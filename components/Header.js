import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
export function Header() {
  const [results, setResults] = useState([]);
  const searchRef = useRef();
  const { locale, locales } = useRouter();

  const getValue = () => searchRef.current?.value;

  const handleChange = () => {
    const q = getValue();
    if (!q) return;

    fetch(`/api/search?q=${q}`)
      .then((res) => res.json())
      .then((searchResults) => {
        setResults(searchResults);
      });
  };

  const restOfLocales = locales.filter((l) => l !== locale);

  return (
    <header className="flex justify-between items-center p-4 max-w-xl m-auto">
      <h1 className="font-bold">
        <Link href="/">
          <a className="transition hover:opacity-80">
            next<span className="font-light">xkcd</span>
          </a>
        </Link>
      </h1>

      <nav>
        <ul className="flex flex-row gap-2">
          <li>
            <Link href="/">
              <a className="text-sm font-bold">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/" locale={restOfLocales[0]}>
              <a className="text-sm font-semibold">{restOfLocales[0]}</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
