const {Pool} = require('pg')

const pool = new Pool({

    user: 'postgres',
    host: 'localhost',
    database: 'controle_estoque',
    password: '12163013',
    port: 5432
})

module.exports = pool