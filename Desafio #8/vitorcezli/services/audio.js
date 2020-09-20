const { speech: { api: API, url: URL, model: MODEL } } = require('../config');

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({ apikey: API }),
    serviceUrl: URL,
});

const audioToText = async readStream => {
    const params = {
        audio: readStream,
        model: 'pt-BR_BroadbandModel',
        contentType: 'audio/flac',
        languageCustomizationId: MODEL,
    };
    try {
        const transcript = await speechToText.recognize(params);
        return transcript.result.results[0].alternatives[0].transcript;
    } catch (err) {
        console.error(err);
        return '';
    }
};

module.exports = {
    audioToText,
};
