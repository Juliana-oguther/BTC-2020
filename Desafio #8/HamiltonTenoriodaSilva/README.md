O desafio 8 consistia na criação de uma API com a utilização de vários recursos do Watson IBM (reconhecimento de voz, entendimento semântico e ambiente cloud). 

O desafio foi apresentado aqui: https://github.com/maratonadev-br/desafio-8-2020

O que foi feito na prática: 
1 - treinamento via IBM Watson Knowledge Studio (KWS) para indicação de "entidades" do assunto (segurança, design, consumo, etc.)
2 - vincular o modelo gerado pelo KWS ao NLU (neural language understanding) para que este entenda as frases
3 - uso do Speech to text para reconhecimento de fala
4 - programação (eu usei node.js, mas poderia ser qualquer  linguagem) para receber a entrada (texto ou voz), processar as informações e retornar uma saída JSON com possível recomendação (por isso a tabela acima).
