import { useState, useEffect } from 'react';
import './style.css';
import Logo from '/logotipo_gomoney.webp';

const RegisterPage = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [birthdateDisplay, setBirthdateDisplay] = useState('DD/MM/AAAA');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState('Força da senha');
  const [passwordStrengthColor, setPasswordStrengthColor] = useState('text-gray-500');
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

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

  useEffect(() => {
    let strength = 0;
    const strengthTexts = ['Muito fraca', 'Fraca', 'Moderada', 'Forte', 'Muito forte'];
    const strengthColors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

    if (password.length >= 8) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;

    setPasswordStrength(strength);
    setPasswordStrengthText(strengthTexts[strength] || 'Força da senha');
    setPasswordStrengthColor(strengthColors[strength] || 'text-gray-500');
  }, [password]);

  useEffect(() => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setPasswordMatch(true);
      } else {
        setPasswordMatch(false);
      }
    } else {
      setPasswordMatch(null);
    }
  }, [password, confirmPassword]);

  const handleBirthdateChange = (e) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setBirthdateDisplay(`${day}/${month}/${year}`);
      setBirthdate(e.target.value);
    } else {
      setBirthdateDisplay('DD/MM/AAAA');
      setBirthdate('');
    }
  };

  const isFormValid = () => {
    return (
      fullname &&
      email &&
      password.length >= 8 &&
      password === confirmPassword &&
      birthdate &&
      terms
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("https://gomoney-backend.onrender.com/register_action.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          email,
          password,
          confirmPassword,  // Adiciona confirmPassword aqui
          birthdate,
          terms: terms ? 1 : 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Conta criada com sucesso! Redirecionando...");
        // Redirecionamento ou reset do formulário
      } else {
        console.log(data.message || "Erro desconhecido ao cadastrar");
      }
    } catch (error) {
      console.log("Erro na requisição: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);


  return (
    <div className="bg-gray-50 dark:bg-dark-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <div className="  w-[250px] flex items-center justify-center rounded-xl mr-3">
            <img src={Logo} alt="Logo"/>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Crie sua conta e comece a controlar suas finanças
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Criar conta
            </h2>
            
            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="mb-5">
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    id="fullname"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-800 dark:text-white smooth-transition input-focus focus:outline-none focus:ring-0"
                    placeholder="Seu nome completo"
                    required
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
              </div>
              
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
                <div className="mt-2 flex items-center">
                  <div className={`password-strength strength-${passwordStrength} rounded-full mr-2`}></div>
                  <span className={`text-xs ${passwordStrengthColor}`}>{passwordStrengthText}</span>
                </div>
                <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${password ? 'block' : 'hidden'}`}>
                  <p className="flex items-center">
                    <i className={`fas fa-check-circle ${hasLength ? 'text-green-500' : 'text-gray-400'} mr-1`}></i>
                    Mínimo 8 caracteres
                  </p>
                  <p className="flex items-center">
                    <i className={`fas fa-check-circle ${hasNumber ? 'text-green-500' : 'text-gray-400'} mr-1`}></i>
                    Pelo menos 1 número
                  </p>
                  <p className="flex items-center">
                    <i className={`fas fa-check-circle ${hasSpecialChar ? 'text-green-500' : 'text-gray-400'} mr-1`}></i>
                    Pelo menos 1 caractere especial
                  </p>
                </div>
              </div>
              
              {/* Confirm Password Input */}
              <div className="mb-5">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-800 dark:text-white smooth-transition input-focus focus:outline-none focus:ring-0"
                    placeholder="••••••••"
                    required
                    minLength="8"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <i className={`fas fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  {passwordMatch === true && (
                    <p className="text-xs password-match">
                      <i className="fas fa-check-circle mr-1"></i>
                      <span>As senhas coincidem</span>
                    </p>
                  )}
                  {passwordMatch === false && (
                    <p className="text-xs password-mismatch">
                      <i className="fas fa-times-circle mr-1"></i>
                      <span>As senhas não coincidem</span>
                    </p>
                  )}
                </div>
              </div>
              
              {/* Birth Date Input */}
              <div className="mb-6">
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de nascimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-calendar-alt text-gray-400"></i>
                  </div>
                  <input
                    type="date"
                    id="birthdate"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-800 dark:text-white smooth-transition input-focus focus:outline-none focus:ring-0 appearance-none"
                    required
                    onChange={handleBirthdateChange}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{birthdateDisplay}</p>
                <input type="hidden" id="birthdate-formatted" name="birthdate" value={birthdate} />
              </div>
              
              {/* Terms and Submit */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-dark-700 text-primary-light focus:ring-primary-light smooth-transition"
                      required
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                      Eu concordo com os <a href="#" className="text-primary-light hover:text-primary-dark font-medium">Termos de Serviço</a> e <a href="#" className="text-primary-light hover:text-primary-dark font-medium">Política de Privacidade</a>
                    </label>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 smooth-transition floating-btn flex items-center justify-center ${
                  !isFormValid() ? 'disabled-btn opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span>Criando conta...</span>
                  </>
                ) : (
                  <>
                    <span>Criar conta</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </>
                )}
              </button>
            </form>
            
            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Já tem uma conta? 
                <a href="/login" className="text-primary-light hover:text-primary-dark font-medium smooth-transition"> Faça login</a>
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

export default RegisterPage;