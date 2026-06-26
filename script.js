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
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const messageList = document.querySelector("#messageList");
const emptyMessage = document.querySelector("#emptyMessage");
const clearMessages = document.querySelector("#clearMessages");
const projectGrid = document.querySelector("#projectGrid");
const projectAddToggle = document.querySelector("#projectAddToggle");
const projectComposer = document.querySelector("#projectComposer");
const projectTitleInput = document.querySelector("#projectTitleInput");
const projectDescriptionInput = document.querySelector("#projectDescriptionInput");
const projectTagsInput = document.querySelector("#projectTagsInput");
const projectAddStatus = document.querySelector("#projectAddStatus");
const projectFactCount = document.querySelector("#projectFactCount");
const lifePhotoGrid = document.querySelector("#lifePhotoGrid");
const lifeAddToggle = document.querySelector("#lifeAddToggle");
const lifeComposer = document.querySelector("#lifeComposer");
const lifePhotoInput = document.querySelector("#lifePhotoInput");
const lifeAddStatus = document.querySelector("#lifeAddStatus");

const routeIds = ["intro", "fortune", "skills", "projects", "contact"];
const views = Array.from(document.querySelectorAll("[data-view]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route-link]"));
const navLinks = Array.from(document.querySelectorAll(".brand[data-route-link], .nav-list [data-route-link], .quick-nav-link[data-route-link]"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));

const introPhotos = [
  { src: "assets/huajuan-photo-6.jpg", alt: "花卷生活照片 6" },
  { src: "assets/huajuan-photo-1.jpg", alt: "花卷生活照片 1" },
  { src: "assets/huajuan-photo-2.jpg", alt: "花卷生活照片 2" },
  { src: "assets/huajuan-photo-3.jpg", alt: "花卷生活照片 3" },
  { src: "assets/huajuan-photo-4.jpg", alt: "花卷生活照片 4" },
  { src: "assets/huajuan-photo-5.jpg", alt: "花卷生活照片 5" }
];

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
let savedMessages = [];
let savedProjects = [];
let savedLifePhotos = [];
const messageStorageKey = "huajuan-messages";
const projectStorageKey = "huajuan-projects";
const lifePhotoStorageKey = "huajuan-life-photos";

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

  syncView(route);
  afterRouteChange({ focusMain, scrollTop, smooth });
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

function setPanelOpen(toggle, panel, isOpen) {
  if (!toggle || !panel) {
    return;
  }

  panel.hidden = !isOpen;
  toggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    panel.classList.add("is-visible");
  }
}

function setProjectAddStatus(message) {
  if (!projectAddStatus) {
    return;
  }

  projectAddStatus.textContent = message;
}

function setLifeAddStatus(message) {
  if (!lifeAddStatus) {
    return;
  }

  lifeAddStatus.textContent = message;
}

function readStoredList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function bindZoomableImage(image) {
  if (!image || image.dataset.zoomBound === "true") {
    return;
  }

  image.dataset.zoomBound = "true";
  image.addEventListener("dblclick", () => openImageViewer(image));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImageViewer(image);
    }
  });
}

function setIntroPhoto(index) {
  if (!introImage || introPhotos.length === 0) {
    return;
  }

  const photo = introPhotos[index % introPhotos.length];
  introImage.src = photo.src;
  introImage.alt = photo.alt;
  introImage.setAttribute("aria-label", `双击放大${photo.alt}`);
  introImage.dataset.currentPhotoIndex = String(index % introPhotos.length);
}

function startIntroSlideshow() {
  if (!introImage || introPhotos.length <= 1 || prefersReducedMotion.matches) {
    return;
  }

  let currentIndex = Number(introImage.dataset.currentPhotoIndex || "0");

  window.setInterval(() => {
    currentIndex = (currentIndex + 1) % introPhotos.length;
    setIntroPhoto(currentIndex);
  }, 5000);
}

