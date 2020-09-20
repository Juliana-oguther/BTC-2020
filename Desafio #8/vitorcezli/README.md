# Vítor Cézar de Lima | Desafio 8

## Link para o desafio:

https://github.com/maratonadev-br/desafio-8-2020


## Solucionando o desafio:

Como o Speech to Text padrão não funcionou bem para o áudio de exemplo, um modelo
customizado foi criado usando como corpus os arquivos de texto de treinamento.

Esses arquivos também foram usados para escolher os melhores carros e criar o
modelo do Natural Language Understanding. Para a primeira tarefa, os arquivos
foram lidos um por um e os dois melhores carros de cada categoria foram
selecionados. Isso resultou no arquivo *data/category.json*, que é utilizado
pela API para recomendação de carros.

A API foi desenvolvida em NodeJS e o resto deste README indica como executá-la
localmente ou no Cloud Foundry.


## Dependências:

- NodeJS e NPM para rodar localmente
- Conta na IBM Cloud e CLI para rodar no Cloud Foundry


## Executando a API:

Crie um modelo Speech to Text customizado e preencha as configurações no arquivo
*.env*. Depois, execute `npm install` para instalar as dependências e `npm start`
para executar localmente.

Para rodar no Cloud Foundry, faça login na IBM Cloud usando o CLI, defina uma
rota no campo **name** no arquivo *manifest.yml* e execute `ibmcloud cf push`.


## Testando a função de recomendação:

A função de recomendação pode ser testada com `npm test`, que executará os testes
unitários em *services/recommend.test.js*. A definição das categorias dos carros
para teste está definida no arquivo *test_data/category.test.json*.


## Referências:

- Instalando CLI da IBM Cloud: https://cloud.ibm.com/docs/cli?topic=cli-install-ibmcloud-cli
- Lançando um aplicativo NodeJS no Cloud Foundry: https://cloud.ibm.com/docs/cloud-foundry-public?topic=cloud-foundry-public-deployingapps
- Multer: https://www.npmjs.com/package/multer
- Criação de um modelo customizado: https://cloud.ibm.com/docs/speech-to-text?topic=speech-to-text-languageCreate
- Speech to Text: https://cloud.ibm.com/apidocs/speech-to-text?code=node
- Natural Language Understanding: https://cloud.ibm.com/apidocs/natural-language-understanding-data?code=node
