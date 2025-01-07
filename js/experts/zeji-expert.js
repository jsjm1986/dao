// 择吉术专家
class ZejiExpert {
    constructor() {
        this.expertise = "择吉术";
        this.description = "专精于择吉术，精通黄历择日、神煞、时辰、方位等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的择吉术专家，请根据以下时间进行择吉分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 日期分析
   - 黄历吉凶
   - 宜忌事项
   - 神煞分析
   - 时令特点

2. 时辰分析
   - 吉时判断
   - 时辰宜忌
   - 时辰神煞
   - 时辰配合

3. 方位分析
   - 吉方判断
   - 凶方提示
   - 趋吉方法
   - 避凶建议

4. 年命配合
   - 生肖相合
   - 年命关系
   - 岁君吉凶
   - 太岁方位

5. 神煞分析
   - 当日神煞
   - 时辰神煞
   - 方位神煞
   - 神煞化解

6. 五行分析
   - 日干五行
   - 时干五行
   - 生克制化
   - 调和方法

7. 吉日断语
   - 婚嫁择日
   - 搬迁择日
   - 开业择日
   - 动土择日
   - 安葬择日
   - 祭祀择日

8. 时辰断语
   - 早晨时段
   - 上午时段
   - 下午时段
   - 晚上时段

9. 方位断语
   - 东南西北
   - 四维方位
   - 进退方向
   - 安置位置

10. 实践指导
    - 具体建议
    - 注意事项
    - 化解方法
    - 趋吉避凶

请给出专业、详实的择吉分析结果，并注重实用性建议。`;

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