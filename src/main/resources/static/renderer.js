// Este arquivo pode ser usado para integração com Electron se necessário.
// Atualmente está vazio, mas serve de base para chamadas futuras.
// Exemplo: chamada para abrir pastas locais via Electron.

window.api = {
  abrirPasta: (caminho) => {
    console.log("Abrir pasta (futuro):", caminho);
    // Este código pode ser habilitado quando o preload.js estiver configurado no Electron.
    // window.electronAPI.abrirPasta(caminho);
  }
};
