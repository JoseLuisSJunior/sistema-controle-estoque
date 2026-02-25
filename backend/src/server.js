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

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})