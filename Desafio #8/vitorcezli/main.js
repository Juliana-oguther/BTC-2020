const { port: PORT } = require('./config');
const { audio, nlu, recommend } = require('./services');

const app = require('express')();
const bodyParser = require('body-parser');
const forms = require('multer')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/recommend', forms.single('audio'),  async (req, res) => {
    const { car, text } = req.body;
    const nluText = text || (await audio.audioToText(req.file.buffer));
    const entities = await nlu.analyze(nluText);
    const recommendation = recommend.recommend(entities, car.toUpperCase());
    return res.json({ recommendation, entities });
});

const http = require('http');
const server = http.createServer(app);
server.listen(PORT || 8000);
