/**
 * learnywhere API 数据获取模块
 * 带简单内存缓存（5分钟 TTL）
 */

const CACHE_TTL = 5 * 60 * 1000; // 5 分钟
const cache = new Map();

const API_BASE = 'https://learnywhere.cn/api/bb/dashboard/profile/search';

/**
 * 获取用户背诵数据
 * @param {string} sid - 用户的加密 sid 令牌
 * @returns {Promise<object>}
 */
async function fetchUserData(sid) {
    const cacheKey = `sid_${sid}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    const url = `${API_BASE}?sid=${encodeURIComponent(sid)}`;

    const res = await fetch(url, {
        headers: {
            'User-Agent': 'VocabCard/1.0',
            Accept: 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`API 请求失败: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (json.result_code !== 200 || !json.data_body) {
        throw new Error('API 返回数据异常');
    }

    const data = formatData(json.data_body);

    cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
}

/**
 * 格式化 API 数据
 */
function formatData(body) {
    const { learnList = [], durationList = [], total_duration_num = 0 } = body;

    // 总学习时长（秒 → 小时和分钟）
    const totalSeconds = total_duration_num;
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

    // 今日数据
    const today = learnList[learnList.length - 1] || { learnNum: 0, reviewNum: 0 };
    const todayDuration = durationList[durationList.length - 1] || { duration: 0 };

    // 近7日学习总数
    const weekLearnTotal = learnList.reduce((sum, d) => sum + d.learnNum, 0);
    const weekReviewTotal = learnList.reduce((sum, d) => sum + d.reviewNum, 0);
    const weekDurationTotal = durationList.reduce((sum, d) => sum + d.duration, 0);

    return {
        learnList,
        durationList,
        totalHours,
        totalMinutes,
        totalSeconds,
        todayLearn: today.learnNum,
        todayReview: today.reviewNum,
        todayDuration: todayDuration.duration,
        weekLearnTotal,
        weekReviewTotal,
        weekDurationTotal,
    };
}

module.exports = { fetchUserData };
