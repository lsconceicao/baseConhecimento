require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db'); // Importa a conexão do Postgres

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Importante para o CRUD funcionar (receber JSON)
app.use(cors());

// Rota de Leitura (GET)
app.get('/api/equipamentos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM equipamentos');
        
        const dadosFormatados = result.rows.map(row => ({
            ...row,
            id_acessorio_capas: row.capas ? row.capas.split(',') : [],
            id_acessorio_peliculas: row.peliculas ? row.peliculas.split(',') : []
        }));

        res.json(dadosFormatados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar dados" });
    }
});

// EXEMPLO DE ROTA DE CRIAÇÃO (POST) - Para você testar o CRUD real depois
app.post('/api/equipamentos', async (req, res) => {
    const { nome, sku, id_eq, marca, img, ficha, capas, peliculas } = req.body;
    
    try {
        // Note a sintaxe $1, $2, $3...
        const query = `
            INSERT INTO equipamentos (
                nome_equipamento, sku_equipamento, id_equipamento, marca_equipamento, 
                link_imagem, link_ficha_tecnica, capas, peliculas
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `;
        
        const values = [nome, sku, id_eq, marca, img, ficha, capas.join(','), peliculas.join(',')];
        const newEquip = await pool.query(query, values);
        
        res.json(newEquip.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao salvar" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});