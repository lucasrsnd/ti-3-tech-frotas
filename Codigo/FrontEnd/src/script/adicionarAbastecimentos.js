// Função para buscar caminhões e preencher selects
function carregarCaminhoes(selectId) {
    fetch('http://localhost:8080/caminhoes')
        .then(response => response.json())
        .then(caminhoes => {
            const selectCaminhao = $(`#${selectId}`);
            caminhoes.forEach(caminhao => {
                const option = new Option(caminhao.placa, caminhao.placa, false, false);
                selectCaminhao.append(option);
            });
            selectCaminhao.select2();
        });
}

carregarCaminhoes('placaCaminhao');

document.addEventListener("DOMContentLoaded", function () {
    function abrirModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function fecharModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    const btnAddViagem = document.getElementById('btnAddViagem');
    if (btnAddViagem) {
        btnAddViagem.addEventListener('click', () => abrirModal('modalAddAbastecimento'));
    }

    const closeModalViagem = document.getElementById('closeModalViagem');
    if (closeModalViagem) {
        closeModalViagem.addEventListener('click', () => fecharModal('modalAddAbastecimento'));
    }

    window.onclick = function (event) {
        const modal = document.getElementById('modalAddAbastecimento');
        if (event.target === modal) {
            fecharModal('modalAddAbastecimento');
        }
    };
});

function cadastrarAbastecimento() {
    const valor = parseFloat(document.getElementById('valorAbastecimento').value);
    const litros = parseInt(document.getElementById('litrosAbastecimento').value);
    const data = document.getElementById('dataAbastecimento').value;
    const local = document.getElementById('localAbastecimento').value;
    const km = parseInt(document.getElementById('kmAbastecimento').value);
    const placaCaminhao = document.getElementById('placaCaminhao').value;

    if (!valor || !litros || !data || !local || !km || !placaCaminhao) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const novoAbastecimento = { valor, litros, local, data, km, placaCaminhao };

    fetch('http://localhost:8080/abastecimentos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoAbastecimento)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao criar abastecimento!');
        return response.json();
    })
    .then(() => {
        alert("Abastecimento cadastrado com sucesso!");
        fecharModal('modalAddAbastecimento');
        document.getElementById('formAddAbastecimento').reset();
        listarAbastecimentos();
    })
    .catch(error => alert('Ocorreu um erro ao cadastrar o abastecimento.'));
}

document.getElementById('formAddAbastecimento').addEventListener('submit', (event) => {
    event.preventDefault();
    cadastrarAbastecimento();
});

