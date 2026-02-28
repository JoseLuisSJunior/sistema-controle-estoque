const express = require('express')
const cors = require('cors')
const pool = require('./config/database')

const app = express()

app.use(cors())
app.use(express.json())

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
    const {nome, valor_unitario, quantidade} = req.body

    const valor_total = valor_unitario * quantidade

    const result = await pool.query (
      'INSERT INTO produtos (nome, valor_unitario, quantidade, valor_total) VALUES ($1, $2, $3, $4) RETURNING *',[nome, valor_unitario, quantidade, valor_total]
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
    const { nome, valor_unitario, quantidade} = req.body

    const valor_total = valor_unitario * quantidade

    const result = await pool.query(
      `UPDATE produtos 
       SET nome = $1, valor_unitario = $2, quantidade = $3, valor_total = $4 
       WHERE id = $5 
       RETURNING *`,
      [nome, valor_unitario, quantidade, valor_total, id]
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



const PORT = 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})