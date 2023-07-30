import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ScaleLoader } from "react-spinners";
import "./index.css";
import { youtube_parser } from "./utils";
import axios from "axios";

function App() {
  const inputURLRef = useRef();
  const [urlResult, setUrlResult] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controlar o efeito de loading
  const [videoNotFound, setVideoNotFound] = useState(false); // Estado para controlar a mensagem de vídeo não encontrado

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o efeito de loading enquanto aguarda a resposta da API
    setVideoNotFound(false); // Reseta o estado videoNotFound

    const youtubeID = youtube_parser(inputURLRef.current.value);

    const options = {
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
    axios(options)
      .then((res) => {
        setLoading(false); // Desativa o efeito de loading quando a resposta da API é obtida
        if (res.data.error) {
          setVideoNotFound(true); // Define o estado videoNotFound como true se o vídeo não for encontrado
        } else {
          setUrlResult(res.data.link);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Certifique-se de desativar o efeito de loading em caso de erro
      });

    inputURLRef.current.value = "";
  };

  const handleDownloadClick = () => {
    if (urlResult) {
      // Oculta o botão de download após o clique
      setUrlResult(null);
    }
  };

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
          <input
            ref={inputURLRef}
            placeholder="Copie e cole aqui o link do vídeo"
            className="form_input"
            type="text"
          />
          <button type="submit" className="form_button">
            Pesquisar
          </button>
          {/* Renderiza a mensagem de vídeo não encontrado se o estado "videoNotFound" for true */}
          {videoNotFound && !loading && (
            <div className="download_btn">Vídeo indisponível</div>
          )}
          {/* Renderiza o efeito de loading se o estado "loading" for true */}
          {loading && (
            <div className="loading">
              <ScaleLoader size={10} color={"#333"} loading={true} />
            </div>
          )}
          {/* Renderiza o link de download apenas se "urlResult" for verdadeiro */}
          {urlResult && !loading && !videoNotFound && (
            <a
              href={urlResult}
              target="_blank"
              rel="noreferrer"
              className="download_btn a"
              onClick={handleDownloadClick}
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
