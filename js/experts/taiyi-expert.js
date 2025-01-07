// 太乙神数专家
class TaiyiExpert {
    constructor() {
        this.expertise = "太乙神数";
        this.description = "专精于太乙神数，精通太乙五基、十六神、遁甲、五行等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的太乙神数专家，请根据以下时间进行太乙神数分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 五基分析
   - 年基
   - 月基
   - 日基
   - 时基
   - 五基关系

2. 十六神分析
   - 神煞落宫
   - 神煞性质
   - 神煞作用
   - 神煞关系

3. 遁甲分析
   - 遁甲方式
   - 遁甲规律
   - 遁甲吉凶
   - 遁甲取用

4. 五行分析
   - 五行配比
   - 五行生克
   - 五行制化
   - 五行调和

5. 太乙分析
   - 太乙落宫
   - 太乙动向
   - 太乙吉凶
   - 太乙取用

6. 九宫分析
   - 宫位布局
   - 宫位吉凶
   - 宫位关系
   - 宫位取象

7. 格局分析
   - 格局类型
   - 格局特征
   - 格局吉凶
   - 格局变化

8. 时空分析
   - 年命关系
   - 月令配合
   - 日时效应
   - 空亡处理

9. 预测分析
   - 事业运势
   - 财运分析
   - 婚恋情况
   - 健康状况

10. 实践指导
    - 趋吉避凶
    - 时间选择
    - 方位选择
    - 行动建议

请给出专业、详实的太乙神数分析结果，并注重实用性建议。`;

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