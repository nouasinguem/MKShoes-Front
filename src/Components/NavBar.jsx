import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/navBar.css";
import logo from "../Images/MKDesign.png"
import cart from "../Images/cart.png"
import auth from "../Images/auth.jpg"


function Navbar() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const fetchCart = async () => {
        try {
            const res = await fetch(`${API_URL}/cart`, {
                credentials: "include"
            });
            const data = await res.json();
            setCartItems(data);
        } catch (err) {
            console.error(err);
        }
    };

    const cartClick = () => {
        setShowCart(!showCart);

        if (!showCart) {
            fetchCart(); // load cart when opening
        }
    };
    return (
        <div className="navbar">

            <Link to="/">
                <img src={logo} alt="MKShoes Logo" className="logo" />
            </Link>

            <div className="nav-right">
               <span onClick={cartClick}>
                   <img src={cart} alt="Cart icon" className="cart" />
               </span>
               <Link to="/auth">
                   <img src={auth} alt="Auth icon" className="auth" />
               </Link>
            </div>
            {showCart && (
                <div className="cart-dropdown">
                    <h3>Your Cart</h3>

                    {cartItems.length === 0 && <p>Cart is empty</p>}

                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={`${API_URL}/images/${item.productImage}`} className="cart-img" />
                            <p>Size: {item.size}</p>
                            <p>Qty: {item.quantity}</p>
                        </div>
                    ))}
                    {cartItems.length > 0 && (
                        <button className="checkout-btn" onClick= {
                            () => {navigate("/checkout")}}>
                            Checkout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Navbar;