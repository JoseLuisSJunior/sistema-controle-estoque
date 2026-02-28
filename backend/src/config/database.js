const {Pool} = require('pg') //importando a classe Pool da biblioteca pg

const pool = new Pool({

    user: 'postgres',
    host: 'localhost',
    database: 'controle_estoque',
    password: '12163013',
    port: 5432
})

module.exports = pool //tornando o objeto pool disponível para outros arquivos do projeto