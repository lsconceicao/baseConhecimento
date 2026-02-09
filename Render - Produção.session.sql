-->READ ME< Script para Selecionar/Consultar a coluna ID, nome do equipamento e capas, DA tabela equipamentos ONDE o nome do equipamento é COMO a referencia descrita
--SELECT id, nome_equipamento, capas FROM equipamentos WHERE nome_equipamento LIKE '%SS - SMARTPHONE - GALAXY XCOVER 7 5G 128GB 6GB PRETO%'



-->READ ME< Script para ATUALIZAR a tabela equipamentos COLOCANDO na coluna que precisa de alteração a referencia mencionada em aspas simples, ONDE o id é referenciado
--UPDATE equipamentos SET capas = 'CAPA-IPD10_1' WHERE id = 4;



-->READ ME< Scrip para Selecionar/Consultar a coluna ID, SKU do equipamento e capas, DA tabela equipamentos ONDE o SKU do equipamento é COMO a referencia descrita
--SELECT id, sku_equipamento, capas FROM equipamentos WHERE sku_equipamento LIKE '%SM-G556BZKD_4%'


-->READ ME< Guia de funções e funcionalidades
--SELECT serve para Selecionar/Consultar
--FROM define de onde sera consumida a consulta (Vem de...)
--WHERE define o lugar de consulta (WHERE coluna... ou ONDE tiver a coluna...)
--LIKE busca dentro da tabela algo que tenha a caracteristica do input
--UPDATE Atualiza o local selecionado (Atualiza o que ja existe)
--INSERT INTO Insere na tabela um novo conteudo



-->READ ME< Script para incluir item no banco de dados
/*INSERT INTO equipamentos (
nome_equipamento,
sku_equipamento,
id_equipamento,
marca_equipamento,
link_imagem,
link_ficha_tecnica,
capas,
peliculas
)

VALUES (

'SAMSUNG GALAXY TAB S8',
'SM-X706BZAU_4',
'X706',
'SAMSUNG',
'https://images.samsung.com/is/image/samsung/p6pim/pt/sm-x706bzaaeub/gallery/pt-galaxy-tab-s8-5g-x706-sm-x706bzaaeub-534242380?$Q90_1248_936_F_PNG$',
'https://www.tudocelular.com/Samsung/fichas-tecnicas/n7589/Samsung-Galaxy-Tab-S8.html',
'CAPA-X706-11',
'PEL-X706-11'
);*/


-->READ ME< Script para visualizar toda a tabela equipamentos

--SELECT * FROM equipamentos
