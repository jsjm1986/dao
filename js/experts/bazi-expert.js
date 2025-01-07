// 八字专家
class BaziExpert {
    constructor() {
        this.expertise = "八字命理";
        this.description = "专精于八字命理分析，精通十神、纳音、五行生克、大运流年等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的八字命理专家，请对以下生辰八字进行专业的分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 命盘基础信息
   - 年月日时四柱天干地支
   - 纳音五行
   - 生肖特征
   - 命局格局判定

2. 日主分析
   - 日主五行属性
   - 日主强弱判定
   - 日主所处环境
   - 日主特点详解

3. 十神分析
   - 十神配置特点
   - 十神力量对比
   - 十神关系互动
   - 十神吉凶判定

4. 五行分析
   - 五行旺衰状态
   - 五行生克制化
   - 五行平衡状况
   - 五行调理建议

5. 大运流年
   - 大运排盘
   - 流年特点
   - 流月吉凶
   - 重要时间点提示

6. 命理格局
   - 命局组合特征
   - 特殊格局判定
   - 格局吉凶分析
   - 格局化解方法

7. 八字调理建议
   - 五行调节方案
   - 开运方位建议
   - 有利时间选择
   - 注意事项提醒

请给出专业、详实的八字分析结果，并注重实用性建议。`;

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