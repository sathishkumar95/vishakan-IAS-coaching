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
  { id: "djji9bvQCXY", title: "Video 1", thumb: "https://img.youtube.com/vi/djji9bvQCXY/hqdefault.jpg" },
  { id: "XUz1Km2fhB0", title: "Video 2", thumb: "https://img.youtube.com/vi/XUz1Km2fhB0/hqdefault.jpg" },
  { id: "ylnfSnssT9c", title: "Video 3", thumb: "https://img.youtube.com/vi/ylnfSnssT9c/hqdefault.jpg" },
  { id: "tz6G0g4gBLI", title: "Video 4", thumb: "https://img.youtube.com/vi/tz6G0g4gBLI/hqdefault.jpg" },
  { id: "a8kNGgCK31o", title: "Video 5", thumb: "https://img.youtube.com/vi/a8kNGgCK31o/hqdefault.jpg" }
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

function getHeroEls() {
  return {
    slider: document.querySelector(".hero-slider"),
    wrapper: document.querySelector(".hero-slider .slider-wrapper"),
    dotsWrap: document.querySelector(".hero-slider .hero-dots"),
    prevBtn: document.querySelector(".hero-slider .hero-prev"),
    nextBtn: document.querySelector(".hero-slider .hero-next"),
    slides: Array.from(document.querySelectorAll(".hero-slider .hero-slide")),
    dots: Array.from(document.querySelectorAll(".hero-slider .hero-dot")),
  };
}

function setHeroNavVisibility(slideCount) {
  const { prevBtn, nextBtn, dotsWrap } = getHeroEls();
  const shouldShow = slideCount > 1;
  if (prevBtn) prevBtn.style.display = shouldShow ? "" : "none";
  if (nextBtn) nextBtn.style.display = shouldShow ? "" : "none";
  if (dotsWrap) dotsWrap.style.display = shouldShow ? "" : "none";
}

function showHeroSlide(index) {
  const { slides, dots } = getHeroEls();
  if (!slides.length) return;

  currentHeroSlide = (index + slides.length) % slides.length;
  slides.forEach((s) => s.classList.remove("active"));
  dots.forEach((d) => d.classList.remove("active"));

  slides[currentHeroSlide]?.classList.add("active");
  dots[currentHeroSlide]?.classList.add("active");
}

// Keep as global for the inline onclick handlers in HTML
function moveHeroSlide(dir) {
  const { slides } = getHeroEls();
  if (slides.length <= 1) return;
  showHeroSlide(currentHeroSlide + dir);
}

function imageExists(url, timeoutMs = 1800) {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;

    const finish = (ok) => {
      if (done) return;
      done = true;
      resolve(ok);
    };

    const t = setTimeout(() => finish(false), timeoutMs);
    img.onload = () => {
      clearTimeout(t);
      finish(true);
    };
    img.onerror = () => {
      clearTimeout(t);
      finish(false);
    };

    img.src = url;
  });
}

function joinUrlPath(dir, file) {
  if (!dir.endsWith("/")) dir += "/";
  if (file.startsWith("/")) file = file.slice(1);
  return dir + file;
}

