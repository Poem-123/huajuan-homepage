const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const themeToggle = document.querySelector("#themeToggle");
const skillsToggle = document.querySelector("#skillsToggle");
const moreSkills = document.querySelector("#moreSkills");
const backToTop = document.querySelector("#backToTop");
const readingProgress = document.querySelector("#readingProgress");
const mainContent = document.querySelector("#mainContent");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const fortuneButton = document.querySelector("#fortuneButton");
const fortuneCopy = document.querySelector("#fortuneCopy");
const fortuneText = document.querySelector("#fortuneText");
const fortuneMeta = document.querySelector("#fortuneMeta");
const fortuneCard = document.querySelector("#fortuneCard");
const copyStatus = document.querySelector("#copyStatus");
const introImage = document.querySelector("#introImage");
const imageViewer = document.querySelector("#imageViewer");
const imageViewerImage = document.querySelector("#imageViewerImage");
const imageViewerClose = document.querySelector("#imageViewerClose");

const routeIds = ["intro", "fortune", "skills", "projects", "contact"];
const views = Array.from(document.querySelectorAll("[data-view]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route-link]"));
const navLinks = Array.from(document.querySelectorAll(".brand[data-route-link], .nav-list [data-route-link]"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));

const fortunes = [
  {
    text: "今天适合把重要的事放慢一点，把喜欢的事靠近一点。",
    meta: "幸运动作：找一个舒服的位置"
  },
  {
    text: "今天适合先完成一件小事，再奖励自己一段安静时间。",
    meta: "幸运动作：把水杯放近一点"
  },
  {
    text: "如果事情太多，就从最柔软、最容易开始的那一件动手。",
    meta: "幸运动作：伸个懒腰再继续"
  },
  {
    text: "今天的灵感藏在慢半拍里，不必急着证明什么。",
    meta: "幸运动作：看一会儿窗外"
  },
  {
    text: "把边角整理好，心情也会跟着亮一点。",
    meta: "幸运动作：清出一块桌面"
  },
  {
    text: "适合认真吃饭，也适合认真喜欢今天。",
    meta: "幸运动作：给自己加一道小奖励"
  },
  {
    text: "先照顾好身体，再去处理那些需要勇气的事情。",
    meta: "幸运动作：把肩膀放松下来"
  },
  {
    text: "今天不必把所有答案都想清楚，往前挪一点也很好。",
    meta: "幸运动作：写下一个下一步"
  },
  {
    text: "留一段空白给自己，花卷会把它变成舒服的形状。",
    meta: "幸运动作：关掉一个多余提醒"
  },
  {
    text: "适合把喜欢的人和喜欢的事放在更容易看见的位置。",
    meta: "幸运动作：发出一句温柔问候"
  },
  {
    text: "今天的效率来自稳定，不来自着急。",
    meta: "幸运动作：给任务排一个顺序"
  },
  {
    text: "遇到卡住的地方，可以先去晒一会儿光，再回来试一次。",
    meta: "幸运动作：离开屏幕三分钟"
  }
];

let currentFortuneIndex = 0;
let activeRoute = "";
let lastImageTrigger = null;
let scrollTicking = false;
let copyTimer = null;

function setTheme(theme, shouldSave = true) {
  root.dataset.theme = theme;

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.textContent = theme === "dark" ? "浅色" : "明暗";
  }

  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "dark" ? "#101918" : "#f5f8f6");
  }

  if (shouldSave) {
    localStorage.setItem("huajuan-theme", theme);
  }
}

function cleanHash(hash = window.location.hash) {
  return decodeURIComponent(hash.replace(/^#/, ""));
}

function routeFromHash(hash = window.location.hash) {
  const id = cleanHash(hash);

  if (routeIds.includes(id)) {
    return id;
  }

  return null;
}

function routeFromHref(href) {
  try {
    const url = new URL(href, window.location.href);
    return routeFromHash(url.hash);
  } catch {
    return null;
  }
}

function setActiveNav(route) {
  navLinks.forEach((link) => {
    const linkRoute = routeFromHref(link.href);
    const isActive = linkRoute === route;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateProgress() {
  if (!readingProgress) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min((window.scrollY / maxScroll) * 100, 100) : 0;
  readingProgress.style.width = `${progress}%`;
}

function updateBackToTop() {
  if (backToTop) {
    backToTop.classList.toggle("is-visible", window.scrollY > 420);
  }
}

function markVisibleReveals() {
  revealItems.forEach((item) => {
    if (item.closest("[hidden]")) {
      return;
    }

    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      item.classList.add("is-visible");
    }
  });
}

function syncView(route) {
  views.forEach((view) => {
    const isActive = view.id === route;
    view.hidden = !isActive;
    view.classList.toggle("is-active", isActive);
  });

  activeRoute = route;
  setActiveNav(route);
}

function afterRouteChange({ focusMain = false, scrollTop = true, smooth = true } = {}) {
  if (focusMain && mainContent) {
    mainContent.focus({ preventScroll: true });
  }

  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: smooth && !prefersReducedMotion.matches ? "smooth" : "auto" });
  }

  requestAnimationFrame(() => {
    markVisibleReveals();
    updateProgress();
    updateBackToTop();
  });
}

function navigateToRoute(route, options = {}) {
  if (!routeIds.includes(route)) {
    return;
  }

  const {
    push = false,
    focusMain = false,
    scrollTop = true,
    smooth = true
  } = options;

  if (push && cleanHash() !== route) {
    history.pushState({ route }, "", `#${route}`);
  }

  if (route === activeRoute) {
    afterRouteChange({ focusMain, scrollTop, smooth });
    return;
  }

  const update = () => syncView(route);

  if (document.startViewTransition && !prefersReducedMotion.matches) {
    const transition = document.startViewTransition(update);
    transition.ready
      .then(() => afterRouteChange({ focusMain, scrollTop, smooth }))
      .catch(() => afterRouteChange({ focusMain, scrollTop, smooth }));
  } else {
    update();
    afterRouteChange({ focusMain, scrollTop, smooth });
  }
}

function setCopyStatus(message) {
  if (!copyStatus) {
    return;
  }

  copyStatus.textContent = message;
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    copyStatus.textContent = "";
  }, 2200);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function drawFortune() {
  if (!fortuneText || !fortuneMeta) {
    return;
  }

  let nextIndex = Math.floor(Math.random() * fortunes.length);

  if (fortunes.length > 1) {
    while (nextIndex === currentFortuneIndex) {
      nextIndex = Math.floor(Math.random() * fortunes.length);
    }
  }

  currentFortuneIndex = nextIndex;
  fortuneText.textContent = fortunes[nextIndex].text;
  fortuneMeta.textContent = fortunes[nextIndex].meta;

  if (fortuneCard) {
    fortuneCard.classList.remove("is-popping");
    void fortuneCard.offsetWidth;
    fortuneCard.classList.add("is-popping");
  }

  setCopyStatus("");
}

