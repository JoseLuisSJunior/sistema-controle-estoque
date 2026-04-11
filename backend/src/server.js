const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json({ limit: '10kb'}))

app.get('/', (req, res) => {
  res.send('API Controle de estoque funcionando')
})

app.get('/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao conectar no banco' })
  }
})

app.post('/produtos', async (req, res) => {

  try{
    const {nome, codigo, valor_unitario, quantidade, fornecedor_id} = req.body

    if (valor_unitario < 0 || quantidade <0) {
      return res.status(400)
    }

    const valor_total = valor_unitario * quantidade

    const result = await pool.query (
      'INSERT INTO produtos (nome, codigo, valor_unitario, quantidade, valor_total, fornecedor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, codigo, valor_unitario, quantidade, valor_total, fornecedor_id]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    res.status(500).json ({error: 'Erro ao cadastrar produto'})
  
  }
})

app.get('/produtos', async (req,res) => {
  
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id ASC')
    res.status(200).json(result.rows)
  }catch(error) {
    console.error('Erro ao listar produtos: ', error)
    res.status(500).json({error: 'Erro ao buscar produtos' })
  
  }
})

app.get('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT * FROM produtos WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('ERRO AO BUSCAR PRODUTO:', error)
    res.status(500).json({ error: 'Erro ao buscar produto' })
  }
})

app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params
    let { nome,codigo, valor_unitario, quantidade, fornecedor_id} = req.body

    if (valor_unitario < 0 || quantidade <0){
      return res.status(400)
    }

    if (fornecedor_id === ''){
      fornecedor_id = null;
    }

    const valor_total = valor_unitario * quantidade

    const result = await pool.query(
      `UPDATE produtos 
       SET nome = $1, codigo = $2, valor_unitario = $3, quantidade = $4, valor_total = $5, fornecedor_id = $6
       WHERE id = $7
       RETURNING *`,
      [nome, codigo, valor_unitario, quantidade, valor_total,fornecedor_id, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.status(200).json(result.rows[0])

  } catch (error) {
    console.error('ERRO AO ATUALIZAR PRODUTO:', error)
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
})

app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM produtos WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.status(200).json({ message: 'Produto removido com sucesso' })

  } catch (error) {
    console.error('ERRO AO DELETAR PRODUTO:', error)
    res.status(500).json({ error: 'Erro ao deletar produto' })
  }
})

// AC2 - Função fornecedores (Criar)
app.post('/fornecedores', async (req, res) => {
  try {
    const {nome, cnpj, contato} = req.body
    const result = await pool.query(
      ' INSERT INTO fornecedores (nome, cnpj, contato) VALUES ($1, $2, $3) RETURNING *', [nome, cnpj, contato]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Erro ao criar fornecedor', error)
    res.status(500).json({ error: 'Erro ao cadastrar fornecedor' })
  }
})

// AC2 - Função fornecedores (listar)
app.get('/fornecedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fornecedores ORDER BY id ASC')
    res.status(200).json(result.rows)
  } catch (error){
    console.error('Erro ao listar fornecedores: ', error)
    res.status(500).json({error: 'Erro ao buscar fornecedores' })
  }
})

app.get('/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT * FROM fornecedores WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('ERRO AO BUSCAR FORNECEDOR:', error)
    res.status(500).json({ error: 'Erro ao buscar fornecedor' })
  }
})

// AC2 - Função fornecedores (atualização)
app.put('/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnpj, contato } = req.body;
    const result = await pool.query(
      'UPDATE fornecedores SET nome = $1, cnpj = $2, contato = $3 WHERE id = $4 RETURNING *',
      [nome, cnpj, contato, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
});

app.delete('/fornecedores/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const result = await pool.query('DELETE FROM fornecedores WHERE id= $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.status(200).json({message: 'Fornecedor removido'});

  } catch(error) {
    res.status(500).json({error: 'Erro ao deletar fornecedor'});
  }
});

// AC3

app.post('/movimentacoes', async (req, res) => {

  const client = await pool.connect();
  try {
    const {produto_id, tipo, quantidade} = req.body;

  if (quantidade <=0){

    return res.status(400)
  }

  await client.query('BEGIN'); //proteção do banco

  // histórico movimentações
  const resultMov = await client.query(
    'INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES ($1, $2, $3) RETURNING *', [produto_id, tipo, quantidade]
  );

const qtdAjustada = tipo === 'entrada' ? quantidade : -quantidade;

const resultProd = await client.query(
    'UPDATE produtos SET quantidade = quantidade + $1 WHERE id = $2 RETURNING quantidade',
    [qtdAjustada, produto_id]
  );

  // evita tirar mais do que tem no estoque
  if (resultProd.rows[0].quantidade < 0) {
    throw new Error ('Estoque insuficiente');
  }
  await client.query('COMMIT');
  res.status(201).json(resultMov.rows[0]);
} catch (error) {
  await client.query('ROLLBACK');
  console.error('Erro na transação de estoque:', error);
  res.status(400).json({ error: error.message || 'Erro ao registrar movimentação'});
} finally {
  client.release();
}
 });

 // leitura de histórico
app.get('/movimentacoes', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
            m.id, 
            m.tipo, 
            m.quantidade, 
            m.data_hora, 
            p.nome AS produto_nome 
        FROM movimentacoes m
        JOIN produtos p ON m.produto_id = p.id
        ORDER BY m.data_hora DESC
      `);
      
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erro ao listar movimentações:', error);
      res.status(500).json({ error: 'Erro ao buscar o histórico de estoque' });
    }
});

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})