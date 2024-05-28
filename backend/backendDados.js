// backend/backendDados.js
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const pool = require('./conexao.js'); // Importa o pool de conexão
const upload = multer();

app.use(cors());
app.use(express.json());



app.post('/upload', upload.none(), async (req, res) => {
    const { numcliente, mesreferencia, energiakwhquantidade, energiakwhvalor, sceekwhquantidade, sceekwhvalor, compensadakwhquantidade, compensadakwhvalor, contribuicaoilummunicipal, valortotalfatura} = req.body;

    try {
        const query = 'INSERT INTO fatura (numcliente,mesreferencia, energiakwhquantidade, energiakwhvalor,sceeekwhquantidade,sceeekwhvalor,compensadakwhquantidade,compensadakwhvalor, contribuicaoilummunicipal, valortotalfat) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10) RETURNING *';
        const values = [numcliente, mesreferencia, energiakwhquantidade, energiakwhvalor, sceekwhquantidade, sceekwhvalor, compensadakwhquantidade, compensadakwhvalor, contribuicaoilummunicipal, valortotalfatura];

        const result = await pool.query(query, values);
        console.log('Dados inseridos:', result.rows[0]);

        res.send({ message: 'Dados recebidos e inseridos com sucesso!', data: result.rows[0] });
    } catch (error) {
        console.error('Erro ao inserir dados no banco de dados:', error);
        res.status(500).send({ error: 'Erro ao inserir dados no banco de dados' });
    }
});

app.get('/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT numcliente from fatura group by numcliente');
        res.json(result.rows);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).send({ error: 'Erro ao buscar clientes' });
      }
  });

// Rota para buscar e somar o valor total das faturas
app.get('/total-fatura', async (req, res) => {
    const { cliente } = req.query;
    try {
        const query = cliente
        ? 'SELECT SUM((COALESCE(energiakwhvalor,0))+(COALESCE(sceeekwhvalor,0))+(COALESCE(contribuicaoilummunicipal,0))) AS total_energia FROM fatura where numcliente = $1'
        : 'SELECT SUM((COALESCE(energiakwhvalor,0))+(COALESCE(sceeekwhvalor,0))+(COALESCE(contribuicaoilummunicipal,0))) AS total_energia FROM fatura';
            const values = cliente ? [cliente] : [];
            const result = await pool.query(query, values);
      const total_energia = result.rows[0].total_energia;
      res.json({ total_energia });
    } catch (error) {
      console.error('Erro ao buscar o total da fatura no banco de dados,:', error);
      res.status(500).json({ error: 'Erro ao buscar o total da fatura no banco de dados,' });
    }
  });

  app.get('/consumo-energia', async (req, res) => {
    const { cliente } = req.query;
    try {
        const query = cliente
        ? `SELECT
            SUM(energiakwhquantidade) AS soma_total_energiakwhquantidade,
            SUM(sceeekwhquantidade) AS soma_total_sceeekwhquantidade,
            SUM(COALESCE(energiakwhquantidade, 0) + COALESCE(sceeekwhquantidade, 0)) AS soma_total
            FROM fatura WHERE numcliente = $1`
        : `SELECT
            SUM(energiakwhquantidade) AS soma_total_energiakwhquantidade,
            SUM(sceeekwhquantidade) AS soma_total_sceeekwhquantidade,
            SUM(COALESCE(energiakwhquantidade, 0) + COALESCE(sceeekwhquantidade, 0)) AS soma_total
            FROM fatura`;
            const values = cliente ? [cliente] : [];
            const result = await pool.query(query, values);
            const totalenergia = result.rows[0].soma_total_energiakwhquantidade;
            const totalscee = result.rows[0].soma_total_sceeekwhquantidade;
            const totalenergiaeletrica = result.rows[0].soma_total;
            res.json({ totalenergia, totalscee, totalenergiaeletrica });
    } catch (error) {
      console.error('Erro ao buscar o total da fatura no banco de dados,:', error);
      res.status(500).json({ error: 'Erro ao buscar o total da fatura no banco de dados,' });
    }
  });

  app.get('/energia-compensada', async (req, res) => {
    const { cliente } = req.query;
    try {
        const query = cliente
        ? 'SELECT SUM(compensadakwhquantidade) AS compensada FROM fatura where numcliente = $1'
        : 'SELECT SUM(compensadakwhquantidade) AS compensada FROM fatura';
            const values = cliente ? [cliente] : [];
            const result = await pool.query(query, values);
      const compensada = result.rows[0].compensada;
      res.json({ compensada });
    } catch (error) {
      console.error('Erro ao buscar o total da fatura no banco de dados,:', error);
      res.status(500).json({ error: 'Erro ao buscar o total da fatura no banco de dados,' });
    }
  });
  
  app.get('/energia-compensadavalor', async (req, res) => {
    const { cliente } = req.query;
    try {
        const query = cliente
        ? `SELECT REPLACE(CAST(SUM(compensadakwhvalor) AS TEXT), '-', '') AS compensadakwhvalor FROM fatura where numcliente = $1`
        : `SELECT REPLACE(CAST(SUM(compensadakwhvalor) AS TEXT), '-', '') AS compensadakwhvalor FROM fatura`;
            const values = cliente ? [cliente] : [];
            const result = await pool.query(query, values);
      const compensadakwhvalor = result.rows[0].compensadakwhvalor;
      res.json({ compensadakwhvalor });
    } catch (error) {
      console.error('Erro ao buscar o total da fatura no banco de dados,:', error);
      res.status(500).json({ error: 'Erro ao buscar o total da fatura no banco de dados,' });
    }
  });

app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});
