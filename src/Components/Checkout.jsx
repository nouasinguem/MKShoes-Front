import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/checkout.css";


function Checkout(){
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        fetchCart();
    }, []);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: ""
    });

    //Calculate the total price of order
    const total = cartItems.reduce((sum, item) => sum + item.productPrice*item.quantity, 0);
    // Function to handle form changes
    const change = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const filledFields = Object.values(formData).filter(value => value !== "").length;
    const progressPercentage = (filledFields / 5) * 100;

    const fetchCart = async () => {
        try {
            const res = await fetch("http://localhost:8080/cart", {
                credentials: "include"
            });
            const data = await res.json();
            setCartItems(data);
        } catch (err) {
            console.error(err);
        }
    };

    const placeOrder = async () => {
        //check
        const emptyField = Object.values(formData).some(value => value.trim() === "");

        if (emptyField) {
            alert("All fields are required");
            return; // stop execution
        }

        try {
            const email= localStorage.getItem("email"); // or however you store it

            const orderItems = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            const res = await fetch("http://localhost:8080/orders/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    userEmail: email,
                    items: orderItems
                })
            });

            if (!res.ok) {
                console.log(res);
                const text = await res.text();
                console.error("Server error:", text);
                console.log("EMAIL:", email);
                throw new Error("Order failed");
            }

            alert("Order placed successfully!");
             await fetch("http://localhost:8080/cart/clear-cart", {
                 method: "DELETE",
                 credentials: "include"
             });
            navigate("/products"); // redirect to home

        } catch (err) {
            console.error(err);
            alert("Failed to place order");
        }
    };

    return(
        <div className="checkout-container">
            <div className="progress-container">
                <div className="step" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="card">
                <h3>Order Summary</h3>

                {cartItems.map((item, index) => (
                    <div className="item" key={index}>
                        <span><img src ={`http://localhost:8080/ShoesImages/${item.productImage}`} className="order-img" /></span>
                        <span>£{item.productPrice*item.quantity}</span>
                    </div>
                ))}
                <hr />

                <div className="total">
                    <strong>Total:</strong>
                    <strong>£{total}</strong>
                </div>
            </div>

            <div className="card">
                <h3>Shipping Information</h3>

                <input placeholder="Full Name"
                       type="text"
                       name="fullName"
                       placeholder="Full Name"
                       value={formData.fullName}
                       onChange={change}
                />
                <input placeholder="Address"
                       type="text"
                       name="address"
                       placeholder="Address"
                       value={formData.address}
                       onChange={change}
                />
                <input placeholder="City"
                       type="text"
                       name="city"
                       placeholder="City"
                       value={formData.city}
                       onChange={change}
                />
                <input placeholder="Postal Code"
                       type="text"
                       name="postalCode"
                       placeholder="Postal Code"
                       value={formData.postalCode}
                       onChange={change}
                />
                <input placeholder="Country"
                       type="text"
                       name="country"
                       placeholder="Country"
                       value={formData.country}
                       onChange={change}
                />
            </div>

            <button className="place-order" onClick={placeOrder}>Place Order</button>
        </div>
            );
}
export default Checkout;