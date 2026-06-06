document.addEventListener("DOMContentLoaded", () => {

const API_URL = "http://localhost:3333/produtos"
const API_FORNECEDORES = "http://localhost:3333/fornecedores"
const API_MOVIMENTACOES = "http://localhost:3333/movimentacoes"
const API_CATEGORIAS = "http://localhost:3333/categorias"
const API_DASHBOARD = "http://localhost:3333/dashboard/geral";
let chartCat = null;
let chartForn = null;


let produtoEditandoId = null
let fornecedorEditandoId = null;
let categoriaEditandoId = null;

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
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
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
    document.getElementById("telaMovimentacoes").style.display = "none";
    carregarProdutos()
}


// Criar produto
document.getElementById("formProduto").addEventListener("submit", async (e) => {
    e.preventDefault()

    const nome = document.getElementById("nome").value
    const codigo = document.getElementById("codigo").value
    const valor_unitario = document.getElementById("valor_unitario").value
    const quantidade = document.getElementById("quantidade").value
    const fornecedor_id = document.getElementById("fornecedor_id").value;
    const categoria_id = document.getElementById("categoria_id").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome,codigo, valor_unitario, quantidade, fornecedor_id, categoria_id})
    })

    e.target.reset()
    alert("Produto cadastrado com sucesso!")
})

async function carregarProdutos() {
    const response = await fetch(API_URL)
    const produtos = await response.json()

    const responseFornecedores = await fetch(API_FORNECEDORES);
    const fornecedores = await responseFornecedores.json();

    lista.innerHTML = ""

    produtos.forEach(produto => {
        const fornecedorProduto = fornecedores.find(f => f.id == produto.fornecedor_id);
        const nomeFornecedor = fornecedorProduto ? fornecedorProduto.nome : "Fornecedor não cadastrado";
        
        // 1. Validação Cravada
        const quantidadeNumerica = Number(produto.quantidade);
        const isEstoqueBaixo = produto.is_baixo_estoque === true || quantidadeNumerica <= 5;

        // 2. O Estilo base do Card (Alinhamento perfeito ao centro)
        const estiloCard = isEstoqueBaixo 
            ? 'background-color: #fef9c3; border-left: 5px solid #eab308; display: flex; justify-content: space-between; align-items: center;' 
            : 'display: flex; justify-content: space-between; align-items: center;';

        // 3. A Etiqueta agora fica ao lado do título (Inline)
        const badgeHTML = isEstoqueBaixo 
            ? `<span style="background-color: #fcd34d; color: #ca8a04; padding: 3px 10px; border-radius: 12px; font-weight: bold; font-size: 0.75em; margin-left: 10px; vertical-align: middle;">⚠️ ESTOQUE BAIXO</span>` 
            : '';

        const div = document.createElement("div")
        div.classList.add("linha-produto")
        div.style.cssText = estiloCard;

        // 4. HTML limpo, sem margins malucas, tudo no fluxo natural
        div.innerHTML = `
            <div style="flex: 1;">
                <strong>${produto.nome}</strong> (Cód: ${produto.codigo}) ${badgeHTML}<br>
                <span style="color: #64748b; font-size: 0.9em;">Categoria: <strong>${produto.categoria_nome || "Sem Categoria"}</strong></span><br>
                <span style="color: #64748b; font-size: 0.9em;">Fornecedor: <strong>${nomeFornecedor}</strong></span><br>
                Unitário: R$ ${Number(produto.valor_unitario).toLocaleString("pt-BR", {minimumFractionDigits: 2})}<br>
                <span style="${isEstoqueBaixo ? 'color: #ca8a04; font-weight: bold;' : ''}">
                    Qtde: ${produto.quantidade}
                </span> 
                | Total: R$ ${Number(produto.valor_total).toLocaleString("pt-BR", {minimumFractionDigits: 2})}
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="abrirModal(${produto.id}, '${produto.nome}', '${produto.codigo}', ${produto.valor_unitario}, ${produto.quantidade}, ${produto.categoria_id || null})" class="btn-primary">
                    Editar
                </button>
                <button onclick="deletarProduto(${produto.id})" style="background:#dc2626; color:white; border:none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    Excluir
                </button>
            </div>
        `;

        lista.appendChild(div)
    })
}