function createTagList(tags, label) {
  const tagList = document.createElement("ul");
  tagList.className = "tag-list";
  tagList.setAttribute("aria-label", label);

  tags.forEach((tag) => {
    const item = document.createElement("li");
    item.textContent = tag;
    tagList.append(item);
  });

  return tagList;
}

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card reveal is-visible is-user-added";

  const removeButton = document.createElement("button");
  removeButton.className = "item-remove";
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `移除项目 ${project.title}`);
  removeButton.addEventListener("click", () => {
    savedProjects.splice(index, 1);
    storeProjects();
    renderProjects();
    setProjectAddStatus("已移除一个新增项目。");
  });

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const tags = project.tags.length > 0 ? project.tags : ["新增", "花卷", "灵感"];
  const tagList = createTagList(tags, `${project.title} 标签`);

  card.append(removeButton, title, description, tagList);
  return card;
}

function renderProjects() {
  if (!projectGrid) {
    return;
  }

  projectGrid.querySelectorAll(".is-user-added").forEach((card) => card.remove());
  savedProjects.forEach((project, index) => {
    projectGrid.append(createProjectCard(project, index));
  });

  if (projectFactCount) {
    projectFactCount.textContent = String(2 + savedProjects.length);
  }
}

function createLifePhotoItem(photo, index) {
  const item = document.createElement("div");
  item.className = "life-photo-item is-user-added";

  const image = document.createElement("img");
  image.className = "life-photo";
  image.src = photo.src;
  image.alt = photo.title || "花卷的萌萌照";
  image.width = 900;
  image.height = 900;
  image.loading = "lazy";
  image.tabIndex = 0;
  image.dataset.zoomableImage = "";
  image.setAttribute("aria-label", `双击放大${image.alt}`);
  bindZoomableImage(image);

  const removeButton = document.createElement("button");
  removeButton.className = "item-remove";
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `移除${image.alt}`);
  removeButton.addEventListener("click", () => {
    savedLifePhotos.splice(index, 1);
    storeLifePhotos();
    renderLifePhotos();
    setLifeAddStatus("已移除一张新增切片。");
  });

  item.append(image, removeButton);
  return item;
}

function renderLifePhotos() {
  if (!lifePhotoGrid) {
    return;
  }

  lifePhotoGrid.querySelectorAll(".is-user-added").forEach((item) => item.remove());
  savedLifePhotos.forEach((photo, index) => {
    lifePhotoGrid.append(createLifePhotoItem(photo, index));
  });
}

function storeProjects() {
  localStorage.setItem(projectStorageKey, JSON.stringify(savedProjects));
}

function storeLifePhotos() {
  localStorage.setItem(lifePhotoStorageKey, JSON.stringify(savedLifePhotos));
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
      window.setTimeout(tick, 118);
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

function readSavedMessages() {
  try {
    const parsed = JSON.parse(localStorage.getItem(messageStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.text === "string") : [];
  } catch {
    return [];
  }
}

function storeMessages() {
  localStorage.setItem(messageStorageKey, JSON.stringify(savedMessages));
}

function renderMessages() {
  if (!messageList || !emptyMessage) {
    return;
  }

  messageList.innerHTML = "";
  emptyMessage.hidden = savedMessages.length > 0;

  savedMessages.forEach((item) => {
    const messageItem = document.createElement("li");
    const messageText = document.createElement("span");
    const messageTime = document.createElement("time");
    const date = new Date(item.createdAt || Date.now());

    messageText.textContent = item.text;
    messageTime.dateTime = date.toISOString();
    messageTime.textContent = date.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    messageItem.append(messageText, messageTime);
    messageList.append(messageItem);
  });
}

function addMessage(text) {
  savedMessages.unshift({
    text,
    createdAt: new Date().toISOString()
  });
  savedMessages = savedMessages.slice(0, 6);
  storeMessages();
  renderMessages();
}

function tagsFromText(text) {
  return text
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const image = new Image();

      image.addEventListener("load", () => {
        const maxSize = 900;
        const scale = Math.min(maxSize / image.naturalWidth, maxSize / image.naturalHeight, 1);
        const width = Math.round(image.naturalWidth * scale);
        const height = Math.round(image.naturalHeight * scale);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        if (!context) {
          reject(new Error("canvas unavailable"));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      });

      image.addEventListener("error", () => reject(new Error("image unavailable")));
      image.src = reader.result;
    });

    reader.addEventListener("error", () => reject(new Error("file unavailable")));
    reader.readAsDataURL(file);
  });
}

