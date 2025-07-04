// script.js (com suporte à indentação baseada em "Nivel" para a coluna "Descricao")

// Dados principais
let dataLista1 = [];
let dataLista2 = [];
let celulasMarcadas = [];
let estadoChecagem = {};

let corSelecionado = "";
let reguaAtiva1 = false;
let reguaAtiva2 = false;

const ocorrencias = { 1: [], 2: [] };
const indiceAtual = { 1: 0, 2: 0 };

// Cores suaves
function getCorHex(cor) {
  return cor === "green" ? "#d9ffe6"
       : cor === "orange" ? "#fff3cd"
       : cor === "blue" ? "#e0f7fa"
       : cor;
}

// Copiar linha selecionada com base nos checkboxes
let isArrastando = false;
let celulasSelecionadas = [];

document.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  if (!document.getElementById("copiarLinhaAoClicar")?.checked) return;

  celulasSelecionadas = [];
  isArrastando = true;

  if (e.target.tagName === "TD") {
    e.target.classList.add("selected-cell");
    celulasSelecionadas.push(e.target);
  }
});

document.addEventListener("mousemove", (e) => {
  if (!isArrastando) return;
  if (e.target.tagName === "TD" && !celulasSelecionadas.includes(e.target)) {
    e.target.classList.add("selected-cell");
    celulasSelecionadas.push(e.target);
  }
});

document.addEventListener("mouseup", () => {
  if (!isArrastando) return;
  isArrastando = false;

  const texto = celulasSelecionadas.map(cel => cel.textContent.trim()).join(", ");
  celulasSelecionadas.forEach(c => c.classList.remove("selected-cell"));
  celulasSelecionadas = [];

  if (texto.trim()) {
    navigator.clipboard.writeText(texto).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Linha copiada!',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
});

// UTILITÁRIO: Normaliza chaves removendo acento, maiúsculas, espaços
function normalizeKey(str) {
  return String(str || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acento
    .replace(/\s/g, '') // remove espaço
    .toLowerCase();
}

// Célula editável com indentação visual baseada na coluna "Nivel"
function criarCelulaEditavel(valor, linhaIdx, colunaIdx, tabela) {
  const cell = document.createElement("td");
  const dados = tabela === 1 ? dataLista1 : dataLista2;
  const colunas = Object.keys(dados[linhaIdx]);

  // Encontra a coluna Nivel (qualquer variação)
  const chaveNivel = colunas.find(k => normalizeKey(k) === "nivel");
  // Encontra a coluna Descricao (qualquer variação)
  const chaveDescricao = colunas.find(k => normalizeKey(k).startsWith("descricao"));

  // Só indentar a célula que está na coluna Descricao
  if (colunas[colunaIdx] === chaveDescricao && chaveNivel) {
    // Valor do nível, trata qualquer lixo que vier do Excel
    let nivelRaw = dados[linhaIdx][chaveNivel];
    let nivel = parseInt(String(nivelRaw).replace(/[^\d]/g, ''), 10) || 0;
    cell.style.paddingLeft = `${nivel * 20}px`;
  }

  cell.textContent = valor;
  cell.contentEditable = true;
  cell.style.whiteSpace = "pre";

  cell.addEventListener("input", () => {
    dados[linhaIdx][colunas[colunaIdx]] = cell.textContent;
  });

  cell.addEventListener("click", () => {
    selecionarCelula(cell, tabela, linhaIdx, colunaIdx);
  });

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

  setTimeout(() => carregarMarcacoes(), 100);
}

// Importar arquivo
function carregarExcel(input, tabelaNum) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // NORMALIZA AS CHAVES de cada linha
    data = data.map(row => {
      const newRow = {};
      for (const key in row) {
        // Remove acentos, espaços e mantém maiúsculas/minúsculas originais no Excel, mas as chaves normalizadas no código
        newRow[key.trim()] = row[key];
      }
      return newRow;
    });

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

// --- RESTANTE IGUAL SEU ORIGINAL (pintura, marcações, salvar etc.) ---

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

function pintarSelecionado(cor) {
  corSelecionado = cor;
}

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

function salvarMarcacoes() {
  fetch("/api/checagem/marcar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(celulasMarcadas),
  }).then(() => Swal.fire("Salvo", "Marcações armazenadas.", "success"));
}

function carregarMarcacoes() {
  fetch("/api/checagem/marcacoes")
    .then((res) => res.json())
    .then((dados) => {
      celulasMarcadas = dados;
      aplicarMarcacoes();
    });
}

function aplicarMarcacoes() {
  celulasMarcadas.forEach(({ tabela, linha, coluna, cor }) => {
    const tabelaEl = document.getElementById(`table${tabela}`).querySelector("table");
    if (tabelaEl?.rows[linha + 1]) {
      tabelaEl.rows[linha + 1].cells[coluna].style.backgroundColor = cor;
    }
  });
}

function resetarMarcacoes() {
  fetch("/api/checagem/resetar", { method: "DELETE" }).then(() => location.reload());
}

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

// Eventos principais
document.getElementById("fileInput1").addEventListener("change", (e) => carregarExcel(e.target, 1));
document.getElementById("fileInput2").addEventListener("change", (e) => carregarExcel(e.target, 2));
