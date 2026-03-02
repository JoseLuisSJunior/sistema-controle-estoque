document.addEventListener("DOMContentLoaded", () => {

const API_URL = "http://localhost:3333/produtos"

let produtoEditandoId = null

const home = document.getElementById("menu")
const cadastro = document.getElementById("cadastro")
const listaTela = document.getElementById("listaTela")
const lista = document.getElementById("listaProdutos")
const modal = document.getElementById("modal")

const toggleSwitch = document.querySelector('#checkbox');
const themeIcon = document.getElementById('theme-icon');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        themeIcon.innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.innerText = '☀️';
        localStorage.setItem('theme', 'light');
    }    
}

// Escuta a mudança no interruptor
toggleSwitch.addEventListener('change', switchTheme);

// Verifica se o usuário já tinha ativado antes ao recarregar a página
if (localStorage.getItem('theme') === 'dark') {
    toggleSwitch.checked = true;
    document.body.classList.add('dark-mode');
    themeIcon.innerText = '🌙';
}

// Navegação
function mostrarCadastro() {
    home.classList.add("hidden")
    cadastro.classList.remove("hidden")
}

function mostrarLista() {
    home.classList.add("hidden")
    listaTela.classList.remove("hidden")
    carregarProdutos()
}

function voltarHome() {
    cadastro.classList.add("hidden")
    listaTela.classList.add("hidden")
    home.classList.remove("hidden")
}

// Criar produto
document.getElementById("formProduto").addEventListener("submit", async (e) => {
    e.preventDefault()

    const nome = document.getElementById("nome").value
    const codigo = document.getElementById("codigo").value
    const valor_unitario = document.getElementById("valor_unitario").value
    const quantidade = document.getElementById("quantidade").value

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome,codigo, valor_unitario, quantidade})
    })

    e.target.reset()
    alert("Produto cadastrado com sucesso!")
})

// Listar produtos
async function carregarProdutos() {
    const response = await fetch(API_URL)
    const produtos = await response.json()

    lista.innerHTML = ""

produtos.forEach(produto => {
    const div = document.createElement("div")
    div.classList.add("linha-produto")

    div.innerHTML = `
        <div>
            <strong>${produto.nome}</strong> (Cód: ${produto.codigo})<br>
            Unitário: R$ ${Number(produto.valor_unitario).toLocaleString("pt-BR", {minimumFractionDigits: 2})}<br>
            Qtde: ${produto.quantidade} | Total: R$ ${Number(produto.valor_total).toLocaleString("pt-BR", {minimumFractionDigits: 2})}
        </div>
        <div>
            <button onclick="abrirModal(${produto.id}, '${produto.nome}', '${produto.codigo}', ${produto.valor_unitario}, ${produto.quantidade})" class="btn-primary">
                Editar
            </button>
            <button onclick="deletarProduto(${produto.id})" style="background:#dc2626; color:white; border:none;">
                Excluir
            </button>
        </div>
    `

    lista.appendChild(div)
    })
}

// Modal
function abrirModal(id, nome, codigo, valor, quantidade) {
    produtoEditandoId = id

    document.getElementById("editNome").value = nome
    document.getElementById("editCodigo").value = codigo
    document.getElementById("editValor").value = valor
    document.getElementById("editQuantidade").value = quantidade

    modal.classList.remove("hidden")

}

function fecharModal(){
    modal.classList.add("hidden")
}

async function salvarEdicao() {
    const nome = document.getElementById("editNome").value
    const codigo = document.getElementById("editCodigo").value
    const valor_unitario = document.getElementById("editValor").value
    const quantidade = document.getElementById("editQuantidade").value

    await fetch(`${API_URL}/${produtoEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, codigo, valor_unitario, quantidade})
    })

    fecharModal()
    carregarProdutos()
}

// Deletar
async function deletarProduto(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return
    await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    carregarProdutos()
}
window.deletarProduto = deletarProduto
window.abrirModal = abrirModal
window.salvarEdicao = salvarEdicao
window.fecharModal = fecharModal
window.mostrarCadastro = mostrarCadastro
window.mostrarLista = mostrarLista
window.voltarHome = voltarHome
})
