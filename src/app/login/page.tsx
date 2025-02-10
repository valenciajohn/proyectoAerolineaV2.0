"use client";

import { useRouter } from "next/navigation";
import CheckEmail from "@/components/Auth/checkEmail";

export default function LoginPage() {
  const router = useRouter();

  const handleEmailValidated = (email: string, exists: boolean, name?: string) => {
    if (exists) {
      console.log(`✅ Usuario ${email} encontrado. Redirigiendo a contraseña...`);
      
      const encodedName = encodeURIComponent(name || "Usuario");
    
      setTimeout(() => {
        router.push(`/login/password?email=${email}&name=${encodedName}`);
      }, 500);
    } else {
      console.log(`El email ${email} fue agregado a suscriptores.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <CheckEmail onEmailValidated={handleEmailValidated} />
    </div>
  );
}

