// 专家系统管理器
class ExpertSystem {
    constructor() {
        this.experts = [
            new BaziExpert(),        // 八字专家
            new ZiweiExpert(),       // 紫微斗数专家
            new LiuyaoExpert(),      // 六爻预测专家
            new QimenExpert(),       // 奇门遁甲专家
            new DaliurenExpert(),    // 大六壬专家
            new TaiyiExpert(),       // 太乙神数专家
            new ZejiExpert(),        // 择吉术专家
            new AstrologyExpert(),   // 占星术专家
            new WuxingExpert(),      // 五行分析专家
            new DestinyExpert()      // 运势分析专家
        ];
    }

    async analyze(year, month, day, hour, gender) {
        const results = [];
        const resultDiv = document.getElementById('result');
        
        // 逐个专家进行分析
        for (const expert of this.experts) {
            try {
                // 显示当前专家正在分析
                resultDiv.innerHTML += `<div class="expert-analyzing">
                    <h3>${expert.expertise}专家正在推演...</h3>
                    <p class="expert-description">${expert.description}</p>
                </div>`;

                // 获取专家分析结果
                const result = await expert.analyze(year, month, day, hour, gender);
                results.push(result);

                // 更新显示结果
                this.updateResults(results);
            } catch (error) {
                console.error(`${expert.expertise}分析失败:`, error);
                resultDiv.innerHTML += `<div class="error">
                    ${expert.expertise}专家分析时遇到问题: ${error.message}
                </div>`;
            }
        }

        return results;
    }

    updateResults(results) {
        const resultDiv = document.getElementById('result');
        let html = '<div class="analysis-results">';
        
        results.forEach(result => {
            html += `
                <div class="expert-result">
                    <h3>${result.expert}专家分析结果</h3>
                    <div class="analysis-content">
                        ${result.analysis.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        resultDiv.innerHTML = html;
    }
} 