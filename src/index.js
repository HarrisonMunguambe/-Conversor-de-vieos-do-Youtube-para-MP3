// importar bibliotecas que vamos usar
import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ScaleLoader } from "react-spinners";
import "./index.css";
import { youtube_parser } from "./utils";
import axios from "axios";

//componete App.
function App() {
  const inputURLRef = useRef(); // criar e declarar a variavel que vai controlar o que e introduzido no input do formulario
  // Referência para o input do formulário

  const [urlResult, setUrlResult] = useState(null);
  // Estado para armazenar a URL do vídeo
  //criar um array com 2 elementos que urlResult vai ser o elemento que vai armazenar a url e o setUrlResult vai colocar o estado como ativo ou nao, por isso iniciamos com null.
  const [loading, setLoading] = useState(false); // Estado para controlar o efeito de loading, loading e o elemento para armazenar o efeito e steLoading vai estar a controlar se esta ativo ou nao.
  const [videoNotFound, setVideoNotFound] = useState(false); // Estado para controlar a mensagem de vídeo não encontrado

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // evitar o comportamento padrão de atualizar a página quando o formulário é enviado

    setLoading(true); // Ativa o efeito de loading enquanto aguarda a resposta da API, logo que recebe ela passa a true que e trocada abixo no code

    setVideoNotFound(false); // Reseta o estado videoNotFound

    const youtubeID = youtube_parser(inputURLRef.current.value); // colocar na constante youtubeID o input recebido e cortado pelo metodo youtube_parser.

    const options = {
      // Configurações para fazer a chamada à API de download do YouTube
      method: "get",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      headers: {
        "X-RapidAPI-Key": "654bd586b0mshbe900228081150dp147081jsn9954fe376dbf",
        "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
      },
      params: {
        id: youtubeID,
      },
    };
    // Faz a chamada à API e trata a resposta
    axios(options)
      .then((res) => {
        setLoading(false); // Desativa o efeito de loading quando a resposta da API é obtida
        if (res.data.error) {
          setVideoNotFound(true); // Define o estado videoNotFound como true se o vídeo não for encontrado
        } else {
          // Define a URL do vídeo para possibilitar o download
          setUrlResult(res.data.link);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Certifique-se de desativar o efeito de loading em caso de erro
      });

    inputURLRef.current.value = ""; // colocar a input do campo de input limpa logo depois de clicar pesquisar
  };

  const handleDownloadClick = () => {
    if (urlResult) {
      // Oculta o botão de download após o clique
      setUrlResult(null); // vai passar setUrlResult para null e assim o botao de dowload nao sera exibido
    }
  };
  // o que o componente vai retornar
  return (
    <div className="app">
      <span className="about">
        <a
          rel="noreferrer"
          target="_blank"
          href="mailto:harrison.munguambe17@gmail.com"
        >
          Desenvolvido por Harrison Munguambe.
        </a>
      </span>
      <section className="content">
        <h1 className="content_title">
          Conversor de vídeos do Youtube para MP3
        </h1>
        <p className="content_description">
          Converta vídeos do Youtube para MP3 e baixe gratuitamente.
        </p>

        <form onSubmit={handleSubmit} className="form">
          {/* ao subemeter o formulario vai chamara funcao handleSubmit */}

          <input
            ref={inputURLRef} // vai colocar como link/ valor do input o link que foi cortado pela metodo exterior
            placeholder="Copie e cole aqui o link do vídeo"
            className="form_input"
            type="text"
          />
          <button type="submit" className="form_button">
            Pesquisar
          </button>
          {/* Renderiza a mensagem de vídeo não encontrado se o estado "videoNotFound" for true */}
          {videoNotFound &&
            !loading && ( // se videoNotFound for true , e o efeito loading for false ele vai renderizar a div
              <div className="download_btn">Vídeo indisponível</div>
            )}
          {/* Renderiza o efeito de loading se o estado "loading" for true */}
          {loading && (
            <div className="loading">
              <ScaleLoader size={10} color={"#333"} loading={true} />
              {/* {componete da biblioteca react spinner para renderizar um efeito bonito de loading} */}
            </div>
          )}
          {/* Renderiza o link de download apenas se "urlResult" for verdadeiro se e loading e videoNotFound estiverem falsos e a nao serem renderizados*/}
          {urlResult && !loading && !videoNotFound && (
            <a
              href={urlResult}
              target="_blank"
              rel="noreferrer"
              className="download_btn a"
              onClick={handleDownloadClick}
              // verificar que o botao download vai ser removido depois de um download
            >
              Baixar o MP3
            </a>
          )}
        </form>
      </section>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
