import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/checkout.css";


function Checkout(){
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        fetchCart();
    }, []);
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: ""
    });
    //handle form changes
    const change = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });//save the current object
    };

    //Updates the progress bar
    const filledFields = Object.values(formData).filter(value => value !== "").length;
    const progressPercentage = (filledFields / 5) * 100;

    //Calculate the total price of order

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

    const placeOrder = async () => {
        //check
        const emptyField = Object.values(formData).some(value => value.trim() === "");

        if (emptyField) {
            alert("All fields are required");
            return; // stop execution
        }

        try {
            const user = JSON.parse(localStorage.getItem("email"));
            if (!user || !user.email) {
                alert("Please log in to place the order");
                return;
            }
            const email = user.email;

            // Determine items: "Buy Now" or full cart
            let items = [];
            const checkoutItem = JSON.parse(localStorage.getItem("checkoutItem"));

            if (checkoutItem) {
                items = [
                    {
                        productId: checkoutItem.productId,
                        quantity: checkoutItem.quantity
                    }
                ];
            } else {
                items = cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }));
            }

            // Build order request
            const orderRequest = {
                userEmail: email,
                items: items
            };

            // Send order to backend
            const res = await fetch(`${API_URL}/orders/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(orderRequest)
            });


            if (!res.ok) {
                const text = await res.text();
                console.error("Server error:", text);
                throw new Error("Order failed");
            }

            alert("Order placed successfully!");
            //Empty the cart
            if (!checkoutItem) {
                await fetch(`${API_URL}/cart/clear-cart`, {method: "DELETE", credentials: "include"});
            }
            localStorage.removeItem("checkoutItem");

            navigate("/"); // Redirect to home

        } catch (err) {
            console.error(err);
            alert("Failed to place order");
        }
    };

    //To display the appropriate content
    const displayItems = () => {
        const checkoutItem = JSON.parse(localStorage.getItem("checkoutItem"));
        if (checkoutItem) {
            return [
                {
                    productId: checkoutItem.productId,
                    productName: checkoutItem.productName,
                    productPrice: checkoutItem.productPrice,
                    productImage: checkoutItem.productImage,
                    quantity: checkoutItem.quantity,
                }
            ];
        } else {
            return cartItems;
        }
    };

    const total = displayItems().reduce((sum, item) => sum + item.productPrice*item.quantity, 0);


    return(
        <div className="checkout-container">
            <div className="progress-container">
                <div className="step" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="card">
                <h3>Order Summary</h3>

                {displayItems().map((item, index) => (
                    <div className="item" key={index}>
                        <span><img src ={`${API_URL}/images/${item.productImage}`} className="order-img" /></span>
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