document.addEventListener('DOMContentLoaded', () => {
    const targetPointsInput = document.getElementById('targetPoints')
    const saveButton = document.getElementById('save')

    // 加载已保存的目标积分
    chrome.storage.sync.get(['targetPoints'], (result) => {
        if (result.targetPoints) {
            targetPointsInput.value = result.targetPoints
        }
    })

    // 保存目标积分
    saveButton.addEventListener('click', () => {
        const targetPoints = parseInt(targetPointsInput.value)
        if (targetPoints > 0) {
            chrome.storage.sync.set({ targetPoints }, () => {
                alert('设置已保存！')
            })
        } else {
            alert('请输入有效的目标积分！')
        }
    })
})
