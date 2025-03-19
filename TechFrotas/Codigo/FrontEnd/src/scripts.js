// Arrays para armazenar motoristas, caminhões e viagens
let motoristas = [];
let caminhoes = [];
let viagens = [];

// Abrir e fechar modais de adicionar funcionário, veículo e viagem
const modalFuncionario = document.getElementById("modalAddFuncionario");
const modalVeiculo = document.getElementById("modalAddVeiculo");
const modalViagem = document.getElementById("modalAddViagem");

const btnAddFuncionario = document.querySelector(".buttons button:first-child");
const btnAddVeiculo = document.querySelector(".buttons button:nth-child(2)");
const btnAddViagem = document.getElementById("btnAddViagem");

const closeModalFuncionario = document.getElementById("closeModal");
const closeModalVeiculo = document.getElementById("closeModalVeiculo");
const closeModalViagem = document.getElementById("closeModalViagem");

// Funções para abrir e fechar modais
btnAddFuncionario.onclick = () => modalFuncionario.style.display = "block";
closeModalFuncionario.onclick = () => modalFuncionario.style.display = "none";

btnAddVeiculo.onclick = () => modalVeiculo.style.display = "block";
closeModalVeiculo.onclick = () => modalVeiculo.style.display = "none";

btnAddViagem.onclick = () => modalViagem.style.display = "block";
closeModalViagem.onclick = () => modalViagem.style.display = "none";

// Fechar os modais ao clicar fora da caixa
window.onclick = function (event) {
    if (event.target == modalFuncionario) {
        modalFuncionario.style.display = "none";
    }
    if (event.target == modalVeiculo) {
        modalVeiculo.style.display = "none";
    }
    if (event.target == modalViagem) {
        modalViagem.style.display = "none";
    }
};

// Manipulação de formulário de adicionar funcionário
const formMotorista = document.getElementById("formAddFuncionario");
formMotorista.addEventListener("submit", function (event) {
    event.preventDefault();

    const nomeFuncionario = document.getElementById("nomeFuncionario").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const contatoFuncionario = document.getElementById("contatoFuncionario").value;
    const funcaoFuncionario = document.getElementById("funcaoFuncionario").value;

    adicionarMotorista(nomeFuncionario, dataNascimento, contatoFuncionario, funcaoFuncionario);

    formMotorista.reset();
    modalFuncionario.style.display = "none";
});

// Manipulação de formulário de adicionar caminhão
const formCaminhao = document.getElementById("formAddVeiculo");
formCaminhao.addEventListener("submit", function (event) {
    event.preventDefault();

    const modeloVeiculo = document.getElementById("modeloVeiculo").value;
    const anoVeiculo = document.getElementById("anoVeiculo").value;
    const placaVeiculo = document.getElementById("placaVeiculo").value;
    const motoristaId = document.getElementById("motoristaVeiculo").value;

    // Verificar se a placa já existe antes de adicionar
    if (verificarPlacaExistente(placaVeiculo)) {
        alert("Erro: A placa já está cadastrada para outro caminhão.");
        return; // Impede a adição do caminhão
    }

    adicionarCaminhao(modeloVeiculo, anoVeiculo, placaVeiculo, motoristaId);

    formCaminhao.reset();
    modalVeiculo.style.display = "none";

    // Atualizar a lista de placas após adicionar o caminhão
    atualizarSelectPlacas();
});

// Função para verificar se a placa já está cadastrada
function verificarPlacaExistente(placa) {
    return caminhoes.some(caminhao => caminhao.placa === placa);
}

// Função para adicionar caminhões dinamicamente na lista e array
function adicionarCaminhao(modelo, ano, placa, motoristaId) {
    const motorista = motoristas.find(m => m.id === parseInt(motoristaId));
    const caminhao = { id: caminhoes.length + 1, modelo, ano, placa, motorista };
    caminhoes.push(caminhao);

    // Relacionar o caminhão com o motorista
    motorista.caminhao = caminhao;

    // Atualizar o select de motoristas, removendo o motorista que foi associado
    atualizarSelectMotoristas();

    // Atualizar a tabela de caminhões
    atualizarTabelaCaminhoes();
}

