from playwright.sync_api import sync_playwright
import time

p = sync_playwright().start()
browser = p.chromium.launch(headless=False)
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
    time.sleep(2)
    print('Waiting for page to load...')
    page.wait_for_load_state('networkidle')
    print('Navigation complete')
else:
    print('Login failed')

print('Browser remains open...')
print('Press Ctrl+C to close')
try:
    time.sleep(60)
except:
    pass
