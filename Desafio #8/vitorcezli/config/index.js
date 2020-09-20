const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    speech: {
        api: process.env.SPEECH_APIKEY,
        url: process.env.SPEECH_URL,
        model: process.env.SPEECH_MODEL,
    },
    nlu: {
        api: process.env.NLU_APIKEY,
        url: process.env.NLU_URL,
        model: process.env.NLU_MODELID,
    },
    data: {
        category: './data/category.json',
    },
    port: process.env.PORT,
};
