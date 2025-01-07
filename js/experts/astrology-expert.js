// 占星术专家
class AstrologyExpert {
    constructor() {
        this.expertise = "占星术";
        this.description = "专精于占星术，精通十二宫、行星、相位、宫主等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的占星术专家，请根据以下时间进行占星分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 本命盘分析
   - 上升星座
   - 月亮星座
   - 太阳星座
   - 命盘特点

2. 十二宫分析
   - 第一宫（本命宫）
   - 第二宫（财帛宫）
   - 第三宫（兄弟宫）
   - 第四宫（田宅宫）
   - 第五宫（子女宫）
   - 第六宫（疾厄宫）
   - 第七宫（婚姻宫）
   - 第八宫（迁移宫）
   - 第九宫（官禄宫）
   - 第十宫（迁移宫）
   - 第十一宫（福德宫）
   - 第十二宫（疾厄宫）

3. 行星分析
   - 太阳位置
   - 月亮位置
   - 水星位置
   - 金星位置
   - 火星位置
   - 木星位置
   - 土星位置
   - 天王星位置
   - 海王星位置
   - 冥王星位置

4. 相位分析
   - 主要相位
   - 次要相位
   - 相位关系
   - 相位影响

5. 宫主分析
   - 各宫宫主
   - 宫主落宫
   - 宫主相位
   - 宫主力量

6. 运势分析
   - 本命运势
   - 流年运势
   - 流月运势
   - 重要时点

7. 人格分析
   - 性格特征
   - 天赋才能
   - 潜在优势
   - 发展方向

8. 事业分析
   - 职业倾向
   - 事业机遇
   - 发展方向
   - 注意事项

9. 感情分析
   - 感情特质
   - 缘分时机
   - 婚姻状况
   - 桃花运势

10. 实践指导
    - 开运建议
    - 时机把握
    - 趋吉避凶
    - 注意事项

请给出专业、详实的占星分析结果，并注重实用性建议。`;

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