const savedTheme = localStorage.getItem("huajuan-theme");
if (savedTheme === "dark") {
  setTheme("dark", false);
} else {
  setTheme("light", false);
}

savedProjects = readStoredList(projectStorageKey)
  .filter((item) => item && typeof item.title === "string" && typeof item.description === "string")
  .map((item) => ({
    title: item.title,
    description: item.description,
    tags: Array.isArray(item.tags) ? item.tags.filter((tag) => typeof tag === "string").slice(0, 4) : []
  }))
  .slice(0, 6);

savedLifePhotos = readStoredList(lifePhotoStorageKey)
  .filter((item) => item && typeof item.title === "string" && typeof item.src === "string")
  .slice(0, 9);

renderProjects();
renderLifePhotos();

document.querySelectorAll("[data-zoomable-image], #introImage").forEach(bindZoomableImage);
startIntroSlideshow();

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

if (projectAddToggle && projectComposer) {
  projectAddToggle.addEventListener("click", () => {
    const willOpen = projectComposer.hidden;
    setPanelOpen(projectAddToggle, projectComposer, willOpen);

    if (willOpen && projectTitleInput) {
      projectTitleInput.focus();
    }
  });
}

if (projectComposer && projectTitleInput && projectDescriptionInput) {
  projectComposer.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = projectTitleInput.value.trim();
    const description = projectDescriptionInput.value.trim();
    const tags = tagsFromText(projectTagsInput?.value || "");

    if (!title || !description) {
      setProjectAddStatus("项目名称和描述都要填写。");
      return;
    }

    savedProjects.unshift({ title, description, tags });
    savedProjects = savedProjects.slice(0, 6);
    storeProjects();
    renderProjects();
    projectComposer.reset();
    setProjectAddStatus("已添加一个新项目。");
  });
}

if (lifeAddToggle && lifeComposer) {
  lifeAddToggle.addEventListener("click", () => {
    const willOpen = lifeComposer.hidden;
    setPanelOpen(lifeAddToggle, lifeComposer, willOpen);

    if (willOpen && lifePhotoInput) {
      lifePhotoInput.focus();
    }
  });
}

if (lifeComposer && lifePhotoInput) {
  lifeComposer.addEventListener("submit", async (event) => {
    event.preventDefault();

    const files = Array.from(lifePhotoInput.files || []);

    if (files.length === 0) {
      setLifeAddStatus("需要先选择照片。");
      return;
    }

    try {
      setLifeAddStatus("正在保存照片。");
      const photos = await Promise.all(files.slice(0, 6).map(async (file, index) => ({
        title: `花卷的萌萌照 ${savedLifePhotos.length + index + 1}`,
        src: await imageFileToDataUrl(file)
      })));

      savedLifePhotos = photos.concat(savedLifePhotos);
      savedLifePhotos = savedLifePhotos.slice(0, 6);
      storeLifePhotos();
      renderLifePhotos();
      lifeComposer.reset();
      setLifeAddStatus(`已添加 ${photos.length} 张花卷的萌萌照。`);
    } catch {
      setLifeAddStatus("这张照片暂时保存失败，换一张试试。");
    }
  });
}

if (messageForm && messageInput) {
  savedMessages = readSavedMessages();
  renderMessages();

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = messageInput.value.trim();

    if (!text) {
      return;
    }

    addMessage(text);
    messageInput.value = "";
    messageInput.focus();
  });
}

if (clearMessages) {
  clearMessages.addEventListener("click", () => {
    savedMessages = [];
    storeMessages();
    renderMessages();
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
