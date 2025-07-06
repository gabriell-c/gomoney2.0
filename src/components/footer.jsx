import React from 'react';
import Logo from '../../public/isotipo_gomoney.webp'; // Ajuste o caminho conforme necessário
import { Link } from 'react-router-dom'; // Certifique-se de que o react-router-dom está instalado

const Footer = () => {
    return (
        <footer className='py-10 w-full bg-light-900 dark:bg-dark-800 text-white py-4 text-center flex flex-col items-center justify-center'>
                <Link to="/" className="flex items-center">
                    <img src={Logo} alt="Logo" className="mb-2 h-12" />
                </Link>
                <p className='text-gray-700 dark:text-gray-300'>&copy; {new Date().getFullYear()} Gomoney 2.0 | Todos os direitos reservados.</p>
        </footer>
    );
};

export default Footer;