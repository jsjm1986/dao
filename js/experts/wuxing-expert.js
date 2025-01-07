// 五行分析专家
class WuxingExpert {
    constructor() {
        this.expertise = "五行分析";
        this.description = "深入分析命局五行配比，找出五行失衡点，提供调理方案";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位专业的五行分析专家，请基于以下信息进行分析：
农历${year}年${month}月${day}日${hour}时 ${gender}命

请从以下方面进行分析：
1. 命局五行配比分析
2. 五行失衡点诊断
3. 五行相生相克关系
4. 命主喜用神分析
5. 五行调理建议
6. 趋吉避凶指导

请给出专业、详实的分析结果。`;

        try {
            const response = await fetchWithRetry(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: getApiHeaders(),
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            const data = await response.json();
            return {
                expert: this.expertise,
                analysis: data.choices[0].message.content
            };
        } catch (error) {
            console.error('五行分析失败:', error);
            throw new Error('五行分析过程中出现错误，请稍后重试');
        }
    }

    async getAnalysis(prompt) {
        try {
            const response = await fetchWithRetry(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: getApiHeaders(),
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            const data = await response.json();
            return {
                expert: this.expertise,
                analysis: data.choices[0].message.content
            };
        } catch (error) {
            console.error('五行分析对话失败:', error);
            throw new Error('对话过程中出现错误，请稍后重试');
        }
    }
} 