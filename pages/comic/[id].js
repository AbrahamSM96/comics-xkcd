import Head from "next/head";
import { Header } from "components/Header";
import Image from "next/image";
import { readFile, stat } from "fs/promises";
import fs from "fs/promises";
import Link from "next/link";
import { basename } from "path";
export default function Comic({
  img,
  alt,
  title,
  width,
  height,
  nextId,
  prevId,
  hasNext,
  hasPrevious,
}) {
  return (
    <>
      <Head>
        <title>xkcd - Comics for developers</title>
        <meta name="description" content="Comics for developers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <section className="max-w-lg m-auto">
          <h1 className="font-bold text-xl text-center mb-4">{title}</h1>
          <div className="max-w-xs m-auto mb-4">
            <Image
              layout="responsive"
              width={width}
              height={height}
              src={img}
              alt={alt}
            />
          </div>

          <p>{alt}</p>
          <div className="flex justify-between mt-4 font-bold ">
            {hasPrevious && (
              <Link href={`/comic/${prevId}`}>
                <a className="text-gray-600"> ← Previous</a>
              </Link>
            )}
            {hasNext && (
              <Link href={`/comic/${nextId}`}>
                <a className="text-gray-600">Next →</a>
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const files = await fs.readdir("./comics");
  let paths = [];
  // locales --> ["es", "en"]
  locales.forEach((locale) => {
    paths = paths.concat(
      files.map((file) => {
        const id = basename(file, ".json");
        return { params: { id }, locale };
      }),
    );
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  const content = await readFile(`./comics/${id}.json`, "utf8");
  const comic = JSON.parse(content);

  const idNumber = +id;
  const prevId = idNumber - 1;
  const nextId = idNumber + 1;
  // STAT nos dira si existe o no un archivo
  // allSettled resolvera la promesa aunque uno no funcione y el otro si
  const [prevResult, nextResult] = await Promise.allSettled([
    stat(`./comics/${prevId}.json`),
    stat(`./comics/${nextId}.json`),
  ]);

  const hasPrevious = prevResult.status === "fulfilled";
  const hasNext = nextResult.status === "fulfilled";
  // Manera de hacer peticion a la api externa
  //   const response = await fetch(`https://xkcd.com/${id}/info.0.json`);
  //   const json = await response.json();
  //   console.log(json);

  //   const promisesReadFiles = latestComicsFiles.map(async (file) => {
  //     const content = await fs.readFile(`./comics/${file}`, "utf8");
  //     return JSON.parse(content);
  //   });
  //   const latestComics = await Promise.all(promisesReadFiles);
  return {
    props: {
      ...comic,
      hasNext,
      hasPrevious,
      nextId,
      prevId,
    },
  };
}
