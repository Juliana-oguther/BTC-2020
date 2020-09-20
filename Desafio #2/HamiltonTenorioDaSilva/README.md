Muitas pessoas que estão participando da Maratona Behind the Code IBM 2020 me perguntaram qual foi a estratégia que usei para estar no 2º lugar do desafio 2. Não sei responder com certeza, mas talvez a abordagem com relação à nota foi a mais importante.

Avaliando as informações do dataset, notei que várias linhas davam como bom o desempenho de pessoas com zero em alguma matéria. Diante disso, imaginei que seriam matérias não cursadas, como citado na descrição.

Para tratar esta questão, fiz uma criação de um novo campo (nota média) e criei uma rotina simples de cálcular a média das notas, tomando o cuidado de não entrar na média notas zero.

Basicamente é isso:

#cria uma coluna com média geral das notas
class MediaGeral(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        def AvaliaCaso(nota_de, nota_em, nota_mf, nota_go):            
            conta = 0
            valores = 0
            if nota_de > 0 and not pd.isna(nota_de):
                conta += 1
                valores += nota_de
            if nota_em > 0 and not pd.isna(nota_em):
                conta += 1
                valores += nota_em
            if nota_mf > 0 and not pd.isna(nota_mf):
                conta += 1
                valores += nota_mf
            if nota_go > 0 and not pd.isna(nota_go):
                conta += 1
                valores += nota_go
            if conta > 0:    
                media = valores / conta
            else:
                media = 0
            return media
        
        # Primeiro realizamos a cópia do dataframe 'X' de entrada
        data = X.copy()
        #faz a criação da coluna "MEDIA_GERAL" sem considerar 0
        data['MEDIA_GERAL'] = data.apply(lambda x: AvaliaCaso(x.NOTA_DE, x.NOTA_EM, x.NOTA_MF, x.NOTA_GO), axis=1)
        # Retornamos um novo dataframe
        return data   
        
        
Explicando: avaliei cada nota e, sendo zero ou nulo, não entrou para calcular a média. Caso algum registro tenha todas as notas zero ou nula, o resultado ficou 0. 

Não posso garantir que esta tenha sido a razão do meu desempenho neste desafio, mas é provável que sim.

O arquivo completo de minha abordagem neste desafio está neste repositório (https://github.com/htsnet/sklearn_transforms) que é o foi utilizado na pipeline de entrega da solução. Aliás, foi o único desafio que fiz uma única submissão.
