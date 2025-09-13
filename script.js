// === FORM RSVP + KOMENTAR ===
function initializeCommentForm() {
  const rsvpForm = document.getElementById('rsvp-form');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(rsvpForm);
      const url = 'https://script.google.com/macros/s/AKfycbxLl7i0KDsfKIiyjAQITKH_ceVGbZcR8ACST_TzmFxvZlGijgHhlysRTx0W53N-bA/exec';

      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(result => {
        alert(result);
        rsvpForm.reset();
        loadCommentsFromSheets(); // refresh komentar setelah kirim
      })
      .catch(error => {
        console.error('Gagal kirim komentar:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
      });
    });
  }
}

// === TAMPILKAN KOMENTAR DARI GOOGLE SHEETS ===
function loadCommentsFromSheets() {
  const url = 'https://script.google.com/macros/s/AKfycbxLl7i0KDsfKIiyjAQITKH_ceVGbZcR8ACST_TzmFxvZlGijgHhlysRTx0W53N-bA/exec';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      renderAllComments(data);
    })
    .catch(error => {
      console.error('Gagal memuat komentar:', error);
    });
}

function renderAllComments(data) {
  const commentList = document.getElementById('json-comment-list');
  if (!commentList) return;

  commentList.innerHTML = '';

  data.forEach(c => {
    const wrapper = document.createElement('div');
    wrapper.className = 'comment-wrapper';

    const author = document.createElement('div');
    author.className = 'comment-author';
    author.textContent = `${c.name} (${c.attendance})`;

    const bubble = document.createElement('div');
    bubble.className = 'comment-item';

    const text = document.createElement('div');
    text.className = 'comment-message';
    text.textContent = c.message;

    bubble.appendChild(text);
    wrapper.appendChild(author);
    wrapper.appendChild(bubble);
    commentList.appendChild(wrapper);
  });
}

// === UTILITY ===
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Nomor rekening berhasil disalin!');
  }, () => {
    alert('Gagal menyalin nomor rekening.');
  });
}

// === FITUR COUNTDOWN ===
function initializeCountdown() {
  const weddingDate = new Date('October 05, 2025 10:00:00').getTime();

  const countdownFunction = setInterval(function () {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (daysElement && hoursElement && minutesElement && secondsElement) {
      daysElement.innerHTML = days;
      hoursElement.innerHTML = hours;
      minutesElement.innerHTML = minutes;
      secondsElement.innerHTML = seconds;
    }

    if (distance < 0) {
      clearInterval(countdownFunction);
    }
  }, 1000);
}

// === ANIMASI SCROLL ===
function initializeScrollAnimations() {
  const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => observer.observe(el));
}

// === GOOGLE CALENDAR ===
function openCalendar(e) {
  e.preventDefault();

  const eventDetails = {
    title: 'Walimatul Ursy Dinda & Agung',
    description: 'Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara resepsi pernikahan kami. Mohon berikan doa restu. URL: https://anandaamalia1.github.io/undangan-digital/',
    location: 'Wisma Yayasan Perjalanan Haji Indonesia PHI, Jl. Binjai No.270, Medan',
    startTime: '20251005T100000',
    endTime: '20251005T203000'
  };

  const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startTime}/${eventDetails.endTime}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;

  window.location.href = googleLink;
}

// === INISIALISASI SAAT HALAMAN DIMUAT ===
window.addEventListener('load', () => {
  initializeCommentForm();
  loadCommentsFromSheets();
  initializeCountdown();
  initializeScrollAnimations();

  const flowerOverlay = document.getElementById('flowerAnimationOverlay');
  const mainContent = document.getElementById('mainUndanganWrapper');
  const myAudio = document.getElementById('myAudio');
  const musicToggleButton = document.getElementById('musicToggleButton');

  // 🌸 Animasi bunga pembuka
  if (flowerOverlay) {
    flowerOverlay.classList.add('show');
    const flowers = flowerOverlay.querySelectorAll('.animated-flower');
    flowers.forEach(flower => flower.classList.add('animate'));

    setTimeout(() => {
      flowerOverlay.classList.remove('show');
      if (mainContent) {
        mainContent.classList.add('show');
      }
    }, 2500);
  }

  // 🎵 Musik autoplay dan toggle
  if (myAudio) {
    myAudio.play().catch(() => {
      console.warn("Autoplay diblokir, menunggu interaksi pengguna.");
    });

    if (musicToggleButton) {
      musicToggleButton.addEventListener('click', function () {
        if (myAudio.paused) {
          myAudio.play();
          this.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
          myAudio.pause();
          this.innerHTML = '<i class="fas fa-play"></i>';
        }
      });
    }
  }
});
