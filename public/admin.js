document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('informativoForm');
    const informativoList = document.getElementById('informativoList');

    // Função para carregar os informativos existentes
    function loadInformativos() {
        fetch('/api/informativo')
            .then(response => response.json())
            .then(data => {
                informativoList.innerHTML = '';
                data.forEach(informativo => {
                    const turno = informativo.turno === 'matutino' ? 'Matutino' : 'Vespertino';
                    informativoList.innerHTML += `
                        <div class="informativo-container">
                            <h3>${informativo.titulo}</h3>
                            <p>${informativo.mensagem}</p>
                            ${informativo.imagemUrl ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo" class="informativo-imagem">` : ''}
                            ${informativo.videoUrl ? `<video src="${informativo.videoUrl}" ${informativo.videoComSom ? 'controls' : 'muted'}></video>` : ''}
                            <span class="turno-indicacao">${turno}</span>
                            <button class="delete-button" onclick="deleteInformativo(${informativo.id})">Excluir</button>
                        </div>`;
                });
            });
    }

    // Função para deletar um informativo
    function deleteInformativo(id) {
        fetch(`/api/informativo/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    loadInformativos();
                } else {
                    alert('Erro ao excluir o informativo');
                }
            });
    }
    window.deleteInformativo = deleteInformativo;

    // Evento de submissão do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            titulo: form.titulo.value,
            mensagem: form.mensagem.value,
            imagemUrl: form.imagemUrl.value,
            videoUrl: form.videoUrl.value,
            videoComSom: form.videoComSom.checked,
            turno: form.turno.value // Capturando o valor selecionado no dropdown
        };

        fetch('/api/informativo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            loadInformativos();
            form.reset();
        });
    });

    // Inicializa o carregamento dos informativos
    loadInformativos();
});
