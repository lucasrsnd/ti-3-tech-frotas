// Seleciona o formulário de login pelo ID
const loginForm = document.getElementById('login-form');

// Adiciona um ouvinte de evento para o evento "submit" do formulário
loginForm.addEventListener('submit', (event) => {
  // Previne o comportamento padrão do formulário, que seria enviar os dados e recarregar a página
  event.preventDefault();

  // Coleta os valores do email e da senha dos campos de entrada
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Cria um objeto JSON com as credenciais do usuário
  // O backend espera um objeto com a chave "username", então usamos "username" aqui, mesmo que o campo no HTML seja "email"
  const credentials = {
    username: emailInput.value,
    password: passwordInput.value
  };

  // Faz uma requisição POST para o endpoint de login do backend
  fetch('http://localhost:8080/login', {
    method: 'POST', // Define o método HTTP como POST
    headers: {
      'Content-Type': 'application/json' // Informa ao servidor que estamos enviando dados JSON no corpo da requisição
    },
    body: JSON.stringify(credentials) // Converte o objeto de credenciais para uma string JSON
  })
  .then(response => { // Processa a resposta do servidor
    // Verifica se a resposta não está OK (código de status diferente de 200-299)
    if (!response.ok) {
      // Se houver algum erro, lança uma exceção com a mensagem "Credenciais inválidas!"
      throw new Error('Credenciais inválidas!');
    }
    // Se a resposta estiver OK, retorna o corpo da resposta como texto
    return response.text();
  })
  .then(message => {
    // Exibe um alerta que pode ser fechado pelo usuário
    alert('Usuário logado!'); 
    // Após o usuário clicar em "OK" no alerta, redireciona para a página inicial
    window.location.href = 'Caminhao.html'; 
  })
  .catch(error => { // Captura qualquer erro que ocorreu durante o processo
    // Exibe uma mensagem de erro para o usuário
    alert(error.message);
  });
});