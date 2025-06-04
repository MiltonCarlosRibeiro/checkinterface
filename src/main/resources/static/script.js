document.getElementById('fileInput1').addEventListener('change', function (e) {
    lerArquivo(e.target.files[0], 'table1');
});
document.getElementById('fileInput2').addEventListener('change', function (e) {
    lerArquivo(e.target.files[0], 'table2');
});

function lerArquivo(file, tabelaId) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        renderTabela(json, tabelaId);
    };
    reader.readAsArrayBuffer(file);
}

function renderTabela(json, tabelaId) {
    const container = document.getElementById(tabelaId);
    container.innerHTML = '';
    const tabela = document.createElement('table');
    json.forEach((linha, i) => {
        const tr = document.createElement('tr');
        linha.forEach((celula, j) => {
            const td = document.createElement(i === 0 ? 'th' : 'td');
            td.textContent = celula;
            td.dataset.row = i;
            td.dataset.col = j;
            td.addEventListener('click', () => selecionarCelula(td));
            tr.appendChild(td);
        });
        tabela.appendChild(tr);
    });
    container.appendChild(tabela);
}

let celulaSelecionada = null;
function selecionarCelula(td) {
    if (celulaSelecionada) {
        celulaSelecionada.classList.remove('selected-cell');
    }
    celulaSelecionada = td;
    celulaSelecionada.classList.add('selected-cell');
}

function pintarSelecionado(cor) {
    if (!celulaSelecionada) return;
    const pintarLinha = document.getElementById('pintarLinhaInteira').checked;
    const remover = document.getElementById('removerPintura').checked;
    const tr = celulaSelecionada.parentElement;
    const tabela = celulaSelecionada.closest('table');

    const corClasse = {
        green: 'btn-green',
        orange: 'btn-orange',
        blue: 'btn-blue'
    }[cor];

    const limpar = () => {
        tr.querySelectorAll('td').forEach(td => {
            td.classList.remove('btn-green', 'btn-orange', 'btn-blue');
        });
    };

    if (remover) {
        limpar();
    } else if (pintarLinha) {
        limpar();
        tr.querySelectorAll('td').forEach(td => td.classList.add(corClasse));
    } else {
        celulaSelecionada.classList.remove('btn-green', 'btn-orange', 'btn-blue');
        celulaSelecionada.classList.add(corClasse);
    }
}

function salvarExcelLista(n) {
    const tabela = document.getElementById('table' + n).querySelector('table');
    const wb = XLSX.utils.book_new();
    const linhas = [...tabela.rows].map(row => [...row.cells].map(td => td.textContent));
    const ws = XLSX.utils.aoa_to_sheet(linhas);
    XLSX.utils.book_append_sheet(wb, ws, 'Planilha');
    XLSX.writeFile(wb, `lista_${n}_atualizada.xlsx`);
}

async function salvarMarcacoes() {
    const marcacoes = [];

    [1, 2].forEach(n => {
        const tabela = document.getElementById('table' + n).querySelector('table');
        if (!tabela) return;

        tabela.querySelectorAll('td').forEach(td => {
            if (td.classList.contains('btn-green') || td.classList.contains('btn-orange') || td.classList.contains('btn-blue')) {
                marcacoes.push({
                    tabela: n,
                    linha: parseInt(td.dataset.row),
                    coluna: parseInt(td.dataset.col),
                    cor: td.classList.contains('btn-green') ? 'green' :
                         td.classList.contains('btn-orange') ? 'orange' : 'blue'
                });
            }
        });
    });

    try {
        const response = await fetch('/api/marcas/salvar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(marcacoes)
        });
        const res = await response.text();
        Swal.fire('Sucesso', res, 'success');
    } catch (err) {
        Swal.fire('Erro', err.message, 'error');
    }
}

async function carregarMarcacoes() {
    try {
        const response = await fetch('/api/marcas');
        const marcacoes = await response.json();

        marcacoes.forEach(m => {
            const tabela = document.getElementById('table' + m.tabela).querySelector('table');
            if (!tabela) return;

            const td = [...tabela.rows].find(r => r.rowIndex === m.linha)?.cells[m.coluna];
            if (td) {
                td.classList.add(`btn-${m.cor}`);
            }
        });

        Swal.fire('OK', 'Marcações aplicadas com sucesso!', 'success');
    } catch (err) {
        Swal.fire('Erro', 'Falha ao carregar marcações.', 'error');
    }
}

async function resetarMarcacoes() {
    try {
        await fetch('/api/marcas/resetar', { method: 'DELETE' });
        Swal.fire('Limpo', 'Todas as marcações foram apagadas.', 'info');
        [1, 2].forEach(n => {
            const tabela = document.getElementById('table' + n).querySelector('table');
            if (!tabela) return;
            tabela.querySelectorAll('td').forEach(td =>
                td.classList.remove('btn-green', 'btn-orange', 'btn-blue')
            );
        });
    } catch (err) {
        Swal.fire('Erro', err.message, 'error');
    }
}

function proximaOcorrencia(n) {
    const termo = document.getElementById('searchInput' + n).value.toLowerCase();
    const tabela = document.getElementById('table' + n).querySelector('table');
    if (!tabela) return;
    const cells = tabela.querySelectorAll('td');
    let found = false;

    cells.forEach(cell => {
        if (cell.textContent.toLowerCase().includes(termo)) {
            cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cell.classList.add('highlighted');
            setTimeout(() => cell.classList.remove('highlighted'), 1500);
            found = true;
            return;
        }
    });

    if (!found) Swal.fire('Aviso', 'Nada encontrado.', 'info');
}

function toggleRegua(tabela) {
    const linhas = document.getElementById('table' + tabela).querySelectorAll('tr');
    linhas.forEach(l => l.classList.toggle('regua'));
}
