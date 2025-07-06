// App.js
import React, { useState, useEffect, useRef  } from 'react';
import Logo from '/logotipo_gomoney.webp';
import IconeLogo from '/isotipo_gomoney.webp';
import { data, Link, useNavigate } from 'react-router-dom'
import Hamburger from 'hamburger-react'
import './style.css';
import { jwtDecode } from 'jwt-decode';
import { FaGear } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import Footer from '../../components/footer';




function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [open, setOpen2] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [datas, setDatas] = useState([]);

    const handleLogout = () => {
    // Remove o token (ou dados do usuário)
    localStorage.removeItem('token'); // ou sessionStorage.removeItem('token')

    // Redireciona para a página de login ou home
    navigate('/login'); // ou '/' se quiser ir para a home
  };


  const toggleDrawer = (state) => () => {
    setOpen2(state);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };
 
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Token encontrado:', token);

    if (!token) {
      console.log('Nenhum token encontrado, redirecionando...');
      navigate('/login', { replace: true });
      return;
    }


  

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp < Date.now() / 1000;

      if (isExpired) {
        console.log('Token expirado');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
    }


      fetch('https://gomoney-backend.onrender.com/get_items.php', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(async res => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || 'Falha na autenticação');
            }
            return res.json();
          })
          .then(data => {
            if (data.status !== 'success') {
              console.warn('Resposta inesperada do backend:', data.message);
              setDatas([]);
            } else {
              setDatas(data.items || []);
            }
            setLoading(false);
          })
          .catch(err => {
            console.error('Erro ao buscar dados:', err.message);
            setError(err.message);
            setDatas([]);
            setLoading(false);
          });

      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login', { replace: true });
      }



       const fetchUser = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        try {
          const res = await fetch('https://gomoney-backend.onrender.com/auth.php', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const data = await res.json();
          console.log('Resposta do auth.php:', data);

          if (data.status === 'success') {
            setUser(data.user);
          } else {
            console.warn('Erro ao buscar user:', data.message);
          }

        } catch (err) {
          console.error('Erro ao buscar dados do user:', err);
        }
      };

      fetchUser();
    }, [navigate]);

    






  
  //////////////////////////////////////////
  
  const [darkMode, setDarkMode] = useState(false);
  // const [checked, setChecked] = useState(true);
  const [transactions, setTransactions] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [showCustomDateFilters, setShowCustomDateFilters] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('month');
  const [isOpen, setOpen] = useState(false)
  
  const pieChartRef = useRef(null);

  const expenseCategories = [
    { value: 'food', label: 'Alimentação', icon: 'fa-utensils', color: 'text-red-500' },
    { value: 'transport', label: 'Transporte', icon: 'fa-bus', color: 'text-blue-500' },
    { value: 'housing', label: 'Moradia', icon: 'fa-home', color: 'text-indigo-500' },
    { value: 'education', label: 'Educação', icon: 'fa-graduation-cap', color: 'text-purple-500' },
    { value: 'health', label: 'Saúde', icon: 'fa-heart', color: 'text-pink-500' },
    { value: 'leisure', label: 'Lazer', icon: 'fa-gamepad', color: 'text-green-500' },
    { value: 'internet', label: 'Internet', icon: 'fa-wifi', color: 'text-yellow-500' },
    { value: 'electricity', label: 'Luz', icon: 'fa-lightbulb', color: 'text-yellow-400' },
    { value: 'water', label: 'Água', icon: 'fa-tint', color: 'text-blue-400' },
    { value: 'others', label: 'Outros', icon: 'fa-ellipsis-h', color: 'text-gray-500' }
  ];

  const incomeCategories = [
    { value: 'salary', label: 'Salário', icon: 'fa-money-bill-wave', color: 'text-green-500' },
    { value: 'freelance', label: 'Freelance', icon: 'fa-laptop-code', color: 'text-blue-500' },
    { value: 'investments', label: 'Investimentos', icon: 'fa-chart-line', color: 'text-teal-500' },
    { value: 'sales', label: 'Vendas de Bens', icon: 'fa-tags', color: 'text-purple-500' },
    { value: 'extra', label: 'Rendimentos Extras', icon: 'fa-coins', color: 'text-yellow-500' },
    { value: 'refunds', label: 'Reembolsos', icon: 'fa-receipt', color: 'text-indigo-500' },
    { value: 'others', label: 'Outros', icon: 'fa-ellipsis-h', color: 'text-gray-500' }
  ];




  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch('https://gomoney-backend.onrender.com/get_items.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (data.status === 'success') {
        setDatas(data.items);
      } else {
        console.error('Erro ao buscar itens:', data.message);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };
  
  useEffect(() => {
    fetchItems();
  }, []);
  



  useEffect(() => {

    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(chartScript);


    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Cleanup
    return () => {
      document.head.removeChild(chartScript);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Update chart when data or period changes
    updateChart();
  }, [transactions, chartPeriod, filterPeriod, customStartDate, customEndDate, darkMode]);

  function formatCurrency(value) {
    if (!value) return 'R$ ' + 0;
  
    // Se o valor já estiver formatado, apenas retorne ele
    if (typeof value === 'string' && value.includes('R$')) {
      return value;
    }
  
    // Convertendo para número e formatando
    const formattedValue = parseFloat(value).toFixed(2);
    return `R$ ${formattedValue.replace('.', ',')}`;
  }
  

  const parseCurrency = (value) => {
    return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    if (filterPeriod === 'month') {
      const now = new Date();
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      });
    } else if (filterPeriod === 'last-month') {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.dat);
        return transactionDate.getMonth() === lastMonth.getMonth() && 
               transactionDate.getFullYear() === lastMonth.getFullYear();
      });
    } else if (filterPeriod === 'year') {
      const now = new Date();
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate.getFullYear() === now.getFullYear();
      });
    } else if (filterPeriod === 'custom' && customStartDate && customEndDate) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate >= new Date(customStartDate) && 
               transactionDate <= new Date(customEndDate);
      });
    }
    
    return filtered;
  };

  const updateTotals = () => {
    const filteredTransactions = filterTransactions();
    
    const totalIncome = filteredTransactions
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + t.valor, 0);
    
    return {
      entrada: totalIncome,
      saida: totalExpenses,
      balance: totalIncome - totalExpenses
    };
  };

  const openModal = (transaction = null) => {
    if (transaction) {
      // Formatar o valor de amount antes de definir o currentTransaction
      transaction.valor = formatCurrency(transaction.valor);
    }
    
    setCurrentTransaction(transaction);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setCurrentTransaction(null);
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Coleta os dados do formulário
    const transactionData = {
      id: formData.get('id'),
      titulo: formData.get('titulo'),
      tipo: formData.get('tipo'),
      categoria: formData.get('categoria'),
      data: formData.get('data'),
      valor: formData.get('valor').replace('R$', '').trim() // Remove o "R$" e espaços extras
    };
  
    // Envia para a API de adição ou edição de transação
    const url = transactionData.id ? 'https://gomoney-backend.onrender.com/update_item.php' : 'https://gomoney-backend.onrender.com/create_item.php';
    const method = transactionData.id ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData)
    });
  
    const data = await response.json();
    console.log('Resposta da API:', data);
    console.log('Dados enviados:', transactionData);
    console.log('Método:', method);
    console.log('URL:', url); 
    if (data.status === 'success') {
      // Fechar o modal e atualizar a lista de transações
      closeModal();
      await fetchItems();
      // fetchTransactions(); // Aqui você vai chamar uma função para atualizar a lista de transações no frontend
    } else {
      alert('Erro ao salvar transação: ' + data.message);
    }
  };

  useEffect(() => {
    if (datas && datas.length > 0) {
      const mappedTransactions = datas.map(item => ({
        id: item.id,
        titulo: item.titulo, // assumindo que seu campo é "titulo"
        tipo: item.tipo,    // assumindo que seu campo é "tipo" (income/expense)
        categoria: item.categoria, // assumindo que tenha
        data: item.data,     // assumindo que seja no formato yyyy-mm-dd
        valor: parseFloat(item.valor) // certifique-se que "valor" está correto
      }));
  
      setTransactions(mappedTransactions);
    }
  }, [datas]);  
  
  

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token'); // ou onde você estiver armazenando o JWT

      const response = await fetch('https://gomoney-backend.onrender.com/delete_item.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      const result = await response.json();

      if (result.status === 'success') {
        setTransactions(transactions.filter(t => t.id !== id));
        console.log('excluido com exito seu viado kkk')
        console.log(result)
      } else {
        console.log(result.message || 'Erro ao excluir item.');
      }
    } catch (error) {
      console.error(error);
      console.log('Erro ao conectar com o servidor.');
    }
  };
  

  const updateChart = () => {
    if (!window.Chart) return; // Ensure Chart.js is loaded
    
    const filteredTransactions = filterTransactions();
    
    let chartTransactions = [...filteredTransactions];
    const currentDate = new Date();
    
    if (chartPeriod === 'month') {
      chartTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate.getMonth() === currentDate.getMonth() && 
               transactionDate.getFullYear() === currentDate.getFullYear();
      });
    } else if (chartPeriod === 'year') {
      chartTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate.getFullYear() === currentDate.getFullYear();
      });
    }
    
    const expenseData = chartTransactions
      .filter(t => t.tipo === 'saida')
      .reduce((acc, t) => {
        const categoryLabel = expenseCategories.find(c => c.value === t.categoria)?.label || 'Outros';
        acc[categoryLabel] = (acc[categoryLabel] || 0) + t.valor;
        return acc;
      }, {});
    
    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);
    
    const backgroundColors = [
      'rgba(255, 107, 53, 0.8)',
      'rgba(110, 68, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(201, 203, 207, 0.8)',
      'rgba(255, 205, 86, 0.8)'
    ];
    
    const ctx = document.getElementById('pie-chart')?.getContext('2d');
    if (!ctx) return;
    
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }
    
    pieChartRef.current = new window.Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: darkMode ? '#fff' : '#333',
              font: {
                family: 'Poppins'
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: darkMode ? '#1A1A1A' : '#fff',
            titleColor: darkMode ? '#fff' : '#333',
            bodyColor: darkMode ? '#fff' : '#333',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: R$ ${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%',
        borderRadius: 8,
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  };


  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterPeriod(value);
    
    if (value === 'custom') {
      setShowCustomDateFilters(true);
      
      // Set default dates (current month)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setCustomStartDate(firstDay.toISOString().split('T')[0].substring(0, 7));
      setCustomEndDate(lastDay.toISOString().split('T')[0].substring(0, 7));
    } else {
      setShowCustomDateFilters(false);
    }
  };

  const { entrada, saida, balance } = updateTotals();
  const filteredTransactions = filterTransactions();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  console.log( datas, 'dados do home')

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-dark-900' : 'bg-light-800'}`}>
      {/* Header */}
      <header className=" w-full bg-light-900 dark:bg-dark-800 fixed shadow-sm max-md:py-1 py-4 px-6 flex justify-between items-center top-0 left-0 z-10 glass-dark">
        <div className="flex items-center">
          <div className=" max-md:w-[60px]  md:w-40 rounded-xl mr-3">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className='max-md:hidden'/>
              <img src={IconeLogo} alt="Logo" className='md:hidden' />
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="items-center space-x-2 hidden sm:flex">
            <FaUser className=' text-gray-700 dark:text-gray-300' />
            <span className="text-gray-700 dark:text-gray-300 font-medium ">{user?.fullname.split(' ')[0]}</span>
          </div>

          <div className="theme-switch-container">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={(e) => setDarkMode(e.target.checked)} 
              />
              <span className={`slider ${darkMode ? '' : 'active'}`}>
                <span className="handle" />
                <div className="star star-1" />
                <div className="star star-2" />
                <div className="star star-3" />
                <svg viewBox="0 0 16 16" className="cloud">
                  <path
                    fill="#fff"
                    d="M391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                    transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                  />
                </svg>
              </span>
            </label>
          </div>

            <Hamburger style={{zIndex: 60}} color={ darkMode ? '#ffffff' : '#0F0F0F'} rounded toggled={open} toggle={setOpen2} onClick={toggleDrawer(true)} />
          {/* Menu lateral */}

          <div className={`fixed h-[100vh] w-full marginZero inset-0 bg-black bg-opacity-60 z-49 ${open ? 'flex' : 'hidden'}`} onClick={toggleDrawer(false)}></div>

          <div className={` card marginZero fixed top-0 ${open ? 'left-[0]' : 'left-[-250px]' } h-[100vh] w-[250px] bg-dark-900 text-white z-51 duration-300 ${
              open ? '' : ''
            }`}
            onClick={(e) => e.stopPropagation()}>
              <div className="p-4 mb-2 text-xl font-bold border-gray-700">
                <Link to="/" className="flex items-center">
                    <img src={Logo} alt="Logo" className="h-10" />
                </Link>
              </div>
            <span className="mb-2 items-center flex px-5 text-gray-300 dark:text-gray-300 font-medium">
              <FaUser className='mr-2 ' />
              {user?.fullname.split(' ')[0]}
            </span>
            <div className="separator" />
            <ul className="list">
              <li className="element"> 
                <FaGear  />
                <p className="label">Configurações</p>
              </li>
              <li onClick={handleLogout} className="element delete">
                <ImExit />
                <p className="label">Sair</p>
              </li>
            </ul>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 mt-[120px]">
        <div className="max-w-7xl mx-auto">
          {/* Summary Cards */}
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-light-900 dark:bg-dark-800 rounded-2xl shadow-card dark:shadow-card-dark p-5 md:p-6 transition-all hover:shadow-lg dark:hover:shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">Saldo Total</h3>
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <i className="fas fa-wallet text-green-500 text-lg"></i>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"> <span className="gradient-text">{formatCurrency(balance)}</span></p>
              <p className="text-sm text-green-500 mt-2 flex items-center">
              </p>
            </div>
            <div className="bg-light-900 dark:bg-dark-800 rounded-2xl shadow-card dark:shadow-card-dark p-5 md:p-6 transition-all hover:shadow-lg dark:hover:shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">Receitas</h3>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <i className="fas fa-arrow-up text-blue-500 text-lg"></i>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"> <span>{formatCurrency(entrada)}</span></p>
              <p className="text-sm text-green-500 mt-2 flex items-center">
              </p>
            </div>
            <div className="bg-light-900 dark:bg-dark-800 rounded-2xl shadow-card dark:shadow-card-dark p-5 md:p-6 transition-all hover:shadow-lg dark:hover:shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">Despesas</h3>
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <i className="fas fa-arrow-down text-red-500 text-lg"></i>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"> <span>{formatCurrency(saida)}</span></p>
              <p className="text-sm text-red-500 mt-2 flex items-center">
              </p>
            </div>
          </div>

          {/* Chart and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Chart Section */}
            <div className=" lg:col-span-1 bg-light-900 dark:bg-dark-800 rounded-2xl shadow-card dark:shadow-card-dark p-5 md:p-6">
              <div className={` h-full w-full justify-center items-center mb-4 ${datas.length == 0 ? 'flex' : 'hidden'}`}>
                <span className='text-gray dark:text-gray-400'>Nenhum dado</span>
              </div>



              <div className={` ${datas.length == 0 ? 'hidden' : 'flex'} justify-between items-center mb-4`}>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Distribuição de Gastos</h2>
                <select 
                  id="chart-period" 
                  className="bg-gray-100 dark:bg-dark-700 border-0 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-primary-light focus:border-primary-light block p-2 pr-8 appearance-none focus:outline-none focus:ring-2"
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value)}
                >
                  <option value="month">Este Mês</option>
                  <option value="year">Este Ano</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div className="h-64">
                <canvas id="pie-chart"></canvas>
              </div>
            </div>

            {/* Transactions Section */}
            <div className=" lg:col-span-2 bg-light-900 dark:bg-dark-800 rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 md:mb-6 gap-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">Transações Recentes</h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-48">
                      <select 
                        id="filter-period" 
                        className="w-full bg-gray-100 dark:bg-dark-700 border-0 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-primary-light focus:border-primary-light block p-2 pr-8 appearance-none focus:outline-none focus:ring-2"
                        value={filterPeriod}
                        onChange={handleFilterChange}
                      >
                        <option value="all">Todas as transações</option>
                        <option value="month">Este mês</option>
                        <option value="last-month">Mês passado</option>
                        <option value="year">Este ano</option>
                        <option value="custom">Personalizado</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i className="fas fa-calendar text-gray-400"></i>
                      </div>
                    </div>
                    <div id="custom-date-filters" className={`${showCustomDateFilters ? 'flex' : 'hidden'} flex-col sm:flex-row gap-3 w-full`}>
                      <div className="relative w-full sm:w-36">
                        <input 
                          type="month" 
                          id="start-date" 
                          className="w-full bg-gray-100 dark:bg-dark-700 border-0 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-primary-light focus:border-primary-light block p-2 pr-8 appearance-none focus:outline-none focus:ring-2"
                          value={customStartDate || ''}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                      </div>
                      <div className="relative w-full sm:w-36">
                        <input 
                          type="month" 
                          id="end-date" 
                          className="w-full bg-gray-100 dark:bg-dark-700 border-0 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-primary-light focus:border-primary-light block p-2 pr-8 appearance-none focus:outline-none focus:ring-2"
                          value={customEndDate || ''}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                      </div>
                      <button 
                        id="apply-filter" 
                        className="gradient-bg text-white px-4 py-2 rounded-lg text-sm"
                        onClick={() => {
                          setFilterPeriod('custom');
                          updateChart();
                        }}
                      >
                        Aplicar
                      </button>
                    </div>
                    <button 
                      id="add-transaction" 
                      className="gradient-bg text-white px-4 py-2 rounded-xl flex items-center justify-center floating-btn w-full sm:w-auto"
                      onClick={() => openModal()}
                    >
                      <i className="fas fa-plus mr-2"></i> <span className="hidden sm:inline">Adicionar</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <div className="min-w-full">
                    <div className="hidden sm:grid grid-cols-5 gap-4 pb-2 border-b border-gray-200 dark:border-dark-600">
                      <div className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</div>
                      <div className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</div>
                      <div className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">Data</div>
                      <div className="text-right text-sm font-medium text-gray-500 dark:text-gray-400">Valor</div>
                      <div className="text-right text-sm font-medium text-gray-500 dark:text-gray-400">Ações</div>
                    </div>
                    <div id="transactions-list" className="divide-y divide-gray-200 dark:divide-dark-600">
                      {filteredTransactions
                        .sort((a, b) => new Date(b.data) - new Date(a.data))
                        .map(transaction => {
                          const typeClass = transaction.tipo === 'entrada' ? 'text-green-500' : 'text-red-500';
                          const typeIcon = transaction.tipo === 'entrada' ? 'fa-arrow-up' : 'fa-arrow-down';
                          
                          const allCategories = [...expenseCategories, ...incomeCategories];
                          const categoryInfo = allCategories.find(c => c.value === transaction.categoria) || { label: 'Outros', icon: 'fa-ellipsis-h', color: 'text-gray-500' };
                          
                          return (
                            <React.Fragment key={transaction.id}>
                              {/* Mobile View */}
                              <div className="sm:hidden p-3 transaction-card hover:bg-gray-50 dark:hover:bg-dark-700 smooth-transition">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center">
                                    <div className={`w-9 h-9 rounded-lg ${transaction.tipo === 'entrada' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'} flex items-center justify-center mr-3`}>
                                      <i className={`fas ${typeIcon} ${typeClass} text-sm`}></i>
                                    </div>
                                    <div>
                                      <div className="text-gray-800 dark:text-white font-medium">{transaction.titulo}</div>
                                      <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                                        <i className={`fas ${categoryInfo.icon} ${categoryInfo.color} mr-1 text-xs`}></i>
                                        {categoryInfo.label}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`${typeClass} font-medium`}> {formatCurrency(transaction.valor)}</div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                                    {new Date(transaction.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' })}
                                  </div>
                                  <div className="flex space-x-2">
                                    <button 
                                      className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-light smooth-transition"
                                      onClick={() => openModal(transaction)}
                                    >
                                      <i className="fas fa-edit text-xs"></i>
                                    </button>
                                    <button 
                                      className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-500 smooth-transition"
                                      onClick={() => deleteTransaction(transaction.id)}
                                    >
                                      <i className="fas fa-trash text-xs"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Desktop View */}
                              <div className="hidden sm:grid grid-cols-5 gap-4 py-4 px-4 items-center transaction-card hover:bg-gray-50 dark:hover:bg-dark-700 smooth-transition">
                                <div className="text-gray-800 dark:text-white flex items-center">
                                  <div className={`w-9 h-9 rounded-lg ${transaction.tipo === 'entrada' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'} flex items-center justify-center mr-3`}>
                                    <i className={`fas ${typeIcon} ${typeClass} text-sm`}></i>
                                  </div>
                                  <span className="truncate">{transaction.titulo}</span>
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 flex items-center">
                                  <i className={`fas ${categoryInfo.icon} ${categoryInfo.color} mr-2 text-sm`}></i>
                                  <span className="truncate">{categoryInfo.label}</span>
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {new Date(transaction.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </div>
                                <div className={`${typeClass} text-right font-medium`}> {formatCurrency(transaction.valor)}</div>
                                <div className="text-right flex justify-end space-x-2">
                                  <button 
                                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-light smooth-transition"
                                    onClick={() => openModal(transaction)}
                                  >
                                    <i className="fas fa-edit text-sm"></i>
                                  </button>
                                  <button 
                                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-500 smooth-transition"
                                    onClick={() => deleteTransaction(transaction.id)}
                                  >
                                    <i className="fas fa-trash text-sm"></i>
                                  </button>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Add Button */}
      <div className="fixed bottom-6 right-6 z-20 lg:hidden">
        <button 
          id="mobile-add-transaction" 
          className="w-14 h-14 rounded-full gradient-bg text-white flex items-center justify-center shadow-xl floating-btn"
          onClick={() => openModal()}
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div id="transaction-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl w-full max-w-md mx-4 modal overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {currentTransaction ? 'Editar Transação' : 'Adicionar Transação'}
                </h3>
                <button 
                  id="close-modal" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 smooth-transition"
                  onClick={closeModal}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form id="transaction-form" onSubmit={handleSubmitTransaction}>
                <input type="hidden" id="transaction-id" name="id" value={currentTransaction?.id || ''} />
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                  <input 
                    type="text" 
                    id="title" 
                    name="titulo"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 focus:ring-2 focus:ring-primary-light focus:border-primary-light bg-white dark:bg-dark-700 text-gray-800 dark:text-white smooth-transition" 
                    required
                    defaultValue={currentTransaction?.titulo || ''}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
                  <div className="relative">
                    <select 
                      id="type" 
                      name="tipo"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 focus:ring-2 focus:ring-primary-light focus:border-primary-light bg-white dark:bg-dark-700 text-gray-800 dark:text-white appearance-none smooth-transition" 
                      required
                      defaultValue={currentTransaction?.tipo || ''}
                      onChange={(e) => {
                        // Enable category select when type is selected
                        const categorySelect = document.getElementById('category');
                        if (e.target.value) {
                          categorySelect.disabled = false;
                          // Update category options
                          const categories = e.target.value === 'entrada' ? incomeCategories : expenseCategories;
                          categorySelect.innerHTML = '';
                          const defaultOption = document.createElement('option');
                          defaultOption.value = '';
                          defaultOption.textContent = 'Selecione...';
                          categorySelect.appendChild(defaultOption);
                          categories.forEach(category => {
                            const option = document.createElement('option');
                            option.value = category.value;
                            option.textContent = category.label;
                            categorySelect.appendChild(option);
                          });
                        } else {
                          categorySelect.disabled = true;
                          categorySelect.innerHTML = '<option value="">Selecione o tipo primeiro</option>';
                        }
                      }}
                    >
                      <option value="">Selecione...</option>
                      <option value="entrada">Entrada</option>
                      <option value="saida">Saída</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
                  <div className="relative">
                    <select 
                      id="category" 
                      name="categoria"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 focus:ring-2 focus:ring-primary-light focus:border-primary-light bg-white dark:bg-dark-700 text-gray-800 dark:text-white appearance-none smooth-transition" 
                      required
                      disabled={!currentTransaction?.tipo && !currentTransaction}
                      defaultValue={currentTransaction?.categoria || ''}
                    >
                      {currentTransaction?.tipo ? (
                        <>
                          <option value="">Selecione...</option>
                          {(currentTransaction.tipo === 'entrada' ? incomeCategories : expenseCategories).map(category => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                          ))}
                        </>
                      ) : (
                        <option value="">Selecione o tipo primeiro</option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      id="date" 
                      name="data"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 focus:ring-2 focus:ring-primary-light focus:border-primary-light bg-white dark:bg-dark-700 text-gray-800 dark:text-white smooth-transition" 
                      required
                      defaultValue={currentTransaction?.data || new Date().toISOString().split('T')[0]}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="fas fa-calendar text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">R$</span>
                    <input 
                      type="text" 
                      id="amount" 
                      name="valor"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 focus:ring-2 focus:ring-primary-light focus:border-primary-light bg-white dark:bg-dark-700 text-gray-800 dark:text-white smooth-transition" 
                      required
                      defaultValue={currentTransaction ? formatCurrency(currentTransaction.valor) : ''}
                      onBlur={(e) => {
                        if (e.target.value) {
                          e.target.value = formatCurrency(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    id="cancel-transaction" 
                    className="px-5 py-2.5 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 smooth-transition"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2.5 gradient-bg text-white rounded-xl hover:opacity-90 smooth-transition">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;