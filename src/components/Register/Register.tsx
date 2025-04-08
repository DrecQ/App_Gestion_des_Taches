import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { FaGoogle } from 'react-icons/fa';
import './Register.css';

interface FormData {
  username: string;
  email: string;
  password: string;
  profession: string;
  gender: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    profession: '',
    gender: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.username.trim()) newErrors.username = 'Le pseudo est requis';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email invalide';
    if (formData.password.length < 6) newErrors.password = '6 caractères minimum';
    if (!formData.profession) newErrors.profession = 'Choisissez une profession';
    if (!formData.gender) newErrors.gender = 'Choisissez un genre';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
  
    try {
      // Simulation de traitement asynchrone
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password, // Note: En production, hasher le mot de passe
        profession: formData.profession,
        gender: formData.gender,
        createdAt: new Date().toISOString()
      };
  
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  
      // Vérifier si l'email existe déjà
      if (existingUsers.some((user: any) => user.email === formData.email)) {
        setErrors({ email: 'Cet email est déjà utilisé' });
        return;
      }
  
      // Sauvegarder l'utilisateur dans le localStorage sans le connecter directement
      localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
  
      // Naviguer vers la page de connexion ou une autre page
      navigate('/login');
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setErrors({ email: "Une erreur s'est produite" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Simulation de l'inscription Google
    setTimeout(() => {
      localStorage.setItem('currentUser', JSON.stringify({
        name: 'Utilisateur Google',
        email: `${formData.email || 'google-user'}@google.com`,
        isGoogleUser: true
      }));
      navigate('/');
    }, 1000);
  };

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Pseudo *</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
            autoComplete="username"
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            autoComplete="email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="profession">Profession *</label>
          <select
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            className={errors.profession ? 'error' : ''}
          >
            <option value="">Sélectionnez...</option>
            <option value="etudiant">Étudiant</option>
            <option value="employe">Employé</option>
            <option value="freelance">Freelance</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="retraite">Retraité</option>
            <option value="autre">Autre</option>
          </select>
          {errors.profession && <span className="error-message">{errors.profession}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mot de passe *</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            autoComplete="new-password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <fieldset className={`form-group radio-group ${errors.gender ? 'error' : ''}`}>
          <legend>Genre *</legend>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              Masculin
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Féminin
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleChange}
              />
              Autre
            </label>
          </div>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </fieldset>
        
        <button 
          type="submit" 
          className="register-button"
          disabled={isLoading}
        >
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>

      <div className="auth-links">
        <p>Déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
      </div>
    </div>
  );
};

export default Register;