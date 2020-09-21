const express = require('express');
const multer = require('multer');
const upload = multer({
  dest: 'text/'
});
const fs = require('fs');
const axios = require('axios');
const {
  Console
} = require('console');
const app = express();

const username = 'apikey'; //manter constante
const password = '<apikey>'; //speech-to-text
const password2 = '<apikey>'; // natural language understand
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
const token2 = Buffer.from(`${username}:${password2}`, 'utf8').toString('base64');
const urlStt = 'https://<url do serviço stt>/v1/recognize?model=pt-BR_NarrowbandModel';
const urlNlu = 'https://<url do serviço nlu>/v1/analyze?version=2018-11-16';
const modelIdKS = '<id do modelo>' // do KWS

var teste = false;
const modelos = ['TORO', 'DUCATO', 'FIORINO', 'CRONOS', 'FIAT 500', 'MAREA', 'LINEA', 'ARGO', 'RENEGADE'];
const prioridades = ["SEGURANCA", "CONSUMO", "DESEMPENHO", "MANUTENCAO", "CONFORTO", "DESIGN", "ACESSORIOS"];
//matriz de recomendação, 7 colunas (prioridades) x 9 linhas (modelos)
const matriz = [
  ['DUCATO', 'CRONOS', 'MAREA', 'FIORINO', 'DUCATO', 'DUCATO', 'DUCATO'],
  ['TORO', 'TORO', 'TORO', 'TORO', 'TORO', 'TORO', 'CRONOS'],
  ['DUCATO', 'DUCATO', 'DUCATO', 'TORO', 'DUCATO', 'DUCATO', 'DUCATO'],
  ['MAREA', 'ARGO', 'MAREA', 'MAREA', 'ARGO', 'ARGO', 'ARGO'],
  ['CRONOS', 'ARGO', 'ARGO', 'FIORINO', 'ARGO', 'ARGO', 'ARGO'],
  ['CRONOS', 'CRONOS', 'TORO', 'TORO', 'TORO', 'CRONOS', 'CRONOS'],
  ['MAREA', 'MAREA', 'MAREA', 'TORO', 'MAREA', 'CRONOS', 'CRONOS'],
  ['MAREA', 'CRONOS', 'MAREA', 'TORO', 'CRONOS', 'CRONOS', 'CRONOS'],
  ['CRONOS', 'ARGO', 'ARGO', 'ARGO', 'ARGO', 'ARGO', 'ARGO']
];

app.get('/', (_, res) => {
  return res.send('<h1>MARATONA BEHIND THE CODE IBM 2020</h1>');
});


app.post('/desafio8', upload.single('data'), async (req, res) => {
  var parametros = req.body;
  if (req.file) {
    var arquivoRecebido = req.file;
    var temArquivo = true;
    // console.log(req.file);
  } else {
    var temArquivo = false;
  }

  //verifica se a informação do carro é uma válida
  if (parametros.car == undefined) {
    parametros.car = "";
  }
  indiceModelo = modelos.indexOf(parametros.car.toUpperCase());
  if (indiceModelo < 0) {
    //não tem o modelo do carro informado
    var motivo = 'veículo não informado ou não está na lista de possíveis';
    return res.json(preparaRespostaVazia(motivo));
  } else {
    if (!parametros.text) {
      parametros.text = "";
    }

    //verifica se é para mostrar as informações de teste
    if (parametros.teste == 's') {
      teste =  true; 
    } else {
      teste = false;
    }
    //DECIDE SE TEM ARQUIVO DE VOZ OU NÃO
    if (temArquivo) {
      //tem arquivo de áudio
      fs.readFile(arquivoRecebido.path, function (err, arquivo) {
        // console.log(arquivo);
        if (err) {
          console.log(err)
        } else {
          // console.log('vai em frente');
          //FAZ TRANSCRIÇÃO DO SOM EM TEXTO
          axios.post(urlStt,
              arquivo, {
                headers: header1
              }
            )
            .then(function (response) {
              // console.log(response.data);
              // console.log('ponto no then');
              var textCompleto = "";
              for (let item of response.data.results) {
                //precisa ter esta restrição por percentual????
                if (item.alternatives[0].confidence > 0.01) {
                  textCompleto = textCompleto + ' ' + item.alternatives[0].transcript;
                }
              }
              //junta texto com o que veio pelo post inicial
              textCompleto = parametros.car + ' ' + parametros.text + ' ' + textCompleto;

              //------------------------- rotina repetida em sem áudio ------------------------------------------
              //CHAMA O NLU PARA INTERPRETAÇÃO DO TEXTO
              //verifica se tem o nome de um dos modelos no texto final
              console.log('tem modelo de carro');
              jsonEnvio = montaJson(textCompleto, modelIdKS);
              //acessa NLU
              axios.post(urlNlu,
                  jsonEnvio, {
                    headers: header2,
                  })
                .then(function (response) {
                  return res.json(montaRecomendacao(response.data, textCompleto, "a"))
                })
                .catch(function (error) {
                  var motivo = error;
                  return respostaVazia = preparaRespostaVazia(motivo);
                });
              //------------------------- rotina repetida em sem áudio ------------------------------------------
            })
            .catch(function (error) {
              var motivo = 'Erro NLU';
              var respostaVazia = preparaRespostaVazia(motivo);
              return res.json(respostaVazia);
            })
            .catch(function (error) {
              var motivo = 'Erro STT';
              var respostaVazia = preparaRespostaVazia(motivo);
              return res.json(respostaVazia);
            });
        }
      });
    } else {
      //SE NÃO TEM ARQUIVO DE ÁUDIO
      var textCompleto = parametros.car + ' ' + parametros.text;
      //------------------------- rotina repetida em sem áudio ------------------------------------------
      //CHAMA O NLU PARA INTERPRETAÇÃO DO TEXTO
      jsonEnvio = montaJson(textCompleto, modelIdKS);
      console.log("NLU sem audio");
      //acessa NLU
      axios.post(urlNlu,
          jsonEnvio, {
            headers: header2,
          })
        .then(function (response) {
          return res.json(montaRecomendacao(response.data, textCompleto, "t"));
        })
        .catch(function (error) {
          return res.json(preparaRespostaVazia(error));
        });
      //------------------------- rotina repetida em sem áudio ------------------------------------------
    }
  }
});

