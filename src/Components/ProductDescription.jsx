import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {useNavigate, useParams} from "react-router-dom";
import "../css/productDescription.css";

function ProductPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const sizes = [6, 7, 8, 9, 10, 11, 12];
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`${API_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error(err));
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Select a size first");
            return;
        }

        if (product.productStock<quantity) {
            alert("Insufficient stock");
            return;
        }
        try {
            await fetch(`${API_URL}/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // used to define a session
                body: JSON.stringify({
                    productId: product.productId,
                    size: selectedSize,
                    quantity: quantity,
                    productPrice: product.productPrice,
                    productName: product.productName,
                    productImage: product.productImage
                })
            });
        } catch (err){
            console.log(err)
        }
        alert("Added to cart");
        navigate("/");
    };

    const handleBuyNow = async () => {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const email = user?.email;
        const isLoggedIn = user?.isLoggedIn;
        if (!selectedSize) {
        alert("Select a size first");
        return;
        }
        if (product.productStock < quantity) {
            alert("Insufficient stock");
            return;    }
        // save checkout item
        const checkoutItem = {
            productId: product.productId,
            productName: product.productName,
            productPrice: product.productPrice,
            productImage: product.productImage,
            quantity: quantity    };
        localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));
        // LOGIN CHECK
        if (!isLoggedIn || !email) {
            alert("Please login before checking out.");
            navigate("/auth");
            return;
        }
        alert("Redirecting to checkout...");
        navigate("/checkout");};
    //Message on the screen while the product loads
    if (!product) return <p>Loading...</p>;

    return(
        <div className="product-container">
            <div className="product-image">
                <img src={`${API_URL}/images/${product.productImage}`}
                     alt={product.productName} />
            </div>
            <div className="product-details">
                <div className="title-price">
                    <h2>{product.productName}</h2>
                    <span className="price">£{product.productPrice}</span>
                </div>

                <h4>Description:</h4>
                <p className="description">{product.productDescription}</p>
            </div>

            <div className="size">
                {sizes.map(size => (
                    <button
                        key={size}
                        className={selectedSize === size ? "active" : ""}
                        onClick={() => setSelectedSize(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>

            <div className="quantity">
                <label>Quantity:</label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </div>

            <div className="buttons">
                <button className="add" onClick={handleAddToCart}>Add to Cart</button>
                <button className="buy" onClick={handleBuyNow}>Buy Now</button>
            </div>
        </div>
    );
}
export default ProductPage;