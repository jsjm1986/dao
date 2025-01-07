// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';  // 修正为正确的API地址
const DEEPSEEK_API_KEY = 'sk-7eeeb89fd2b64611b73cea2c9f7d55de';  // DeepSeek API密钥

// 辅助函数：构建API请求头
function getApiHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Accept': 'application/json'
    };
}

// 辅助函数：带重试的API请求
async function fetchWithRetry(url, options, maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    
    throw lastError;
}

// 当前选中的专家
let selectedExpert = null;

// 专家映射表
const expertMap = {
    'bazi': BaziExpert,           // 八字专家
    'ziwei': ZiweiExpert,         // 紫微斗数专家
    'liuyao': LiuyaoExpert,       // 六爻预测专家
    'qimen': QimenExpert,         // 奇门遁甲专家
    'daliuren': DaliurenExpert,   // 大六壬专家
    'taiyi': TaiyiExpert,         // 太乙神数专家
    'zeji': ZejiExpert,           // 择吉术专家
    'astrology': AstrologyExpert, // 占星术专家
    'wuxing': WuxingExpert,       // 五行分析专家
    'destiny': DestinyExpert      // 运势分析专家
};

// 当前会话的历史记录
let sessionHistory = [];

// 初始化专家选择
function initializeExpertSelection() {
    const expertCards = document.querySelectorAll('.expert-card');
    expertCards.forEach(card => {
        card.addEventListener('click', () => {
            const expertType = card.dataset.expert;
            selectExpert(expertType, card);
        });
    });
}

// 选择专家
function selectExpert(expertType, card) {
    // 移除其他卡片的选中状态
    document.querySelectorAll('.expert-card').forEach(c => {
        c.classList.remove('selected');
    });

    // 添加选中状态
    card.classList.add('selected');
    selectedExpert = expertType;

    // 显示信息输入表单
    document.querySelector('.experts-container').style.display = 'none';
    document.querySelector('.input-form').style.display = 'block';
}

// 返回专家选择界面
function showExpertSelection() {
    document.querySelector('.experts-container').style.display = 'block';
    document.querySelector('.input-form').style.display = 'none';
    document.getElementById('result').innerHTML = '';
}

// 历史记录相关函数
function saveToHistory(data) {
    const expert = expertMap[selectedExpert];
    if (!expert) return;  // 如果没有选择专家，不保存记录
    
    const newEntry = {
        ...data,
        expertType: selectedExpert,
        expertName: expert.prototype.expertise,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    // 添加到会话历史记录
    sessionHistory.unshift(newEntry);
    // 只保留最近5条记录
    if (sessionHistory.length > 5) {
        sessionHistory.pop();
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    sessionHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const date = new Date(entry.timestamp).toLocaleString('zh-CN');
        
        item.innerHTML = `
            <div class="date">${date}</div>
            <div class="details">
                ${entry.expertName} | 农历${entry.year}年${entry.month}月${entry.day}日 ${entry.hour}时 ${entry.gender}
            </div>
        `;
        
        item.addEventListener('click', () => loadHistoryEntry(entry));
        historyList.appendChild(item);
    });
}

function loadHistoryEntry(entry) {
    if (!entry || !entry.expertType) return;  // 添加防护检查
    
    // 选择对应的专家
    const expertCard = document.querySelector(`[data-expert="${entry.expertType}"]`);
    if (expertCard) {
        selectExpert(entry.expertType, expertCard);
    }

    // 设置表单值
    document.getElementById('year').value = entry.year;
    document.getElementById('month').value = entry.month;
    updateDays(); // 先更新日期选项
    document.getElementById('day').value = entry.day;
    document.getElementById('hour').value = entry.hour;
    document.getElementById('gender').value = entry.gender;
    
    // 触发分析
    handleSubmit(new Event('submit'));
}

// 初始化年月日选择器
function initializeSelectors() {
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');

    // 添加年份选项（1900-2100）
    for (let year = 1900; year <= 2100; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        yearSelect.appendChild(option);
    }

    // 添加月份选项（1-12）
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '月';
        monthSelect.appendChild(option);
    }

    // 设置默认值为当前年月
    const currentDate = new Date();
    yearSelect.value = currentDate.getFullYear();
    monthSelect.value = currentDate.getMonth() + 1;

    // 初始化日期选项
    updateDays();

    // 当年份或月份改变时更新日期选项
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);

    // 显示历史记录
    updateHistoryDisplay();
}

