import gsap from "gsap";
import "../css/style.css";

const slides = [...document.querySelectorAll(".slide")];
const captionEl = document.querySelector(".caption");

const loadingBar = document.querySelector(".loading-bar");
const logoEl = document.querySelector("dotlottie-wc");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const totalSlides = slides.length;
let currentIndex = 0;
let isAnimating = false;
let autoAdvanceTimer = null;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const DISPLAY_DURATION = 5;
const SLIDE_DURATION = 1.5;
const PARALLAX_AMOUNT = 0.8;
const ZOOM_START = 1.2;
const ZOOM_END = 1;
const MAX_QUEUE = 10;
const navQueue = [];

// Initialize all slides
slides.forEach((slide, i) => {
  slide.setAttribute("role", "group");
  slide.setAttribute("aria-roledescription", "diapositive");
  slide.setAttribute("aria-label", `${i + 1} sur ${totalSlides}`);
  if (i === 0) {
    gsap.set(slide, { visibility: "visible", zIndex: 1, xPercent: 0 });
    slide.setAttribute("aria-hidden", "false");

    captionEl.innerHTML = slide.querySelector("figcaption")?.innerHTML || "";
    gsap.set(loadingBar, { height: "0%", y: 0 });
    gsap.to(loadingBar, { height: "100%", duration: DISPLAY_DURATION, ease: "none" });
  } else {
    gsap.set(slide, { visibility: "hidden", zIndex: 0, xPercent: 100 });
    slide.setAttribute("aria-hidden", "true");
  }
});

function scheduleAutoAdvance() {
  cancelAutoAdvance();
  autoAdvanceTimer = gsap.delayedCall(DISPLAY_DURATION, () => {
    queueNavigation((currentIndex + 1) % totalSlides, -1);
  });
}

function cancelAutoAdvance() {
  if (autoAdvanceTimer) {
    autoAdvanceTimer.kill();
    autoAdvanceTimer = null;
  }
}

function queueNavigation(targetIndex, direction) {
  if (navQueue.length >= MAX_QUEUE) return;
  navQueue.push({ targetIndex, direction });
  cancelAutoAdvance();
  processQueue();
}

