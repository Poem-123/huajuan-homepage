// documentElement 指的是 <html> 标签；主题颜色就是通过它身上的 data-theme 属性切换的。
const root = document.documentElement;

// querySelector 会在页面里按选择器找元素；找不到时会得到 null。
const themeToggle = document.querySelector("#themeToggle");
const skillsToggle = document.querySelector("#skillsToggle");
const moreSkills = document.querySelector("#moreSkills");
const backToTop = document.querySelector("#backToTop");
const fortuneButton = document.querySelector("#fortuneButton");
const fortuneText = document.querySelector("#fortuneText");
const fortuneMeta = document.querySelector("#fortuneMeta");
const fortuneCard = document.querySelector("#fortuneCard");

// 今日花卷签的候选内容。每次点击按钮，会从这里随机挑一条显示出来。
const fortunes = [
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
  }
];

let currentFortuneIndex = -1;

function setTheme(theme, shouldSave = true) {
  root.dataset.theme = theme;

  // 如果按钮存在，就同步更新按钮状态；这样读屏器也能知道当前是否为深色模式。
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.textContent = theme === "dark" ? "浅色" : "明暗";
  }

  if (shouldSave) {
    localStorage.setItem("huajuan-theme", theme);
  }
}

// 读取上次保存的主题；没有保存过时，页面就使用默认浅色主题。
const savedTheme = localStorage.getItem("huajuan-theme");
if (savedTheme === "dark") {
  setTheme("dark", false);
}

// 交互 1：点击“明暗”按钮，在浅色和深色主题之间切换。
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

// 交互 2：点击按钮，展开或收起“花卷的一天”。
if (skillsToggle && moreSkills) {
  skillsToggle.addEventListener("click", () => {
    const isOpen = moreSkills.classList.toggle("is-open");
    skillsToggle.setAttribute("aria-expanded", String(isOpen));
    skillsToggle.textContent = isOpen ? "收起花卷的一天" : "展开花卷的一天";
  });
}

// 趣味功能：点击“重新抽签”，随机换一条今日提示。
if (fortuneButton && fortuneText && fortuneMeta) {
  fortuneButton.addEventListener("click", () => {
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
  });
}

// 交互 3：滚动一段距离后显示“返回顶部”按钮。
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 420);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
