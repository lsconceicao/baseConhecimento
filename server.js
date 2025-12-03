require('dotenv').config(); // Carrega as variaveis do .env
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Importa o SQLite
const path = require('path'); //Módulo nativo para lidar com caminhos de pasta


const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta do .env ou 3000

// Apenas os arquivos dentro de 'public' são acessíveis
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Conecta ao banco de dados criado
const dbPath = process.env.DB_PATH || './meubanco.db';
const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error('Erro ao abrir o banco:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

app.get('/api/equipamentos', (req, res) => {
    const sql = "SELECT * FROM equipamentos";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "erro": err.message });
            return;
        }

    const dadosFormatados = rows.map(rows => ({
        ...rows,
        id_acessorio_capas: rows.capas ? rows.capas.split(',') : [],
        id_acessorio_peliculas: rows.peliculas ? rows.peliculas.split(',') : []
    }));
    res.json(dadosFormatados);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});