function runTypewriter() {
  const title = document.querySelector("[data-typewriter]");

  if (!title || title.dataset.typed === "true" || prefersReducedMotion.matches) {
    return;
  }

  const fullText = title.dataset.typewriter || title.textContent;
  let index = 0;
  title.dataset.typed = "true";
  title.textContent = "";
  title.classList.add("is-typing");

  function tick() {
    index += 1;
    title.textContent = fullText.slice(0, index);

    if (index < fullText.length) {
      window.setTimeout(tick, 56);
    } else {
      window.setTimeout(() => title.classList.remove("is-typing"), 700);
    }
  }

  tick();
}

function openImageViewer(trigger) {
  if (!imageViewer || !imageViewerImage) {
    return;
  }

  lastImageTrigger = trigger;
  imageViewerImage.src = trigger.currentSrc || trigger.src;
  imageViewerImage.alt = trigger.alt || "完整图片";
  imageViewer.hidden = false;

  if (imageViewerClose) {
    imageViewerClose.focus();
  }
}

function closeImageViewer() {
  if (!imageViewer || imageViewer.hidden) {
    return;
  }

  imageViewer.hidden = true;

  if (imageViewerImage) {
    imageViewerImage.removeAttribute("src");
    imageViewerImage.alt = "";
  }

  if (lastImageTrigger) {
    lastImageTrigger.focus();
  }
}

const savedTheme = localStorage.getItem("huajuan-theme");
if (savedTheme === "dark") {
  setTheme("dark", false);
} else {
  setTheme("light", false);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

if (skillsToggle && moreSkills) {
  skillsToggle.addEventListener("click", () => {
    const isOpen = moreSkills.classList.toggle("is-open");
    skillsToggle.setAttribute("aria-expanded", String(isOpen));
    skillsToggle.textContent = isOpen ? "收起花卷的一天" : "展开花卷的一天";
  });
}

if (fortuneButton) {
  fortuneButton.addEventListener("click", drawFortune);
}

if (fortuneCopy && fortuneText && fortuneMeta) {
  fortuneCopy.addEventListener("click", async () => {
    try {
      await copyText(`${fortuneText.textContent} ${fortuneMeta.textContent}`);
      setCopyStatus("已复制。");
    } catch {
      setCopyStatus("复制失败，请手动选择文字。");
    }
  });
}

if (introImage) {
  introImage.addEventListener("dblclick", () => openImageViewer(introImage));
  introImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImageViewer(introImage);
    }
  });
}

if (imageViewerClose) {
  imageViewerClose.addEventListener("click", closeImageViewer);
}

if (imageViewer) {
  imageViewer.addEventListener("click", (event) => {
    if (event.target === imageViewer) {
      closeImageViewer();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImageViewer();
  }
});

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const route = routeFromHref(link.href);

    if (!route) {
      return;
    }

    event.preventDefault();
    navigateToRoute(route, { push: true, smooth: true });
  });
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  });
}

window.addEventListener("scroll", () => {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  requestAnimationFrame(() => {
    updateProgress();
    updateBackToTop();
    scrollTicking = false;
  });
}, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const spyObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting && !entry.target.hidden)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && routeIds.includes(visible.target.id)) {
      setActiveNav(visible.target.id);
    }
  }, { threshold: [0.2, 0.45, 0.7] });

  views.forEach((view) => spyObserver.observe(view));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("popstate", () => {
  const route = routeFromHash() || "intro";
  navigateToRoute(route, { push: false, smooth: false });
});

window.addEventListener("hashchange", () => {
  const route = routeFromHash();

  if (!route || route === activeRoute) {
    return;
  }

  navigateToRoute(route, { push: false, smooth: false });
});

const initialRoute = routeFromHash() || "intro";
navigateToRoute(initialRoute, { push: false, smooth: false });
runTypewriter();
