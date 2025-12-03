const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// 1. Diagnóstico de Arquivo
const jsonPath = path.resolve(__dirname, 'data.json');
console.log(`[SETUP] Procurando JSON em: ${jsonPath}`);

if (!fs.existsSync(jsonPath)) {
    console.error('[ERRO FATAL] Arquivo data.json não encontrado!');
    process.exit(1);
}

const dados = require(jsonPath);
console.log(`[SETUP] Arquivo carregado. Total de registros para importar: ${dados.length}`);

// Apaga o banco antigo para garantir recriação limpa (opcional, mas bom para debug)
const dbPath = './meubanco.db';
if (fs.existsSync(dbPath)) {
    console.log('[SETUP] Removendo banco de dados antigo...');
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // 2. Criação da Tabela
    db.run(`
        CREATE TABLE IF NOT EXISTS equipamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_equipamento TEXT,
            sku_equipamento TEXT,
            id_equipamento TEXT,
            marca_equipamento TEXT,
            link_imagem TEXT,
            link_ficha_tecnica TEXT,
            capas TEXT,
            peliculas TEXT
        )
    `, (err) => {
        if (err) {
            console.error('[ERRO] Falha ao criar tabela:', err.message);
            process.exit(1);
        } else {
            console.log('[SETUP] Tabela criada com sucesso.');
        }
    });

    // 3. Inserção com Validação
    const stmt = db.prepare(`
        INSERT INTO equipamentos (
            nome_equipamento, sku_equipamento, id_equipamento, marca_equipamento, 
            link_imagem, link_ficha_tecnica, capas, peliculas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let processados = 0;
    let erros = 0;
    const total = dados.length;

    dados.forEach((dado, index) => {
        const capasString = dado.id_acessorio_capas ? dado.id_acessorio_capas.join(',') : '';
        const peliculasString = dado.id_acessorio_peliculas ? dado.id_acessorio_peliculas.join(',') : '';

        // O segredo está aqui: passar um callback para capturar o erro individual
        stmt.run(
            dado.nome_equipamento,
            dado.sku_equipamento,
            dado.id_equipamento,
            dado.marca_equipamento,
            dado.link_imagem,
            dado.link_ficha_tecnica,
            capasString,
            peliculasString,
            function (err) { // Callback individual
                processados++;
                
                if (err) {
                    console.error(`[ERRO INSERT] Falha no item ${index} (${dado.nome_equipamento}):`, err.message);
                    erros++;
                }

                // Só encerra quando todos processarem
                if (processados === total) {
                    stmt.finalize();
                    encerrarProcesso(erros, total);
                }
            }
        );
    });
});

function encerrarProcesso(erros, total) {
    db.close((err) => {
        if (err) console.error('[ERRO] Falha ao fechar conexão:', err.message);
        
        console.log('--- RELATÓRIO FINAL ---');
        console.log(`Total tentado: ${total}`);
        console.log(`Sucessos: ${total - erros}`);
        console.log(`Erros: ${erros}`);
        
        if (erros > 0) {
            console.error('[FALHA] A importação conteve erros. Verifique os logs acima.');
            process.exit(1); // Força erro no build do Render
        } else {
            console.log('[SUCESSO] Banco de dados populado corretamente.');
            process.exit(0);
        }
    });
}


/* const sqlite3 = require('sqlite3').verbose();
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
    
db.close(); */