// Modal
function abrirModal(id, nome, codigo, valor, quantidade, categoria_id) {
    produtoEditandoId = id

    document.getElementById("editNome").value = nome
    document.getElementById("editCodigo").value = codigo
    document.getElementById("editValor").value = valor
    document.getElementById("editQuantidade").value = quantidade
if (categoria_id === null || categoria_id === undefined) {
    document.getElementById("editCategoriaId").value = "";
}else {
    document.getElementById("editCategoriaId").value = categoria_id;

}


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
    const fornecedor_id = document.getElementById("editFornecedorId").value
    const categoria_id = document.getElementById("editCategoriaId").value;

    await fetch(`${API_URL}/${produtoEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, codigo, valor_unitario, quantidade, fornecedor_id, categoria_id})
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


const telaCadastroFornecedor = document.getElementById("cadastroFornecedor");
const telaListaFornecedores = document.getElementById("listaTelaFornecedores");
const divListaFornecedores = document.getElementById("ListaFornecedores");

function mostrarCadastroFornecedor() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("listaTelaFornecedores").classList.add("hidden");
    document.getElementById("cadastroFornecedor").classList.remove("hidden");
}

function mostrarListaFornecedores() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("cadastroFornecedor").classList.add("hidden");
    document.getElementById("listaTelaFornecedores").classList.remove("hidden");
    document.getElementById("telaMovimentacoes").style.display = "none";
    carregarFornecedores();
}

document.getElementById("formFornecedor").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("fornecedorNome").value;
    const cnpj = document.getElementById("fornecedorCNPJ").value;
    const contato = document.getElementById("fornecedorContato").value;

    if (!contato.includes("@") || !contato.includes(".com")) {
        alert("Erro: O e-mail deve conter o domínio");
        return;
    }

    await fetch(API_FORNECEDORES, {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nome, cnpj, contato})
    });
    e.target.reset();
    alert("Fornecedor cadastrado com sucesso");
    carregarSelectFornecedores();
    voltarHome();
});

async function carregarFornecedores() {

    const response = await fetch(API_FORNECEDORES);
    const fornecedores = await response.json();
    const ListaFornecedores = document.getElementById("listaFornecedores");
    ListaFornecedores.innerHTML= "";

    fornecedores.forEach(forn => {
        const div = document.createElement("div");
        div.classList.add("linha-produto");
        div.innerHTML = `
        <div>
            <strong>${forn.nome}</strong><br>
            CNPJ: ${forn.cnpj} | Contato: ${forn.contato}
        </div>
        <div>
            <button onclick="abrirModalFornecedor(${forn.id}, '${forn.nome}', '${forn.cnpj}', '${forn.contato}')" class="btn-primary">Editar</button>
            <button onclick="deletarFornecedor(${forn.id})" style="background:#dc2626; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Excluir</button>
            </div>
        `;
        ListaFornecedores.appendChild(div);

    });
}

window.deletarFornecedor = async function (id) {
    if(!confirm("Tem certeza que deseja excluir esse fornecedor?")) return;
    
    try {
        // 1. Manda a ordem de deletar pro Back-end
        const resposta = await fetch(`${API_FORNECEDORES}/${id}`, { method: "DELETE" });

        // aceita exclusão, pois não tem produtos linkados
        if (resposta.ok) {
            alert("Fornecedor excluído com sucesso!");
            carregarFornecedores();
            carregarSelectFornecedores();
        } else {
            // alerta para não exclusão devido vinculo ao estoque
            alert("Não é possível excluir este fornecedor! Ele possui PRODUTOS cadastrados no estoque. Exclua os produtos dele primeiro.");
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    }
}


async function carregarSelectFornecedores() {
    const response = await fetch(API_FORNECEDORES);
    const fornecedores = await response.json();

    const selectCadastro = document.getElementById("fornecedor_id");
    const selectEdit = document.getElementById("editFornecedorId");

    let options = `<option value=""> Selecione um Fornecedor</option>`;
    fornecedores.forEach(f => {
        options += `<option value="${f.id}">${f.nome}</option>`;
    });
    if(selectCadastro) selectCadastro.innerHTML = options;
    if(selectEdit) selectEdit.innerHTML = options;
}

window.abrirModalFornecedor = function(id, nome, cnpj, contato) {
    fornecedorEditandoId = id; // Salva o ID na memória
    
    // Preenche os campos da janelinha com os dados atuais
    document.getElementById("editFornecedorNome").value = nome;
    document.getElementById("editFornecedorCNPJ").value = cnpj;
    document.getElementById("editFornecedorContato").value = contato;
    
    // Mostra o modal
    document.getElementById("modalFornecedor").classList.remove("hidden");
}

window.fecharModalFornecedor = function() {
    // Esconde o modal e limpa o ID
    document.getElementById("modalFornecedor").classList.add("hidden");
    fornecedorEditandoId = null;
}

window.salvarEdicaoFornecedor = async function() {
    // 1. Pega os valores atualizados do HTML
    const nome = document.getElementById("editFornecedorNome").value;
    const cnpj = document.getElementById("editFornecedorCNPJ").value;
    const contato = document.getElementById("editFornecedorContato").value;

    if (!contato.includes("@") || !contato.includes(".com")){
        alert("Erro: O e-mail deve conter o domínio");
        return;
    }

    // 2. Envia a atualização (PUT) para o Back-end
    await fetch(`${API_FORNECEDORES}/${fornecedorEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cnpj, contato })
    });

    // 3. Fecha a janela e recarrega a lista com os dados novos
    fecharModalFornecedor();
    carregarFornecedores();
}


