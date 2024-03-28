from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

# تشغيل المتصفح مع استخدام Chromium (Chrome الافتراضي)
driver = webdriver.Chrome(use_chromium=True)

# انتظار ظهور صفحة تسجيل الدخول
driver.get('https://accounts.google.com/v3/signin/identifier?hl=en-gb&ifkv=ARZ0qKJp3mev17CcDjjuQzxHizfr4-A2bWBdcjnd__Z9q8Xn-L_3BXGKXS-KWjTof5gi2ecC30MRwA&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1543424507%3A1711009155669812&theme=mn&ddm=0')

# انتظار ظهور حقل البريد الإلكتروني
email_field = driver.find_element_by_css_selector('input[name="identifier"]')

# إدخال البريد الإلكتروني
email_field.send_keys('karimfreegg@gmail.com')

# انتظار 5 ثواني
time.sleep(5)

# الضغط على زر Enter
email_field.send_keys(Keys.ENTER)

# انتظار التحميل
time.sleep(10)

# التقاط صورة للصفحة
driver.save_screenshot('screenshot.png')

# إغلاق المتصفح
driver.quit()
