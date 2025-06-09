let dadosPlanilha = [];

document.getElementById("excelFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    dadosPlanilha = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    alert("✅ Planilha da Lista 1 carregada com sucesso!");
  };

  reader.readAsArrayBuffer(file);
});

// 🔧 Busca simples por ITEM_COMPONENTE com soma de unidades
function executarBusca() {
  const itemBusca = document.getElementById("itemBusca").value.trim();
  const resultadoDiv = document.getElementById("resultado-busca");

  if (dadosPlanilha.length === 0) {
    alert("Por favor, carregue uma planilha primeiro.");
    return;
  }

  let html = "";

  if (itemBusca !== "") {
    let total = 0;

    dadosPlanilha.forEach((linha) => {
      if (
        linha["UNIDADE DE MEDIDA"] === "un" &&
        linha["ITEM_COMPONENTE"] &&
        linha["ITEM_COMPONENTE"].trim() === itemBusca
      ) {
        const qtde = parseFloat(linha["QTDE_MONTAGEM"]);
        if (!isNaN(qtde)) total += qtde;
      }
    });

    html += `<p>🔧 O item <strong>${itemBusca}</strong> aparece com um total de <strong>${total}</strong> unidades.</p>`;
  }

  resultadoDiv.innerHTML = html || "<p>Nenhum dado encontrado.</p>";
}

// 📋 Busca avançada por linha com checkboxes selecionáveis e soma de QTDE_MONTAGEM
function executarBuscaAvancada() {
  const linhaBusca = document.getElementById("linhaBusca").value.trim();
  const resultadoDiv = document.getElementById("resultado-busca-avancada");

  if (dadosPlanilha.length === 0) {
    alert("Por favor, carregue uma planilha primeiro.");
    return;
  }

  if (linhaBusca === "") {
    resultadoDiv.innerHTML = "<p>Insira a linha a ser buscada.</p>";
    return;
  }

  // Suporte a colagem do Excel: converte TABs em vírgulas
  const valoresBusca = linhaBusca
    .replace(/\t/g, ",")
    .split(",")
    .map(v => v.trim());

  // Pega índices dos campos marcados
  const camposSelecionados = Array.from(document.querySelectorAll(".campo-busca:checked"))
    .map(input => parseInt(input.value));

  let repeticoes = 0;
  let ocorrencias = [];
  let somaQtdeMontagem = 0;

  dadosPlanilha.forEach((linha) => {
    const valoresLinha = [
      linha["CODIGO_MATERIAL"],
      linha["NIVEL"],
      linha["TIPO ESTRUTURA"],
      linha["LINHA"],
      linha["ITEM_COMPONENTE"],
      linha["QTDE_MONTAGEM"],
      linha["UNIDADE DE MEDIDA"],
      linha["FATOR_SUCATA"]
    ].map(v => String(v).trim());

    const match = camposSelecionados.every((indice) => {
      return valoresBusca[indice] === valoresLinha[indice];
    });

    if (match) {
      repeticoes++;
      ocorrencias.push(valoresLinha);

      // Somar QTDE_MONTAGEM (índice 5)
      const qtde = parseFloat(valoresLinha[5]);
      if (!isNaN(qtde)) somaQtdeMontagem += qtde;
    }
  });

  let html = `<p>📋 A linha buscada foi encontrada <strong>${repeticoes}</strong> vez(es).</p>`;
  ocorrencias.forEach((linha, i) => {
    html += `<pre>Ocorrência ${i + 1}: ${linha.join(" | ")}</pre>`;
  });

  if (repeticoes > 0) {
    html += `<p>📦 Soma total de <strong>QTDE_MONTAGEM</strong>: <strong>${somaQtdeMontagem}</strong></p>`;
  }

  resultadoDiv.innerHTML = html || "<p>Nenhuma ocorrência encontrada.</p>";
}
