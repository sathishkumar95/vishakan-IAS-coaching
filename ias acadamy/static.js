/* ============================
   VIDEO CAROUSEL (TOP)
============================ */
const videoCarouselTrack = document.getElementById("videoCarouselTrack");

/* ============================
   YOUTUBE TITLE HYDRATION
   (keeps hardcoded titles as fallback)
============================ */
const youTubeTitleCache = new Map();

async function resolveYouTubeTitle(videoId) {
  if (!videoId) return null;
  if (youTubeTitleCache.has(videoId)) return youTubeTitleCache.get(videoId);

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  const sources = [
    `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
    `https://noembed.com/embed?url=${encodeURIComponent(watchUrl)}`,
  ];

  for (const src of sources) {
    try {
      const res = await fetch(src);
      if (!res.ok) continue;
      const data = await res.json();
      const title = typeof data?.title === "string" ? data.title.trim() : "";
      if (title) {
        youTubeTitleCache.set(videoId, title);
        return title;
      }
    } catch {
      // ignore (common when opened via file:// where CORS/origin may be blocked)
    }
  }

  return null;
}

function hydrateYouTubeTitles() {
  const titleEls = Array.from(document.querySelectorAll("[data-youtube-title]"));
  const altEls = Array.from(document.querySelectorAll("[data-youtube-alt]"));

  // Titles
  titleEls.forEach((el) => {
    const id = el.getAttribute("data-youtube-title");
    resolveYouTubeTitle(id).then((title) => {
      if (title) el.textContent = title;
    });
  });

  // Image alts (accessibility)
  altEls.forEach((el) => {
    const id = el.getAttribute("data-youtube-alt");
    resolveYouTubeTitle(id).then((title) => {
      if (title) el.setAttribute("alt", title);
    });
  });
}

function youTubeOriginParam() {
  try {
    // When opened via file://, origin may be "null" and breaks JS API control.
    if (!window.location || !window.location.origin || window.location.origin === "null") return "";
    return `&origin=${encodeURIComponent(window.location.origin)}`;
  } catch {
    return "";
  }
}

function sendYouTubeCommand(iframe, func) {
  try {
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  } catch {
    // ignore
  }
}

function createPauseButton({ initiallyPaused = false, onToggle }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "yt-pause-btn";
  btn.setAttribute("aria-label", initiallyPaused ? "Play" : "Pause");
  btn.textContent = initiallyPaused ? "▶" : "❚❚";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    onToggle?.(btn);
  });
  return btn;
}

const videosCarousel = [
  { id: "ll08vZFexkQ", title: "Why UPSC PYQs Are Important?", thumb: "https://img.youtube.com/vi/ll08vZFexkQ/hqdefault.jpg" },
  { id: "7N2YQ9fbwlc", title: "UPSC Strategy 2026", thumb: "https://img.youtube.com/vi/7N2YQ9fbwlc/hqdefault.jpg" },
  { id: "aoXfzlWtez8", title: "Answer Writing Practice", thumb: "https://img.youtube.com/vi/aoXfzlWtez8/hqdefault.jpg" },
  { id: "tz6G0g4gBLI", title: "Current Affairs Analysis", thumb: "https://img.youtube.com/vi/tz6G0g4gBLI/hqdefault.jpg" },
  { id: "aHO53WCA7aA", title: "Prelims Revision Tips", thumb: "https://img.youtube.com/vi/aHO53WCA7aA/hqdefault.jpg" }
];

let currentVideoIndex = 0;

if (videoCarouselTrack) {
  videosCarousel.forEach((video, i) => {
    const card = document.createElement("div");
    card.className = "video-card";
    if (i === 0) card.classList.add("active");

    card.innerHTML = `
      <img src="${video.thumb}" class="video-thumb-img">
      <div class="play-btn" onclick="playVideoCarousel('${video.id}', this)">▶</div>
    `;
    videoCarouselTrack.appendChild(card);
  });
}

/* ============================
   VIDEO CAROUSEL (TOP) - audio fix
============================ */
function playVideoCarousel(videoId, el) {
  const card = el.closest(".video-card");
  if (!card) return;

  // hide play button
  el.style.display = "none";

  // remove thumbnail image so iframe is visible
  const img = card.querySelector("img");
  if (img) img.style.display = "none";

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;
  iframe.allow = "autoplay; encrypted-media; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.style.width = "100%";
  iframe.style.height = "360px";
  iframe.style.border = "0";

  card.appendChild(iframe);
}

/* ============================
   HERO SLIDER (MANUAL)
============================ */
let currentHeroSlide = 0;
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");

