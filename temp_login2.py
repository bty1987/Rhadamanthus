from playwright.sync_api import sync_playwright
import time

p = sync_playwright().start()
browser = p.chromium.launch(headless=False)
page = browser.new_context()
page = browser.new_page()

print('Opening login page...')
page.goto('http://192.168.5.21')

print('Please fill username and password. Waiting 15 seconds...')
time.sleep(15)

print('Clicking login button...')
page.click('#loginBtn')
time.sleep(3)

url = page.url
print(f'Current URL after login: {url}')

if 'login' not in url.lower():
    print('Login successful!')
    time.sleep(3)
    print('Waiting for main page to load...')
    page.wait_for_load_state('networkidle')

    print('Looking for decoration menu...')
    time.sleep(2)

    try:
        # 查找并点击"装修"菜单
        print('Clicking on decoration menu (装修)...')
        page.get_by_text('装修', exact=True).click()
        time.sleep(1)

        # 查找并点击"装修单-管理"
        print('Clicking on decoration order management (装修单-管理)...')
        page.get_by_text('装修单-管理').click()
        time.sleep(1)

        # 查找并点击"装修单-设计"
        print('Clicking on decoration order design (装修单-设计)...')
        page.get_by_text('装修单-设计').click()
        time.sleep(3)

        final_url = page.url
        print(f'Final URL: {final_url}')
        print('Navigation completed successfully!')

    except Exception as e:
        print(f'Error during navigation: {e}')
else:
    print('Login failed')

print('Browser remains open for 60 seconds...')
try:
    time.sleep(60)
except:
    pass
