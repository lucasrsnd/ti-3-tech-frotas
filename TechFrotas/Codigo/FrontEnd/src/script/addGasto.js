// Função para buscar caminhões e preencher selects
function carregarCaminhoes(selectId) {
    fetch('http://localhost:8080/caminhoes')
        .then(response => response.json())
        .then(caminhoes => {
            const selectCaminhao = $(`#${selectId}`); // Seleciona o select pelo ID dinamicamente
            caminhoes.forEach(caminhao => {
                const option = new Option(caminhao.placa, caminhao.placa, false, false);
                selectCaminhao.append(option);
            });

            // Inicializa o Select2 após carregar os caminhões
            selectCaminhao.select2();
        });
}

// Chama a função para carregar os caminhões no select de adicionar gasto
carregarCaminhoes('caminhaoFuncionario');

// Função para abrir um modal
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Função para fechar um modal
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Adiciona um ouvinte de evento ao botão "Adicionar gasto"
document.getElementById('btnAbrirModalGasto').addEventListener('click', () => {
    abrirModal('modalAddGasto');
});

// Adiciona um ouvinte de evento ao botão de fechar do modal de gasto
document.getElementById('closeModalGasto').addEventListener('click', () => {
    fecharModal('modalAddGasto');
});

// Função para cadastrar um novo gasto na API
function cadastrarGasto() {
    const tipo = document.getElementById('tipoGasto').value; // Corrigido o ID do tipo de gasto
    const valor = document.getElementById('valorGasto').value;
    const placaCaminhao = document.getElementById('caminhaoFuncionario').value;
    const parcela = document.getElementById('parcelaGasto').value;
    const numeroParcelasTotal = document.getElementById('qtd_parcelasGasto').value;

    const novoGasto = {
        tipo: tipo,
        valor: valor,
        placaCaminhao: placaCaminhao,
        parcela: parcela,
        numeroParcelasTotal: numeroParcelasTotal
    };

    fetch('http://localhost:8080/gastos-veiculos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoGasto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao criar Gasto!');
            }
            return response.json();
        })
        .then(() => {
            alert("Gasto cadastrado com sucesso!");
            fecharModal('modalAddGasto');
            document.getElementById('formAddGasto').reset();
            listarGastos();
        })
        .catch(error => {
            console.error('Erro ao criar gasto:', error);
            alert('Ocorreu um erro ao cadastrar o gasto. Por favor, tente novamente.');
        });
}

// Adiciona um ouvinte de evento "submit" ao formulário de gasto
const formAddGasto = document.getElementById('formAddGasto');
formAddGasto.addEventListener('submit', (event) => {
    event.preventDefault();
    cadastrarGasto();
});

