// script.js (merge final com correções de régua e menor delay de importação)

// Dados principais
let dataLista1 = [];
let dataLista2 = [];
let celulasMarcadas = [];
let estadoChecagem = {};

let corSelecionado = "";
let reguaAtiva1 = false;
let reguaAtiva2 = false;

// Controle de busca “Próximo”
const ocorrencias = { 1: [], 2: [] };
const indiceAtual = { 1: 0, 2: 0 };

// Cores suaves
function getCorHex(cor) {
  return cor === "green" ? "#d9ffe6"
       : cor === "orange" ? "#fff3cd"
       : cor === "blue" ? "#e0f7fa"
       : cor;
}

// Célula editável
function criarCelulaEditavel(valor, linhaIdx, colunaIdx, tabela) {
  const cell = document.createElement("td");
  cell.textContent = valor;
  cell.contentEditable = true;

  cell.addEventListener("input", () => {
    const dados = tabela === 1 ? dataLista1 : dataLista2;
    dados[linhaIdx][colunaIdx] = cell.textContent;
  });

  cell.addEventListener("click", () => selecionarCelula(cell, tabela, linhaIdx, colunaIdx));

  cell.addEventListener("mouseover", () => {
    if ((tabela === 1 && reguaAtiva1) || (tabela === 2 && reguaAtiva2)) {
      aplicarReguaLinha(tabela, linhaIdx);
    }
  });

  return cell;
}

// Renderiza tabela
function exibirTabela(dados, idTabela, tabelaNum) {
  const container = document.getElementById(idTabela);
  container.innerHTML = "";
  if (!dados.length) return;

  const tabela = document.createElement("table");
  const thead = tabela.createTHead().insertRow();
  Object.keys(dados[0]).forEach(coluna => {
    const th = document.createElement("th");
    th.textContent = coluna;
    thead.appendChild(th);
  });

  const tbody = tabela.createTBody();
  dados.forEach((linha, i) => {
    const row = tbody.insertRow();
    Object.values(linha).forEach((valor, j) => {
      row.appendChild(criarCelulaEditavel(valor, i, j, tabelaNum));
    });
  });

  container.appendChild(tabela);

  ocorrencias[tabelaNum] = [];
  indiceAtual[tabelaNum] = 0;

  setTimeout(() => carregarMarcacoes(), 100); // pequeno delay
}

// Importar arquivo
function carregarExcel(input, tabelaNum) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

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

// Pintar ou limpar célula
function selecionarCelula(cell, tabela, linha, coluna) {
  const pintar = document.getElementById("pintarLinhaInteira").checked;
  const remover = document.getElementById("removerPintura").checked;

  const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
  const row = tabelaEl?.rows[linha + 1];
  if (!row) return;

  if (remover) {
    celulasMarcadas = celulasMarcadas.filter(m => !(m.tabela === tabela && m.linha === linha));
    Array.from(row.cells).forEach(c => c.style.backgroundColor = "");
    return;
  }

  if (pintar) {
    celulasMarcadas = celulasMarcadas.filter(m => !(m.tabela === tabela && m.linha === linha));
    const hex = getCorHex(corSelecionado);
    Array.from(row.cells).forEach((c, colIdx) => {
      c.style.backgroundColor = hex;
      celulasMarcadas.push({ tabela, linha, coluna: colIdx, cor: hex });
    });
  }
}

// Pintura
function pintarSelecionado(cor) {
  corSelecionado = cor;
}

// Exportar Excel
function salvarExcelLista(n) {
  const dados = n === 1 ? dataLista1 : dataLista2;
  if (!dados.length) {
    Swal.fire("Aviso", `Carregue a Lista ${n} antes de salvar.`, "info");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Lista${n}`);
  XLSX.writeFile(wb, `lista_${n}_atualizada.xlsx`);
}

// Salvar marcações
function salvarMarcacoes() {
  fetch("/api/checagem/marcar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(celulasMarcadas),
  }).then(() => Swal.fire("Salvo", "Marcações armazenadas.", "success"));
}

// Carregar marcações
function carregarMarcacoes() {
  fetch("/api/checagem/marcacoes")
    .then((res) => res.json())
    .then((dados) => {
      celulasMarcadas = dados;
      aplicarMarcacoes();
    });
}

// Aplicar cores
function aplicarMarcacoes() {
  celulasMarcadas.forEach(({ tabela, linha, coluna, cor }) => {
    const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
    if (tabelaEl?.rows[linha + 1]) {
      tabelaEl.rows[linha + 1].cells[coluna].style.backgroundColor = cor;
    }
  });
}

// Resetar
function resetarMarcacoes() {
  fetch("/api/checagem/resetar", { method: "DELETE" }).then(() => location.reload());
}

// Estado
function salvarEstado() {
  estadoChecagem = {
    linhasLista1: dataLista1.length,
    linhasLista2: dataLista2.length,
    timestamp: new Date().toISOString(),
  };
  fetch("/api/checagem/estado", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(estadoChecagem),
  });
}

function carregarEstado() {
  fetch("/api/checagem/estado")
    .then((res) => res.json())
    .then((estado) => console.log("Estado recuperado:", estado));
}

// Busca
function proximaOcorrencia(n) {
  const termo = document.getElementById(`searchInput${n}`).value.toLowerCase().trim();
  if (!termo) return;

  const tabela = document.getElementById(`table${n}`).querySelector("table");
  ocorrencias[n] = Array.from(tabela.querySelectorAll("td")).filter((td) =>
    td.textContent.toLowerCase().includes(termo)
  );

  if (!ocorrencias[n].length) {
    Swal.fire("Busca", "Nenhuma ocorrência.", "info");
    return;
  }

  if (indiceAtual[n] >= ocorrencias[n].length) indiceAtual[n] = 0;

  const cel = ocorrencias[n][indiceAtual[n]];
  cel.scrollIntoView({ behavior: "smooth", block: "center" });
  cel.classList.add("highlighted");
  setTimeout(() => cel.classList.remove("highlighted"), 1000);
  indiceAtual[n]++;
}

// Régua
function aplicarReguaLinha(tabela, linha) {
  const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
  Array.from(tabelaEl.rows).forEach((r, i) => {
    if (i === linha + 1) r.classList.add("regua");
    else r.classList.remove("regua");
  });
}

function toggleRegua(tabela) {
  const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
  const ativa = tabela === 1 ? (reguaAtiva1 = !reguaAtiva1) : (reguaAtiva2 = !reguaAtiva2);
  if (!ativa) removerTodasReguas(tabelaEl);
}

function removerTodasReguas(tabelaEl) {
  tabelaEl.querySelectorAll("tr").forEach((r) => r.classList.remove("regua"));
}

// Eventos

document.getElementById("fileInput1").addEventListener("change", (e) => carregarExcel(e.target, 1));
document.getElementById("fileInput2").addEventListener("change", (e) => carregarExcel(e.target, 2));
