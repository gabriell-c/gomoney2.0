import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import PageNotFound from '../pages/error';
import Signup from '../pages/signup';
import Login from '../pages/login';


export default function index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='*' element={<PageNotFound />} />
                <Route path='/cadastro' element={<Signup />} />
                <Route path='/login' element={<Login />} />

            </Routes>
        </BrowserRouter>
    )
}