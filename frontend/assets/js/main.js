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

    // Initialize reading settings
    initializeReadingSettings();
    
    // Initialize chapter navigation
    initializeChapterNavigation();
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

// Initialize chapter navigation
function initializeChapterNavigation() {
    // Sync chapter selects
    const topSelect = document.getElementById('chapter-select-top');
    const bottomSelect = document.getElementById('chapter-select-bottom');
    
    if (topSelect && bottomSelect) {
        topSelect.addEventListener('change', function() {
            bottomSelect.value = this.value;
            navigateToChapter(this.value);
        });
        
        bottomSelect.addEventListener('change', function() {
            topSelect.value = this.value;
            navigateToChapter(this.value);
        });
    }
}

// Navigate to selected chapter
function navigateToChapter(chapterNumber) {
    // This is a simple implementation - you can modify based on your URL structure
    window.location.href = `chuong-${chapterNumber}.html`;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Left arrow - previous chapter
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.querySelector('.nav-btn:not([disabled])');
        if (prevBtn && prevBtn.textContent.includes('Chương trước')) {
            prevBtn.click();
        }
    }
    
    // Right arrow - next chapter
    if (e.key === 'ArrowRight') {
        const nextBtns = document.querySelectorAll('.nav-btn');
        nextBtns.forEach(btn => {
            if (btn.textContent.includes('Chương sau')) {
                btn.click();
            }
        });
    }
});