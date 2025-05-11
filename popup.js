document.addEventListener('DOMContentLoaded', () => {
    const targetPointsInput = document.getElementById('targetPoints')
    const presetPointsSelect = document.getElementById('presetPoints')
    const saveButton = document.getElementById('save')

    // 生成预设值选项
    for (let i = 1; i <= 14; i++) {
        const value = i * 490
        const option = document.createElement('option')
        option.value = value
        option.textContent = value.toLocaleString()
        presetPointsSelect.appendChild(option)
    }

    // 加载已保存的目标积分
    chrome.storage.sync.get(['targetPoints'], (result) => {
        if (result.targetPoints) {
            targetPointsInput.value = result.targetPoints
            // 如果保存的值匹配预设值，则同步选择下拉框
            presetPointsSelect.value = result.targetPoints
        }
    })

    // 监听预设值选择变化
    presetPointsSelect.addEventListener('change', () => {
        if (presetPointsSelect.value) {
            targetPointsInput.value = presetPointsSelect.value
        }
    })

    // 监听手动输入变化
    targetPointsInput.addEventListener('input', () => {
        // 如果输入的值不匹配任何预设值，清空预设值选择
        if (!presetPointsSelect.querySelector(`option[value="${targetPointsInput.value}"]`)) {
            presetPointsSelect.value = ''
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
