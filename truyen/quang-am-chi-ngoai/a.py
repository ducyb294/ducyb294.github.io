import os
import re

# Lặp qua tất cả các file trong thư mục hiện tại
for filename in os.listdir('.'):
    # Kiểm tra nếu file có định dạng .html và bắt đầu bằng 'C' theo đúng mẫu C1.html, C2.html, v.v.
    match = re.match(r'^C(\d+)\.html$', filename)
    if match:
        number = match.group(1)
        new_name = f'chuong-{number}.html'
        os.rename(filename, new_name)
        print(f'Đã đổi: {filename} → {new_name}')
