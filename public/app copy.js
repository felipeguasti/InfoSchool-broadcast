document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('informativoContainer');

    function loadInformativos() {
        fetch('/api/informativo?filtroTurno=true')
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                if (data.length === 0) {
                    container.innerHTML = '<p>Nenhum informativo disponível.</p>';
                    return;
                }
                data.forEach((informativo, index) => {
                    const slideClass = index === 0 ? 'informativo-slide active' : 'informativo-slide';
                    container.innerHTML += `<div class="${slideClass}">
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
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.informativo-slide');
        if (slides.length === 0) return;
        setInterval(() => {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }, 12000); // Muda o slide a cada 5 segundos
    }

    setInterval(loadInformativos, 1800000); // 30 minutos
    loadInformativos();
});
