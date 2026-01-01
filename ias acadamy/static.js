// /* VIDEO CAROUSEL */
// const videoCarouselTrack = document.getElementById("videoCarouselTrack");
// const videosCarousel = [
//   {
//     id: "ll08vZFexkQ",
//     title: "Why UPSC PYQs Are Important?",
//     thumb: "https://img.youtube.com/vi/ll08vZFexkQ/hqdefault.jpg"
//   },
//   {
//     id: "7N2YQ9fbwlc",
//     title: "UPSC Strategy 2026",
//     thumb: "https://img.youtube.com/vi/7N2YQ9fbwlc/hqdefault.jpg"
//   },
//   {
//     id: "aoXfzlWtez8",
//     title: "Answer Writing Practice",
//     thumb: "https://img.youtube.com/vi/aoXfzlWtez8/hqdefault.jpg"
//   },
//   {
//     id: "tz6G0g4gBLI",
//     title: "Current Affairs Analysis",
//     thumb: "https://img.youtube.com/vi/tz6G0g4gBLI/hqdefault.jpg"
//   },
//   {
//     id: "aHO53WCA7aA",
//     title: "Prelims Revision Tips",
//     thumb: "https://img.youtube.com/vi/aHO53WCA7aA/hqdefault.jpg"
//   }
// ];

// let currentVideoIndex = 0;

// if (videoCarouselTrack) {
//   // Create video cards
//   videosCarousel.forEach((video, i) => {
//     const card = document.createElement("div");
//     card.className = "video-card";
//     if (i === 0) card.classList.add("active");
//     card.innerHTML = `
//       <img src="${video.thumb}" alt="${video.title}" class="video-thumb-img">
//       <div class="play-btn" onclick="playVideoCarousel('${video.id}', this)">▶</div>
//     `;
//     videoCarouselTrack.appendChild(card);
//   });

//   function updateVideoCarousel() {
//     const cards = document.querySelectorAll(".video-card");
//     cards.forEach((card, i) => {
//       card.classList.remove("active");
      
//       // Only show the active card
//       if (i === currentVideoIndex) {
//         card.classList.add("active");
//       }
//     });
//   }

//   function nextVideoSlide() {
//     currentVideoIndex = (currentVideoIndex + 1) % videosCarousel.length;
//     updateVideoCarousel();
//   }

//   function prevVideoSlide() {
//     currentVideoIndex = (currentVideoIndex - 1 + videosCarousel.length) % videosCarousel.length;
//     updateVideoCarousel();
//   }

//   function playVideoCarousel(videoId, element) {
//     const card = element.closest(".video-card");
//     const thumb = card.querySelector(".video-thumb-img");
    
//     // Hide only the play button
//     element.style.display = "none";
    
//     // Create a container for the iframe
//     const iframeContainer = document.createElement("div");
//     iframeContainer.className = "video-iframe-container";
//     iframeContainer.style.position = "absolute";
//     iframeContainer.style.top = "0";
//     iframeContainer.style.left = "0";
//     iframeContainer.style.width = "100%";
//     iframeContainer.style.height = "100%";
//     iframeContainer.style.zIndex = "5";
    
//     const iframe = document.createElement("iframe");
//     iframe.width = "100%";
//     iframe.height = "100%";
//     iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
//     iframe.frameborder = "0";
//     iframe.allow = "autoplay; encrypted-media";
//     iframe.allowFullscreen = true;
//     iframe.style.borderRadius = "12px";
    
//     iframeContainer.appendChild(iframe);
//     card.appendChild(iframeContainer);
//   }

//   updateVideoCarousel();
// }

// /* HERO SLIDER - MANUAL ONLY */
// let currentHeroSlide = 0;
// const heroSlides = document.querySelectorAll(".hero-slide");
// const heroDots = document.querySelectorAll(".hero-dot");
// const sliderWrapper = document.querySelector(".slider-wrapper");