function showHeroSlide(index) {
  if (!heroSlides.length || !heroDots.length) return; // ✅ guard

  currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach(slide => slide.classList.remove("active"));
  heroDots.forEach(dot => dot.classList.remove("active"));

  heroSlides[currentHeroSlide].classList.add("active");
  heroDots[currentHeroSlide].classList.add("active");
}

function moveHeroSlide(dir) {
  if (!heroSlides.length) return; // ✅ guard
  showHeroSlide(currentHeroSlide + dir);
}

if (heroSlides.length && heroDots.length) {
  heroDots.forEach(dot => {
    dot.addEventListener("click", () => showHeroSlide(+dot.dataset.slide));
  });
  showHeroSlide(0); // ✅ only run if slides exist
}

/* ============================
   TESTIMONIAL SLIDER
============================ */
const track = document.getElementById("sliderTrack");
const dots = document.querySelectorAll(".dot");

if (track) {
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      track.style.transform = `translateX(-${dot.dataset.slide * 100}%)`;
      dots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");
    });
  });
}

/* ============================
   YOUTUBE CENTER VIDEO SLIDER
============================ */
const ytTrack = document.getElementById("ytTrack");

const videos = [
  { id: "ll08vZFexkQ", title: "Why UPSC PYQs Are Important?" },
  { id: "7N2YQ9fbwlc", title: "UPSC Strategy 2026" },
  { id: "aoXfzlWtez8", title: "Answer Writing Practice" },
  { id: "tz6G0g4gBLI", title: "Current Affairs Analysis" },
  { id: "aHO53WCA7aA", title: "Prelims Revision Tips" }
];

const PLAY_DURATION = 45000; // 45 seconds
let activeIndex = 2;
let autoTimer = null;
let centerRemaining = PLAY_DURATION;
let centerStartedAt = 0;
let centerPaused = false;

if (ytTrack) {
  videos.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "yt-card";
    card.innerHTML = `
      <div class="thumb"
        data-id="${v.id}"
        style="background-image:url('https://img.youtube.com/vi/${v.id}/hqdefault.jpg')"
        onclick="manualPlay(${i})">
      </div>
      <div class="card-info"><h4 data-youtube-title="${v.id}">${v.title}</h4></div>
    `;
    ytTrack.appendChild(card);
  });

  updateUI();
  playCenterVideo();

  // Ensure titles match the real YouTube titles when possible
  hydrateYouTubeTitles();
}

function updateUI() {
  document.querySelectorAll(".yt-card").forEach((c, i) => {
    c.classList.toggle("active", i === activeIndex);
  });
}

