// 运势分析专家
class DestinyExpert {
    constructor() {
        this.expertise = "运势分析";
        this.description = "专注于运势预测和调理，全面分析事业、财运、感情、健康等运势";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位专业的运势分析专家，请基于以下信息进行分析：
农历${year}年${month}月${day}日${hour}时 ${gender}命

请从以下方面进行分析：
1. 总体运势分析
2. 事业发展运势
3. 财运走向预测
4. 感情姻缘运势
5. 健康状况预测
6. 运势调理建议
7. 趋吉避凶指导

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
            console.error('运势分析失败:', error);
            throw new Error('运势分析过程中出现错误，请稍后重试');
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
            console.error('运势分析对话失败:', error);
            throw new Error('对话过程中出现错误，请稍后重试');
        }
    }
} 