import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/productDescription.css";

function ProductPage() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const sizes = [6, 7, 8, 9, 10, 11, 12];
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:8080/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error(err));
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Select a size first");
            return;
        }
        await fetch("http://localhost:8080/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // REQUIRED for session
            body: JSON.stringify({
                productId: product.productId,
                size: selectedSize,
                quantity: quantity,
                productPrice: product.productPrice,
                productName: product.productName,
                productImage: product.productImage
            })
        });

        alert("Added to cart");
    };

    //Message on the screen while the product loads
    if (!product) return <p>Loading...</p>;

    return(
        <div className="product-container">
            <div className="product-image">
                <img src={`http://localhost:8080/ShoesImages/${product.productImage}`}
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
                <button className="buy">Buy Now</button>
            </div>
        </div>
    );
}
export default ProductPage;