// 创建MutationObserver监听DOM变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    updatePointsProgress();
  });
});

// 开始监听页面变化
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 更新积分进度
function updatePointsProgress() {
  // 使用CSS选择器定位目标元素，避免使用图片URL作为特征值
  const pointElements = document.querySelectorAll('a[href="/zh/points"] .mw-css-yyek0l');

  pointElements.forEach(element => {
    // 获取当前积分数（移除逗号并转换为数字）
    const currentPoints = parseInt(element.textContent.replace(/,/g, ''));

    // 从存储中获取目标积分
    chrome.storage.sync.get(['targetPoints'], (result) => {
      if (result.targetPoints) {
        const targetPoints = result.targetPoints;
        const progress = ((currentPoints / targetPoints) * 100).toFixed(2);

        // 更新显示内容
        element.textContent = `${currentPoints.toLocaleString()} (${progress}%)`;
      }
    });
  });
}

// 初始运行一次
updatePointsProgress();