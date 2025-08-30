// Contador de tiempo transcurrido global y reutilizable
(function(){
  function actualizarContadoresTiempo() {
    const ahora = new Date();
    document.querySelectorAll('.contador-tiempo').forEach(function(span) {
      const meta = span.closest('[data-fecha]');
      if (!meta) return;
      const fecha = new Date(meta.getAttribute('data-fecha'));
      let diff = Math.floor((ahora - fecha) / 1000);
      let texto = '';
      if (diff < 60) {
        texto = 'Hace unos segundos';
      } else if (diff < 3600) {
        const min = Math.floor(diff / 60);
        texto = `Hace ${min} minuto${min === 1 ? '' : 's'}`;
      } else if (diff < 86400) {
        const h = Math.floor(diff / 3600);
        texto = `Hace ${h} hora${h === 1 ? '' : 's'}`;
      } else {
        const d = Math.floor(diff / 86400);
        texto = `Hace ${d} día${d === 1 ? '' : 's'}`;
      }
      span.textContent = texto;
    });
  }
  setInterval(actualizarContadoresTiempo, 30000);
  actualizarContadoresTiempo();
})();
