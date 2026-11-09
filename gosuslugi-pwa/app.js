// Splash screen timeout
setTimeout(() => {
    document.getElementById('splash-screen').classList.remove('active');
    document.getElementById('screen-services').classList.add('active');
}, 2500);

// Navigation
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Tab switching
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Copy detail
function copyDetail(elementId) {
    const el = document.getElementById(elementId);
    const text = el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Скопировано');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Скопировано');
    });
}

// Toast
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Refresh docs
function refreshDocs() {
    showToast('Список обновлён');
}

// Upload handlers
function handleUpload(type) {
    if (type === 'file' || type === 'gallery' || type === 'photo') {
        document.getElementById('file-input').click();
    } else if (type === 'camera') {
        const input = document.getElementById('file-input');
        input.setAttribute('capture', 'environment');
        input.click();
        setTimeout(() => input.removeAttribute('capture'), 100);
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        showToast('Фото загружено: ' + file.name);
    }
}

// Present document
function presentDocument() {
    showToast('Документ предъявлен');
}

// Send details
function sendDetails() {
    showToast('Реквизиты отправлены');
}

// Search filter
document.getElementById('search-input')?.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.service-item').forEach(item => {
        const name = item.querySelector('.service-name').textContent.toLowerCase();
        const desc = item.querySelector('.service-desc')?.textContent.toLowerCase() || '';
        item.style.display = (name.includes(query) || desc.includes(query)) ? 'flex' : 'none';
    });
});

// Service item clicks
document.querySelectorAll('.service-item[data-screen]').forEach(item => {
    item.addEventListener('click', () => {
        navigateTo(item.dataset.screen);
    });
});

// Bottom nav
document.querySelectorAll('.nav-item[data-screen]').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        navigateTo(item.dataset.screen);
    });
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('SW registration failed:', err);
    });
}