async function tryFetchAssetListing(dir = "./assets/") {
  try {
    const res = await fetch(dir, { cache: "no-store" });
    if (!res.ok) return [];
    const text = await res.text();

    // Parse simple directory listings (Apache/Nginx/etc.)
    const hrefs = Array.from(text.matchAll(/href\s*=\s*"([^"]+)"/gi)).map((m) => m[1]);
    const files = hrefs
      .map((h) => h.split("?")[0])
      .map((h) => h.replace(/^\//, ""))
      .filter((h) => /\.(png|jpg|jpeg|webp|gif)$/i.test(h))
      .map((h) => h.split("/").pop())
      .filter(Boolean);

    return Array.from(new Set(files));
  } catch {
    return [];
  }
}

async function scanHeroSliderImages() {
  const assetDir = "./assets/";
  const exts = ["png", "jpg", "jpeg", "webp", "gif"]; // keep broad; only existing will load

  // 1) Prefer real directory listing, if hosting allows it
  const listedFiles = await tryFetchAssetListing(assetDir);
  const sliderFiles = listedFiles
    .filter((f) => f.toLowerCase().startsWith("slider"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  if (sliderFiles.length) {
    return sliderFiles.map((f) => joinUrlPath(assetDir, f));
  }

  // 2) Fallback: probe sequential filenames (slider1.png, slider2.jpg, slider-3.webp, etc.)
  const found = [];
  const max = 20;
  const patterns = [
    (n, ext) => `slider${n}.${ext}`,
    (n, ext) => `slider-${n}.${ext}`,
    (n, ext) => `slider_${n}.${ext}`,
  ];

  for (let i = 1; i <= max; i++) {
    let foundForIndex = null;
    for (const ext of exts) {
      for (const p of patterns) {
        const candidate = joinUrlPath(assetDir, p(i, ext));
        // eslint-disable-next-line no-await-in-loop
        const ok = await imageExists(candidate);
        if (ok) {
          foundForIndex = candidate;
          break;
        }
      }
      if (foundForIndex) break;
    }

    if (foundForIndex) {
      found.push(foundForIndex);
    } else if (found.length) {
      // stop after the first gap once we already found at least one
      break;
    }
  }

  return found;
}

function buildHeroSlider(imageUrls) {
  const { wrapper, dotsWrap } = getHeroEls();
  if (!wrapper || !dotsWrap) return;
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

  wrapper.innerHTML = "";
  dotsWrap.innerHTML = "";

  imageUrls.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = `hero-slide hero-image-slide${i === 0 ? " active" : ""}`;
    slide.innerHTML = `<img class="hero-slide-img" src="${src}" alt="Hero slide ${i + 1}">`;
    wrapper.appendChild(slide);

    const dot = document.createElement("span");
    dot.className = `hero-dot${i === 0 ? " active" : ""}`;
    dot.dataset.slide = String(i);
    dot.addEventListener("click", () => showHeroSlide(i));
    dotsWrap.appendChild(dot);
  });

  currentHeroSlide = 0;
  setHeroNavVisibility(imageUrls.length);
  showHeroSlide(0);
}

// Init: scan assets and rebuild slider. If scan fails, keep existing markup but still apply nav visibility.
(async () => {
  const { wrapper } = getHeroEls();
  if (!wrapper) return;

  const scanned = await scanHeroSliderImages();
  if (scanned.length) {
    buildHeroSlider(scanned);
    return;
  }

  // Fallback: use existing slides from HTML
  const existing = Array.from(document.querySelectorAll(".hero-slider .hero-slide-img"))
    .map((img) => img.getAttribute("src"))
    .filter(Boolean);

  setHeroNavVisibility(existing.length);
  showHeroSlide(0);
})();

/* ============================
   TESTIMONIAL SLIDER
============================ */
(() => {
  const track = document.getElementById("achieversTrack");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".achiever-slide"));
  const viewport = track.closest(".achievers-carousel-viewport");

  let index = 0;

  function circularDiff(i, current, n) {
    let d = (i - current) % n;
    if (d < 0) d += n;
    if (d > n / 2) d -= n;
    return d;
  }

  function update() {
    const n = slides.length;
    if (!n) return;

    const isSmall = window.matchMedia("(max-width: 560px)").matches;

    // Mobile: simple 1-card slider
    if (isSmall) {
      track.style.transform = `translateX(-${index * 100}%)`;

      slides.forEach((slide) => {
        slide.style.opacity = "1";
        slide.style.pointerEvents = "auto";
        slide.style.zIndex = "1";
        slide.style.transform = "none";
        slide.style.filter = "none";
        slide.onclick = null;
      });

      return;
    }

    const isMedium = window.matchMedia("(max-width: 900px)").matches;
    const xStep = isMedium ? 240 : 320;
    const activeScale = 1.05;
    const sideScale = 0.92;
    const sideOpacity = 0.42;

    // Desktop/Tablet: coverflow (3 visible)
    track.style.transform = "";

    slides.forEach((slide, i) => {
      const d = circularDiff(i, index, n);

      // show only 3: left, center, right
      if (Math.abs(d) > 1) {
        slide.style.opacity = "0";
        slide.style.pointerEvents = "none";
        slide.style.transform = `translateX(-50%) translateX(${d * xStep}px) scale(0.80)`;
        slide.style.zIndex = "0";
        return;
      }

      const x = d * xStep;
      const scale = d === 0 ? activeScale : sideScale;
      const opacity = d === 0 ? 1 : sideOpacity;

      slide.style.opacity = String(opacity);
      slide.style.pointerEvents = "auto";
      slide.style.zIndex = String(100 - Math.abs(d));
      slide.style.transform = `translateX(-50%) translateX(${x}px) scale(${scale})`;
      slide.style.filter = d === 0 ? "none" : "brightness(0.95) saturate(0.95)";

      // Clicking side cards should move like the video section
      slide.onclick = () => {
        index = i;
        update();
      };
    });
  }

  function next() {
    if (!slides.length) return;
    index = (index + 1) % slides.length;
    update();
  }

  function prev() {
    if (!slides.length) return;
    index = (index - 1 + slides.length) % slides.length;
    update();
  }

  // Expose for inline onclick
  window.nextTestimonialSlide = next;
  window.prevTestimonialSlide = prev;

  update();

  // Mobile swipe support (single-card slider)
  if (!window.__achieversSwipeBound && viewport) {
    window.__achieversSwipeBound = true;

    let startX = 0;
    let startY = 0;

    viewport.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches && e.touches[0];
        if (!t) return;
        startX = t.clientX;
        startY = t.clientY;
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchend",
      (e) => {
        const t = e.changedTouches && e.changedTouches[0];
        if (!t) return;

        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        // Tap support (user taps right/left side)
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          const rect = viewport.getBoundingClientRect();
          const x = t.clientX - rect.left;
          if (x > rect.width / 2) next();
          else prev();
          return;
        }

        // Swipe support
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

        if (dx < 0) next();
        else prev();
      },
      { passive: true }
    );
  }

  if (!window.__achieversCarouselResizeBound) {
    window.__achieversCarouselResizeBound = true;
    window.addEventListener("resize", () => update());
  }
})();

