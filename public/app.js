document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('informativoContainer');
    let intervaloSlideShow;

    function loadInformativos() {
        fetch('/api/informativo?filtroTurno=true')
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                if (data.length === 0) {
                    container.innerHTML = '<p>Nenhum informativo disponível.</p>';
                    return;
                }
                data.forEach(informativo => {
                    container.innerHTML += `
                        <div class="informativo-slide">
                            <h1>${informativo.titulo}</h1>
                            <p>${informativo.mensagem}</p>
                            ${informativo.imagemUrl ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo">` : ''}
                            ${informativo.videoUrl ? `<video src="${informativo.videoUrl}" ${informativo.videoComSom ? 'controls' : 'muted'}></video>` : ''}
                        </div>`;
                });
                startSlideShow();
            });
    }

    function startSlideShow() {
        clearInterval(intervaloSlideShow);
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.informativo-slide');
        if (slides.length === 0) return;

        slides[currentSlideIndex].classList.add('active');

        intervaloSlideShow = setInterval(() => {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');

            // Se todos os slides foram exibidos, recarregar informativos
            if (currentSlideIndex === 0) {
                loadInformativos();
            }
        }, 12000); // Muda o slide a cada 12 segundos
    }

    loadInformativos();
});