window.voltarHome = function() {
    const telaCadProd = document.getElementById("cadastro");
    if (telaCadProd) telaCadProd.classList.add("hidden");

    const telaListaProd = document.getElementById("listaTela");
    if (telaListaProd) telaListaProd.classList.add("hidden");

    const telaCadForn = document.getElementById("cadastroFornecedor");
    if (telaCadForn) telaCadForn.classList.add("hidden");

    const telaListaForn = document.getElementById("listaTelaFornecedores");
    if (telaListaForn) telaListaForn.classList.add("hidden");

    const menuPrincipal = document.getElementById("menu");
    if (menuPrincipal) menuPrincipal.classList.remove("hidden");

    const telaMov = document.getElementById("telaMovimentacoes");
    if (telaMov) telaMov.style.display = "none";

    const telaCadCat = document.getElementById("cadastroCategoria");
    if (telaCadCat) telaCadCat.classList.add("hidden");

    const telaListaCat = document.getElementById("listaTelaCategorias");
    if (telaListaCat) telaListaCat.classList.add("hidden");

    const telaDash = document.getElementById("telaDashboard");
    if (telaDash) telaDash.classList.add("hidden");
}


//AC4 Criação de categorias
async function CarregarSelectCategorias() {
    try{
        const response = await fetch(API_CATEGORIAS);
        const categorias = await response.json();

        const selectCadastro = document.getElementById("categoria_id");
        const selectEdit = document.getElementById("editCategoriaId");

        let options =  `<option value=""> Selecione uma categoria</option>`;
        categorias.forEach(c => {
            options += `<option value="${c.id}">${c.nome}</option>`;
        });

        if (selectCadastro) selectCadastro.innerHTML = options;
        if (selectEdit) selectEdit.innerHTML = options;
    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
    }
}
    

function mostrarCadastroCategoria() {
    voltarHome();
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("cadastroCategoria").classList.remove("hidden");
}

document.getElementById("formCategoria")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("categoriaNome").value;

    try {
        const response = await fetch(API_CATEGORIAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome })
        });

        if (response.ok) {
            alert("Categoria cadastrada com sucesso!");
            e.target.reset();
            CarregarSelectCategorias();
            voltarHome();
        } else {
            alert("Erro ao cadastrar categoria.");
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    }
});

