import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!displayName.trim()) {
      setError("Por favor, insira um nome de usuário.");
      return;
    }
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: displayName,
      });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          profile: {
            displayName: displayName,
            bio: "",
          },
          createdAt: new Date(),
        },
        { merge: true }
      );

      navigate("/");
    } catch (err) {
      console.error("Erro durante o registro:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Falha ao criar a conta. Tente novamente.");
      }
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center p-4 py-20 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-light-dark rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">
          Criar Conta
        </h2>
        {error && (
          <p className="text-center text-red-400 bg-red-900/20 p-3 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="displayName"
              className="text-sm font-bold text-gray-400 block mb-2"
            >
              Nome de Usuário
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-bold text-gray-400 block mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-400 block mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-brand-primary text-white font-bold rounded-md hover:bg-blue-500 transition-colors duration-300"
          >
            Cadastrar
          </button>
        </form>
        <div className="text-center text-brand-text-secondary">
          <p>
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-bold text-brand-primary hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
