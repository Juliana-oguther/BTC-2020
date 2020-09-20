const { expect } = require('chai');
const Recommend = require('./recommend');
const recommend = new Recommend('./test_data/category.test.json');

describe('Testing recommendation', () => {

    it('Should recommend the worst entity', () => {
        const object = [
            {
                'entity': 'CONSUMO',
                'sentiment': -0.5,
                'mention': '8Km/L'
            },
            {
                'entity': 'CONFORTO',
                'sentiment': 1.15,
                'mention': 'Sofá'
            },
            {
                'entity': 'DESIGN',
                'sentiment': -0.35,
                'mention': '8Km/L'
            },
            {
                'entity': 'DESIGN',
                'sentiment': -0.3,
                'mention': '8Km/L'
            }
        ];
        const recommendation = recommend.recommend(object, 'MAREA');
        expect(recommendation).to.deep.equal('RENEGADE');
    });

    it('Should not return any recommendation for an empty entity', () => {
        const object = [];
        const recommendation = recommend.recommend(object, 'MAREA');
        expect(recommendation).to.deep.equal('');
    });

    it('Recommendation should be empty if all sentiments are positive', () => {
        const object = [
            {
                'entity': 'MODELO',
                'sentiment': 0.1,
                'mention': 'Jeep Renegade'
            }
        ];
        const recommendation = recommend.recommend(object, 'MAREA');
        expect(recommendation).to.deep.equal('');
    });

    it('Recommendation should be empty if all sentiments are not negative', () => {
        const object = [
            {
                'entity': 'CONFORTO',
                'sentiment': 0.501,
                'mention': 'Sofá'
            },
            {
                'entity': 'CONFORTO',
                'sentiment': -0.5,
                'mention': 'Sofá'
            }
        ];
        const recommendation = recommend.recommend(object, 'MAREA');
        expect(recommendation).to.deep.equal('');
    });

    it('Should return the best vehicle for the entity that is negative', () => {
        const object = [
            {
                'entity': 'ACESSORIOS',
                'sentiment': -0.890016,
                'mention': 'Ar condicionado'
            },
        ];
        const recommendation = recommend.recommend(object, 'LINEA');
        expect(recommendation).to.deep.equal('TORO');
    });

    it('Should return the second best vehicle if the first is passed as parameter', () => {
        const object = [
            {
                'entity': 'CONSUMO',
                'sentiment': -0.000001,
                'mention': '8Km/L'
            },
        ];
        const recommendation = recommend.recommend(object, 'FIAT 500');
        expect(recommendation).to.deep.equal('MAREA');
    });

    it('MODELO should not be considered', () => {
        const object = [
            {
                'entity': 'MODELO',
                'sentiment': -0.9,
                'mention': 'Jeep Renegade'
            },
            {
                'entity': 'CONSUMO',
                'sentiment': -0.000001,
                'mention': '8Km/L'
            }
        ];
        const recommendation = recommend.recommend(object, 'TORO');
        expect(recommendation).to.deep.equal('FIAT 500');
    });

    it('Should return based on DESIGN, whose summation is higher', () => {
        const object = [
            {
                'entity': 'CONSUMO',
                'sentiment': -0.5,
                'mention': '8Km/L'
            },
            {
                'entity': 'CONFORTO',
                'sentiment': 1.1,
                'mention': 'Sofá'
            },
            {
                'entity': 'DESIGN',
                'sentiment': -0.35,
                'mention': '8Km/L'
            },
            {
                'entity': 'DESIGN',
                'sentiment': -0.3,
                'mention': '8Km/L'
            }
        ];
        const recommendation = recommend.recommend(object, 'UNO');
        expect(recommendation).to.deep.equal('RENEGADE');
    });

    it('Should return the best car on CONSUMO', () => {
        const object = [
            {
                'entity': 'CONSUMO',
                'sentiment': -0.5,
                'mention': '8Km/L'
            },
            {
                'entity': 'CONFORTO',
                'sentiment': -0.40001,
                'mention': 'Sofá'
            },
        ];
        const recommendation = recommend.recommend(object, 'UNO');
        expect(recommendation).to.deep.equal('FIAT 500');
    });

    it('Should return the second best on SEGURANCA', () => {
        const object = [
            {
                'entity': 'CONSUMO',
                'sentiment': -0.5,
                'mention': '8Km/L'
            },
            {
                'entity': 'CONFORTO',
                'sentiment': -0.40001,
                'mention': 'Sofá'
            },
            {
                'entity': 'SEGURANCA',
                'sentiment': -0.4,
                'mention': 'Sofá'
            },
        ];
        const recommendation = recommend.recommend(object, 'MAREA');
        expect(recommendation).to.deep.equal('LINEA');
    });

    it('Should return the best car on CONSUMO', () => {
        const object = [
            {
                'entity': 'CONSUMO',
                'sentiment': -0.5,
                'mention': '8Km/L'
            },
            {
                'entity': 'CONFORTO',
                'sentiment': -0.40001,
                'mention': 'Sofá'
            },
            {
                'entity': 'SEGURANCA',
                'sentiment': -0.39999,
                'mention': 'Sofá'
            },
        ];
        const recommendation = recommend.recommend(object, 'MAREA');
        expect(recommendation).to.deep.equal('FIAT 500');
    });

    it('Should not consider a draw with a positive entity', () => {
        const object = [
            {
                'entity': 'CONSUMO',
                'sentiment': -0.05,
                'mention': '8Km/L'
            },
            {
                'entity': 'SEGURANCA',
                'sentiment': 0.01,
                'mention': 'Sofá'
            },
        ];
        const recommendation = recommend.recommend(object, 'MAREA');
        expect(recommendation).to.deep.equal('FIAT 500');
    });

});
