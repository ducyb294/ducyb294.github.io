// Get current chapter from URL parameter
function getCurrentChapter() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('chuong')) || 1;
}

// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('../../frontend/includes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeHeader();
        });

    // Load footer
    fetch('../../frontend/includes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // Load chapter content
    loadChapterContent();
    
    // Initialize reading settings
    initializeReadingSettings();
    
    // Initialize chapter navigation
    // initializeChapterNavigation();
});

// Initialize header functionality
function initializeHeader() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
}

// Initialize reading settings
function initializeReadingSettings() {
    const chapterContent = document.getElementById('chapter-content');
    
    // Font size controls
    const fontSizeButtons = document.querySelectorAll('.font-size-btn');
    fontSizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            chapterContent.style.fontSize = size + 'px';
            
            // Update active button
            fontSizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Save preference
            localStorage.setItem('fontSize', size);
        });
    });
    
    // Background color options
    const bgOptions = document.querySelectorAll('.bg-option');
    bgOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Remove all theme classes
            document.body.classList.remove('dark-theme', 'sepia-theme', 'gray-theme');
            
            // Add selected theme
            if (theme !== 'light') {
                document.body.classList.add(theme + '-theme');
            }
            
            // Update active option
            bgOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Save preference
            localStorage.setItem('theme', theme);
        });
    });
    
    // Font family selector
    const fontSelect = document.getElementById('font-select');
    if (fontSelect) {
        fontSelect.addEventListener('change', function() {
            chapterContent.style.fontFamily = this.value + ', sans-serif';
            localStorage.setItem('fontFamily', this.value);
        });
    }
    
    // Full width toggle
    const fullWidthToggle = document.getElementById('full-width');
    if (fullWidthToggle) {
        fullWidthToggle.addEventListener('change', function() {
            const chapterWrapper = document.querySelector('.chapter-wrapper');
            if (this.checked) {
                chapterWrapper.style.maxWidth = '100%';
                chapterWrapper.style.padding = '30px 50px';
            } else {
                chapterWrapper.style.maxWidth = '900px';
                chapterWrapper.style.padding = '30px';
            }
            localStorage.setItem('fullWidth', this.checked);
        });
    }
    
    // Load saved preferences
    loadSavedPreferences();
}

// Load saved preferences from localStorage
function loadSavedPreferences() {
    const chapterContent = document.getElementById('chapter-content');
    
    // Font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        chapterContent.style.fontSize = savedFontSize + 'px';
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-size') === savedFontSize) {
                btn.classList.add('active');
            }
        });
    }
    
    // Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== 'light') {
        document.body.classList.add(savedTheme + '-theme');
        document.querySelectorAll('.bg-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === savedTheme) {
                option.classList.add('active');
            }
        });
    }
    
    // Font family
    const savedFont = localStorage.getItem('fontFamily');
    if (savedFont) {
        chapterContent.style.fontFamily = savedFont + ', sans-serif';
        const fontSelect = document.getElementById('font-select');
        if (fontSelect) {
            fontSelect.value = savedFont;
        }
    }
    
    // Full width
    const savedFullWidth = localStorage.getItem('fullWidth');
    if (savedFullWidth === 'true') {
        const fullWidthToggle = document.getElementById('full-width');
        const chapterWrapper = document.querySelector('.chapter-wrapper');
        if (fullWidthToggle && chapterWrapper) {
            fullWidthToggle.checked = true;
            chapterWrapper.style.maxWidth = '100%';
            chapterWrapper.style.padding = '30px 50px';
        }
    }
}

// Load chapter content from markdown file
async function loadChapterContent() {
    const currentChapter = getCurrentChapter();
    
    try {
        // Load the markdown file
        const response = await fetch(`data/${currentChapter}.md`);
        if (!response.ok) {
            throw new Error('Chapter not found');
        }
        
        const text = await response.text();
        
        // Parse the markdown file
        const lines = text.split('\n');
        let title = '';
        let content = '';
        let isContent = false;
        
        for (const line of lines) {
            if (line.startsWith('title:')) {
                title = line.substring(6).trim();
            } else if (line.startsWith('content:')) {
                isContent = true;
            } else if (isContent) {
                content += line + '\n';
            }
        }
        
        // Update the page title
        document.getElementById('chapter-title').textContent = title;
        document.title = `${title} - Quang Âm Chi Ngoại - TruyenFull`;
        
        // Convert markdown to HTML and display
        const htmlContent = marked.parse(content);
        document.getElementById('chapter-content').innerHTML = htmlContent;
        
        // Update navigation
        updateNavigation(currentChapter);
        
    } catch (error) {
        console.error('Error loading chapter:', error);
        document.getElementById('chapter-content').innerHTML = '<p>Không thể tải nội dung chương. Vui lòng thử lại sau.</p>';
    }
}

// Update navigation buttons and selects
async function updateNavigation(currentChapter) {
    // Check total chapters available
    let totalChapters = 1;
    for (let i = 1; i <= 1000; i++) {
        try {
            const response = await fetch(`data/${i}.md`, { method: 'HEAD' });
            if (!response.ok) break;
            totalChapters = i;
        } catch {
            break;
        }
    }
    
    // Update chapter selects

    
    // Update prev/next buttons
    const prevBtns = [document.getElementById('prev-btn-top'), document.getElementById('prev-btn-bottom')];
    const nextBtns = [document.getElementById('next-btn-top'), document.getElementById('next-btn-bottom')];
    
    prevBtns.forEach(btn => {
        if (currentChapter > 1) {
            btn.href = `?chuong=${currentChapter - 1}`;
            btn.removeAttribute('disabled');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.removeAttribute('href');
            btn.setAttribute('disabled', 'disabled');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
    
    nextBtns.forEach(btn => {
        if (currentChapter < totalChapters) {
            btn.href = `?chuong=${currentChapter + 1}`;
            btn.removeAttribute('disabled');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.removeAttribute('href');
            btn.setAttribute('disabled', 'disabled');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
}

// Initialize chapter navigation


// Navigate to selected chapter
function navigateToChapter(chapterNumber) {
    window.location.href = `?chuong=${chapterNumber}`;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    const currentChapter = getCurrentChapter();
    
    // Left arrow - previous chapter
    if (e.key === 'ArrowLeft' && currentChapter > 1) {
        window.location.href = `?chuong=${currentChapter - 1}`;
    }
    
    // Right arrow - next chapter
    if (e.key === 'ArrowRight') {
        // Check if next chapter exists
        fetch(`data/${currentChapter + 1}.md`, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    window.location.href = `?chuong=${currentChapter + 1}`;
                }
            });
    }
});