function playCenterVideo(withSound = false) {
  clearTimeout(autoTimer);

  const card = document.querySelectorAll(".yt-card")[activeIndex];
  const thumb = card.querySelector(".thumb");
  const id = thumb.dataset.id;

  // reset pause state on each (re)play
  centerRemaining = PLAY_DURATION;
  centerStartedAt = Date.now();
  centerPaused = false;

  // ✅ autoplay (timer) should stay muted; manual actions can enable sound
  const muteParam = withSound ? "" : "&mute=1";
  const originParam = youTubeOriginParam();

  thumb.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1${muteParam}&loop=1&playlist=${id}&enablejsapi=1${originParam}"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      style="width:100%;height:100%;border:0;">
    </iframe>
  `;

  thumb.classList.add("is-playing");

  const iframe = thumb.querySelector("iframe");
  const pauseBtn = createPauseButton({
    initiallyPaused: false,
    onToggle: (btn) => {
      if (!iframe) return;

      if (!centerPaused) {
        // pause
        centerPaused = true;
        const elapsed = Date.now() - centerStartedAt;
        centerRemaining = Math.max(0, centerRemaining - elapsed);
        clearTimeout(autoTimer);
        sendYouTubeCommand(iframe, "pauseVideo");
        btn.textContent = "▶";
        btn.setAttribute("aria-label", "Play");
      } else {
        // resume
        centerPaused = false;
        centerStartedAt = Date.now();
        sendYouTubeCommand(iframe, "playVideo");
        btn.textContent = "❚❚";
        btn.setAttribute("aria-label", "Pause");

        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => {
          stopVideo(card, id);
        }, centerRemaining);
      }
    },
  });
  thumb.appendChild(pauseBtn);

  autoTimer = setTimeout(() => {
    stopVideo(card, id);
    // pause (stop) after PLAY_DURATION
  }, PLAY_DURATION);
}

function stopVideo(card, id) {
  const thumb = card.querySelector(".thumb");
  thumb.innerHTML = "";
  thumb.style.backgroundImage = `url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`;
  thumb.classList.remove("is-playing");
  centerPaused = false;
  centerRemaining = PLAY_DURATION;
}

function nextSlide(withSound = true) {
  clearTimeout(autoTimer);
  activeIndex = (activeIndex + 1) % videos.length;
  updateUI();
  playCenterVideo(withSound);
}

function prevSlide(withSound = true) {
  clearTimeout(autoTimer);
  activeIndex = (activeIndex - 1 + videos.length) % videos.length;
  updateUI();
  playCenterVideo(withSound);
}

function manualPlay(index) {
  clearTimeout(autoTimer);
  activeIndex = index;
  updateUI();
  playCenterVideo(true); // ✅ user click => sound ON
}

/* ============================
   VIDEO CAROUSEL (COVERFLOW)
============================ */
(() => {
  const videoCarouselTrack = document.getElementById("videoCarouselTrack");
  if (!videoCarouselTrack) return;

  const videosCarousel = [
    {
      id: "ll08vZFexkQ",
      title: "Why UPSC PYQs Are Important?",
      desc: "An in-depth look into UPSC PYQs with examples.",
      thumb: "https://img.youtube.com/vi/ll08vZFexkQ/hqdefault.jpg",
    },
    {
      id: "7N2YQ9fbwlc",
      title: "UPSC Strategy 2026",
      desc: "Complete preparation roadmap.",
      thumb: "https://img.youtube.com/vi/7N2YQ9fbwlc/hqdefault.jpg",
    },
    {
      id: "aoXfzlWtez8",
      title: "Answer Writing Practice",
      desc: "Improve mains performance.",
      thumb: "https://img.youtube.com/vi/aoXfzlWtez8/hqdefault.jpg",
    },
    {
      id: "tz6G0g4gBLI",
      title: "Current Affairs Analysis",
      desc: "Monthly breakdown and insights.",
      thumb: "https://img.youtube.com/vi/tz6G0g4gBLI/hqdefault.jpg",
    },
    {
      id: "aHO53WCA7aA",
      title: "Prelims Revision Tips",
      desc: "Smart revision techniques.",
      thumb: "https://img.youtube.com/vi/aHO53WCA7aA/hqdefault.jpg",
    },
  ];

  // ✅ start with the middle card centered
  let currentVideoIndex = Math.floor(videosCarousel.length / 2);
  const CAROUSEL_PLAY_DURATION = 45000; // 45 seconds

  function circularDiff(i, current, n) {
    let d = (i - current) % n;
    if (d < 0) d += n;
    if (d > n / 2) d -= n;
    return d;
  }

  function clearInlinePlayers() {
    const cards = Array.from(videoCarouselTrack.querySelectorAll(".video-card"));

    cards.forEach((card) => {
      if (card.__playTimer) {
        clearTimeout(card.__playTimer);
        card.__playTimer = null;
      }

      const thumb = card.querySelector(".thumb");
      if (!thumb) return;

      thumb.querySelectorAll("iframe").forEach((f) => f.remove());

      thumb.querySelectorAll(".yt-pause-btn").forEach((b) => b.remove());

      const img = thumb.querySelector("img");
      if (img) img.style.display = "";

      const btn = thumb.querySelector(".play-btn");
      if (btn) btn.style.display = "";
    });
  }

  function updateVideoCarousel() {
    const cards = Array.from(videoCarouselTrack.querySelectorAll(".video-card"));
    const n = cards.length;

    cards.forEach((card, i) => {
      const d = circularDiff(i, currentVideoIndex, n);

      // ✅ mark the centered card as active
      card.classList.toggle("active", d === 0);

      // Show only 3 cards: center + immediate left/right
      if (Math.abs(d) > 1) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.transform = `translateX(-50%) translateX(${d * 360}px) scale(0.75)`;
        card.style.zIndex = "0";
        return;
      }

      const x = d * 340;
      const scale = d === 0 ? 1.06 : 0.88;
      const opacity = d === 0 ? 1 : 0.40;

      card.style.opacity = String(opacity);
      card.style.pointerEvents = "auto";
      card.style.zIndex = String(100 - Math.abs(d));
      card.style.transform = `translateX(-50%) translateX(${x}px) scale(${scale})`;
      card.style.filter = d === 0 ? "none" : "brightness(0.92) saturate(0.9)";
      card.style.boxShadow = d === 0
        ? "0 18px 55px rgba(2, 6, 23, 0.22)"
        : "0 14px 40px rgba(2, 6, 23, 0.12)";

      card.onclick = () => {
        currentVideoIndex = i;
        clearInlinePlayers();
        updateVideoCarousel();
      };
    });
  }

  function nextVideoSlide() {
    currentVideoIndex = (currentVideoIndex + 1) % videosCarousel.length;
    clearInlinePlayers();
    updateVideoCarousel();
  }

  function prevVideoSlide() {
    currentVideoIndex = (currentVideoIndex - 1 + videosCarousel.length) % videosCarousel.length;
    clearInlinePlayers();
    updateVideoCarousel();
  }

  function playVideoCarousel(videoId, btnEl) {
    const card = btnEl.closest(".video-card");
    if (!card) return;

    const thumb = card.querySelector(".thumb");
    if (!thumb) return;

    // stop any existing players first (also restores thumbnails)
    clearInlinePlayers();

    const img = thumb.querySelector("img");
    if (img) img.style.display = "none";
    btnEl.style.display = "none";

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&enablejsapi=1${youTubeOriginParam()}`;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    thumb.appendChild(iframe);

    // local pause/resume + timer pause
    card.__remaining = CAROUSEL_PLAY_DURATION;
    card.__startedAt = Date.now();
    card.__paused = false;

    const pauseBtn = createPauseButton({
      initiallyPaused: false,
      onToggle: (btn) => {
        if (!iframe) return;

        if (!card.__paused) {
          card.__paused = true;
          const elapsed = Date.now() - (card.__startedAt || Date.now());
          card.__remaining = Math.max(0, (card.__remaining ?? CAROUSEL_PLAY_DURATION) - elapsed);
          if (card.__playTimer) {
            clearTimeout(card.__playTimer);
            card.__playTimer = null;
          }
          sendYouTubeCommand(iframe, "pauseVideo");
          btn.textContent = "▶";
          btn.setAttribute("aria-label", "Play");
        } else {
          card.__paused = false;
          card.__startedAt = Date.now();
          sendYouTubeCommand(iframe, "playVideo");
          btn.textContent = "❚❚";
          btn.setAttribute("aria-label", "Pause");

          if (card.__playTimer) clearTimeout(card.__playTimer);
          card.__playTimer = setTimeout(() => {
            clearInlinePlayers();
          }, card.__remaining ?? CAROUSEL_PLAY_DURATION);
        }
      },
    });
    thumb.appendChild(pauseBtn);

    // pause (stop) after 45 seconds
    card.__playTimer = setTimeout(() => {
      clearInlinePlayers();
    }, CAROUSEL_PLAY_DURATION);
  }

  // expose for nav buttons
  window.nextVideoSlide = nextVideoSlide;
  window.prevVideoSlide = prevVideoSlide;

  // build cards once
  videoCarouselTrack.innerHTML = "";
  videosCarousel.forEach((video) => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <div class="thumb">
        <img class="video-thumb-img" src="${video.thumb}" data-youtube-alt="${video.id}" alt="${video.title}">
        <div class="play-btn"><span>▶</span></div>
      </div>
      <div class="meta">
        <h3 data-youtube-title="${video.id}">${video.title}</h3>
      </div>
    `;

    // ✅ bind click in JS (no inline `event` dependency)
    const btn = card.querySelector(".play-btn");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      playVideoCarousel(video.id, btn);
    });

    videoCarouselTrack.appendChild(card);
  });

  updateVideoCarousel();
  // Ensure titles match the real YouTube titles when possible
  hydrateYouTubeTitles();
})();


/* ============================
   CONTACT FORM (Toast + AJAX)
============================ */
(() => {
  // Prevent double-binding if static.js is loaded twice
  if (window.__contactFormToastInit) return;
  window.__contactFormToastInit = true;

  const form = document.getElementById("contact-form");
  const toast = document.getElementById("contact-toast");
  const statusEl = document.getElementById("form-status");

  if (!form || !toast) return;

  let hideTimer = null;

  function showToast(message, type) {
    toast.textContent = message;
    toast.hidden = false;

    toast.classList.remove("toast--success", "toast--error");
    toast.classList.add(type === "success" ? "toast--success" : "toast--error");

    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toast.hidden = true;
    }, 4000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (statusEl) statusEl.textContent = "";

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);

      showToast("Email has been sent.", "success");

      // this will set the bottom section of the form to success message
      if (statusEl) statusEl.textContent = "";
      
      form.reset();
    } catch (err) {
      console.error(err);
      showToast("Failed to send email. Please try again.", "error");
      if (statusEl) statusEl.textContent = "Failed to send email. Please try again.";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
