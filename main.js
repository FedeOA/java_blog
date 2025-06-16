
window.addEventListener('hashchange', cargarSeccion);
window.addEventListener('DOMContentLoaded', cargarSeccion);

function cargarSeccion() {
  const seccion = location.hash.slice(1) || 'inicio';
  const contenido = document.getElementById('contenido');

  if (seccion === 'inicio') {
  contenido.innerHTML = `
    <div class="intro">
      <h2>Bienvenido al blog</h2>
      <p class="escribiendo delay-1">Este es un espacio para compartir buenas prácticas, patrones de diseño y arquitecturas en Java.</p>
      <p class="escribiendo delay-2">La posibilidad de tener este blog me parece una gran oportunidad para compartir conocimiento,</p>
      <p class="escribiendo delay-3"> demostrar habilidades y mantenerme motivado para el aprendizaje continuo.</p>
      <p class="escribiendo delay-4">Explora los artículos, aplicá lo aprendido y sumate al intercambio de ideas sobre desarrollo.</p>
    </div>
  `;
}
 else if (seccion === 'posts') {
  contenido.innerHTML = `
    <h2>Categorías</h2>
    <div class="post-card">
      <h3>Patrones de diseño</h3>
      <p>Buenas prácticas y patrones comunes usados en el desarrollo con Java.</p>
      <a href="/categories/patrones/patrones-de-diseno.html">Ver artículos</a>
    </div>
    <div class="post-card">
      <h3>Testing</h3>
      <p>Pruebas unitarias, de integración y frameworks como JUnit y Mockito.</p>
      <a href="/categories/test/testing.html">Ver artículos</a>
    </div>
  `;
  } else if (seccion === 'sobre') {
    contenido.innerHTML = `
      <h2>Sobre mí</h2>
      <div class="sobre-mi">
        <p class="escribiendo delay-1">
          Actualmente me desempeño en el ámbito profesional como desarrollador backend con Java y
        </p>
        <p class="escribiendo delay-2">
           Spring Boot como tecnologías principales. Me apasiona crear soluciones eficientes y 
        </p>
        <p class="escribiendo delay-3">
          escalables, y siempre estoy aprendiendo nuevas herramientas para mejorar la calidad del</p>
        </p>
        <p class="escribiendo delay-4">
          software. En mi tiempo libre me gusta explorar nuevas tecnologías y mejorar mis habilidades a
        </p>
        <p class="escribiendo delay-5">
          través de proyectos personales e investigación sobre nuevas tendencias.
        </p>
      </div>
    `;
  } else if (seccion === 'contacto') {
    contenido.innerHTML = `
      <h2>Contacto</h2>
        <p>
          Puedes encontrarme en 
          <a href="https://github.com/FedeOA" target="_blank">GitHub</a>, 
          <a href="https://www.linkedin.com/in/federico-oscar-acosta" target="_blank">LinkedIn</a>,
          o <a href="mailto:fedeacosta07@hotmail.com">enviarme un correo</a>.
        </p>
    `;
  } else {
    contenido.innerHTML = `<h2>Sección no encontrada</h2>`;
  }
}