/* ============================
   YOUTUBE CENTER VIDEO SLIDER
============================ */
const ytTrack = document.getElementById("ytTrack");

const videos = [
  { id: "djji9bvQCXY", title: "Video 1" },
  { id: "XUz1Km2fhB0", title: "Video 2" },
  { id: "ylnfSnssT9c", title: "Video 3" },
  { id: "tz6G0g4gBLI", title: "Video 4" },
  { id: "a8kNGgCK31o", title: "Video 5" }
];

const PLAY_DURATION = 45000; // 45 seconds
let activeIndex = 0;
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

/* ============================
   MOBILE NAV (HAMBURGER)
============================ */
(() => {
  const topBar = document.querySelector(".top-bar");
  const toggleBtn = document.querySelector(".nav-toggle");
  const navList = document.getElementById("primary-nav");
  if (!topBar || !toggleBtn || !navList) return;

  function setOpen(isOpen) {
    topBar.classList.toggle("nav-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    toggleBtn.textContent = isOpen ? "✕" : "☰";
  }

  toggleBtn.addEventListener("click", () => {
    setOpen(!topBar.classList.contains("nav-open"));
  });

  // Close menu after clicking a link
  navList.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.closest && target.closest("a")) {
      setOpen(false);
    }
  });

  // Reset on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setOpen(false);
  });
})();

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

  const carouselWrapper = document.querySelector(".video-carousel-wrapper");

  const videosCarousel = [
    {
      id: "djji9bvQCXY",
      title: "Video 1",
      desc: "",
      thumb: "https://img.youtube.com/vi/djji9bvQCXY/hqdefault.jpg",
    },
    {
      id: "XUz1Km2fhB0",
      title: "Video 2",
      desc: "",
      thumb: "https://img.youtube.com/vi/XUz1Km2fhB0/hqdefault.jpg",
    },
    {
      id: "ylnfSnssT9c",
      title: "Video 3",
      desc: "",
      thumb: "https://img.youtube.com/vi/ylnfSnssT9c/hqdefault.jpg",
    },
    {
      id: "tz6G0g4gBLI",
      title: "Video 4",
      desc: "",
      thumb: "https://img.youtube.com/vi/tz6G0g4gBLI/hqdefault.jpg",
    },
    {
      id: "a8kNGgCK31o",
      title: "Video 5",
      desc: "",
      thumb: "https://img.youtube.com/vi/a8kNGgCK31o/hqdefault.jpg",
    },
  ];

  // ✅ start with the first card centered
  let currentVideoIndex = 0;
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

    const isSmall = window.matchMedia("(max-width: 560px)").matches;
    const isMedium = window.matchMedia("(max-width: 900px)").matches;
    const xStep = isSmall ? 190 : isMedium ? 260 : 340;
    const activeScale = isSmall ? 1.03 : 1.06;
    const sideScale = isSmall ? 0.86 : 0.88;
    const sideOpacity = isSmall ? 0.32 : 0.40;

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

      const x = d * xStep;
      const scale = d === 0 ? activeScale : sideScale;
      const opacity = d === 0 ? 1 : sideOpacity;

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

    // Only allow playback from the centered card.
    // If user taps play on a side card, center it first, then play.
    const cards = Array.from(videoCarouselTrack.querySelectorAll(".video-card"));
    const cardIndex = cards.indexOf(card);
    if (cardIndex !== -1 && cardIndex !== currentVideoIndex) {
      currentVideoIndex = cardIndex;
      clearInlinePlayers();
      updateVideoCarousel();
      // wait a tick so layout updates before injecting iframe
      setTimeout(() => {
        const centeredCard = cards[currentVideoIndex];
        const centeredBtn = centeredCard?.querySelector(".play-btn");
        if (centeredBtn) playVideoCarousel(videoId, centeredBtn);
      }, 50);
      return;
    }

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

  // Mobile swipe/tap support
  if (!window.__videoCarouselSwipeBound && carouselWrapper) {
    window.__videoCarouselSwipeBound = true;

    let startX = 0;
    let startY = 0;

    carouselWrapper.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches && e.touches[0];
        if (!t) return;
        startX = t.clientX;
        startY = t.clientY;
      },
      { passive: true }
    );

    carouselWrapper.addEventListener(
      "touchend",
      (e) => {
        const t = e.changedTouches && e.changedTouches[0];
        if (!t) return;

        const dx = t.clientX - startX;
        const dy = t.clientY - startY;

        // tap: right half => next, left half => prev
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          const rect = carouselWrapper.getBoundingClientRect();
          const x = t.clientX - rect.left;
          if (x > rect.width / 2) nextVideoSlide();
          else prevVideoSlide();
          return;
        }

        // swipe
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) nextVideoSlide();
        else prevVideoSlide();
      },
      { passive: true }
    );
  }

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

  // Keep spacing correct when resizing between breakpoints
  if (!window.__videoCarouselResizeBound) {
    window.__videoCarouselResizeBound = true;
    window.addEventListener("resize", () => updateVideoCarousel());
  }
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
