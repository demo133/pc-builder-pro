# 京东价格爬虫脚本（Postgres 版 + 反爬优化）
# 功能：自动爬取京东硬件价格，写入 Prisma Postgres 数据库
# 运行：python crawler/jd_crawler.py
# 定时：Windows 任务计划程序每24小时运行一次
# 注意：京东反爬严格，本脚本采用长延迟+分批爬取策略

import os
import time
import random
import re
from datetime import datetime
from pathlib import Path

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("请先安装 psycopg2-binary：pip install psycopg2-binary")
    exit(1)

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("请先安装 playwright：pip install playwright && playwright install chromium")
    exit(1)

# 从 .env 读取数据库连接字符串
def get_db_url():
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("DATABASE_URL="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("DATABASE_URL", "")

DATABASE_URL = get_db_url()

# 反爬配置：长延迟降低被封概率
DELAY_MIN = 15
DELAY_MAX = 25
# 每次最多爬取数量（避免连续爬太多被封）
MAX_CRAWL_PER_RUN = 50
# 重试次数
MAX_RETRY = 2

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)


def get_hardware_to_crawl():
    """获取待爬取的硬件（优先爬取最久没爬的）"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT h.id, h.category, h.brand, h.model, h."fullName"
        FROM "Hardware" h
        LEFT JOIN "CrawlTask" ct ON ct."hardwareId" = h.id AND ct.platform = 'jd'
        WHERE h.status = 'active'
        ORDER BY ct."lastSuccessAt" ASC NULLS FIRST, h.id
        LIMIT %s
    """, (MAX_CRAWL_PER_RUN,))
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return items


def upsert_price(hardware_id, price, product_url, shop_name="京东"):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now()
    cursor.execute('DELETE FROM "Price" WHERE "hardwareId" = %s AND platform = %s', (hardware_id, "jd"))
    cursor.execute(
        """INSERT INTO "Price" ("hardwareId", platform, "shopName", "productUrl", price, "inStock", "crawledAt", "createdAt")
           VALUES (%s, 'jd', %s, %s, %s, true, %s, %s)""",
        (hardware_id, shop_name, product_url, int(price * 100), now, now)
    )
    conn.commit()
    conn.close()


def update_crawl_task(hardware_id, success, error_msg=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now()
    next_run = datetime.fromtimestamp(time.time() + 24 * 60 * 60)
    if success:
        cursor.execute(
            """UPDATE "CrawlTask" SET status = 'success', "lastSuccessAt" = %s, "lastError" = NULL, "nextRunAt" = %s
               WHERE "hardwareId" = %s AND platform = 'jd'""",
            (now, next_run, hardware_id)
        )
    else:
        cursor.execute(
            """UPDATE "CrawlTask" SET status = 'failed', "lastError" = %s, "retryCount" = "retryCount" + 1, "nextRunAt" = %s
               WHERE "hardwareId" = %s AND platform = 'jd'""",
            (error_msg[:500], next_run, hardware_id)
        )
    conn.commit()
    conn.close()


def is_blocked(page):
    """检测是否被京东反爬拦截"""
    text = page.evaluate("() => document.body.innerText")
    block_keywords = ["访问频繁", "无法搜索", "请稍后再试", "验证码", "安全验证"]
    return any(kw in text for kw in block_keywords)


def crawl_jd_price(page, keyword):
    search_url = f"https://search.jd.com/Search?keyword={keyword}&enc=utf-8"

    for attempt in range(MAX_RETRY):
        try:
            page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
            time.sleep(3)

            # 检测反爬
            if is_blocked(page):
                print(f"    被反爬拦截，等待30秒后重试...")
                time.sleep(30)
                continue

            # 滚动加载
            page.evaluate("window.scrollBy(0, 500)")
            time.sleep(2)

            # 尝试多种选择器（京东页面结构经常变）
            selectors = [
                ".gl-item:first-child",
                ".goods-list-v2 .gl-item:first-child",
                "[class*='goods-item']:first-child",
                ".J_goodsList li:first-child",
            ]

            first_item = None
            for sel in selectors:
                first_item = page.query_selector(sel)
                if first_item:
                    break

            if not first_item:
                return None

            # 提取价格
            price_selectors = [".p-price i", ".p-price .price", ".p-price strong i", "[class*='price'] i"]
            price = None
            for sel in price_selectors:
                price_elem = first_item.query_selector(sel)
                if price_elem:
                    price_text = price_elem.inner_text().strip()
                    price_match = re.search(r"[\d.]+", price_text)
                    if price_match:
                        price = float(price_match.group())
                        break

            if not price:
                return None

            # 提取商品链接
            link_selectors = [".p-name a", ".p-img a", "a[href*='item.jd.com']"]
            product_url = ""
            for sel in link_selectors:
                link_elem = first_item.query_selector(sel)
                if link_elem:
                    href = link_elem.get_attribute("href") or ""
                    if href.startswith("//"):
                        product_url = "https:" + href
                    elif href.startswith("/"):
                        product_url = "https://item.jd.com" + href
                    else:
                        product_url = href
                    break

            # 提取店铺名
            shop_selectors = [".p-shop a", ".p-shop span a", ".p-shopnum a", "[class*='shop'] a"]
            shop_name = "京东"
            for sel in shop_selectors:
                shop_elem = first_item.query_selector(sel)
                if shop_elem:
                    name = shop_elem.inner_text().strip()
                    if name:
                        shop_name = name
                        break

            return (price, product_url, shop_name)

        except Exception as e:
            print(f"    第{attempt+1}次尝试失败: {e}")
            if attempt < MAX_RETRY - 1:
                time.sleep(10)

    return None


def main():
    print("=" * 60)
    print("京东价格爬虫启动 (Postgres 版 + 反爬优化)")
    print(f"启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    if not DATABASE_URL:
        print("错误：未找到 DATABASE_URL，请检查 .env 文件")
        return

    hardware_list = get_hardware_to_crawl()
    print(f"本次计划爬取 {len(hardware_list)} 款（按最久未爬排序）\n")

    success = 0
    failed = 0
    blocked = False

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={"width": 1280, "height": 800},
            locale="zh-CN"
        )
        page = context.new_page()

        for i, hw in enumerate(hardware_list, 1):
            if blocked:
                print("检测到反爬拦截，终止本次爬取，剩余留到下次")
                break

            keyword = f"{hw['brand']} {hw['model']}"
            print(f"[{i}/{len(hardware_list)}] 爬取: {keyword}")

            result = crawl_jd_price(page, keyword)

            if result:
                price, product_url, shop_name = result
                upsert_price(hw["id"], price, product_url, shop_name)
                update_crawl_task(hw["id"], True)
                print(f"    ✓ ¥{price:.2f} - {shop_name}")
                success += 1
            else:
                # 检查是否被封
                if is_blocked(page):
                    blocked = True
                    update_crawl_task(hw["id"], False, "反爬拦截")
                else:
                    update_crawl_task(hw["id"], False, "未获取到价格")
                print(f"    ✗ 未获取到价格")
                failed += 1

            # 长延迟
            if i < len(hardware_list) and not blocked:
                delay = random.uniform(DELAY_MIN, DELAY_MAX)
                print(f"    等待 {delay:.0f}s...")
                time.sleep(delay)

        browser.close()

    print("\n" + "=" * 60)
    print(f"爬取完成：成功 {success}，失败 {failed}")
    print(f"完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)


if __name__ == "__main__":
    main()