// function showHeroSlide(index) {
//     // Wrap around
//     if (index >= heroSlides.length) {
//         currentHeroSlide = 0;
//     } else if (index < 0) {
//         currentHeroSlide = heroSlides.length - 1;
//     } else {
//         currentHeroSlide = index;
//     }

//     // Hide all slides
//     heroSlides.forEach(slide => slide.classList.remove("active"));
    
//     // Show current slide
//     heroSlides[currentHeroSlide].classList.add("active");

//     // Update active dot
//     heroDots.forEach(dot => dot.classList.remove("active"));
//     heroDots[currentHeroSlide].classList.add("active");
// }

// function moveHeroSlide(direction) {
//     showHeroSlide(currentHeroSlide + direction);
// }

// // Dot navigation
// heroDots.forEach(dot => {
//     dot.addEventListener("click", () => {
//         showHeroSlide(parseInt(dot.dataset.slide));
//     });
// });

// // Initialize - show first slide
// showHeroSlide(0);


// /* TESTIMONIAL SLIDER */
// const track = document.getElementById("sliderTrack");
// const dots = document.querySelectorAll(".dot");

// if (track && dots.length > 0) {
//     function goToSlide(index) {
//       track.style.transform = `translateX(-${index * 100}%)`;

//       dots.forEach(dot => dot.classList.remove("active"));
//       dots[index].classList.add("active");
//     }

//     dots.forEach(dot => {
//       dot.addEventListener("click", () => {
//         goToSlide(dot.dataset.slide);
//       });
//     });
// }
// // email.......................................................................................................................................
// // video editing section.....//
// const videos = [
//   {
//     id: "ll08vZFexkQ",
//     title: "Why UPSC PYQs Are Important?",
//     desc: "The importance of UPSC PYQs | Vishakan Sir's IAS Coaching"
//   },
//   {
//     id: "7N2YQ9fbwlc",
//     title: "UPSC Strategy 2026",
//     desc: "Complete preparation roadmap"
//   },
//   {
//     id: "aoXfzlWtez8",
//     title: "Answer Writing Practice",
//     desc: "Improve Mains performance"
//   },
//   {
//     id: "tz6G0g4gBLI",
//     title: "Current Affairs Analysis",
//     desc: "Monthly breakdown"
//   },
//   {
//     id: "aHO53WCA7aA",
//     title: "Prelims Revision Tips",
//     desc: "Smart revision techniques"
//   }
// ];

// const ytTrack = document.getElementById("ytTrack");
// let active = 2;

// // Define these OUTSIDE the if block
// function nextSlide() {
//   active = (active + 1) % videos.length;
//   update();
// }

// function prevSlide() {
//   active = (active - 1 + videos.length) % videos.length;
//   update();
// }

// function update() {
//   const cards = document.querySelectorAll(".yt-card");
//   cards.forEach((c, i) => {
//     c.classList.toggle("active", i === active);
//   });
// }

// if (ytTrack) {
//     /* Create cards */
//     videos.forEach((v, i) => {
//       const card = document.createElement("div");
//       card.className = "yt-card";
//       card.innerHTML = `
//         <div class="thumb"
//           style="background-image:url('https://img.youtube.com/vi/${v.id}/hqdefault.jpg')"
//           onclick="playVideo(this,'${v.id}')">
//         </div>
//         <div class="card-info">
//           <h4>${v.title}</h4>
//           <p>${v.desc}</p>
//         </div>
//       `;
//       ytTrack.appendChild(card);
//     });

//     update();
// }

// /* Play video inline */
// function playVideo(el, id) {
//   el.innerHTML = `
//     <iframe width="100%" height="100%"
//       id="ytPlayer-${id}"
//       src="https://www.youtube.com/embed/${id}?autoplay=1"
//       frameborder="0"
//       allow="autoplay; encrypted-media"
//       allowfullscreen>
//     </iframe>
//   `;
  
//   // Pause video after 10 seconds
//   setTimeout(() => {
//     const iframe = document.getElementById(`ytPlayer-${id}`);
//     if (iframe) {
//       // YouTube iframe can't directly pause, so we disable pointer-events temporarily
//       // Then re-enable after 10 seconds to allow button clicks
//       iframe.style.pointerEvents = "none";
      
