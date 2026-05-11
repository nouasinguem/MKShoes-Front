import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignUp from "./Components/LoginSignUp.jsx";
import Checkout from "./Components/Checkout.jsx";
import Navbar from "./Components/NavBar.jsx";
import ProductDescription from "./Components/ProductDescription.jsx";
import Home from "./Components/Home.jsx";

function App() {
    return (
        <>
            <BrowserRouter>

                <Routes>
                    <Route path = '/auth' element = {<LoginSignUp />}></Route>
                    <Route path = '/checkout' element = {<><Navbar /><Checkout /></>}></Route>
                    <Route path = '/product' element = {<><Navbar /><ProductDescription /></>}></Route>
                    <Route path = '/' element = {<><Navbar /><Home /></>}></Route>
                    <Route path='/product/:id' element={<><Navbar /><ProductDescription /></>} /></Routes>
            </BrowserRouter>
        </>

    );
}

export default App;

