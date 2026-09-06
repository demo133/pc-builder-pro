@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo ========================================
echo 京东价格爬虫启动
echo 时间: %date% %time%
echo ========================================
python crawler\jd_crawler.py
echo.
echo 爬虫执行完毕，时间: %date% %time%
echo ========================================
