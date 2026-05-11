import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/loginSignUp.css";
import logo from "../Images/MKDesign.png"

function LoginSignUp (){
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); //Use as a router to goto another page
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    //to handle APIs when connecting logging in or signing up
    const handleSubmit = async () => {
        try {
            const url = isLogin
                ? `${API_URL}/auth/login`
                : `${API_URL}/auth/signup`;

            const body = isLogin
                ? {
                    email: formData.email,
                    password: formData.password
                }
                : formData;
            if (!formData.email || !formData.password) {
                alert("Please fill all fields");
                return;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Backend error:", errorText);
                throw new Error(errorText || "Request failed");            }

            const user = await response.json();

            console.log("User:", user);

            // Save user (important step)
            localStorage.setItem("email", JSON.stringify(user));

            alert("Login Successful.\nWelcome to your account " + user.name + ".\nEnjoy shopping with us.");
            // Redirect to home page
            navigate("/");

        } catch (error) {
            console.error("Error:", error);
            alert("Login/Signup failed");

        }
    };

    const guestCheckout = () => {
        const guestEmail = "guest@shop";

        // store guest email same way as normal users
        localStorage.setItem("email", guestEmail);

        console.log("Guest mode:", guestEmail);

        alert("Hope you enjoy your shopping!!")
        navigate("/");
    };
    return (
        <div className="container">
            <img src = {logo} alt = "MKShoes Logo"/>

            <div className="tabs">
                <button onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>
                    Login
                </button>
                <button onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>
                    Sign Up
                </button>
            </div>

            <div className="form">
                {!isLogin && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button className="log" onClick={handleSubmit}> {isLogin ? "Login" : "Sign Up"} </button>
                <hr/>
                <button type="button" className="guest" onClick={guestCheckout}>Shop as Guest</button>
            </div>
        </div>
      );
 }

export default LoginSignUp;