// Função para adicionar motoristas dinamicamente na lista e array
function adicionarMotorista(nome, dataNascimento, contato, funcao) {
    const motorista = { id: motoristas.length + 1, nome, dataNascimento, contato, funcao, caminhao: null };
    motoristas.push(motorista);

    // Atualizar o select de motoristas no modal de caminhões
    atualizarSelectMotoristas();
}

// Função para adicionar caminhões dinamicamente na lista e array
function adicionarCaminhao(modelo, ano, placa, motoristaId) {
    const motorista = motoristas.find(m => m.id === parseInt(motoristaId));
    const caminhao = { id: caminhoes.length + 1, modelo, ano, placa, motorista };
    caminhoes.push(caminhao);

    // Relacionar o caminhão com o motorista
    motorista.caminhao = caminhao;

    // Atualizar o select de motoristas, removendo o motorista que foi associado
    atualizarSelectMotoristas();
}

// Função para atualizar o select de motoristas no modal de caminhões
function atualizarSelectMotoristas() {
    const selectMotorista = document.getElementById("motoristaVeiculo");
    selectMotorista.innerHTML = "";

    motoristas.forEach(motorista => {
        if (!motorista.caminhao) {
            const option = document.createElement("option");
            option.value = motorista.id;
            option.textContent = motorista.nome;
            selectMotorista.appendChild(option);
        }
    });
}

// Funções para abrir os modais de visualização de listas
const modalListaMotoristas = document.getElementById("modalListaMotoristas");
const modalListaCaminhoes = document.getElementById("modalListaCaminhoes");

const btnListaMotoristas = document.querySelector("li img[alt='Motoristas']").parentElement;
const btnListaCaminhoes = document.querySelector("li img[alt='Caminhões']").parentElement;

const closeModalListaMotoristas = document.getElementById("closeModalListaMotoristas");
const closeModalListaCaminhoes = document.getElementById("closeModalListaCaminhoes");

btnListaMotoristas.onclick = () => {
    atualizarTabelaMotoristas();
    modalListaMotoristas.style.display = "block";
};
closeModalListaMotoristas.onclick = () => modalListaMotoristas.style.display = "none";

btnListaCaminhoes.onclick = () => {
    atualizarTabelaCaminhoes();
    modalListaCaminhoes.style.display = "block";
};
closeModalListaCaminhoes.onclick = () => modalListaCaminhoes.style.display = "none";

// Fechar os modais de lista ao clicar fora da caixa
window.onclick = function (event) {
    if (event.target == modalListaMotoristas) {
        modalListaMotoristas.style.display = "none";
    }
    if (event.target == modalListaCaminhoes) {
        modalListaCaminhoes.style.display = "none";
    }
};

// Atualizar tabela de motoristas
function atualizarTabelaMotoristas() {
    const tabelaMotoristas = document.getElementById("tabelaMotoristas").querySelector("tbody");
    tabelaMotoristas.innerHTML = "";

    motoristas.forEach(motorista => {
        const novaLinha = document.createElement("tr");

        novaLinha.innerHTML = `
            <td>${motorista.nome}</td>
            <td>${motorista.dataNascimento}</td>
            <td>${motorista.contato}</td>
            <td>${motorista.funcao}</td>
            <td>${motorista.caminhao ? motorista.caminhao.modelo : 'Nenhum caminhão'}</td>
        `;

        tabelaMotoristas.appendChild(novaLinha);
    });
}

