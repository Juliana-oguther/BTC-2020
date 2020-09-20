const { nlu: { api: API, url: URL, model: MODEL_ID } } = require('../config');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const nlu = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({ apikey: API }),
    serviceUrl: URL,
});

const analyze = async text => {
    const analyzeParams = {
        'text': text,
        'features': {
            'entities': {
                'model': MODEL_ID,
                'sentiment': true,
                'mentions': true,
            }
        }
    };
    try {
        const { result: { entities } } = await nlu.analyze(analyzeParams);
        return entities.map(object => ({
            entity: object.type,
            sentiment: object.sentiment.score,
            mention: object.mentions[0].text,
        }))
    } catch (err) {
        return [];
    }
};

module.exports = { analyze };
