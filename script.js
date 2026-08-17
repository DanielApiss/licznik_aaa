// ==========================================================================
// Konfiguracja daty docelowej i startowej
// ==========================================================================
// Docelowa data: 18 sierpnia 2026, 15:00:00 (Strefa czasowa Polski CEST / UTC+2)
const TARGET_DATE = new Date("2026-08-18T15:00:00+02:00").getTime();

// Punkt odniesienia do paska postępu (początek roku 2026)
const START_DATE = new Date("2026-01-01T00:00:00+02:00").getTime();

// Elementy DOM
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const daysLabelEl = document.getElementById("days-label");
const hoursLabelEl = document.getElementById("hours-label");
const minutesLabelEl = document.getElementById("minutes-label");
const secondsLabelEl = document.getElementById("seconds-label");

const timerGrid = document.getElementById("timer-grid");
const finishedContainer = document.getElementById("finished-container");
const progressFill = document.getElementById("progress-fill");
const progressPercent = document.getElementById("progress-percent");
const progressText = document.getElementById("progress-text");

let confettiTriggered = false;

// ==========================================================================
// Poprawna odmiana gramatyczna w języku polskim
// ==========================================================================
function getPolishDeclension(value, single, few, many) {
  const absValue = Math.abs(value);
  if (absValue === 1) {
    return single;
  }
  const lastDigit = absValue % 10;
  const lastTwoDigits = absValue % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}

function updateLabels(days, hours, minutes, seconds) {
  if (daysLabelEl) {
    daysLabelEl.textContent = getPolishDeclension(days, "Dzień", "Dni", "Dni");
  }
  if (hoursLabelEl) {
    hoursLabelEl.textContent = getPolishDeclension(hours, "Godzina", "Godziny", "Godzin");
  }
  if (minutesLabelEl) {
    minutesLabelEl.textContent = getPolishDeclension(minutes, "Minuta", "Minuty", "Minut");
  }
  if (secondsLabelEl) {
    secondsLabelEl.textContent = getPolishDeclension(seconds, "Sekunda", "Sekundy", "Sekund");
  }
}

// Formatowanie z zerem wiodącym
function padZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

// ==========================================================================
// Główna funkcja odliczania
// ==========================================================================
function updateCountdown() {
  const now = new Date().getTime();
  const distance = TARGET_DATE - now;

  // Sprawdzenie, czy czas minął
  if (distance <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";

    if (timerGrid) timerGrid.style.display = "none";
    if (finishedContainer) finishedContainer.classList.remove("hidden");
    if (progressFill) progressFill.style.width = "100%";
    if (progressPercent) progressPercent.textContent = "100%";
    if (progressText) progressText.textContent = "Odliczanie zakończone";

    // Wystrzał konfetti
    if (!confettiTriggered && typeof confetti === "function") {
      confettiTriggered = true;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
    return;
  }

  // Obliczenia jednostek czasu
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Aktualizacja wartości na stronie
  if (daysEl) daysEl.textContent = days;
  if (hoursEl) hoursEl.textContent = padZero(hours);
  if (minutesEl) minutesEl.textContent = padZero(minutes);
  if (secondsEl) secondsEl.textContent = padZero(seconds);

  // Aktualizacja etykiet z gramatyką
  updateLabels(days, hours, minutes, seconds);

  // Obliczanie i aktualizacja paska postępu
  const totalDuration = TARGET_DATE - START_DATE;
  const elapsed = now - START_DATE;
  let percent = 0;

  if (totalDuration > 0 && elapsed > 0) {
    percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  if (progressFill) {
    progressFill.style.width = `${percent.toFixed(1)}%`;
  }
  if (progressPercent) {
    progressPercent.textContent = `${percent.toFixed(1)}%`;
  }
  if (progressText) {
    progressText.textContent = `Pozostało: ${days} ${getPolishDeclension(days, "dzień", "dni", "dni")}`;
  }
}

// Inicjalizacja i pętla co 1 sekundę
updateCountdown();
setInterval(updateCountdown, 1000);
