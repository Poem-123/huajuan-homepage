// documentElement 指的是 <html> 标签；主题颜色就是通过它身上的 data-theme 属性切换的。
const root = document.documentElement;

// querySelector 会在页面里按选择器找元素；找不到时会得到 null。
const themeToggle = document.querySelector("#themeToggle");
const skillsToggle = document.querySelector("#skillsToggle");
const moreSkills = document.querySelector("#moreSkills");
const backToTop = document.querySelector("#backToTop");

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

// 交互 3：滚动一段距离后显示“返回顶部”按钮。
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 420);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