// Atualizar tabela de caminhões
function atualizarTabelaCaminhoes() {
    const tabelaCaminhoes = document.getElementById("tabelaCaminhoes").querySelector("tbody");
    tabelaCaminhoes.innerHTML = "";

    caminhoes.forEach(caminhao => {
        const novaLinha = document.createElement("tr");

        novaLinha.innerHTML = `
            <td>${caminhao.modelo}</td>
            <td>${caminhao.ano}</td>
            <td>${caminhao.placa}</td>
            <td>${caminhao.motorista ? caminhao.motorista.nome : 'Nenhum motorista'}</td>
            <td><button class="btn-editar-caminhao" data-id="${caminhao.id}">Editar</button></td>
        `;

        tabelaCaminhoes.appendChild(novaLinha);
    });

    // Adicionar evento de clique para os botões de editar caminhão
    document.querySelectorAll(".btn-editar-caminhao").forEach(button => {
        button.addEventListener("click", function () {
            const caminhaoId = this.getAttribute("data-id");
            abrirModalEditarCaminhao(caminhaoId);
        });
    });
}
// Manipulação de formulário de adicionar viagem
const formViagem = document.getElementById("formAddViagem");
formViagem.addEventListener("submit", function (event) {
    event.preventDefault();

    const dataViagem = document.getElementById("dataViagem").value;
    const valorViagem = document.getElementById("valorViagem").value;
    const pesoViagem = document.getElementById("pesoViagem").value;
    const origemViagem = document.getElementById("origemViagem").value;
    const destinoViagem = document.getElementById("destinoViagem").value;
    const placaCaminhao = document.getElementById("placaCaminhao").value; // Capturando a placa selecionada

    adicionarViagem(dataViagem, valorViagem, pesoViagem, origemViagem, destinoViagem, placaCaminhao);

    formViagem.reset();
    modalViagem.style.display = "none";
});

