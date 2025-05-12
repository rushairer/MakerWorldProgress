// 定义网站URL
const SITES = {
    com: 'https://makerworld.com',
    cn: 'https://makerworld.com.cn',
}

// 检查登录状态
async function checkLoginStatus() {
    for (const [key, url] of Object.entries(SITES)) {
        const statusElement = document.getElementById(`${key}-status`)
        const pointsElement = document.getElementById(`${key}-points`)
        try {
            const cookies = await chrome.cookies.getAll({
                domain: new URL(url).hostname,
            })
            const isLoggedIn = cookies.some(
                (cookie) => cookie.name === 'token' || cookie.name === 'session'
            )
            
            statusElement.textContent = isLoggedIn ? '已登录' : '未登录'
            statusElement.className = `status ${isLoggedIn ? 'logged-in' : 'logged-out'}`

            if (isLoggedIn) {
                try {
                    const response = await fetch(`${url}/points`, {
                        credentials: 'include',
                    })
                    const text = await response.text()
                    const pointsMatch = text.match(/class="mw-css-yyek0l"[^>]*>([\d,]+)/i)
                    
                    if (pointsMatch) {
                        const currentPoints = parseInt(pointsMatch[1].replace(/,/g, ''))
                        const targetPoints = await chrome.storage.sync.get(['targetPoints'])
                        const progress = targetPoints.targetPoints ? 
                            ((currentPoints / targetPoints.targetPoints) * 100).toFixed(2) : '0.00'
                        
                        pointsElement.textContent = `${currentPoints.toLocaleString()} (${progress}%)`
                    } else {
                        pointsElement.textContent = '无法获取积分'
                    }
                } catch (error) {
                    pointsElement.textContent = '积分获取失败'
                    console.error(`获取积分失败 ${url}:`, error)
                }
            } else {
                pointsElement.textContent = '请先登录'
            }
        } catch (error) {
            statusElement.textContent = '检查失败'
            statusElement.className = 'status logged-out'
            pointsElement.textContent = '状态检查失败'
            console.error(`检查登录状态失败 ${url}:`, error)
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    checkLoginStatus()
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
