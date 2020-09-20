const fs = require('fs');

module.exports = class Recommend {

    constructor(fileCategory) {
        const category = fs.readFileSync(fileCategory, 'utf-8');
        this.category = JSON.parse(category);
    }

    _hasEntity(entityList, entity) {
        for (let i = 0; i < entityList.length; i++) {
            if (entityList[i] === entity) return true;
        }
        return false;
    }

    _selectEntityByPriority(drawEntities) {
        if (this._hasEntity(drawEntities, 'SEGURANCA')) return 'SEGURANCA';
        if (this._hasEntity(drawEntities, 'CONSUMO')) return 'CONSUMO';
        if (this._hasEntity(drawEntities, 'DESEMPENHO')) return 'DESEMPENHO';
        if (this._hasEntity(drawEntities, 'MANUTENCAO')) return 'MANUTENCAO';
        if (this._hasEntity(drawEntities, 'CONFORTO')) return 'CONFORTO';
        if (this._hasEntity(drawEntities, 'DESIGN')) return 'DESIGN';
        if (this._hasEntity(drawEntities, 'ACESSORIOS')) return 'ACESSORIOS';
    }

    recommend(entities, car) {
        const entitiesSentiments = 
            entities
                .filter(entity => entity.entity !== 'MODELO')
                .map(entity => ({
                    'entity': entity.entity,
                    'sentiment': entity.sentiment,
                }))
                .reduce((obj, entity) => {
                    const name = entity.entity;
                    const sentiment = entity.sentiment;
                    obj[name] = obj[name] ? obj[name] + sentiment : sentiment;
                    return obj;
                }, {});
        // Sort elements on dictionary based on the sentiments.
        let processed = [];
        Object.keys(entitiesSentiments).forEach(key => {
            processed.push([key, entitiesSentiments[key]]);
        });
        processed.sort((a, b) => a[1] - b[1]);
        // Doesn't recommend for empty entity.
        if (!processed.length) return '';
        // Doesn't recommend if general sentiment is positive.
        if (processed.every(v => v[1] >= 0)) return '';
        // Select the category to be evaluated.
        const draw = processed
            .filter(entity => entity[1] < 0)
            .filter(entity => entity[1] - processed[0][1] <= 0.1)
            .map(entity => entity[0]);
        const evaluationEntity = this._selectEntityByPriority(draw);
        // Return the best car different from the one passed as parameter.
        const bestCars = this.category[evaluationEntity];
        return bestCars[0] === car ? bestCars[1] : bestCars[0];
    }
}