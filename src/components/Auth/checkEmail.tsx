"use client";

import { useState } from "react";
import axios from "axios";

export default function CheckEmail({ onEmailValidated }: { onEmailValidated: (email: string, exists: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckEmail = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post("/api/auth/check-email", { email });

      if (data.exists) {
        onEmailValidated(email, true, data.name); // Usuario encontrado
      } else {
        setMessage(data.message);
      }
    } catch (error) {
       setMessage(error.response?.data?.message || "Error al verificar el correo.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-black">Verificar correo</h2>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md text-black"
      />
      <button
        onClick={handleCheckEmail}
        className="w-full bg-blue-500 text-black py-2 mt-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Verificando..." : "Continuar"}
      </button>
      {message && <p className="mt-2 text-sm text-black">{message}</p>}
    </div>
  );
}

