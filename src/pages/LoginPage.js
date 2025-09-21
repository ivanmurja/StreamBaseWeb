import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists() || !userDocSnap.data().profile) {
        await setDoc(
          userDocRef,
          {
            profile: {
              displayName: user.displayName || user.email,
              bio: "",
            },
            createdAt: new Date(),
          },
          { merge: true }
        );
      }

      navigate("/");
    } catch (err) {
      setError("Falha ao fazer login. Verifique seu e-mail e senha.");
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center p-4 py-20 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-light-dark rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>
        {error && (
          <p className="text-center text-red-400 bg-red-900/20 p-3 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            Entrar
          </button>
        </form>
        <div className="text-center text-brand-text-secondary">
          <p>
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="font-bold text-brand-primary hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
