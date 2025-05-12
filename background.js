// 定义网站URL
const SITES = {
    com: 'https://makerworld.com',
    cn: 'https://makerworld.com.cn',
}

// 初始化后台任务
chrome.runtime.onInstalled.addListener(() => {
    // 初始化时立即检查积分
    checkPointsForAllSites()

    // 创建定时任务，每3分钟检查一次积分
    chrome.alarms.create('checkPoints', {
        periodInMinutes: 3,
    })
})

// 监听定时任务
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkPoints') {
        checkPointsForAllSites()
    }
})

// 检查所有站点的积分
async function checkPointsForAllSites() {
    for (const site of Object.values(SITES)) {
        await checkPointsForSite(site)
    }
}

// 检查单个站点的积分
async function checkPointsForSite(siteUrl) {
    try {
        // 获取登录状态
        const cookies = await chrome.cookies.getAll({
            domain: new URL(siteUrl).hostname,
        })
        const isLoggedIn = cookies.some(
            (cookie) => cookie.name === 'token' || cookie.name === 'session'
        )

        if (!isLoggedIn) {
            console.log(`未登录: ${siteUrl}`)
            return
        }

        // 获取积分页面
        const response = await fetch(`${siteUrl}/points`, {
            credentials: 'include',
        })
        const text = await response.text()

        // 解析积分
        const pointsMatch = text.match(/class="mw-css-yyek0l"[^>]*>([\d,]+)/i)
        if (pointsMatch) {
            const currentPoints = parseInt(pointsMatch[1].replace(/,/g, ''))

            // 从存储中获取上次的积分
            const data = await chrome.storage.sync.get([
                'lastPoints_' + siteUrl,
            ])
            const lastPoints = data['lastPoints_' + siteUrl]

            if (lastPoints && currentPoints !== lastPoints) {
                const diff = currentPoints - lastPoints
                // 发送通知
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: chrome.runtime.getURL('icon.png'),
                    title: 'MakerWorld积分变动提醒',
                    message: `${new URL(siteUrl).hostname}积分${
                        diff > 0 ? '增加' : '减少'
                    }了${Math.abs(diff)}点`,
                })
            }

            // 保存当前积分
            await chrome.storage.sync.set({
                ['lastPoints_' + siteUrl]: currentPoints,
            })
        }
    } catch (error) {
        console.error(`检查积分失败 ${siteUrl}:`, error)
    }
}
