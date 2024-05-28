// backend/conexao.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'EnergiaEletricaPDF',
    password: '3636',
    port: 5432,
});

module.exports = pool;