//       // Show a pause message
//       const pauseMsg = document.createElement("div");
//       pauseMsg.style.position = "absolute";
//       pauseMsg.style.top = "50%";
//       pauseMsg.style.left = "50%";
//       pauseMsg.style.transform = "translate(-50%, -50%)";
//       pauseMsg.style.background = "rgba(0,0,0,0.8)";
//       pauseMsg.style.color = "white";
//       pauseMsg.style.padding = "20px 40px";
//       pauseMsg.style.borderRadius = "8px";
//       pauseMsg.style.zIndex = "10";
//       pauseMsg.textContent = "⏸ Video Paused - Use navigation buttons";
      
//       el.parentElement.style.position = "relative";
//       el.parentElement.appendChild(pauseMsg);
      
//       // Re-enable buttons after pause
//       setTimeout(() => {
//         pauseMsg.remove();
//       }, 2000);
//     }
//   }, 10000); // 10 seconds
// }







/* ============================
   VIDEO CAROUSEL (TOP)
============================ */
const videoCarouselTrack = document.getElementById("videoCarouselTrack");

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

const PLAY_DURATION = 10000; // change to 60000 for 1 minute
let activeIndex = 2;
let autoTimer = null;

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
      <div class="card-info"><h4>${v.title}</h4></div>
    `;
    ytTrack.appendChild(card);
  });

  updateUI();
  playCenterVideo();
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

  // ✅ autoplay (timer) should stay muted; manual actions can enable sound
  const muteParam = withSound ? "" : "&mute=1";

  thumb.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1${muteParam}&loop=1&playlist=${id}"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      style="width:100%;height:100%;border:0;">
    </iframe>
  `;

  autoTimer = setTimeout(() => {
    stopVideo(card, id);
    nextSlide(false); // ✅ timer navigation => muted
  }, PLAY_DURATION);
}

function stopVideo(card, id) {
  const thumb = card.querySelector(".thumb");
  thumb.innerHTML = "";
  thumb.style.backgroundImage = `url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`;
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

  function circularDiff(i, current, n) {
    let d = (i - current) % n;
    if (d < 0) d += n;
    if (d > n / 2) d -= n;
    return d;
  }

  function clearInlinePlayers() {
    videoCarouselTrack.querySelectorAll(".video-card iframe").forEach((f) => f.remove());
    videoCarouselTrack.querySelectorAll(".video-card .play-btn").forEach((b) => (b.style.display = ""));
  }

  function updateVideoCarousel() {
    const cards = Array.from(videoCarouselTrack.querySelectorAll(".video-card"));
    const n = cards.length;

    cards.forEach((card, i) => {
      const d = circularDiff(i, currentVideoIndex, n);

      // ✅ mark the centered card as active
      card.classList.toggle("active", d === 0);

      if (Math.abs(d) > 2) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.transform = `translateX(-50%) translateX(${d * 360}px) scale(0.75)`;
        card.style.zIndex = "0";
        return;
      }

      const x = d * 340;
      const scale = d === 0 ? 1 : Math.abs(d) === 1 ? 0.9 : 0.82;
      const opacity = d === 0 ? 1 : Math.abs(d) === 1 ? 0.55 : 0.28;

      card.style.opacity = String(opacity);
      card.style.pointerEvents = "auto";
      card.style.zIndex = String(100 - Math.abs(d));
      card.style.transform = `translateX(-50%) translateX(${x}px) scale(${scale})`;

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
    const thumb = card.querySelector(".thumb");
    if (!thumb) return;

    // ✅ removed mute=1 so sound can play on user click
    thumb.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
        style="width:100%;height:100%;border:0;">
      </iframe>
    `;
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
        <img src="${video.thumb}" alt="${video.title}">
        <div class="play-btn"><span>▶</span></div>
      </div>
      <div class="meta">
        <h3>${video.title}</h3>
        <p>${video.desc ?? ""}</p>
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
})();
