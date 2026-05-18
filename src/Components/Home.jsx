import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import summersale from "../Images/summerSale.png";
import src from "../Images/search.png";


function Home() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const searchProduct = async (value) => {

        try {
            let res;
            if (!value || value.trim() === "") {//displays all products if the search bar is empty
                res = await fetch(`${API_URL}/products`);
            } else {
                res = await fetch(`${API_URL}/products/search?name=${value}`);
            }
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!localStorage.getItem("user")) {//user and login status
        localStorage.setItem("user", JSON.stringify({
            email: null,
            isLoggedIn: false
        }));
    }
    localStorage.removeItem("checkoutItem");//In case any item is still in the storage

    useEffect(() => {
        fetch(`${API_URL}/products`)
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


    if (products.length == 0) return <p>Loading...</p>;
    return(
        <div className="home">
            <div className="summer-sale">
                <img src={summersale} className="image" alt="Summer Sale Icon" />
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {setSearch(e.target.value);searchProduct(e.target.value);}}
                />
                <img src={src} onClick={searchProduct}/>
            </div>
            <div className="section">
                <h2>Featured Products</h2>
                <div className="products">
                    {products.map(product => (
                        <div className="product-card" key={product.productId} onClick={() => navigate(`/product/${product.productId}`)}>
                            <img src={`${API_URL}/images/${product.productImage}`} />
                            <p className="name">{product.productName}</p>
                            <p className="price">£{product.productPrice}</p>

                            {product.productStock < 10 && (
                                <p className="remaining">
                                    Only {product.productStock} left!
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Home;