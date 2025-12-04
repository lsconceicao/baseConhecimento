const { Pool } = require('pg');
const dados = require('./data.json');
require('dotenv').config();

// ATENÇÃO: Para rodar isso LOCALMENTE, você precisa pegar a "External Database URL" no painel do Render
// e colocar no seu .env local como DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrar() {
    try {
        console.log('Criando tabela...');
        // Sintaxe Postgres usa SERIAL em vez de AUTOINCREMENT
        await pool.query(`
            CREATE TABLE IF NOT EXISTS equipamentos (
                id SERIAL PRIMARY KEY,
                nome_equipamento TEXT,
                sku_equipamento TEXT,
                id_equipamento TEXT,
                marca_equipamento TEXT,
                link_imagem TEXT,
                link_ficha_tecnica TEXT,
                capas TEXT,
                peliculas TEXT
            )
        `);

        console.log('Inserindo dados...');
        for (const dado of dados) {
            const capas = dado.id_acessorio_capas ? dado.id_acessorio_capas.join(',') : '';
            const peliculas = dado.id_acessorio_peliculas ? dado.id_acessorio_peliculas.join(',') : '';

            await pool.query(
                `INSERT INTO equipamentos (
                    nome_equipamento, sku_equipamento, id_equipamento, marca_equipamento, 
                    link_imagem, link_ficha_tecnica, capas, peliculas
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    dado.nome_equipamento, dado.sku_equipamento, dado.id_equipamento, 
                    dado.marca_equipamento, dado.link_imagem, dado.link_ficha_tecnica, 
                    capas, peliculas
                ]
            );
        }
        console.log('Migração concluída com sucesso!');
    } catch (err) {
        console.error('Erro na migração:', err);
    } finally {
        pool.end();
    }
}

migrar();