// 奇门遁甲专家
class QimenExpert {
    constructor() {
        this.expertise = "奇门遁甲";
        this.description = "专精于奇门遁甲，精通九宫布局、八门、九星、八神等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的奇门遁甲专家，请根据以下时间进行奇门遁甲分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 盘局基础
   - 局数判定
   - 遁甲方式
   - 阴阳遁别
   - 格局类型

2. 九宫分析
   - 九宫布局
   - 宫位吉凶
   - 宫位寄托
   - 宫位关系

3. 八门分析
   - 八门分布
   - 门吉凶性
   - 门户关系
   - 门户取用

4. 九星分析
   - 九星落宫
   - 星性判断
   - 星门组合
   - 星辰关系

5. 八神分析
   - 八神位置
   - 神煞作用
   - 神煞关系
   - 吉凶判断

6. 天盘分析
   - 天盘干支
   - 天盘布局
   - 天盘吉凶
   - 天盘变化

7. 地盘分析
   - 地盘干支
   - 地盘布局
   - 地盘吉凶
   - 地盘特征

8. 人盘分析
   - 人盘干支
   - 人盘布局
   - 人盘吉凶
   - 人盘特点

9. 三奇六仪
   - 三奇用神
   - 六仪配合
   - 吉凶断定
   - 取用方法

10. 实务应用
    - 时间选择
    - 方位选择
    - 行动建议
    - 趋吉避凶

请给出专业、详实的奇门遁甲分析结果，并注重实用性建议。`;

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