// 大六壬专家
class DaliurenExpert {
    constructor() {
        this.expertise = "大六壬";
        this.description = "专精于大六壬预测，精通十二天将、十二地支、四课、三传等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的大六壬专家，请根据以下时间进行大六壬预测分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 四课分析
   - 日课
   - 辰课
   - 人课
   - 神课

2. 三传分析
   - 初传
   - 中传
   - 末传
   - 传变规律

3. 天将分析
   - 天将落宫
   - 将星吉凶
   - 将星变化
   - 将星取用

4. 地盘分析
   - 十二支配
   - 地支关系
   - 地支生克
   - 支神取用

5. 神煞分析
   - 十二神
   - 吉凶神煞
   - 神煞作用
   - 神煞关系

6. 格局分析
   - 课体判定
   - 格局类型
   - 格局特征
   - 吉凶断定

7. 时空分析
   - 月建效应
   - 日辰关系
   - 时辰配合
   - 空亡处理

8. 卦象分析
   - 本卦特征
   - 变卦关系
   - 卦象寓意
   - 卦变规律

9. 预测断语
   - 事业方面
   - 财运方面
   - 感情方面
   - 健康方面

10. 实践指导
    - 时间选择
    - 方向选择
    - 行动建议
    - 趋吉避凶

请给出专业、详实的大六壬预测分析结果，并注重实用性建议。`;

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