// Função para listar gastos
function listarGastos() {
    fetch('http://localhost:8080/gastos-veiculos')
        .then(response => response.json())
        .then(gastos => {
            const tbody = document.querySelector('#tabelaGastos tbody');
            tbody.innerHTML = '';

            gastos.forEach(gasto => {
                const row = `
                    <tr>
                        <td>${gasto.tipo}</td>
                        <td>${gasto.valor}</td>
                        <td>${gasto.veiculo.placa}</td>
                        <td>${gasto.parcela}</td>
                        <td>${gasto.numeroParcelasTotal}</td>
                        <td style="display:none;">${gasto.id}</td>
                        <td>
                            <button onclick="abrirModalEditarGasto(${gasto.id})"><i class="fas fa-edit"></i></button>
                            <button onclick="excluirGasto(${gasto.id})"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error('Erro ao buscar gastos:', error));
}

// Função para abrir o modal de edição
function abrirModalEditarGasto(gastoId) {
    abrirModal('modalEditGasto');

    // Carrega os caminhões no select do modal de edição
    carregarCaminhoes('caminhaoFuncionarioEdit');

    fetch(`http://localhost:8080/gastos-veiculos/${gastoId}`)
        .then(response => response.json())
        .then(gasto => {
            document.getElementById('idGasto').value = gasto.id;
            document.getElementById('tipoGastoEdit').value = gasto.tipo; // Corrigido: usando o select correto no modal de edição
            document.getElementById('valorGastoEdit').value = gasto.valor;
            $('#caminhaoFuncionarioEdit').val(gasto.veiculo.placa).trigger('change');
            document.getElementById('parcelaGastoEdit').value = gasto.parcela;
            document.getElementById('qtd_parcelasGastoEdit').value = gasto.numeroParcelasTotal;
        })
        .catch(error => console.error('Erro ao buscar gasto:', error));
}

// Função para salvar as alterações do gasto
function salvarAlteracoesGasto() {
    const gastoId = document.getElementById('idGasto').value;
    const tipo = document.getElementById('tipoGastoEdit').value; // Corrigido ID
    const valor = document.getElementById('valorGastoEdit').value;
    const placaCaminhao = document.getElementById('caminhaoFuncionarioEdit').value;
    const parcela = document.getElementById('parcelaGastoEdit').value;
    const numeroParcelasTotal = document.getElementById('qtd_parcelasGastoEdit').value;

    const gastoAtualizado = {
        tipo: tipo,
        valor: valor,
        placaCaminhao: placaCaminhao,
        parcela: parcela,
        numeroParcelasTotal: numeroParcelasTotal
    };

    fetch(`http://localhost:8080/gastos-veiculos/${gastoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gastoAtualizado)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar gasto!');
            }
            return response.json();
        })
        .then(() => {
            alert('Gasto atualizado com sucesso!');
            fecharModal('modalEditGasto');
            listarGastos();
        })
        .catch(error => {
            console.error('Erro ao atualizar gasto:', error);
            alert('Ocorreu um erro ao atualizar o gasto.');
        });
}
// Adiciona um ouvinte de evento "submit" ao formulário de edição de gasto
const formEditGasto = document.getElementById('formEditGasto');
formEditGasto.addEventListener('submit', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    salvarAlteracoesGasto(); // Chama a função para salvar as alterações do gasto
});

// Função para excluir gasto
function excluirGasto(gastoId) {
    if (confirm("Tem certeza que deseja excluir este gasto?")) {
        fetch(`http://localhost:8080/gastos-veiculos/${gastoId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir gasto!');
                }
                alert('Gasto excluído com sucesso!');
                listarGastos(); // Atualiza a lista após exclusão
            })
            .catch(error => {
                console.error('Erro ao excluir gasto:', error);
                alert('Ocorreu um erro ao excluir o gasto.');
            });
    }
}

// Fechar modal de adição
document.getElementById('closeModalGasto').addEventListener('click', function () {
    document.getElementById('modalAddGasto').style.display = 'none'; // Fecha o modal
});

// Fechar modal de edição
document.getElementById('closeModalEditGasto').addEventListener('click', function () {
    document.getElementById('modalEditGasto').style.display = 'none'; // Fecha o modal
});


// Abrir modal de seleção de relatório
document.getElementById('btnGerarSelectRelatorio').addEventListener('click', () => {
    const modal = document.getElementById('modalSelectRelatorio');
    const select = document.getElementById('tipoGastoSelect');
    
    // Limpa a seleção anterior
    select.value = '';
    
    // Exibe o modal
    modal.style.display = 'block';
});

// Fechar modal de seleção de relatório
document.getElementById('closeModalSelectRelatorio').addEventListener('click', () => {
    const modal = document.getElementById('modalSelectRelatorio');
    
    // Fecha o modal
    modal.style.display = 'none';
    
    // Opcional: reseta o select (para limpar qualquer valor selecionado)
    document.getElementById('tipoGastoSelect').value = '';
});



// Função para gerar o PDF com os gastos em formato de tabela
function gerarRelatorioPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtém o valor selecionado no dropdown
    const tipoSelecionado = document.getElementById('tipoGastoSelect').value;

    doc.setFontSize(18);
    doc.text(`Relatório de Gastos - ${tipoSelecionado}`, 10, 10);

    const colunas = ["Tipo", "Valor", "Placa", "Parcela", "Qtd. Parcelas"];

    fetch('http://localhost:8080/gastos-veiculos') // Busca os dados da API
        .then(response => response.json())
        .then(gastos => {
            // Filtra os gastos pelo tipo selecionado
            const gastosFiltrados = gastos.filter(gasto => gasto.tipo === tipoSelecionado);

            const linhas = gastosFiltrados.map(gasto => [
                gasto.tipo,
                `R$ ${gasto.valor.toFixed(2)}`,
                gasto.veiculo.placa || "-",
                gasto.parcela || "-",
                gasto.numeroParcelasTotal || "-"
            ]);

            if (linhas.length === 0) {
                alert(`Nenhum gasto do tipo "${tipoSelecionado}" foi encontrado.`);
                return;
            }

            doc.autoTable({
                head: [colunas],
                body: linhas,
                startY: 20,
            });

            doc.save(`relatorio_gastos_${tipoSelecionado.toLowerCase()}.pdf`);
        })
        .catch(error => {
            console.error('Erro ao buscar gastos para o relatório:', error);
            alert('Ocorreu um erro ao gerar o relatório.');
        });
}

// Adiciona evento ao botão "Gerar Relatório"
//document.getElementById('btnGerarRelatorio').addEventListener('click', gerarRelatorioPDF);

// Geração do relatório ao enviar o formulário
document.getElementById('formSelectRelatorio').addEventListener('submit', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    
    gerarRelatorioPDF(); // Gera o relatório PDF
    fecharModal('modalSelectRelatorio'); // Fecha o modal após gerar o relatório
});

// Chamada inicial para listar gastos
listarGastos();
