// Adiciona um ouvinte de evento para o mouse entrar no elemento
document.getElementById('whatsapp-button').addEventListener('mouseenter', function() {
  // Quando o mouse entra, redimensiona o elemento para 1.1 vezes o tamanho original
  this.style.transform = 'scale(1.1)';
});

// Adiciona um ouvinte de evento para o mouse sair do elemento
document.getElementById('whatsapp-button').addEventListener('mouseleave', function() {
  // Quando o mouse sai, redefine o redimensionamento do elemento para 1 (tamanho original)
  this.style.transform = 'scale(1)';
});
