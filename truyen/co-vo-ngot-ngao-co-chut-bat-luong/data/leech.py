import requests
from bs4 import BeautifulSoup
import time
import os
import re

def read_config():
    """Đọc URL base từ file config.txt"""
    with open('config.txt', 'r', encoding='utf-8') as f:
        return f.read().strip()

def clean_filename(filename):
    """Loại bỏ các ký tự không hợp lệ trong tên file"""
    # Loại bỏ các ký tự đặc biệt, chỉ giữ lại chữ, số, dấu cách, dấu gạch ngang
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Thay nhiều dấu cách liên tiếp bằng 1 dấu cách
    filename = re.sub(r'\s+', ' ', filename)
    return filename.strip()

def leech_chapter(base_url, chapter_num):
    """Leech nội dung của một chương"""
    url = f"{base_url}/chuong-{chapter_num}/"
    
    try:
        # Gửi request với headers để tránh bị block
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.encoding = 'utf-8'
        
        if response.status_code != 200:
            print(f"Không thể truy cập chương {chapter_num}: Status code {response.status_code}")
            return False
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Tìm tiêu đề chương
        title_elem = soup.find('a', class_='chapter-title')
        if not title_elem:
            # Thử cách khác nếu không tìm thấy
            title_elem = soup.find('h1') or soup.find('h2', class_='chapter-title')
        
        if title_elem:
            title = title_elem.get_text(strip=True)
        else:
            title = f"Chương {chapter_num}"
        
        # Tìm nội dung chương
        content_elem = soup.find('div', {'id': 'chapter-c'})
        if not content_elem:
            content_elem = soup.find('div', class_='chapter-content')
        
        if not content_elem:
            print(f"Không tìm thấy nội dung chương {chapter_num}")
            return False
        
        # Loại bỏ các phần tử không cần thiết (ads, scripts, etc.)
        for elem in content_elem.find_all(['script', 'ins', 'div'], class_=['ads', 'adsbygoogle']):
            elem.decompose()
        
        # Lấy inner HTML của content_elem, giữ nguyên các thẻ HTML
        content_parts = []
        
        # Duyệt qua các phần tử con
        for elem in content_elem.descendants:
            if elem.name == 'br':
                # Giữ nguyên thẻ br
                if len(content_parts) > 0 and not content_parts[-1].endswith('<br>'):
                    content_parts.append('<br>')
            elif elem.name is None and elem.strip():
                # Text node
                content_parts.append(elem.strip())
        
        # Join content
        content = ''.join(content_parts)
        content = content.strip()
        
        # Nếu không có content, thử cách khác
        if not content:
            # Fallback: lấy text với br tags
            for p in content_elem.find_all('p'):
                # Thay thế br tags trong p với placeholder
                for br in p.find_all('br'):
                    br.replace_with('__BR__')
                text = p.get_text(strip=True)
                if text:
                    # Khôi phục br tags
                    text = text.replace('__BR__', '<br>')
                    content_parts.append(text)
            
            content = '\n\n'.join(content_parts)
        
        # Tạo nội dung file markdown
        md_content = f"title:{title}\ncontent:\n{content}"
        
        # Lưu file
        filename = f"{chapter_num}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        print(f"✓ Đã leech chương {chapter_num}: {title}")
        return True
        
    except Exception as e:
        print(f"Lỗi khi leech chương {chapter_num}: {str(e)}")
        return False

def main():
    """Hàm chính"""
    print("=== TOOL LEECH TRUYỆN TỪ TRUYENFULL ===")
    
    # Đọc config
    try:
        base_url = read_config()
        print(f"URL base: {base_url}")
    except Exception as e:
        print(f"Lỗi đọc file config.txt: {e}")
        return
    
    # Nhập thông số
    try:
        start_chapter = int(input("\nNhập chương bắt đầu: "))
        end_chapter = int(input("Nhập chương kết thúc: "))
        
        if start_chapter > end_chapter:
            print("Chương bắt đầu phải nhỏ hơn hoặc bằng chương kết thúc!")
            return
            
    except ValueError:
        print("Vui lòng nhập số chương hợp lệ!")
        return
    
    print(f"\nBắt đầu leech từ chương {start_chapter} đến chương {end_chapter}...")
    print("-" * 50)
    
    success_count = 0
    fail_count = 0
    
    # Leech từng chương
    for chapter in range(start_chapter, end_chapter + 1):
        if leech_chapter(base_url, chapter):
            success_count += 1
        else:
            fail_count += 1
        
        # Delay để tránh spam request
        if chapter < end_chapter:
            time.sleep(1)  # Đợi 1 giây giữa các request
    
    print("-" * 50)
    print(f"\nHoàn thành!")
    print(f"Thành công: {success_count} chương")
    print(f"Thất bại: {fail_count} chương")
    
    # Giữ cửa sổ console mở
    print("\nNhấn phím bất kỳ để đóng...")
    import msvcrt
    msvcrt.getch()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\nLỗi: {e}")
        print("\nNhấn phím bất kỳ để đóng...")
        import msvcrt
        msvcrt.getch()