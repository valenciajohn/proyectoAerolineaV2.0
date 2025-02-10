"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const origin = searchParams.get("origin");
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token no proporcionado.");
      return;
    }

    try {
      jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
    } catch (err) {
      setError("El enlace ha expirado.");
    }
  }, [token]);

  const handleVerification = (accepted: boolean) => {
    if (accepted) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>¿Confirma su autenticación?</h2>
      <button onClick={() => handleVerification(true)}>✅ Sí</button>
      <button onClick={() => handleVerification(false)}>❌ No</button>
    </div>
  );
}


