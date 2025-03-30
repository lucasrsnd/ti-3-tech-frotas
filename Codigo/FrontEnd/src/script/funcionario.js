// Função para buscar caminhões e preencher selects
function carregarCaminhoes(selectId) {
    fetch('http://localhost:8080/caminhoes')
        .then(response => response.json())
        .then(caminhoes => {
            const selectCaminhao = $(`#${selectId}`);
            selectCaminhao.empty(); // Limpa as opções existentes

            caminhoes.forEach(caminhao => {
                const option = new Option(caminhao.placa, caminhao.placa, false, false);
                selectCaminhao.append(option);
            });

            // Inicializa o Select2 após carregar os caminhões
            selectCaminhao.select2();
        })
        .catch(error => console.error('Erro ao carregar caminhões:', error));
}

carregarCaminhoes('caminhaoFuncionario');

// Função para abrir um modal
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Função para fechar um modal
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Evento para abrir o modal de adicionar funcionário
document.querySelector('#btnAbrirModalFuncionario').onclick = () => abrirModal('modalAddFuncionario');
document.getElementById('closeModalFuncionario').onclick = () => fecharModal('modalAddFuncionario');

// Função para cadastrar um novo funcionário
function cadastrarFuncionario() {
    const nome = document.getElementById('nomeFuncionario')?.value || '';
    const cpf = document.getElementById('cpfFuncionario')?.value || '';
    const telefone = document.getElementById('telefoneFuncionario')?.value || '';
    const placaCaminhao = document.getElementById('caminhaoFuncionario')?.value || '';
    const salario = parseFloat(document.getElementById('salarioFuncionario')?.value || 0);

    if (!nome || !cpf || !telefone || !placaCaminhao || isNaN(salario)) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const novoFuncionario = {
        nome,
        cpf,
        telefone,
        placaCaminhao,
        salario
    };

    fetch('http://localhost:8080/funcionarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoFuncionario)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao criar funcionário!');
        return response.json();
    })
    .then(() => {
        alert('Funcionário cadastrado com sucesso!');
        fecharModal('modalAddFuncionario');
        document.getElementById('formAddFuncionario').reset();
        listarFuncionarios();
    })
    .catch(error => {
        console.error('Erro ao criar funcionário:', error);
        alert('Ocorreu um erro ao cadastrar o funcionário.');
    });
}

// Adiciona evento ao formulário de cadastro de funcionário
document.getElementById('formAddFuncionario').onsubmit = (event) => {
    event.preventDefault();
    cadastrarFuncionario();
};


// Função para listar funcionários
function listarFuncionarios() {
    fetch('http://localhost:8080/funcionarios')
        .then(response => response.json())
        .then(funcionarios => {
            const tbody = document.querySelector('#tabelaFuncionarios tbody');
            tbody.innerHTML = '';
            funcionarios.forEach(funcionario => {
                const row = `
                    <tr>
                        <td>${funcionario.nome}</td>
                        <td>${funcionario.cpf}</td>
                        <td>${funcionario.telefone}</td>
                        <td>${funcionario.caminhao ? funcionario.caminhao.placa : 'Sem Caminhão'}</td>
                        <td>${funcionario.salario}</td>
                        <td>
                            <button onclick="abrirModalEditarFuncionario(${funcionario.id})"><i class="fas fa-edit"></i></button>
                            <button onclick="excluirFuncionario(${funcionario.id})"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error('Erro ao listar funcionários:', error));
}

// Função para abrir o modal de edição de funcionário
function abrirModalEditarFuncionario(funcionarioId) {
    abrirModal('modalEditFuncionario');
    carregarCaminhoes('caminhaoFuncionarioEdit');

    fetch(`http://localhost:8080/funcionarios/${funcionarioId}`)
        .then(response => response.json())
        .then(funcionario => {
            document.getElementById('idFuncionario').value = funcionario.id;
            document.getElementById('nomeFuncionarioEdit').value = funcionario.nome;
            document.getElementById('cpfFuncionarioEdit').value = funcionario.cpf;
            document.getElementById('telefoneFuncionarioEdit').value = funcionario.telefone;
            document.getElementById('caminhaoFuncionarioEdit').value = funcionario.caminhao ? funcionario.caminhao.placa : '';
            document.getElementById('salarioFuncionarioEdit').value = funcionario.salario;
        })
        .catch(error => console.error('Erro ao buscar funcionário:', error));
}

// Função para salvar alterações do funcionário
function salvarAlteracoesFuncionario() {
    const funcionarioId = document.getElementById('idFuncionario').value;
    const nome = document.getElementById('nomeFuncionarioEdit').value;
    const cpf = document.getElementById('cpfFuncionarioEdit').value;
    const telefone = document.getElementById('telefoneFuncionarioEdit').value;
    const placaCaminhao = document.getElementById('caminhaoFuncionarioEdit').value;
    const salario = parseFloat(document.getElementById('salarioFuncionarioEdit').value);

    const funcionarioAtualizado = {
        nome,
        cpf,
        telefone,
        placaCaminhao,
        salario
    };

    fetch(`http://localhost:8080/funcionarios/${funcionarioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcionarioAtualizado)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar funcionário!');
        alert('Funcionário atualizado com sucesso!');
        fecharModal('modalEditFuncionario');
        listarFuncionarios();
    })
    .catch(error => {
        console.error('Erro ao atualizar funcionário:', error);
        alert('Ocorreu um erro ao atualizar o funcionário.');
    });
}

// Evento para salvar alterações do formulário de edição
document.getElementById('formEditFuncionario').onsubmit = (event) => {
    event.preventDefault();
    salvarAlteracoesFuncionario();
};

// Função para excluir funcionário
function excluirFuncionario(funcionarioId) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        fetch(`http://localhost:8080/funcionarios/${funcionarioId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao excluir funcionário!');
                alert('Funcionário excluído com sucesso!');
                listarFuncionarios();
            })
            .catch(error => {
                console.error('Erro ao excluir funcionário:', error);
                alert('Ocorreu um erro ao excluir o funcionário.');
            });
    }
}

document.addEventListener('DOMContentLoaded', listarFuncionarios);

// Seleciona o botão de fechar e o modal de edição
document.getElementById('closeModalEditFuncionario').addEventListener('click', function() {
    fecharModal('modalEditFuncionario');
});

// Função para fechar o modal
function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';  // Esconde o modal
    }
}

// Função para gerar o PDF com os dados dos funcionários
document.getElementById('btnGerarRelatorioFuncionario').onclick = () => {
    // Cria um novo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adiciona título ao relatório
    doc.setFontSize(16);
    doc.text("Relatório de Funcionários - TechFrotas", 20, 20);

    // Adiciona a tabela de dados
    const table = [];
    const headers = ['Nome', 'CPF', 'Telefone', 'Placa', 'Salário'];
    table.push(headers);

    // Preenche as linhas com os dados dos funcionários
    const rows = [];
    const funcionarios = document.querySelectorAll('#tabelaFuncionarios tbody tr');
    funcionarios.forEach(funcionario => {
        const data = [];
        const cells = funcionario.querySelectorAll('td');
        data.push(cells[0].textContent); // Nome
        data.push(cells[1].textContent); // CPF
        data.push(cells[2].textContent); // Telefone
        data.push(cells[3].textContent); // Caminhão
        data.push(cells[4].textContent); // Salário
        rows.push(data);
    });

    // Adiciona a tabela ao PDF
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 30, // Começa a tabela 30 unidades abaixo do título
    });

    // Salva o PDF
    doc.save('relatorio_funcionarios.pdf');
};