function listarAbastecimentos() {
    fetch('http://localhost:8080/abastecimentos')
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar abastecimentos.");
            return response.json();
        })
        .then(abastecimentos => {
            const tbody = document.querySelector('#tabelaAbastecimentos tbody');
            tbody.innerHTML = '';
            abastecimentos.forEach(abastecimento => {
                const row = `
                    <tr>
                        <td>${abastecimento.valor}</td>
                        <td>${abastecimento.km}</td>
                        <td>${abastecimento.litros}</td>
                        <td>${abastecimento.caminhao ? abastecimento.caminhao.placa : 'Sem Caminhão'}</td>
                        <td>${abastecimento.local}</td>
                        <td>${abastecimento.data}</td>
                        <td>
                            <button onclick="abrirModalEditarAbastecimento(${abastecimento.id})"><i class="fas fa-edit"></i></button>
                            <button onclick="excluirAbastecimento(${abastecimento.id})"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error('Erro ao listar abastecimentos:', error));
}


document.addEventListener('DOMContentLoaded', listarAbastecimentos);

function abrirModalEditarAbastecimento(abastecimentoId) {
    abrirModal('modalEditAbastecimento');

    // Carrega os caminhões no select antes de preencher o valor
    carregarCaminhoes('placaCaminhaoEdit');

    // Fetch para obter os detalhes do abastecimento
    fetch(`http://localhost:8080/abastecimentos/${abastecimentoId}`)
        .then(response => response.json())
        .then(abastecimento => {
            // Preenche os campos do modal com os dados do abastecimento
            document.getElementById('idAbastecimento').value = abastecimento.id;
            document.getElementById('valorAbastecimentoEdit').value = abastecimento.valor;
            document.getElementById('litrosAbastecimentoEdit').value = abastecimento.litros;
            document.getElementById('localAbastecimentoEdit').value = abastecimento.local;
            document.getElementById('dataAbastecimentoEdit').value = abastecimento.data;
            document.getElementById('kmAbastecimentoEdit').value = abastecimento.km;

            // Define o valor correto do select após as opções serem carregadas
            setTimeout(() => {
                document.getElementById('placaCaminhaoEdit').value = abastecimento.placaCaminhao;
            }, 200); // Pequeno atraso para garantir que o select já tenha sido carregado
        })
        .catch(error => console.error('Erro ao buscar abastecimento:', error));
}


function salvarAlteracoesAbastecimento() {
    const abastecimentoId = document.getElementById('idAbastecimento').value;
    const valor = document.getElementById('valorAbastecimentoEdit').value;
    const litros = document.getElementById('litrosAbastecimentoEdit').value;
    const local = document.getElementById('localAbastecimentoEdit').value;
    const data = document.getElementById('dataAbastecimentoEdit').value;
    const km = document.getElementById('kmAbastecimentoEdit').value;
    const placaCaminhao = document.getElementById('placaCaminhaoEdit').value;

    const abastecimentoAtualizado = { valor, litros, local, data, km, placaCaminhao };

    fetch(`http://localhost:8080/abastecimentos/${abastecimentoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(abastecimentoAtualizado)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar abastecimento!');
        return response.json();
    })
    .then(() => {
        alert('Abastecimento atualizado com sucesso!');
        fecharModal('modalEditAbastecimento');
        listarAbastecimentos();
    })
    .catch(error => alert('Ocorreu um erro ao atualizar o abastecimento.'));
}

document.getElementById('formEditAbastecimento').addEventListener('submit', (event) => {
    event.preventDefault();
    salvarAlteracoesAbastecimento();
});

function excluirAbastecimento(abastecimentoId) {
    if (confirm("Tem certeza que deseja excluir este abastecimento?")) {
        fetch(`http://localhost:8080/abastecimentos/${abastecimentoId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao excluir abastecimento!');
            alert('Abastecimento excluído com sucesso!');
            listarAbastecimentos();
        })
        .catch(error => alert('Ocorreu um erro ao excluir o abastecimento.'));
    }
}

// Função para gerar o relatório de abastecimentos em formato PDF
function gerarRelatorioAbastecimentos() {
    // Importa o jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título do PDF
    doc.setFontSize(18);
    doc.text("Relatório de Abastecimentos", 10, 10);

    // Define os cabeçalhos das colunas da tabela
    const colunas = ["Valor", "KM", "Litros", "Placa", "Local", "Data"];

    // Obtém os abastecimentos do backend
    fetch('http://localhost:8080/abastecimentos')
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar abastecimentos.");
            return response.json();
        })
        .then(abastecimentos => {
            // Mapeia os dados dos abastecimentos para um formato de array bidimensional
            const linhas = abastecimentos.map(abastecimento => [
                `R$ ${abastecimento.valor.toFixed(2)}`, // Formata o valor
                abastecimento.km,
                abastecimento.litros,
                abastecimento.caminhao ? abastecimento.caminhao.placa : 'Sem Caminhão',
                abastecimento.local,
                abastecimento.data
            ]);

            // Gera a tabela usando o autoTable
            doc.autoTable({
                head: [colunas],
                body: linhas,
                startY: 20, // Define o espaço entre o título e a tabela
            });

            // Salva o PDF com o nome "relatorio_abastecimentos.pdf"
            doc.save("relatorio_abastecimentos.pdf");
        })
        .catch(error => alert("Erro ao gerar relatório: " + error.message));
}

// Adiciona evento ao botão "Gerar Relatório"
document.getElementById('btnGerarRelatorioFuncionario').addEventListener('click', gerarRelatorioAbastecimentos);

