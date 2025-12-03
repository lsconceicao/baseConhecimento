const sqlite3 = require('sqlite3').verbose();
const dados = require('./data.json');
const db = new sqlite3.Database('./meubanco.db');
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS equipamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_equipamento Text,
        sku_equipamento Text,
        id_equipamento Text,
        marca_equipamento Text,
        link_imagem Text,
        link_ficha_tecnica Text,
        capas Text,
        peliculas Text
        )
    `);

console.log("Tabela criada (ou já existente).");

const stmt = db.prepare(`
    INSERT INTO equipamentos (
        nome_equipamento, sku_equipamento, id_equipamento, marca_equipamento,
        link_imagem, link_ficha_tecnica, capas, peliculas
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

dados.forEach(dado => {
    const capasString = dado.id_acessorio_capas ? dado.id_acessorio_capas.join(',') : '';
    const peliculasString = dado.id_acessorio_peliculas ? dado.id_acessorio_peliculas.join(',') : '';

    stmt.run(
        dado.nome_equipamento,
        dado.sku_equipamento,
        dado.id_equipamento,
        dado.marca_equipamento,
        dado.link_imagem,
        dado.link_ficha_tecnica,
        capasString,
        peliculasString
    );
});

stmt.finalize();
console.log("Dados do JSON importados para o SQL com sucesso!");

});
    
db.close();