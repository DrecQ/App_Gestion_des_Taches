import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { FaGoogle } from 'react-icons/fa';
import './Login.css';

interface User {
  username: string;
  email: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulation de vérification avec délai
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify({
          name: foundUser.username,
          email: foundUser.email,
          lastLogin: new Date().toISOString()
        }));
        navigate('/');
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      setError('Une erreur est survenue');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogin = () => {
    // Simulation OAuth avec redirection
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('currentUser', JSON.stringify({
        name: 'Utilisateur',
        email: `${email || 'utilisateur'}@google.com`,
        isGoogleUser: true,
        lastLogin: new Date().toISOString()
      }));
      navigate('/');
    }, 1000);
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="separator">
        <span>Ou</span>
      </div>

      <div className="social-login">
        <button 
          type="button" 
          onClick={handleUserLogin}
          className="google-button"
          disabled={isLoading}
        >
          {/* <FaGoogle className="google-icon" /> */}
          Continuer sans compte
        </button>
      </div>

      <div className="auth-links">
        <Link to="/forgot-password" className="auth-link">
          Mot de passe oublié ?
        </Link>
        <span className="auth-link-separator">•</span>
        <Link to="/register" className="auth-link">
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

export default Login;