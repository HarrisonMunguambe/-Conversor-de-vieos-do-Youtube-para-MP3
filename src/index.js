import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { useRef, useState } from "react";
import axios from "axios";
import { youtube_parser } from "./utils";

function App() {
  const inputURLRef = useRef();
  const [urlResult, setUrlResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputURLRef.current.value);

    const youtubeID = youtube_parser(inputURLRef.current.value);
    console.log(youtubeID);

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
      .then((res) => setUrlResult(res.data.link))
      .catch((err) => console.log(err));

    inputURLRef.current.value = "";
  };
  return (
    <div className="app">
      <span className="about">
        <a href="mailto:harrison.munguambe17@gmail.com">
          Desenvolvido por Harrison Munguambe.
        </a>
      </span>
      <section className="content">
        <h1 className="content_title">
          {" "}
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
          {urlResult ? (
            <a
              href={urlResult}
              target="_blank"
              rel="noreferrer"
              className="download_btn"
            >
              Baixar o MP3
            </a>
          ) : (
            " "
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
