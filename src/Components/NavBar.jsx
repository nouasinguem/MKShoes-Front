import React, {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/navBar.css";
import logo from "../Images/MKDesign.png"
import cart from "../Images/cart.png"
import auth from "../Images/auth.jpg"
import viewOrder from "../Images/myorders.png"


function Navbar() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const cartCount = cartItems.length;
    //for authentication
    const [authState, setAuthState] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : { email: null, isLoggedIn: false };
    });
    const email = authState.email;
    const isLoggedIn = authState.isLoggedIn;

    const fetchOrders = async () => {

        try {
            const storedUser = localStorage.getItem("user");
            const user = storedUser ? JSON.parse(storedUser) : null;
            const email = user?.email;
            const isLoggedIn = user?.isLoggedIn;

            if (!isLoggedIn || !email || email === "guest@shop") {//this checks if the user is logged in
                alert("Please login to view your orders");
                navigate("/auth");
                return;
            }

            const res = await fetch(
                `${API_URL}/orders/user/${email}`
            );
            const data = await res.json();

            setOrders(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error(err);
        }
    };
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

        setShowOrders(false);
        setShowCart(!showCart);

        if (!showCart) {
            fetchCart(); // load cart when opening
        }
    };

    const viewOrderClick = () => {
        setShowCart(false);
        setShowOrders(!showOrders);
        if (!showOrders) {
            fetchOrders(); // load orders when opening
        }
    };

    const changeQty = async (productId, size, quantity) => {//Change the quantity of a product in a cart
        try {
            await fetch(`${API_URL}/cart/update?productId=${productId}&size=${size}&quantity=${quantity}`, {
                method: "PUT",
                credentials: "include"
            });
            fetchCart(); // refresh cart
        } catch (err) {
            console.error(err);
        }
    };

    const rmItem = async (productId, size) => {//remove an item from the cart
        try {
            await fetch(`${API_URL}/cart/remove?productId=${productId}&size=${size}`, {
                method: "DELETE",
                credentials: "include"
            });

            fetchCart(); // refresh cart
        } catch (err) {
            console.error(err);
        }
    };
    const redirectCheckout = async () => {

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const email = user?.email;
        const isLoggedIn = user?.isLoggedIn;
        try {
            // Check stock for each cart item
            let stockIssue = false;
            for (const item of cartItems) {
                const res = await fetch(`${API_URL}/products/${item.productId}`);
                const product = await res.json();

                if (product.productStock < item.quantity) {
                    stockIssue = true;
                    alert(`Not enough stock for ${product.productName}. Available: ${product.productStock}, in cart: ${item.quantity}`);
                    break;
                }
            }

            if (!stockIssue) {
                if (!email) {
                    alert("Redirecting to authentication...");
                    navigate("/auth");//for users not logged in
                    return;
                }
                if (!isLoggedIn || !email) {
                    alert("Please login before checking out.");
                    navigate("/auth");
                    return;
                }
                alert("Redirecting to checkout...");
                navigate("/checkout"); // only checkout if enough stock and user logged in
            }
        } catch (err) {
            console.error(err);
            alert("Error checking stock. Please try again.");
        }
    };
    useEffect(() => {
        fetchCart(); // load cart immediately on page load
    }, [location.pathname]);

    const authClick = () => {
        if (isLoggedIn) {
            // log out
            localStorage.setItem("user", JSON.stringify({email: null, isLoggedIn: false}));
            setAuthState({email: null, isLoggedIn: false});
            alert("You have been logged out.");
            navigate("/"); //redirects user to the home page
            return;
        }
        //in defaul case this redirects the user to authentication
        navigate("/auth");
    };

    return (
        <div className="navbar">

            <Link to="/">
                <img src={logo} alt="MKShoes Logo" className="logo" />
            </Link>

            <div className="nav-right">
                <span onClick={viewOrderClick}>
                   <img src={viewOrder} alt="View Order Icon" className="view-order" />
               </span>
               <span className="cart1" onClick={cartClick}>
                   <img src={cart} alt="Cart icon" className="cart" />
                   {cartCount > 0 && <span className="cart-count">({cartCount})</span>}
               </span>
                <button className="auth" onClick={authClick}>
                    {isLoggedIn ? "Log Out" : "Login"}
                </button>
            </div>
            {showOrders && (
                <div className="cart-dropdown">

                    <div className="hd">
                        <h3>My Orders</h3>
                        <button className="close-btn" onClick={() => setShowOrders(false)}>Close</button>
                    </div>
                    {orders.length === 0 && (
                        <p>No orders found</p>
                    )}

                    {orders.map(order => (

                        <div key={order.orderId} className="cart-item">

                            <p>
                                <strong>Order #{order.orderId}</strong>
                            </p>

                            <p>Total: £{order.price}</p>

                            <p>Status: Shipping</p>

                        </div>
                    ))}

                </div>
            )}
            {showCart && (
                <div className="cart-dropdown">

                    <div className="hd">
                        <h3>Your Cart</h3>
                        <button className="close-btn" onClick={() => setShowCart(false)}>Close</button>
                    </div>
                    {cartItems.length === 0 && <p>Cart is empty</p>}

                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={`${API_URL}/images/${item.productImage}`} className="cart-img" />
                            <p>Size: {item.size}</p>
                            <label>Qty:</label>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {changeQty(item.productId, item.size, Number(e.target.value))}}
                                className="qty"
                            />

                            <button className="delete-btn" onClick={() => rmItem(item.productId, item.size)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    {cartItems.length > 0 && (
                        <button className="checkout-btn" onClick= {redirectCheckout}>
                            Checkout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Navbar;