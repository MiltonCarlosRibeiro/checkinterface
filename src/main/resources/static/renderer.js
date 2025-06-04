const { shell } = require('electron');

// Correto com base no index.html
document.getElementById('abrirMapoteca').addEventListener('click', () => {
  shell.openPath('T:\\Mapoteca');
});

document.getElementById('abrirEngenharia').addEventListener('click', () => {
  shell.openPath('W:\\Desenhos SW');
});