// Função para adicionar viagens dinamicamente na lista e array
function adicionarViagem(data, valor, peso, origem, destino, placa) {
    const viagem = { id: viagens.length + 1, data, valor, peso, origem, destino, placa };
    viagens.push(viagem);

    // Verificar se a tabela de viagens existe
    const tabelaViagens = document.querySelector("#tabelaViagens tbody");
    if (!tabelaViagens) {
        console.error("Tabela de viagens não encontrada");
        return;
    }

    // Converter a data de YYYY-MM-DD para DD/MM/YYYY
    const dataFormatada = formatarData(data);

    // Adicionar a viagem à tabela de viagens
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
        <td>${dataFormatada}</td>
        <td>R$ ${parseFloat(valor).toFixed(2)}</td>
        <td>${peso} kg</td>
        <td>${origem}</td>
        <td>${destino}</td>
        <td>${placa}</td> <!-- Exibindo a placa do caminhão -->
    `;
    tabelaViagens.appendChild(novaLinha);
}

// Função para carregar as placas dos caminhões no select de placas
function atualizarSelectPlacas() {
    const selectPlaca = document.getElementById("placaCaminhao");
    selectPlaca.innerHTML = ""; // Limpar o select

    caminhoes.forEach(caminhao => {
        const option = document.createElement("option");
        option.value = caminhao.placa;
        option.textContent = `${caminhao.modelo} - ${caminhao.placa}`;
        selectPlaca.appendChild(option);
    });
}

// Chamar essa função sempre que um caminhão for adicionado
atualizarSelectPlacas();

// Função para formatar a data de YYYY-MM-DD para DD/MM/YYYY
function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Abrir o modal de edição de caminhão
function abrirModalEditarCaminhao(caminhaoId) {
    const caminhao = caminhoes.find(c => c.id === parseInt(caminhaoId));
    
    if (!caminhao) {
        console.error("Caminhão não encontrado");
        return;
    }

    // Fechar o modal de lista de caminhões
    document.getElementById("modalListaCaminhoes").style.display = "none";

    // Carregar a lista de motoristas no select
    const selectMotorista = document.getElementById("editarMotoristaCaminhao");
    selectMotorista.innerHTML = ""; // Limpar o select

    motoristas.forEach(motorista => {
        const option = document.createElement("option");
        option.value = motorista.id;
        option.textContent = motorista.nome;
        option.selected = motorista.id === caminhao.motorista?.id; // Selecionar o motorista atual
        selectMotorista.appendChild(option);
    });

    // Definir o ID do caminhão no campo oculto
    document.getElementById("caminhaoIdEditar").value = caminhao.id;

    // Abrir o modal de edição de caminhão
    document.getElementById("modalEditarCaminhao").style.display = "block";
}

// Fechar o modal de edição de caminhão ao clicar no "X" ou fora do modal
document.getElementById("closeModalEditarCaminhao").onclick = function() {
    document.getElementById("modalEditarCaminhao").style.display = "none";
};

window.onclick = function(event) {
    const modalEditarCaminhao = document.getElementById("modalEditarCaminhao");
    if (event.target == modalEditarCaminhao) {
        modalEditarCaminhao.style.display = "none";
    }
};

// Manipulação de formulário para salvar as alterações no caminhão
const formEditarCaminhao = document.getElementById("formEditarCaminhao");
formEditarCaminhao.addEventListener("submit", function (event) {
    event.preventDefault();

    const caminhaoId = document.getElementById("caminhaoIdEditar").value;
    const novoMotoristaId = document.getElementById("editarMotoristaCaminhao").value;

    salvarAlteracoesCaminhao(caminhaoId, novoMotoristaId);

    // Fechar o modal
    document.getElementById("modalEditarCaminhao").style.display = "none";
});

// Função para salvar as alterações no caminhão
function salvarAlteracoesCaminhao(caminhaoId, novoMotoristaId) {
    const caminhao = caminhoes.find(c => c.id === parseInt(caminhaoId));
    const novoMotorista = motoristas.find(m => m.id === parseInt(novoMotoristaId));

    if (caminhao && novoMotorista) {
        // Remover o caminhão do motorista antigo, se houver
        if (caminhao.motorista) {
            caminhao.motorista.caminhao = null; // Desvincular o caminhão do motorista antigo
        }

        // Atualizar o motorista do caminhão
        caminhao.motorista = novoMotorista;

        // Atualizar o caminhão do novo motorista
        novoMotorista.caminhao = caminhao;

        // Atualizar o select de motoristas (para remover ou adicionar motoristas conforme o vínculo muda)
        atualizarSelectMotoristas();

        // Atualizar as tabelas de caminhões e motoristas
        atualizarTabelaCaminhoes();
        atualizarTabelaMotoristas();
    }
}

// Função para atualizar o select de motoristas no modal de caminhões
function atualizarSelectMotoristas() {
    const selectMotorista = document.getElementById("motoristaVeiculo");
    selectMotorista.innerHTML = "";

    motoristas.forEach(motorista => {
        if (!motorista.caminhao) { // Apenas motoristas que não estão vinculados a um caminhão
            const option = document.createElement("option");
            option.value = motorista.id;
            option.textContent = motorista.nome;
            selectMotorista.appendChild(option);
        }
    });
}

// Função para carregar as placas dos caminhões no select de placas
function atualizarSelectPlacas() {
    const selectPlaca = document.getElementById("placaCaminhao");
    selectPlaca.innerHTML = "";

    caminhoes.forEach(caminhao => {
        const option = document.createElement("option");
        option.value = caminhao.placa;
        option.textContent = `${caminhao.modelo} - ${caminhao.placa}`;
        selectPlaca.appendChild(option);
    });
}

// Função para abrir o modal de edição de caminhão
function abrirModalEditarCaminhao(caminhaoId) {
    const caminhao = caminhoes.find(c => c.id === parseInt(caminhaoId));
    
    if (!caminhao) {
        console.error("Caminhão não encontrado");
        return;
    }

    // Fechar o modal de lista de caminhões
    document.getElementById("modalListaCaminhoes").style.display = "none";

    // Carregar a lista de motoristas no select
    const selectMotorista = document.getElementById("editarMotoristaCaminhao");
    selectMotorista.innerHTML = ""; 

    motoristas.forEach(motorista => {
        if (!motorista.caminhao || motorista.id === caminhao.motorista?.id) {
            const option = document.createElement("option");
            option.value = motorista.id;
            option.textContent = motorista.nome;
            option.selected = motorista.id === caminhao.motorista?.id; 
            selectMotorista.appendChild(option);
        }
    });

    // Definir o ID do caminhão no campo oculto
    document.getElementById("caminhaoIdEditar").value = caminhao.id;

    // Abrir o modal de edição de caminhão
    document.getElementById("modalEditarCaminhao").style.display = "block";
}