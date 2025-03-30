function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
  }

  // Obtenha os elementos do switch e do body
  const themeSwitch = document.getElementById('themeSwitch');
  const body = document.body;

  // Verifique se o tema escuro está ativado nas preferências do usuário
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeSwitch.checked = true;
  }

  // Adicione um ouvinte de evento para alternar o tema quando o switch for alterado
  themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark'); // Armazene a preferência no localStorage
    } else {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light'); // Armazene a preferência no localStorage
    }
  });