function mostrarListaCategorias() {
    voltarHome();
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("listaTelaCategorias").classList.remove("hidden");
    carregarListaCategorias();
}

async function carregarListaCategorias() {
    const response = await fetch(API_CATEGORIAS);
    const categorias = await response.json();
    const divLista = document.getElementById("listaCategorias");
    divLista.innerHTML = "";

    categorias.forEach(cat => {
        const div = document.createElement("div");
        div.classList.add("linha-produto");
        div.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
        
        div.innerHTML = `
            <div><strong>${cat.nome}</strong></div>
            <div style="display: flex; gap: 10px;">
                <button onclick="abrirModalCategoria(${cat.id}, '${cat.nome}')" class="btn-primary">Editar</button>
                <button onclick="deletarCategoria(${cat.id})" style="background:#dc2626; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Excluir</button>
            </div>
        `;
        divLista.appendChild(div);
    });
}

function abrirModalCategoria(id, nome) {
    categoriaEditandoId = id;
    document.getElementById("editCategoriaNome").value = nome;
    document.getElementById("modalCategoria").classList.remove("hidden");
}

function fecharModalCategoria() {
    document.getElementById("modalCategoria").classList.add("hidden");
    categoriaEditandoId = null;
}

async function salvarEdicaoCategoria() {
    const nome = document.getElementById("editCategoriaNome").value;
    
    await fetch(`${API_CATEGORIAS}/${categoriaEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    });

    fecharModalCategoria();
    carregarListaCategorias();
    CarregarSelectCategorias(); // Atualiza os selects do sistema
}

async function deletarCategoria(id) {
    if(!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    
    try {
        const resposta = await fetch(`${API_CATEGORIAS}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("Categoria excluída com sucesso!");
            carregarListaCategorias();
            CarregarSelectCategorias();
        } else {
            const erro = await resposta.json();
            alert(erro.error); // Mostra a mensagem de trava (se houver produtos)
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    }
}

// AC3

