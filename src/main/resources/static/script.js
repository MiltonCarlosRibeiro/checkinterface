// script.js (auto-aplica marcações sempre que uma lista é importada)

let dataLista1 = [];
let dataLista2 = [];
let celulasMarcadas = [];
let estadoChecagem = {};

let corSelecionado = "";
let reguaAtiva1 = false;
let reguaAtiva2 = false;

// Controle de ocorrências para a busca “Próximo”
const ocorrencias = { 1: [], 2: [] };
const indiceAtual = { 1: 0, 2: 0 };

/**
 * Retorna cor hex mais leve para um código lógico.
 */
function getCorHex(cor) {
  return (
    cor === "green" ? "#d9ffe6" :
    cor === "orange" ? "#ffe082" :
    cor === "blue" ? "#81d4fa" :
    cor
  );
}

/**
 * Cria célula <td> editável, com evento de click para seleção/pintura.
 */
function criarCelulaEditavel(valor, linhaIdx, colunaIdx, tabelaNum) {
  const cell = document.createElement("td");
  cell.textContent = valor;
  cell.contentEditable = true;

  cell.dataset.row = linhaIdx;
  cell.dataset.col = colunaIdx;
  cell.dataset.tabela = tabelaNum;

  cell.addEventListener("input", () => {
    const dados = tabelaNum === 1 ? dataLista1 : dataLista2;
    dados[linhaIdx][colunaIdx] = cell.textContent;
  });

  cell.addEventListener("click", () =>
    selecionarCelula(cell, tabelaNum, linhaIdx, colunaIdx)
  );

  return cell;
}

/**
 * Exibe um array de objetos como tabela HTML editável.
 * Após renderizar, carrega automaticamente as marcações salvas.
 */
