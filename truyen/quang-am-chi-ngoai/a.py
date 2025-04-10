from bs4 import BeautifulSoup
import os
import re
import zipfile

# Đường dẫn file HTML gốc
input_path = "index_split_031.html"
output_dir = "chapters"
os.makedirs(output_dir, exist_ok=True)

# Khung HTML giữ nguyên
html_prefix = """<?xml version='1.0' encoding='utf-8'?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
  <head>
    <title>Unknown</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
    <link rel="stylesheet" type="text/css" href="page_styles.css"/>
  </head>
  <body class="calibre">
"""
html_suffix = "\n  </body>\n</html>"

# Đọc file gốc
with open(input_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

body = soup.body
h2_tags = body.find_all("h2")

chapter_files = []

for i, h2 in enumerate(h2_tags):
    h2_text = h2.get_text().strip()
    # Tìm số chương trong tiêu đề
    match = re.search(r"[Cc]hương\s*(\d+)", h2_text)
    if not match:
        continue  # bỏ qua nếu không phải chương

    chapter_number = int(match.group(1))
    file_name = f"chuong-{chapter_number}.html"
    file_path = os.path.join(output_dir, file_name)
    chapter_files.append((chapter_number, file_name))

    # Lấy nội dung chương
    content_parts = [str(h2)]
    for sibling in h2.find_next_siblings():
        if sibling.name == "h2":
            break
        content_parts.append(str(sibling))

    # Thêm link điều hướng luôn luôn
    prev_file = f"chuong-{chapter_number - 1}.html"
    next_file = f"chuong-{chapter_number + 1}.html"

    nav_links = f'''
    <div class="nav-links">
        <a href="{prev_file}">← Chương trước</a>
        <a href="{next_file}">Chương sau →</a>
    </div>
    '''

    full_html = html_prefix + nav_links + "\n" + "\n".join(content_parts) + "\n" + nav_links + html_suffix

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(full_html)

# Tạo file .zip
zip_path = "chapters_with_nav.zip"
with zipfile.ZipFile(zip_path, 'w') as zipf:
    for _, filename in chapter_files:
        filepath = os.path.join(output_dir, filename)
        zipf.write(filepath, arcname=filename)

print("✅ Hoàn tất! Đã tạo file:", zip_path)
