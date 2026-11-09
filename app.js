// Current document type
let currentDocType = 'identity';

// Document data storage
const documents = {
    identity: {
        image: null,
        details: {
            fio: 'Официальный Telegram – @',
            iin: 'Официальный Telegram – @',
            birthDate: 'by',
            docNumber: 'ID1234567',
            issueDate: '01.01.2020',
            expiryDate: '01.01.2030'
        }
    },
    passport: {
        image: null,
        details: {
            fio: 'Официальный Telegram – @',
            iin: 'Официальный Telegram – @',
            birthDate: 'by',
            docNumber: 'AB1234567',
            issueDate: '01.01.2020',
            expiryDate: '01.01.2030'
        }
    },
    diploma: {
        image: null,
        details: {
            fio: 'Официальный Telegram – @',
            iin: '',
            birthDate: '',
            docNumber: 'ДИП123456',
            issueDate: '15.06.2020',
            expiryDate: 'Бессрочно'
        }
    }
};

// Load from localStorage
function loadDocuments() {
    const saved = localStorage.getItem('documents');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(documents, parsed);
    }
    updateDocStatuses();
}

// Save to localStorage
function saveDocuments() {
    localStorage.setItem('documents', JSON.stringify(documents));
}

// Update document statuses on main screen
function updateDocStatuses() {
    ['identity', 'passport', 'diploma'].forEach(type => {
        const statusEl = document.getElementById(`doc-status-${type}`);
        if (statusEl) {
            statusEl.textContent = documents[type].image ? '✅ Загружено' : 'Не загружено';
        }
    });
}

// Splash screen timeout
setTimeout(() => {
    document.getElementById('splash-screen').classList.remove('active');
    document.getElementById('screen-services').classList.add('active');
    loadDocuments();
}, 2500);

// Navigation
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'screen-identity-doc') {
        updateCurrentDocView();
    }
}

// Switch document type
function switchDoc(docType) {
    currentDocType = docType;
    
    // Update tabs
    document.querySelectorAll('.doc-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.doc === docType);
    });
}

// Update current document view
function updateCurrentDocView() {
    const doc = documents[currentDocType];
    const titles = {
        identity: 'Удостоверение личности',
        passport: 'Паспорт гражданина РК',
        diploma: 'Диплом'
    };
    
    document.getElementById('current-doc-title').textContent = titles[currentDocType];
    
    // Update preview
    const previewArea = document.getElementById('preview-area');
    const previewImg = document.getElementById('doc-preview-img');
    
    if (doc.image) {
        previewImg.src = doc.image;
        previewArea.style.display = 'block';
    } else {
        previewArea.style.display = 'none';
    }
    
    // Update details
    document.getElementById('detail-fio').textContent = doc.details.fio;
    document.getElementById('detail-inn').textContent = doc.details.iin || 'Не указано';
    document.getElementById('detail-birth').textContent = doc.details.birthDate || 'Не указано';
    document.getElementById('detail-docnum').textContent = doc.details.docNumber;
    document.getElementById('detail-issue').textContent = doc.details.issueDate;
    document.getElementById('detail-expiry').textContent = doc.details.expiryDate;
    
    // Show/hide IIN and birth date for diploma
    document.getElementById('detail-iin-row').style.display = currentDocType === 'diploma' ? 'none' : 'flex';
    document.getElementById('detail-birth-row').style.display = currentDocType === 'diploma' ? 'none' : 'flex';
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
        const reader = new FileReader();
        reader.onloadend = () => {
            documents[currentDocType].image = reader.result;
            saveDocuments();
            updateDocStatuses();
            
            // Show preview
            const previewArea = document.getElementById('preview-area');
            const previewImg = document.getElementById('doc-preview-img');
            previewImg.src = reader.result;
            previewArea.style.display = 'block';
            
            showToast('Документ загружен');
        };
        reader.readAsDataURL(file);
    }
}

// Fullscreen preview
function openFullscreen() {
    const doc = documents[currentDocType];
    if (doc.image) {
        document.getElementById('fullscreen-img').src = doc.image;
        document.getElementById('fullscreen-modal').classList.add('active');
    }
}

function closeFullscreen() {
    document.getElementById('fullscreen-modal').classList.remove('active');
}

// Present document
function presentDocument() {
    showToast('Документ предъявлен');
}

// Edit modal
function openEditModal() {
    const doc = documents[currentDocType];
    document.getElementById('edit-fio').value = doc.details.fio;
    document.getElementById('edit-inn').value = doc.details.iin;
    document.getElementById('edit-birth').value = doc.details.birthDate;
    document.getElementById('edit-docnum').value = doc.details.docNumber;
    document.getElementById('edit-issue').value = doc.details.issueDate;
    document.getElementById('edit-expiry').value = doc.details.expiryDate;
    
    // Show/hide fields for diploma
    document.getElementById('edit-iin-field').style.display = currentDocType === 'diploma' ? 'none' : 'block';
    document.getElementById('edit-birth-field').style.display = currentDocType === 'diploma' ? 'none' : 'block';
    
    document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function saveDetails() {
    documents[currentDocType].details = {
        fio: document.getElementById('edit-fio').value,
        iin: document.getElementById('edit-inn').value,
        birthDate: document.getElementById('edit-birth').value,
        docNumber: document.getElementById('edit-docnum').value,
        issueDate: document.getElementById('edit-issue').value,
        expiryDate: document.getElementById('edit-expiry').value
    };
    saveDocuments();
    closeEditModal();
    updateCurrentDocView();
    showToast('Реквизиты сохранены');
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