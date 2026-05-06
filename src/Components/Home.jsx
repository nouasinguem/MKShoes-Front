import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import summersale from "../Images/summerSale.png";


function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/products")
            .then(res => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            })
            .catch(err => {
                console.error(err);
                setProducts([]);
            });
    }, []);

    if(!products)
    {
        <p>Product Loading...</p>
    }
    return(
        <div className="home">
            <div className="summer-sale">
                <img src={summersale} className="image" alt="Summer Sale Icon" />
            </div>
            <div className="section">
                <h2>Featured Products</h2>

                <div className="products">
                    {products.map(product => (
                        <div className="product-card" key={product.productId} onClick={() => navigate(`/product/${product.productId}`)}>
                            <img src={`http://localhost:8080/ShoesImages/${product.productImage}`} />
                            <p className="name">{product.productName}</p>
                            <p className="price">£{product.productPrice}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>


    );
}

export default Home;