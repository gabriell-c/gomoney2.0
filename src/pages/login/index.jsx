import { useState, useEffect } from 'react';
import './style.css';
import Logo from '/logotipo_gomoney.webp';
import { useNavigate } from 'react-router-dom'; // se estiver usando react-router

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      // Opcional: checar validade do token via backend
      navigate('/'); // redireciona para a home
    }
  }, []);

  // States for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Dark mode ativado por padrão

  const isFormValid = email.trim() !== '' && password.length >= 8

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://gomoney-backend.onrender.com/login_action.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });
    
      const text = await response.text(); // 👈 pega a resposta como texto bruto
      console.log("Resposta bruta do backend:", text); // 👈 LOGA isso
    
      // Tenta converter pra JSON só se quiser seguir o fluxo
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Resposta do backend não é JSON. Veja o log acima.");
      }
    
      if (response.ok) {
        console.log("Login bem-sucedido:", data);
        if (rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }
        navigate("/");
      } else {
        console.error("Erro no login:", data.message || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setIsSubmitting(false);
    }
    
  };
    
  // Initialize dark mode
    useEffect(() => {
      // Forçar dark mode inicialmente
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');

      // Observar mudanças no sistema (opcional)
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        if (!localStorage.getItem('theme')) {
          setDarkMode(e.matches);
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      };
      mediaQuery.addEventListener('change', handleSystemThemeChange);

      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };



  return (
    <div className="bg-gray-50 dark:bg-dark-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md ">
        {/* Logo and Title */}
        <div className="text-center mb-8 flex flex-col items-center justify-center ">
            <div className="  w-[250px] flex items-center justify-center rounded-xl mr-3">
                <img src={Logo} alt="Logo"/>
            </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Faça login para acessar sua conta
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Entrar
            </h2>
            
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400"></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-800 dark:text-white smooth-transition input-focus focus:outline-none focus:ring-0"
                    placeholder="seu@email.com"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-800 dark:text-white smooth-transition input-focus focus:outline-none focus:ring-0"
                    placeholder="••••••••"
                    required
                    minLength="8"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="custom-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Lembrar-me
                  </label>
                </div>
                <div>
                  <a href="#" className="text-sm text-primary-light hover:text-primary-dark font-medium smooth-transition">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 smooth-transition floating-btn flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </>
                )}
              </button>
            </form>
            
            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Não tem uma conta? 
                <a href="/cadastro" className="text-primary-light hover:text-primary-dark font-medium smooth-transition"> Cadastre-se</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white dark:bg-dark-700 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 smooth-transition"
          >
            {darkMode ? (
              <i className="fas fa-sun text-yellow-300"></i>
            ) : (
              <i className="fas fa-moon"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;