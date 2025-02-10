"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_BASE_URL); // Cambiar en producción

const LoadingPage = () => {
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('Usuario');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const phone = localStorage.getItem('userPhone');

    if (!token || !phone || isTokenExpired(token)) {
      localStorage.removeItem('jwtToken'); // Borrar token expirado
      localStorage.removeItem('userPhone');
      router.push('/login'); // Redirigir si no hay token válido
      return;
    } else {
      setUserPhone(phone);
      const decoded: any = jwtDecode(token);
      if (decoded?.name) setUserName(decoded.name); // Extraer el nombre del token
    }
    
    socket.on("mfaVerified", (data) => {
      if (data.phone === phone) {
        if (data.accepted) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    });

    return () => socket.disconnect();
  }, [router]);

  useEffect(() => {
    const sendSMS = async () => {
      try {
        const response = await fetch('/api/auth/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: userPhone, name: userName }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('SMS enviado con éxito:', data.message);
        } else {
          console.error('Error enviando SMS:', data.error);
        }
      } catch (error) {
        console.error('Error en la solicitud de SMS:', error);
      }
    };

    if (userPhone) sendSMS();
  }, [userPhone, userName]);

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Si la fecha de expiración es menor a ahora, está expirado
    } catch (error) {
      return true;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone ? `${phone.slice(0, 2)}*****${phone.slice(-2)}` : '';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Cargando...</h1>
      <p>Verifica tu número de teléfono terminado en  {formatPhoneNumber(userPhone)}</p>
      <p>Por favor, revisa tu celular para continuar.</p>
    </div>
  );
};

export default LoadingPage;


