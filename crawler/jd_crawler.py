# 京东价格爬虫脚本
# 功能：自动爬取京东硬件价格，写入SQLite数据库
# 使用前需要：
#   1. 安装Python 3.10+
#   2. pip install playwright
#   3. playwright install chromium
# 运行：python crawler/jd_crawler.py

import sqlite3
import time
import random
import re
from datetime import datetime
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("请先安装 playwright：pip install playwright && playwright install chromium")
    exit(1)

# 数据库路径（相对于项目根目录）
DB_PATH = Path(__file__).parent.parent / "prisma" / "dev.db"

# 爬取间隔（秒），避免被封
DELAY_MIN = 3
DELAY_MAX = 6

# User-Agent
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def get_all_hardware():
    """从数据库读取所有硬件"""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT id, category, brand, model, full_name FROM Hardware WHERE status = 'active'")
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return items


def save_price(hardware_id, price, product_url, shop_name="京东自营"):
    """保存价格到数据库"""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute(
        """INSERT INTO Price (hardwareId, platform, shopName, productUrl, price, inStock, crawledAt, createdAt)
           VALUES (?, 'jd', ?, ?, ?, 1, ?, ?)""",
        (hardware_id, shop_name, product_url, int(price * 100), now, now)
    )
    conn.commit()
    conn.close()


def crawl_jd_price(page, keyword):
    """
    爬取京东搜索结果的第一个商品价格
    返回 (price, product_url, shop_name) 或 None
    """
    search_url = f"https://search.jd.com/Search?keyword={keyword}&enc=utf-8"

    try:
        page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
        # 等待商品列表加载
        page.wait_for_selector(".gl-item, .goods-list-v2 .gl-item", timeout=10000)
        # 滚动触发懒加载
        page.evaluate("window.scrollBy(0, 500)")
        time.sleep(1)

        # 获取第一个商品
        first_item = page.query_selector(".gl-item:first-child, .goods-list-v2 .gl-item:first-child")
        if not first_item:
            return None

        # 提取价格
        price_elem = first_item.query_selector(".p-price i, .p-price .price")
        if not price_elem:
            return None
        price_text = price_elem.inner_text().strip()
        price_match = re.search(r"[\d.]+", price_text)
        if not price_match:
            return None
        price = float(price_match.group())

        # 提取商品链接
        link_elem = first_item.query_selector(".p-name a, .p-img a")
        product_url = ""
        if link_elem:
            href = link_elem.get_attribute("href") or ""
            if href.startswith("//"):
                product_url = "https:" + href
            elif href.startswith("/"):
                product_url = "https://item.jd.com" + href
            else:
                product_url = href

        # 提取店铺名
        shop_elem = first_item.query_selector(".p-shop a, .p-shop span a")
        shop_name = "京东"
        if shop_elem:
            shop_name = shop_elem.inner_text().strip() or "京东"

        return (price, product_url, shop_name)

    except Exception as e:
        print(f"    爬取失败: {e}")
        return None


def main():
    print("=" * 60)
    print("京东价格爬虫启动")
    print("=" * 60)

    if not DB_PATH.exists():
        print(f"数据库不存在: {DB_PATH}")
        return

    hardware_list = get_all_hardware()
    print(f"共 {len(hardware_list)} 款硬件待爬取\n")

    success = 0
    failed = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # headless=False 可以看到浏览器操作
        context = browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()

        for i, hw in enumerate(hardware_list, 1):
            keyword = f"{hw['brand']} {hw['model']}"
            print(f"[{i}/{len(hardware_list)}] 爬取: {keyword}")

            result = crawl_jd_price(page, keyword)

            if result:
                price, product_url, shop_name = result
                save_price(hw["id"], price, product_url, shop_name)
                print(f"    ✓ ¥{price:.2f} - {shop_name}")
                success += 1
            else:
                print(f"    ✗ 未获取到价格")
                failed += 1

            # 随机延迟
            if i < len(hardware_list):
                delay = random.uniform(DELAY_MIN, DELAY_MAX)
                print(f"    等待 {delay:.1f}s...")
                time.sleep(delay)

        browser.close()

    print("\n" + "=" * 60)
    print(f"爬取完成：成功 {success}，失败 {failed}")
    print("=" * 60)


if __name__ == "__main__":
    main()
