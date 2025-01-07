// 六爻预测专家
class LiuyaoExpert {
    constructor() {
        this.expertise = "六爻预测";
        this.description = "专精于六爻预测，精通卦象、变爻、飞伏、六亲等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的六爻预测专家，请根据以下时间进行六爻预测分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 卦象基础
   - 本卦与变卦
   - 六爻动静
   - 世应关系
   - 卦象类型

2. 六亲分析
   - 六亲配属
   - 六亲旺衰
   - 六亲关系
   - 六亲取用

3. 爻位分析
   - 各爻动静
   - 爻位吉凶
   - 爻变规律
   - 爻位寄托

4. 变卦分析
   - 变卦特征
   - 变爻含义
   - 变化趋势
   - 变卦预示

5. 飞伏分析
   - 飞神方位
   - 伏神位置
   - 飞伏关系
   - 吉凶判断

6. 时空分析
   - 月建分析
   - 日辰分析
   - 时空配合
   - 时序变化

7. 卦象取象
   - 物象分析
   - 人事分析
   - 事理分析
   - 方位分析

8. 预测结论
   - 整体趋势
   - 具体预测
   - 时间判断
   - 趋吉避凶建议

请给出专业、详实的六爻预测分析结果，并注重实用性建议。`;

        return await this.getAnalysis(prompt);
    }

    async getAnalysis(prompt) {
        const response = await fetchWithRetry(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2500,
                stream: false
            })
        });

        const data = await response.json();
        return {
            expert: this.expertise,
            analysis: data.choices[0].message.content
        };
    }
} 