// 更新日期选择器
function updateDays() {
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const selectedMonth = parseInt(monthSelect.value);
    const currentDay = parseInt(daySelect.value) || 1;

    // 清空现有的日期选项
    daySelect.innerHTML = '';

    // 农历月份天数（假设大月30天，小月29天）
    const daysInMonth = selectedMonth === 1 || selectedMonth === 3 || 
                       selectedMonth === 5 || selectedMonth === 7 || 
                       selectedMonth === 8 || selectedMonth === 10 || 
                       selectedMonth === 12 ? 30 : 29;

    // 添加日期选项
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day + '日';
        daySelect.appendChild(option);
    }

    // 尝试恢复之前选择的日期，如果超出范围则选择1号
    daySelect.value = currentDay <= daysInMonth ? currentDay : 1;
}

// 处理表单提交
async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedExpert) {
        displayError('请先选择一位专家');
        return;
    }

    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const hour = document.getElementById('hour').value;
    const gender = document.getElementById('gender').value;

    // 显示加载动画
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';
    document.getElementById('chatContainer').style.display = 'none';

    try {
        // 创建选中的专家实例
        const ExpertClass = expertMap[selectedExpert];
        const expert = new ExpertClass();
        
        // 获取专家分析结果
        const result = await expert.analyze(year, month, day, hour, gender);
        
        // 显示结果
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div class="expert-result">
                <h3>${result.expert}专家分析结果</h3>
                <div class="analysis-content">
                    ${result.analysis.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
        
        // 保存到历史记录
        saveToHistory({
            year,
            month,
            day,
            hour,
            gender,
            result
        });

        // 显示对话界面
        initializeChat(expert);
    } catch (error) {
        displayError(error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// 初始化对话功能
function initializeChat(expert) {
    const chatContainer = document.getElementById('chatContainer');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatExpertName = document.getElementById('chatExpertName');

    // 设置专家名称
    chatExpertName.textContent = `与${expert.expertise}专家对话`;

    // 显示对话界面
    chatContainer.style.display = 'block';

    // 获取之前的分析结果
    const resultDiv = document.getElementById('result');
    const previousAnalysis = resultDiv.textContent.trim();

    // 添加欢迎消息
    const welcomePrompt = ExpertPromptBuilder.buildBasePrompt(expert.expertise, previousAnalysis);
    addMessage({
        type: 'expert',
        content: `您好，我是${expert.expertise}专家。基于您的生辰八字，我已经做出了初步分析。如果您有任何疑问，请随时询问，我会为您进行更详细的解答。`,
        time: new Date()
    });

    // 存储对话历史
    const chatHistory = [];

    // 处理发送消息
    async function handleSend() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 禁用输入和发送按钮
        chatInput.disabled = true;
        sendButton.disabled = true;

        // 添加用户消息
        addMessage({
            type: 'user',
            content: message,
            time: new Date()
        });

        // 更新对话历史
        chatHistory.push({
            role: 'user',
            content: message
        });

        // 清空输入框
        chatInput.value = '';

        try {
            // 构建对话提示词
            const chatPrompt = ExpertPromptBuilder.buildChatPrompt(
                expert.expertise,
                previousAnalysis,
                message
            );
            
            // 获取专家回复
            const response = await expert.getAnalysis(chatPrompt);
            
            // 添加专家回复
            addMessage({
                type: 'expert',
                content: response.analysis,
                time: new Date()
            });

            // 更新对话历史
            chatHistory.push({
                role: 'assistant',
                content: response.analysis
            });

        } catch (error) {
            addMessage({
                type: 'expert',
                content: ExpertPromptBuilder.buildErrorPrompt(expert.expertise),
                time: new Date()
            });
        } finally {
            // 恢复输入和发送按钮
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    // 添加消息到对话界面
    function addMessage({ type, content, time }) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        const timeStr = time.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${timeStr}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 绑定事件
    sendButton.onclick = handleSend;
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
}

// 显示错误信息
function displayError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="error">${message}</div>`;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    initializeExpertSelection();
    initializeSelectors();
    document.getElementById('birthForm').addEventListener('submit', handleSubmit);
}); 