"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [protectedLinkId, setProtectedLinkId] = useState("");
  const [message, setMessage] = useState("");

  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const handleProtectLink = async () => {
    if (!isValidUrl(inputValue)) {
      setMessage("The link must start with http or https");
      return;
    }

    try {
      const res = await fetch("/api/protected-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalLink: inputValue }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setMessage(data.error || "Erreur lors de la protection du lien");
      } else {
        setProtectedLinkId(data.id);
        setMessage("Lien protégé avec succès !");
      }
    } catch (error) {
      console.error(error);
      setMessage("Une erreur s'est produite lors de la création du lien.");
    }
  };

  return (
    <div className="mx-auto text-center m-10">
      <h1 className="text-xl mb-5">Protect your link easily</h1>

      <input
        type="url"
        placeholder="https://exemple.com"
        color="black"
        className="mb-5 border p-2 text-black bg-white rounded"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <div className="mb-5">Saisie actuelle : {inputValue || "Aucune"}</div>

      <button
        onClick={handleProtectLink}
        className="bg-blue-800 px-4 py-2 rounded text-white mr-4 "
      >
        Protect this link
      </button>

      {protectedLinkId && (
        <div className="mt-4">
          <strong>http://localhost:3000/links/{protectedLinkId}</strong>
        </div>
      )}

      {message && <div className="mt-4 text-red-500">{message}</div>}
    </div>
  );
}