async function carregarSelectProdutosMovimentacao() {
    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();
        
        const select = document.getElementById("movProdutoId");
        select.innerHTML = "<option value=''>Selecione um Produto...</option>";
        
        produtos.forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.nome} (Estoque atual: ${p.quantidade})</option>`;
        });
    } catch (erro) {
        console.error("Erro ao carregar produtos no select:", erro);
    }
}


window.registrarMovimentacao = async function(event) {
    event.preventDefault(); // Evita que a página recarregue do zero

    const produto_id = document.getElementById("movProdutoId").value;
    const tipo = document.getElementById("movTipo").value;
    const quantidade = parseInt(document.getElementById("movQuantidade").value);

    try {
        const resposta = await fetch(API_MOVIMENTACOES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ produto_id, tipo, quantidade })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(` Movimentação registrada com sucesso!`);
            document.getElementById("formMovimentacao").reset();
            carregarMovimentacoes();
            carregarSelectProdutosMovimentacao();
            carregarProdutos(); 
        } else {
            // Se o Back-end barrar (ex: tentar tirar mais do que tem), avisa o usuário
            alert(` Erro: ${dados.error}`);
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    }
}

async function carregarMovimentacoes() {
    try {
        const response = await fetch(API_MOVIMENTACOES);
        const historico = await response.json();
        
        const lista = document.getElementById("listaMovimentacoes");
        lista.innerHTML = "";

        if (historico.length === 0) {
            lista.innerHTML = "<p>Nenhuma movimentação registrada ainda.</p>";
            return;
        }

        historico.forEach(mov => {
        
            const cor = mov.tipo === 'entrada' ? 'green' : 'red';
            const sinal = mov.tipo === 'entrada' ? '+' : '-';
            const dataFormatada = new Date(mov.data_hora).toLocaleString('pt-BR');

            lista.innerHTML += `
                <div class="linha-produto" style="border-left: 5px solid ${cor};">
                    <div>
                        <strong>${mov.produto_nome}</strong><br>
                        <span style="font-size: 0.85em; color: gray;"> ${dataFormatada}</span>
                    </div>
                    <div>
                        <strong style="color: ${cor}; font-size: 1.2em;">${sinal} ${mov.quantidade}</strong>
                    </div>
                </div>
            `;
        });
    } catch (erro) {
        console.error("Erro ao listar histórico:", erro);
    }
}
async function carregarDashboardGeral() {
    const response = await fetch(API_DASHBOARD);
    const data = await response.json();

    // 1. Preenche os Cards
    document.getElementById("kpiProdutos").innerText = data.kpis.total_produtos;
    document.getElementById("kpiValorEstoque").innerText = Number(data.kpis.valor_total_estoque).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById("kpiEntradas").innerText = Number(data.kpis.valor_total_entrada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById("kpiSaidas").innerText = Number(data.kpis.valor_total_saida).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // 2. Gráfico Categorias
    if (chartCat) chartCat.destroy();
    chartCat = new Chart(document.getElementById('chartCategorias'), {
        type: 'pie',
        data: {
            labels: data.categorias.map(c => c.nome),
            datasets: [{ data: data.categorias.map(c => c.total), backgroundColor: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'] }]
        }
    });

    // 3. Gráfico Fornecedores
    if (chartForn) chartForn.destroy();
    chartForn = new Chart(document.getElementById('chartFornecedores'), {
        type: 'bar',
        data: {
            labels: data.fornecedores.map(f => f.nome),
            datasets: [{ label: 'Qtd Produtos', data: data.fornecedores.map(f => f.total), backgroundColor: '#6366f1' }]
        },
        options: { indexAxis: 'y' } // Gráfico de barras horizontais
    });
}

window.mostrarMovimentacoes = function() {
    
    const menu = document.getElementById("menu");
    if (menu) menu.classList.add("hidden");

    const telaCadProd = document.getElementById("cadastro");
    if (telaCadProd) telaCadProd.classList.add("hidden");
    const telaListaProd = document.getElementById("listaTela");
    if (telaListaProd) telaListaProd.classList.add("hidden");

    const telaCadForn = document.getElementById("cadastroFornecedor");
    if (telaCadForn) telaCadForn.classList.add("hidden");
    const telaListaForn = document.getElementById("listaTelaFornecedores");
    if (telaListaForn) telaListaForn.classList.add("hidden");

    const telaMov = document.getElementById("telaMovimentacoes");
    if (telaMov) {
        telaMov.style.display = "block";
    } else {
        alert("A div com id 'telaMovimentacoes' não foi encontrada no HTML!");
    }

    const dashArea = document.getElementById("dashboardArea");
    if (dashArea) dashArea.style.display = "none";


    document.getElementById("dashboardArea").style.display = "none";

    carregarSelectProdutosMovimentacao();
    carregarMovimentacoes();
}

window.mostrarDashboard = function() {
    voltarHome();
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("telaDashboard").classList.remove("hidden");
    carregarDashboardGeral();
}

carregarSelectFornecedores();
carregarMovimentacoes();
CarregarSelectCategorias();
carregarSelectProdutosMovimentacao();


window.deletarProduto = deletarProduto
window.abrirModal = abrirModal
window.salvarEdicao = salvarEdicao
window.fecharModal = fecharModal
window.mostrarCadastro = mostrarCadastro
window.mostrarLista = mostrarLista
window.mostrarCadastroFornecedor = mostrarCadastroFornecedor;
window.mostrarListaFornecedores = mostrarListaFornecedores;
window.mostrarCadastroCategoria = mostrarCadastroCategoria;
window.mostrarListaCategorias = mostrarListaCategorias;
window.abrirModalCategoria = abrirModalCategoria;
window.fecharModalCategoria = fecharModalCategoria;
window.salvarEdicaoCategoria = salvarEdicaoCategoria;
window.deletarCategoria = deletarCategoria;
})