function processQueue() {
  if (isAnimating || navQueue.length === 0) return;

  const { targetIndex, direction } = navQueue.shift();
  if (targetIndex === currentIndex) {
    processQueue();
    return;
  }

  isAnimating = true;
  gsap.killTweensOf(loadingBar);

  // Clean up all slides
  slides.forEach((slide, i) => {
    const pic = slide.querySelector("picture");
    gsap.killTweensOf(slide);
    gsap.killTweensOf(pic);
    if (i === currentIndex) {
      gsap.set(slide, { visibility: "visible", zIndex: 1, xPercent: 0 });
    } else {
      gsap.set(slide, { visibility: "hidden", zIndex: 0 });
    }
  });

  const fromSlide = slides[currentIndex];
  const toSlide = slides[targetIndex];
  const fromPic = fromSlide.querySelector("picture");
  const toPic = toSlide.querySelector("picture");

  // Clip-path: clip right edge when going next (direction -1), left edge when going prev (direction 1)
  const clipFrom = direction === -1
    ? "inset(0 100% 0 0)"
    : "inset(0 0 0 100%)";
  gsap.set(toSlide, { visibility: "visible", zIndex: 2, xPercent: direction * 100, clipPath: clipFrom });
  gsap.set(toPic, { scale: ZOOM_START });
  gsap.set(fromPic, { scale: ZOOM_END });

  // Play lottie logo during transition, ease out before it ends
  if (logoEl?.dotLottie) {
    const lottie = logoEl.dotLottie;
    const startFrame = lottie.currentFrame;
    const totalFrames = lottie.totalFrames;
    // Play full loops plus land exactly one frame before the start frame
    const framesToPlay = totalFrames * 2 - 2;
    const endFrame = startFrame + framesToPlay;
    const frameObj = { value: startFrame };

    lottie.pause();
    gsap.to(frameObj, {
      value: endFrame,
      duration: SLIDE_DURATION *0.75,
      ease: "cubic-bezier(0.1, 0.95, 0.8, 1)",
      onUpdate() {
        lottie.setFrame(frameObj.value % totalFrames);
      },
    });
  }

  const tl = gsap.timeline({
    onComplete() {
      gsap.set(fromSlide, { visibility: "hidden", zIndex: 0 });
      fromSlide.setAttribute("aria-hidden", "true");
      gsap.set(toSlide, { zIndex: 1, clipPath: "none" });
      toSlide.setAttribute("aria-hidden", "false");
      gsap.set(fromPic, { scale: ZOOM_END });
      currentIndex = targetIndex;
      isAnimating = false;

      if (navQueue.length > 0) {
        processQueue();
      } else {
        gsap.set(loadingBar, { height: "0%", y: 0 });
        gsap.to(loadingBar, { height: "100%", duration: DISPLAY_DURATION, ease: "none" });
        scheduleAutoAdvance();
      }
    },
  });

  // Loading bar
  tl.to(loadingBar, { y: "100vh", duration: SLIDE_DURATION * 0.8, ease: "power2.out" }, 0);
  tl.set(loadingBar, { height: "0%", y: 0 }, SLIDE_DURATION * 0.8);

  // New slide slides in with zoom out + clip-path reveal
  const clipTo = direction === -1
    ? "inset(0 0% 0 0)"
    : "inset(0 0 0 0%)";
  tl.to(toSlide, { xPercent: 0, clipPath: clipTo, duration: SLIDE_DURATION, ease: "expo.out" }, 0);
  tl.to(toPic, { scale: ZOOM_END, duration: SLIDE_DURATION, ease: "expo.out" }, 0);

  // Old slide parallax out with zoom in
  tl.to(fromSlide, { xPercent: -direction * PARALLAX_AMOUNT * 100, duration: SLIDE_DURATION, delay: SLIDE_DURATION * 0.1, ease: "expo.out" }, 0);
  tl.to(fromPic, { scale: ZOOM_START, duration: SLIDE_DURATION, delay: SLIDE_DURATION * 0.1, ease: "expo.in" }, 0);

  // Update caption
  captionEl.innerHTML = toSlide.querySelector("figcaption")?.innerHTML || "";
}

// Click navigation: left half = previous, right half = next
document.addEventListener("click", (e) => {
  if (e.clientX < window.innerWidth / 2) {
    queueNavigation((currentIndex - 1 + totalSlides) % totalSlides, 1);
  } else {
    queueNavigation((currentIndex + 1) % totalSlides, -1);
  }
});

// Keyboard navigation: left/right arrows
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    queueNavigation((currentIndex - 1 + totalSlides) % totalSlides, 1);
  } else if (e.key === "ArrowRight") {
    queueNavigation((currentIndex + 1) % totalSlides, -1);
  }
});

// Once everything is loaded, activate deferred images
window.addEventListener("load", () => {
  document.querySelectorAll("[data-srcset]").forEach((el) => {
    el.setAttribute("srcset", el.dataset.srcset);
    el.removeAttribute("data-srcset");
  });
  document.querySelectorAll("[data-src]").forEach((el) => {
    el.setAttribute("src", el.dataset.src);
    el.removeAttribute("data-src");
  });
});

// Ensure lottie starts paused once loaded
if (logoEl) {
  logoEl.addEventListener("load", () => {
    logoEl.dotLottie?.setSpeed(40);
    logoEl.dotLottie?.pause();
  });
}

// Kick off auto-advance after first slide's display duration
scheduleAutoAdvance();

// Accessible nav buttons
if (prevBtn) {
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    queueNavigation((currentIndex - 1 + totalSlides) % totalSlides, 1);
  });
}
if (nextBtn) {
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    queueNavigation((currentIndex + 1) % totalSlides, -1);
  });
}

// Pause auto-advance when reduced motion is preferred
function handleReducedMotion() {
  if (prefersReducedMotion.matches) {
    cancelAutoAdvance();
  } else {
    scheduleAutoAdvance();
  }
}
prefersReducedMotion.addEventListener("change", handleReducedMotion);
handleReducedMotion();