function montaJson(textCompleto, modelIdKS) {
  return `{
    "language": "pt",
    "text": "${textCompleto}",
    "features": {
      "entities": {
          "model": "${modelIdKS}",
          "sentiment": true,
          "emotion": true
        },
      "sentiment": {
      },
      "keywords": {
        "emotion": true
      }
    }
  }`
}

function montaRecomendacao(dados, texto, audio) {
  //faz a tratativa da resposta recebida para saber o que retornar ao usuário
  //pega todos os sennodetimentos negativos
  var mostrar = [audio];
  var entidades = [];
  var sentimentoGeral = 0;
  var menorSentimento = 0;
  var posicaoSentimento = -1;
  var diferencaMinima = false;
  var listaNegativos = [];
  for (var i = 0; i < dados.entities.length; i++) {
    entrada = {
      "entity": dados.entities[i].type,
      "sentiment": dados.entities[i].sentiment.score,
      "mention": dados.entities[i].text
    }
    sentimentoGeral += dados.entities[i].sentiment.score;
    //se for menor que zero cuida da informação para uso na recomendação
    if (dados.entities[i].sentiment.score < 0) {
      //verifica o índice da entidade
      var qualEntidade = prioridades.indexOf(dados.entities[i].type);
      //inclui no array com todas as entidades negativas
      listaNegativos.push(qualEntidade);
      //atualiza o menor sentimento
      if (dados.entities[i].sentiment.score <= menorSentimento) {
        //se a diferença for menor do que 0.1 e já tiver valor anterior, marca como diferença mínima
        console.log(dados.entities[i].sentiment.score);
        console.log(menorSentimento)
        if ((Math.abs(dados.entities[i].sentiment.score) - Math.abs(menorSentimento) < 0.1) && menorSentimento < 0) {
          console.log(true);
          diferencaMinima = true;
        } else {
          diferencaMinima = false;
          console.log(false);
        }
        menorSentimento = dados.entities[i].sentiment.score;
        posicaoSentimento = entidades.length;
      }
    }
    entidades.push(entrada);
  }

  mostrar.push(indiceModelo);
  mostrar.push(sentimentoGeral);
  mostrar.push(qualEntidade);
  mostrar.push(listaNegativos);
  mostrar.push(menorSentimento);
  mostrar.push(posicaoSentimento);
  mostrar.push(diferencaMinima);
  //prepara como responder ao usuário
  //verifica o label do documento
   //se o sentimento geral for positivo, devolve sem 
  var qualConsiderar = 0;
  var detalhe = "";
  if (sentimentoGeral >= 0) {
    recomendacao = "";
    detalhe = `sentimento positivo ${sentimentoGeral}`;
  } else {
    //rotina para sugerir outro veículo
    //a recomendação não pode ser o mesmo carro da entrada
    if (posicaoSentimento >= 0) {
      qualConsiderar = listaNegativos[posicaoSentimento]; //posição na tabela de prioridade a ser considerada
    }
    if (diferencaMinima) {
      //considerar a tabela de prioridade
      //verifica a prioridade pela lista dos que encontrou
      listaNegativos.sort();
      //pega o elemento da lista de prioridades
      qualConsiderar = prioridades.indexOf(prioridades[listaNegativos[0]]);
      console.log(`diferença é mínima ${qualConsiderar}`);
    }
    recomendacao = matriz[indiceModelo][qualConsiderar];
    //se não tem entidade reconhecida, devolve sem recomendação
    if (entidades.length == 0) {
      recomendacao = "";
    }
  }

  //só por segurança, se recomendação for nulo, coloca como branco
  if (recomendacao == undefined) {
    recomendacao = "";
  }

  if (teste) {
    return {
      "recommendation": recomendacao,
      "entities": entidades,
      "soTeste": "***************você indicou que é um teste, então veja os campos abaixo para conferência",
      "ordemCampos": "audio/texto, indicemodelo, sentimentoGeral, qualEntidade, listaNegativos, menorSentimento, posicaoSentimento, diferencaMinima",
      "apuracaoRecomendacao": mostrar,
      "score": dados.sentiment.document.score,
      "label": dados.sentiment.document.label,
      "respostaDoNlu": dados,
      "fraseTratada": texto,
      "detalhe": detalhe
    }
  } else {
    return {
      "recommendation": recomendacao,
      "entities": entidades
    }
  }
}

function preparaRespostaVazia(motivo) {
  if (teste) {
    //console.log(motivo);
    return {
      "recommendation": "",
      "entities": [],
      "motivo": motivo
    }
  } else {
    return {
      "recommendation": "",
      "entities": []
    }
  }
}


const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Executando na porta', port));