let dadosPlanilha2 = [];

document.getElementById("excelFile2").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    dadosPlanilha2 = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    alert("✅ Planilha da Lista 2 carregada com sucesso!");
  };

  reader.readAsArrayBuffer(file);
});

function executarBusca2() {
  const busca = document.getElementById("itemBusca2").value.trim();
  const linhaBusca = document.getElementById("linhaBusca2").value.trim();
  const resultadoDiv = document.getElementById("resultado-busca2");

  if (dadosPlanilha2.length === 0) {
    alert("Por favor, carregue uma planilha primeiro.");
    return;
  }

  let html = "";

  // --- Busca por Código e/ou Descrição com limpeza de espaços ---
  if (busca !== "") {
    const [itemCodeRaw, descricaoRaw] = busca.includes("|")
      ? busca.split("|").map(v => v.trim())
      : [busca, ""];

    const itemCode = itemCodeRaw || "";
    const descricao = descricaoRaw || "";

    let totalQtd = 0;
    let totalQtdEx = 0;
    let contagem = 0;

    dadosPlanilha2.forEach((linha) => {
      const codigo = linha["CodigoItem"] ? linha["CodigoItem"].trim().replace(/^\s+/, "") : "";
      const desc = linha["Descricao"] ? linha["Descricao"].trim().toLowerCase() : "";

      const itemMatch = itemCode === "" || codigo === itemCode;
      const descMatch = descricao === "" || desc === descricao.toLowerCase();

      if (itemMatch && descMatch) {
        const qtd = parseFloat(linha["Qtd"]);
        const qtdEx = parseFloat(linha["QtdEx"]);

        if (!isNaN(qtd)) totalQtd += qtd;
        if (!isNaN(qtdEx)) totalQtdEx += qtdEx;
        contagem++;
      }
    });

    html += `<p>🔍 Foram encontradas <strong>${contagem}</strong> ocorrência(s) para <code>${busca}</code>.</p>`;
    html += `<ul>
      <li>Total <strong>Qtd</strong>: ${totalQtd}</li>
      <li>Total <strong>QtdEx</strong>: ${totalQtdEx}</li>
    </ul>`;
  }

  // --- Busca por linha colada com campos ativáveis ---
  if (linhaBusca !== "") {
    const valoresBusca = linhaBusca.replace(/\t/g, ",").split(",").map(v => v.trim());
    const camposSelecionados = Array.from(document.querySelectorAll(".campo-busca2:checked"))
      .map(input => parseInt(input.value));

    let repeticoes = 0;
    let ocorrencias = [];
    let somaQtd = 0;
    let somaQtdEx = 0;

    dadosPlanilha2.forEach((linha) => {
      const valoresLinha = [
        linha["Nível"],
        linha["CodigoItem"] ? linha["CodigoItem"].trim().replace(/^\s+/, "") : "",
        linha["Descricao"],
        linha["Texto7"],
        linha["Qtd"],
        linha["QtdEx"]
      ].map(v => String(v).trim());

      const match = camposSelecionados.every((indice) => {
        return valoresBusca[indice] === valoresLinha[indice];
      });

      if (match) {
        repeticoes++;
        ocorrencias.push(valoresLinha);
        const qtd = parseFloat(valoresLinha[4]);
        const qtdEx = parseFloat(valoresLinha[5]);
        if (!isNaN(qtd)) somaQtd += qtd;
        if (!isNaN(qtdEx)) somaQtdEx += qtdEx;
      }
    });

    html += `<p>📋 A linha foi encontrada <strong>${repeticoes}</strong> vez(es).</p>`;
    ocorrencias.forEach((linha, i) => {
      html += `<pre>Ocorrência ${i + 1}: ${linha.join(" | ")}</pre>`;
    });

    if (repeticoes > 0) {
      html += `<p>📦 Soma total → <strong>Qtd</strong>: ${somaQtd} | <strong>QtdEx</strong>: ${somaQtdEx}</p>`;
    }
  }

  resultadoDiv.innerHTML = html || "<p>Nenhum dado encontrado.</p>";
}
