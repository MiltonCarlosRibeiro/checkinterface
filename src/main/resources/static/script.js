// script.js COMPLETO com edição de células, marcações e estado

let dataLista1 = [];
let dataLista2 = [];
let celulasMarcadas = [];
let estadoChecagem = {};

// Torna células editáveis
function criarCelulaEditavel(valor, linhaIdx, colunaIdx, tabela) {
    const cell = document.createElement("td");
    cell.textContent = valor;
    cell.contentEditable = true;
    cell.addEventListener("input", () => {
        const dados = tabela === 1 ? dataLista1 : dataLista2;
        dados[linhaIdx][colunaIdx] = cell.textContent;
    });
    cell.addEventListener("click", () => selecionarCelula(cell, tabela, linhaIdx, colunaIdx));
    return cell;
}

// Exibe a tabela com dados
function exibirTabela(dados, idTabela, tabelaNum) {
    const tabela = document.getElementById(idTabela);
    tabela.innerHTML = "";
    if (dados.length === 0) return;

    const cabecalho = tabela.createTHead().insertRow();
    Object.keys(dados[0]).forEach(coluna => {
        const th = document.createElement("th");
        th.textContent = coluna;
        cabecalho.appendChild(th);
    });

    const tbody = tabela.createTBody();
    dados.forEach((linha, i) => {
        const row = tbody.insertRow();
        Object.values(linha).forEach((valor, j) => {
            row.appendChild(criarCelulaEditavel(valor, i, j, tabelaNum));
        });
    });
}

// Carrega arquivo Excel
function carregarExcel(input, tabelaNum) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (tabelaNum === 1) {
            dataLista1 = data;
            exibirTabela(dataLista1, "table1", 1);
        } else {
            dataLista2 = data;
            exibirTabela(dataLista2, "table2", 2);
        }
    };
    reader.readAsBinaryString(file);
}

// Salvar marcações no backend
function salvarMarcacoes() {
    fetch("/api/checagem/marcar", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(celulasMarcadas)
    })
    .then(() => Swal.fire("Sucesso", "Marcações salvas com sucesso!", "success"))
    .catch(() => Swal.fire("Erro", "Erro ao salvar marcações.", "error"));
}

// Carregar marcações
function carregarMarcacoes() {
    fetch("/api/checagem/marcacoes")
        .then(res => res.json())
        .then(marcacoes => {
            celulasMarcadas = marcacoes;
            aplicarMarcacoes();
        })
        .catch(() => Swal.fire("Erro", "Falha ao carregar marcações.", "error"));
}

function aplicarMarcacoes() {
    celulasMarcadas.forEach(({ tabela, linha, coluna, cor }) => {
        const tabelaEl = document.getElementById(`table${tabela}`);
        if (tabelaEl?.rows[linha + 1]) {
            tabelaEl.rows[linha + 1].cells[coluna].style.backgroundColor = cor;
        }
    });
}

// Selecionar e pintar
function selecionarCelula(cell, tabela, linha, coluna) {
    if (document.getElementById("removerPintura").checked) {
        cell.style.backgroundColor = "";
        celulasMarcadas = celulasMarcadas.filter(m => !(m.tabela === tabela && m.linha === linha && m.coluna === coluna));
        return;
    }
    let cor = "";
    if (document.getElementById("pintarLinhaInteira").checked) {
        const tabelaEl = document.getElementById(`table${tabela}`);
        for (let col = 0; col < tabelaEl.rows[linha + 1].cells.length; col++) {
            const c = tabelaEl.rows[linha + 1].cells[col];
            c.style.backgroundColor = corSelecionado;
            celulasMarcadas.push({ tabela, linha, coluna: col, cor: corSelecionado });
        }
    } else {
        cell.style.backgroundColor = corSelecionado;
        celulasMarcadas.push({ tabela, linha, coluna, cor: corSelecionado });
    }
}

let corSelecionado = "";
function pintarSelecionado(cor) {
    corSelecionado = cor;
}

function resetarMarcacoes() {
    fetch("/api/checagem/resetar", { method: "DELETE" })
        .then(() => location.reload());
}

function salvarEstado() {
    estadoChecagem = {
        linhasLista1: dataLista1.length,
        linhasLista2: dataLista2.length,
        timestamp: new Date().toISOString()
    };
    fetch("/api/checagem/estado", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estadoChecagem)
    });
}

function carregarEstado() {
    fetch("/api/checagem/estado")
        .then(res => res.json())
        .then(estado => console.log("Estado recuperado:", estado));
}

// Eventos

document.getElementById("fileInput1").addEventListener("change", e => carregarExcel(e.target, 1));
document.getElementById("fileInput2").addEventListener("change", e => carregarExcel(e.target, 2));
