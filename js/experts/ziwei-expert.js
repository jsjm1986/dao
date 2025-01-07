// 紫微斗数专家
class ZiweiExpert {
    constructor() {
        this.expertise = "紫微斗数";
        this.description = "专精于紫微斗数命盘分析，精通星曜、宫位、四化、流年等";
    }

    async analyze(year, month, day, hour, gender) {
        const prompt = `作为一位资深的紫微斗数专家，请对以下生辰进行专业的紫微斗数分析：

农历：${year}年${month}月${day}日 ${hour}时
性别：${gender}

请从以下方面进行详尽分析：

1. 命盘基本信息
   - 命主紫微主星
   - 十二宫星曜分布
   - 四化星情况
   - 格局判定

2. 主星分析
   - 紫微星系
   - 天府星系
   - 主星组合特征
   - 主星吉凶判定

3. 辅星分析
   - 六吉星状态
   - 六煞星状态
   - 辅星组合特征
   - 辅星吉凶判定

4. 宫位分析
   - 命宫特征
   - 身宫特征
   - 财帛宫分析
   - 官禄宫分析
   - 迁移宫分析
   - 疾厄宫分析
   - 福德宫分析
   - 田宅宫分析
   - 事业宫分析
   - 子女宫分析
   - 夫妻宫分析
   - 兄弟宫分析

5. 四化分析
   - 化禄分析
   - 化权分析
   - 化科分析
   - 化忌分析

6. 大限流年
   - 大限分析
   - 流年特点
   - 流月吉凶
   - 重要时间点

7. 吉凶分析
   - 命盘整体格局
   - 吉星得地
   - 凶星陷地
   - 制化关系

8. 开运建议
   - 趋吉避凶方法
   - 化解方案
   - 有利时机选择
   - 注意事项提醒

请给出专业、详实的紫微斗数分析结果，并注重实用性建议。`;

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