function exibirTabela(dados, idTabela, tabelaNum) {
  const container = document.getElementById(idTabela);
  container.innerHTML = "";
  if (dados.length === 0) return;

  const tabela = document.createElement("table");
  const thead = tabela.createTHead();
  const cabecalho = thead.insertRow();
  Object.keys(dados[0]).forEach((coluna) => {
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

  container.appendChild(tabela);

  // Resetar histórico de busca quando nova planilha é carregada
  ocorrencias[tabelaNum] = [];
  indiceAtual[tabelaNum] = 0;

  // Assim que a tabela estiver pronta, aplica imediatamente as marcações salvas
  carregarMarcacoes();
}

/**
 * Lê arquivo XLSX/XLS e converte em JSON, depois exibe na tabela.
 */
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

/**
 * Ao clicar em uma célula:
 * - Se “Remover pintura” estiver marcado, limpa toda a linha.
 * - Se “Pintar linha inteira” estiver marcado, limpa linha antiga e pinta nova.
 * - Caso contrário, não faz nada.
 */
function selecionarCelula(cell, tabela, linha, coluna) {
  const remover = document.getElementById("removerPintura").checked;
  const pintarLinhaInteira = document.getElementById("pintarLinhaInteira").checked;

  // 1) Se remover pintura, limpa toda a linha
  if (remover) {
    const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
    const row = tabelaEl.rows[linha + 1];
    celulasMarcadas = celulasMarcadas.filter(
      (m) => !(m.tabela === tabela && m.linha === linha)
    );
    Array.from(row.cells).forEach((c) => (c.style.backgroundColor = ""));
    return;
  }

  // 2) Se pintar linha inteira
  if (pintarLinhaInteira) {
    const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
    const row = tabelaEl.rows[linha + 1];
    celulasMarcadas = celulasMarcadas.filter(
      (m) => !(m.tabela === tabela && m.linha === linha)
    );
    Array.from(row.cells).forEach((c) => (c.style.backgroundColor = ""));
    const hex = getCorHex(corSelecionado);
    Array.from(row.cells).forEach((c, colIdx) => {
      c.style.backgroundColor = hex;
      celulasMarcadas.push({ tabela, linha, coluna: colIdx, cor: hex });
    });
  }
  // 3) Caso contrário, não faz nada
  else {
    return;
  }

  // Aplica régua se estiver ativa
  if ((tabela === 1 && reguaAtiva1) || (tabela === 2 && reguaAtiva2)) {
    aplicarReguaLinha(tabela, linha);
  }
}

/**
 * Define a cor escolhida pelos botões de pintura.
 */
function pintarSelecionado(cor) {
  corSelecionado = cor;
}

/**
 * Exporta a tabela como arquivo XLSX para download.
 */
function salvarExcelLista(n) {
  const dados = n === 1 ? dataLista1 : dataLista2;
  if (dados.length === 0) {
    Swal.fire("Aviso", `Carregue a Lista ${n} antes de salvar.`, "info");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Lista${n}`);
  XLSX.writeFile(wb, `lista_${n}_atualizada.xlsx`);
}

/**
 * Envia todas as celulasMarcadas ao backend (POST /api/checagem/marcar).
 */
function salvarMarcacoes() {
  fetch("/api/checagem/marcar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(celulasMarcadas),
  })
    .then(() => Swal.fire("Sucesso", "Marcações salvas com sucesso!", "success"))
    .catch(() => Swal.fire("Erro", "Erro ao salvar marcações.", "error"));
}

/**
 * Carrega marcações do backend (GET /api/checagem/marcacoes) e aplica.
 */
function carregarMarcacoes() {
  fetch("/api/checagem/marcacoes")
    .then((res) => res.json())
    .then((marcacoes) => {
      celulasMarcadas = marcacoes;
      aplicarMarcacoes();
      Swal.fire("OK", "Marcações aplicadas com sucesso!", "success");
    })
    .catch(() => Swal.fire("Erro", "Falha ao carregar marcações.", "error"));
}

/**
 * Aplica as cores de todas as marcações no DOM.
 */
function aplicarMarcacoes() {
  celulasMarcadas.forEach(({ tabela, linha, coluna, cor }) => {
    const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
    if (tabelaEl?.rows[linha + 1]) {
      tabelaEl.rows[linha + 1].cells[coluna].style.backgroundColor = cor;
    }
  });
}

/**
 * Deleta todas as marcações salvas no backend, limpa visual e reseta array.
 */
function resetarMarcacoes() {
  fetch("/api/checagem/resetar", { method: "DELETE" }).then(() => location.reload());
}

/**
 * Salva estado atual (quantidade de linhas + timestamp) no backend (POST /api/checagem/estado).
 */
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

/**
 * Carrega estado salvo e loga no console (GET /api/checagem/estado).
 */
function carregarEstado() {
  fetch("/api/checagem/estado")
    .then((res) => res.json())
    .then((estado) => console.log("Estado recuperado:", estado))
    .catch((err) => console.error("Erro ao carregar estado:", err));
}

/**
 * Busca “Próximo” considerando prefixos e substrings:
 * ex: “135-003-095” encontra “135-003-095.1” e “135-003-095@”.
 */
function proximaOcorrencia(n) {
  const termoRaw = document.getElementById(`searchInput${n}`).value.trim();
  if (termoRaw === "") {
    Swal.fire("Aviso", "Digite um termo para pesquisar.", "info");
    return;
  }
  const termo = termoRaw.toLowerCase();
  const tabelaEl = document.getElementById(`table${n}`).querySelector("table");
  if (!tabelaEl) return;

  // Recompõe ocorrências a cada busca
  ocorrencias[n] = Array.from(tabelaEl.querySelectorAll("td")).filter((cell) => {
    const txt = cell.textContent.toLowerCase();
    return (
      txt === termo ||
      txt.startsWith(termo + ".") ||
      txt.startsWith(termo + "@") ||
      txt.includes(termo + ".") ||
      txt.includes(termo + "@") ||
      txt.includes(termo)
    );
  });

  if (ocorrencias[n].length === 0) {
    Swal.fire("Aviso", `Nenhuma ocorrência para "${termoRaw}".`, "info");
    return;
  }

  if (indiceAtual[n] >= ocorrencias[n].length) indiceAtual[n] = 0;

  const cell = ocorrencias[n][indiceAtual[n]];
  cell.scrollIntoView({ behavior: "smooth", block: "center" });
  cell.classList.add("highlighted");
  setTimeout(() => cell.classList.remove("highlighted"), 1500);

  indiceAtual[n]++;
}

/**
 * Destaca somente a linha clicada, removendo destaque anterior.
 */
function aplicarReguaLinha(tabela, linha) {
  const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
  Array.from(tabelaEl.rows).forEach((r, idx) => {
    if (idx === linha + 1) r.classList.add("regua");
    else r.classList.remove("regua");
  });
}

/**
 * Ativa/desativa a régua.
 */
function toggleRegua(tabela) {
  const tabelaContainer = document.getElementById(`table${tabela}`).querySelector("table");
  if (tabela === 1) {
    reguaAtiva1 = !reguaAtiva1;
    if (!reguaAtiva1) removerTodasReguas(tabelaContainer);
  } else {
    reguaAtiva2 = !reguaAtiva2;
    if (!reguaAtiva2) removerTodasReguas(tabelaContainer);
  }
  const status = tabela === 1 ? reguaAtiva1 : reguaAtiva2;
  Swal.fire("Régua", `Régua Lista ${tabela} ${status ? "ativada" : "desativada"}`, "info");
}

/**
 * Remove destaque “regua” de todas as linhas da tabela.
 */
function removerTodasReguas(tabelaEl) {
  tabelaEl.querySelectorAll("tr").forEach((r) => r.classList.remove("regua"));
}

// Eventos de upload das planilhas
document
  .getElementById("fileInput1")
  .addEventListener("change", (e) => carregarExcel(e.target, 1));
document
  .getElementById("fileInput2")
  .addEventListener("change", (e) => carregarExcel(e.target, 2));
