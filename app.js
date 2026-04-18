const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const params = new URLSearchParams(window.location.search);
const listingId = parseInt(params.get('lid') || '0', 10);
const avitoUrl = params.get('url');
const minSeconds = Math.max(1, parseInt(params.get('min') || '10', 10));

const openBtn = document.getElementById('openBtn');
const confirmBtn = document.getElementById('confirmBtn');
const timerEl = document.getElementById('timer');
const errorEl = document.getElementById('error');

function showError(text) {
    errorEl.textContent = text;
    errorEl.classList.remove('hidden');
    openBtn.disabled = true;
}

if (!listingId || !avitoUrl) {
    showError('Неверные параметры страницы. Вернись в бот и запусти круг заново.');
}

let openedAt = null;
let timerInterval = null;

openBtn.addEventListener('click', () => {
    if (!avitoUrl) return;
    if (openedAt === null) openedAt = Date.now();
    tg.openLink(avitoUrl);
    timerEl.classList.remove('hidden');
    startTimer();
});

function startTimer() {
    if (timerInterval !== null) return;
    const tick = () => {
        const elapsed = Math.floor((Date.now() - openedAt) / 1000);
        const left = minSeconds - elapsed;
        if (left <= 0) {
            timerEl.textContent = '✅ Можно подтверждать просмотр';
            confirmBtn.disabled = false;
            clearInterval(timerInterval);
            timerInterval = null;
            return;
        }
        timerEl.textContent = `⏱ Подожди ещё ${left} сек.`;
    };
    tick();
    timerInterval = setInterval(tick, 1000);
}

confirmBtn.addEventListener('click', () => {
    if (confirmBtn.disabled) return;
    const payload = {
        action: 'viewed',
        listing_id: listingId,
    };
    tg.sendData(JSON.stringify(payload));
    tg.close();
});
