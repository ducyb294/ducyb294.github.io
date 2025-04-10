import os
import re

def insert_navigation_links():
    # Lấy danh sách tất cả các file HTML
    html_files = [f for f in os.listdir() if f.startswith("chuong-") and f.endswith(".html")]

    # Trích số chương từ tên file
    chapters = []
    for filename in html_files:
        match = re.search(r'chuong-(\d+)\.html', filename)
        if match:
            chapters.append(int(match.group(1)))

    chapters.sort()

    for chapter in chapters:
        filename = f'chuong-{chapter}.html'
        with open(filename, 'r', encoding='utf-8') as file:
            content = file.read()

        prev_link = f'<a href="chuong-{chapter - 1}.html">← Chương trước</a>'
        next_link = f'<a href="chuong-{chapter + 1}.html">Chương sau →</a>'

        navigation_html = f'<div class="nav-top">{prev_link} | {next_link}</div>'
        navigation_bottom_html = f'<div class="nav-bottom">{prev_link} | {next_link}</div>'

        # Chèn sau <body>
        content = re.sub(r'(<body[^>]*>)', r'\1\n' + navigation_html, content, flags=re.IGNORECASE)

        # Chèn trước </body>
        content = re.sub(r'(</body>)', navigation_bottom_html + r'\n\1', content, flags=re.IGNORECASE)

        # Ghi đè lại file
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(content)

        print(f"Đã chèn liên kết cho {filename}")

if __name__ == "__main__":
    insert_navigation_links()
