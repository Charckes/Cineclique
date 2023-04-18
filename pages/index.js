import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
export async function getServerSideProps() {
  try {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${randomNumber}?api_key=${process.env.API}`
    );
    const data = await res.json();
    if (data.title) {
      return { props: { filme: {
          title: data.title,
          overview: data.overview,
          backdrop_path: data.backdrop_path,
          poster_path: data.poster_path,
        } 
      } }
    } else {
      console.warn(`Filme não encontrado para o ID ${randomNumber}`);
      return { props: { filme: null } }
    }
  } catch (error) {
    console.log(error);
    return { props: { filme: null } }
  }
}

export default function Home({ filme }) {
  const [filmeAtual, setFilmeAtual] = useState(filme);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarCompleto, setMostrarCompleto] = useState(false);

  useEffect(() => {
    async function loadRandomMovie() {
      setIsLoading(true);
      try {
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${randomNumber}?api_key=${process.env.API}`
        );
        const data = await res.json();
        if (data.title) {
          setFilmeAtual({
            title: data.title,
            overview: data.overview,
            backdrop_path: data.backdrop_path,
            poster_path: data.poster_path,
          });
        } else {
          console.warn(`Filme não encontrado para o ID ${randomNumber}`);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }

    if (!filmeAtual) {
      loadRandomMovie();
    }
  }, [filmeAtual]);

  const handleMostrarCompleto = () => {
    setMostrarCompleto(!mostrarCompleto);
  };

  const handleClick = async () => {
    setIsLoading(true);
    let found = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (!found && attempts < MAX_ATTEMPTS) {
      try {
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${randomNumber}?api_key=${process.env.API}`
        );
        const data = await res.json();
        if (data.title) {
          setFilmeAtual({
            title: data.title,
            overview: data.overview,
            backdrop_path: data.backdrop_path,
            poster_path: data.poster_path,
          });
          found = true;
        } else {
          console.warn(`Filme não encontrado para o ID ${randomNumber}`);
        }
      } catch (error) {
        console.log(error);
      }
      attempts++;
    }

    if (!found) {
      console.error(
        `Não foi possível encontrar um filme após ${MAX_ATTEMPTS} tentativas.`
      );
    }

    setIsLoading(false);
  };
  const textoResumido = filmeAtual?.overview?.slice(0, 500);

  return (
    <>
      <Head>
        <title>Cineclique</title>
        <meta name="description" content="Gerador de filme aleatório." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : filmeAtual ? (
        <div className={styles.filme}>
          <Image
            className={styles.backdrop}
            src={`https://image.tmdb.org/t/p/w500/${filmeAtual.backdrop_path}`}
            alt={filmeAtual.title}
            priority
            width={1920}
            height={1080}
          />
          <div className={styles.info}>
            <Image
              className={styles.poster}
              src={`https://image.tmdb.org/t/p/w500/${filmeAtual.poster_path}`}
              alt={filmeAtual.title}
              width={250}
              height={300}
              priority
            />
            <div className={styles.texts}>
              <p className={styles.title}>{filmeAtual.title}</p>
              <p className={styles.overview}>
                {mostrarCompleto ? filmeAtual.overview : textoResumido}
                {textoResumido.length < filmeAtual.overview.length && (
                  <button
                    className={styles.buttonLer}
                    onClick={handleMostrarCompleto}
                  >
                    {mostrarCompleto ? "(Ler menos)" : "...Ler mais"}
                  </button>
                )}
              </p>
            </div>
            <div className={styles.containerButton}>
              <button className={styles.button} onClick={handleClick}>
                Gerar filme aleatório
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.default}>
          <h2 className={styles.h2}>Clique no botão para gerar um filme</h2>

          <button className={styles.button} onClick={handleClick}>
            Gerar filme aleatório
          </button>
        </div>
      )}
    </>
  );
}


