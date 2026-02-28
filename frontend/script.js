document.addEventListener("DOMContentLoaded", () =>{

const API_URL = "http://localhost:3333/produtos"

const form = document.getElementById("formProduto")
const lista = document.getElementById("listaProdutos")

//Listar produtos
async function carregarProdutos() {
    const response = await fetch(API_URL)
    const produtos = await response.json()
    
    lista.innerHTML = ""

    produtos.forEach(produto => {
        const li = document.createElement("li")

        li.innerHTML = `
            ${produto.nome} |
            Unitário: R$ ${produto.valor_unitario} |
            Qtde: ${produto.quantidade} |
            Total: R$ ${produto.valor_total}

            <div>
                 <button onclick="editarProduto(${produto.id}, '${produto.nome}', ${produto.valor_unitario}, ${produto.quantidade})">
                    Editar
                </button>

            <div>
                <button onclick="deletarProduto(${produto.id})">Excluir</button>
            </div>
        `

        lista.appendChild(li)
    })
}


// Criar produto
form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const nome = document.getElementById("nome").value
    const valor_unitario = document.getElementById("valor_unitario").value
    const quantidade = document.getElementById("quantidade").value

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ nome, valor_unitario, quantidade})
     })

     form.reset()
     carregarProdutos()
})

// Deletar produto
async function deletarProduto(id) {
    await fetch (`${API_URL}/${id}`, {
        method: "DELETE"
    })

        carregarProdutos()
}


async function editarProduto(id, nomeAtual, valorAtual, quantidadeAtual) {

    const nome = prompt("Novo nome:", nomeAtual)
    const valor_unitario = prompt("Novo valor unitário:", valorAtual)
    const quantidade = prompt("Nova quantidade:", quantidadeAtual)

    if (!nome || !valor_unitario || !quantidade) {
        alert("Todos os campos são obrigatórios")
        return
    }

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            valor_unitario,
            quantidade
        })
    })

    carregarProdutos()
}

window.editarProduto = editarProduto
window.deletarProduto = deletarProduto

// Carregar ao iniciar
carregarProdutos()

})