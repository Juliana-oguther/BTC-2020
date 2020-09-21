O desafio 8 consistia na criação de uma API com a utilização de vários recursos do Watson IBM (reconhecimento de voz, entendimento semântico e ambiente cloud). 

O desafio foi apresentado aqui: https://github.com/maratonadev-br/desafio-8-2020

O que foi feito na prática: 
1 - treinamento via IBM Watson Knowledge Studio (KWS) para indicação de "entidades" do assunto (segurança, design, consumo, etc.)
2 - vincular o modelo gerado pelo KWS ao NLU (neural language understanding) para que este entenda as frases
3 - uso do Speech to text para reconhecimento de fala
4 - programação (eu usei node.js, mas poderia ser qualquer  linguagem) para receber a entrada (texto ou voz), processar as informações e retornar uma saída JSON com possível recomendação (por isso a tabela acima).

O treinamento do KWS e sua vinculação ao NLU foram realizados diretamente no painel do Watson. Já a parte programada está no arquivo index.js.

A chamada da API tem 3 campos oficiais: car, audio e text. Para efeito de avaliação dos resultados devolvidos pela API, um quarto campo foi criado (teste = s). Se existir este campo na chamada, o JSON retorna com diversas informações que permite avaliar as respostas produzidas.

Este desafio solicitava que, em caso de sentimento negativo com relação ao veículo em avaliação, fosse realizada uma recomendação de outro veículo.

Parece ser algo simples, mas foi preciso considerar as 7 entidades (segurança, consumo, desempenho, manutenção, conforto, design e acessórios). Para cumprir esta determinação, foram lidos todos os textos de comentários, criada uma tabela enorme com as características de cada veículo e, por fim, criada uma tabela a ser utilizada no programa para a escolha do outro veículo a ser recomendado. Esta montagem levou em consideração o tipo de veículo (SUV, sedan, hatch, utilitário, etc.) e as características da entidade.

Feito isso, o que levei ao programa foi uma tabela como a da figura. A melhor recomendação seria a intersecção da linha do veículo testado com a coluna do sentimento negativo. Aqui já estava considerada a necessidade de não indicar o mesmo veículo testado.

O desafio mostrou, mais uma vez, que o trabalho de um cientista de dados não é só programar e gerar modelos. O entendimento do assunto e a análise do problema são partes inseparáveis do trabalho.
