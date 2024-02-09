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
                data.forEach((informativo, index) => {
                    let videoContent = '';

                    if (informativo.videoUrl) {
                        if (informativo.videoUrl.includes('youtube')) {
                            const videoId = informativo.videoUrl.split('v=')[1];
                            const autoplay = '&autoplay=1';
                            const loop = '&loop=1';
                            const mute = informativo.videoComSom ? '' : '&mute=1';
                            const embedUrl = `https://www.youtube.com/embed/${videoId}?playlist=${videoId}${autoplay}${loop}${mute}&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&showinfo=0&iv_load_policy=3`;

                            videoContent = `<iframe id="informativo-slide-${index}" width="560" height="315" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                        } else {
                            videoContent = `<video id="informativo-slide-${index}" src="${informativo.videoUrl}" ${informativo.videoComSom ? 'controls' : 'muted'} loop autoplay></video>`;
                        }
                    }

                    container.innerHTML += `
                        <div class="informativo-slide">
                            <h1>${informativo.titulo}</h1>
                            <p>${informativo.mensagem}</p>
                            ${informativo.imagemUrl ? `<img id="informativo-slide-${index}" src="${informativo.imagemUrl}" alt="Imagem do Informativo">` : ''}
                            ${videoContent}
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
