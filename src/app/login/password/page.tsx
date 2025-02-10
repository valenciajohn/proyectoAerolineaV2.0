"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email"); 
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("jwtToken");
    
    if (token && !isTokenExpired(token)) {
      router.push("/loading"); // Si ya tiene un token válido, enviarlo directo a loading
      return;
    }

    const validateUser = async () => {
      if (!email) {
        router.push("/login"); // Si no hay email en la URL, regresar al inicio
        return;
      }

      try {
        const response = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        
        if (data.exists) {
          setAuthorized(true);
          setName(data.name || "Usuario"); // Guardar el nombre recibido
        } else {
          alert("❌ Usted no está habilitado para esta sección.");
          router.push("/login"); // Redirigir al inicio
        }
      } catch (error) {
        console.error("Error validando usuario:", error);
        router.push("/login"); // Redirigir al inicio en caso de error
      }
    };

    validateUser();
  }, [email]);

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor ingresa ambos campos");
      return;
    }

    try {
      const response = await fetch('/api/auth/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
        
      if (response.ok) {
        // Si la autenticación es exitosa
        alert("Autenticación exitosa");
        console.log("userPhone:", data.celular); 
        console.log("Token guardado:", data.token);       
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("userPhone", data.phone); 
        router.push('/loading'); // Redirigir a la página de carga
      } else {
        // Si la autenticación falla
        alert(data.message || "Error al autenticar");
      }
    } catch (error) {
      console.error("Error en la solicitud", error);
      alert("Hubo un error al intentar validar la contraseña");
    }
  };

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Validando acceso...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold mb-4 text-black">
          Hi, {name}
        </h1>
        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Acceder
        </button>
        <p className="mt-4 text-sm text-blue-500 cursor-pointer text-center">
          ¿Olvidaste la contraseña?
        </p>
      </div>
    </div>
  );
}


