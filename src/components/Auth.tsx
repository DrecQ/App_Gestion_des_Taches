import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const Auth: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Compte créé !");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connecté !");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert("Déconnecté !");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">
          {isRegister ? "Créer un compte" : "Se connecter"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Adresse email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            className="btn btn-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "J'ai déjà un compte" : "Créer un compte"}
          </button>
        </div>

        <div className="text-center">
          <button
            className="btn btn-outline-danger btn-sm mt-2"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
