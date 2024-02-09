document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("informativoForm");
    const informativoList = document.getElementById("informativoList");
    const inputImagemFile = document.getElementById("imagemFile");
    const inputImagemUrl = document.getElementById("imagemUrl");
    const inputTitulo = document.getElementById("titulo");
    const inputMensagem = document.getElementById("mensagem");
    const inputVideoUrl = document.getElementById("videoUrl");
    const inputVideoComSom = document.getElementById("videoComSom");
    const inputTurno = document.getElementById("turno");
    const mensagemFooterForm = document.getElementById("mensagemFooterForm");
    const textoMensagem = document.getElementById("textoMensagem");
    const mensagemList = document.getElementById("mensagemList");
    let editandoId = null;
    
    // Manipulador de eventos para o novo formulário de mensagem do footer

    mensagemFooterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        fetch("/api/informativo/mensagemFooter", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: textoMensagem.value })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Falha ao enviar a mensagem do footer");
            }
            return response.json();
        })
        .then(data => {
            alert("Mensagem do footer atualizada com sucesso!");
            textoMensagem.value = ""; // Limpa o campo após o envio
        })
        .catch(error => {
            alert(error.message);
        });
    });

    // Função para buscar e exibir a mensagem do rodapé atual
    function carregarMensagemAtual() {
      fetch('/api/informativo/mensagemAtual') // Rota para buscar a mensagem atual
          .then(response => {
              if (!response.ok) {
                  throw new Error('Falha ao carregar a mensagem.');
              }
              return response.json();
          })
          .then(data => {
              mensagemList.textContent = data.texto || 'Nenhuma mensagem no momento.';
          })
          .catch(error => {
              console.error('Erro ao carregar a mensagem:', error);
              mensagemList.textContent = 'Erro ao carregar a mensagem.';
          });
    }

    // Manipulador de eventos para o formulário de mensagem do rodapé
    mensagemFooterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        fetch('/api/informativo/mensagemFooter', { // Rota para enviar a nova mensagem
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: textoMensagem.value })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao enviar a mensagem do footer.');
            }
            return response.json();
        })
        .then(data => {
            alert("Mensagem do footer atualizada com sucesso!");
            textoMensagem.value = "";
            carregarMensagemAtual(); // Recarrega a mensagem atual
        })
        .catch(error => {
            alert(error.message);
        });
    });

    carregarMensagemAtual();

    //Envio informativo para o banco de dados
    function loadInformativos() {
      fetch("/api/informativo")
        .then((response) => response.json())
        .then((data) => {
          informativoList.innerHTML = "";
          data.forEach((informativo) => {
            const turno =
              informativo.turno === "matutino"
                ? "Matutino"
                : informativo.turno === "vespertino"
                ? "Vespertino"
                : "Ambos";
            let videoContent = "";
  
            if (informativo.videoUrl) {
              if (informativo.videoUrl.includes("youtube")) {
                const videoId = informativo.videoUrl.split("v=")[1];
                const autoplay = "&autoplay=1";
                const loop = "&loop=1";
                const mute = informativo.videoComSom ? "" : "&mute=1";
                const embedUrl = `https://www.youtube.com/embed/${videoId}?playlist=${videoId}${autoplay}${loop}${mute}&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0`;
  
                videoContent = `<iframe width="100%" height="480" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
              } else {
                videoContent = `<video src="${informativo.videoUrl}" ${
                  informativo.videoComSom ? "controls" : "muted"
                } loop autoplay></video>`;
              }
            }
  
            informativoList.innerHTML += `
                          <div class="informativo-container">
                              <h3>${informativo.titulo}</h3>
                              <p>${informativo.mensagem}</p>
                              ${
                                informativo.imagemUrl
                                  ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo" class="informativo-imagem">`
                                  : ""
                              }
                              ${videoContent}
                              <span class="turno-indicacao">${turno}</span>
                              <button class="delete-button" onclick="deleteInformativo(${
                                informativo.id
                              })">Excluir</button>
                              <button class="edit-button" onclick="editInformativo(${
                                informativo.id
                              })">Editar</button>
                          </div>`;
          });
        });
    }
  
    function deleteInformativo(id) {
      fetch(`/api/informativo/${id}`, { method: "DELETE" }).then((response) => {
        if (response.ok) {
          loadInformativos();
        } else {
          alert("Erro ao excluir o informativo");
        }
      });
    }
  
    window.deleteInformativo = deleteInformativo;
  
    function editInformativo(id) {
      fetch(`/api/informativo/${id}`)
        .then((response) => response.json())
        .then((informativo) => {
          inputTitulo.value = informativo.titulo;
          inputMensagem.value = informativo.mensagem;
          inputImagemUrl.value = informativo.imagemUrl || "";
          inputVideoUrl.value = informativo.videoUrl || "";
          inputVideoComSom.checked = informativo.videoComSom || false;
          inputTurno.value = informativo.turno;
          editandoId = id;
  
          // Mover a tela para o topo
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          console.error("Erro ao carregar informativo para edição", error);
        });
    }
  
    window.editInformativo = editInformativo;
  
    inputImagemFile.addEventListener("change", function () {
      if (this.files.length > 0 && this.files[0].size > 3145728) {
        alert("O arquivo é muito grande! O tamanho máximo é de 3MB.");
        this.value = "";
      } else if (this.files.length > 0) {
        const formData = new FormData();
        formData.append("imagem", this.files[0]);
  
        fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            inputImagemUrl.value = data.imageUrl;
          })
          .catch((error) => {
            alert("Erro ao fazer upload da imagem");
          });
      }
    });
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      let formData = new FormData(form);
  
      // Se estiver editando, incluir o ID de edição
      if (editandoId !== null) {
        formData.append("id", editandoId);
      }
  
      // Log para depuração
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      fetch("/api/informativo", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Falha ao enviar o informativo");
          }
          return response.json();
        })
        .then((data) => {
          loadInformativos();
          form.reset();
          editandoId = null;
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  
    loadInformativos();
  });
  