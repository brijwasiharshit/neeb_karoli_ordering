import React, { useEffect, useState } from "react";
import Carousel from "../Carousal";
import Footer from "../Footer";
import { FaArrowUp } from "react-icons/fa";
import "./home.css";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const { tableId } = useParams();
  const host = process.env.REACT_APP_HOST;

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const calculateTotal = () => calculateSubtotal();

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const placeOrder = async () => {
    try {
      if (cart.length === 0) return;

      const errors = {};
      if (!customerInfo.name.trim()) errors.name = "Name is required";
      if (!customerInfo.phone.trim()) errors.phone = "Phone number is required";
      if (!customerInfo.address.trim()) errors.address = "Address is required";

      if (customerInfo.phone && !/^\d{10}$/.test(customerInfo.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const orderData = {
        tableId,
        items: cart,
        total: calculateTotal(),
        orderTime: new Date().toISOString(),
        orderId: `ORD-${Date.now()}`,
        customer: customerInfo,
      };

      await axios.post(`${host}/api/sendOrderNotification`, orderData);

      setCart([]);
      setCustomerInfo({ name: "", phone: "", address: "" });
      setShowCart(false);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(`Failed to place order: ${error.response?.data?.message || error.message}`);
    }
  };

  const addToCart = (item, option, price) => {
    const existingItem = cart.find(
      (i) => i._id === item._id && i.option === option
    );

    if (existingItem) {
      setCart(
        cart.map((i) =>
          i._id === item._id && i.option === option
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, option, price, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId, option) => {
    setCart(cart.filter((item) => !(item._id === itemId && item.option === option)));
  };

  const updateQuantity = (itemId, option, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, option);
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === itemId && item.option === option
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoaded(false);
        setError(null);
        const res = await axios.get(`${host}/api/foodData`);

        if (!res.data.foodItems || res.data.foodItems.length === 0) {
          throw new Error("No food items available");
        }

        const itemsWithCategories = res.data.foodItems.map((item) => ({
          ...item,
          category: res.data.foodCategories.find(
            (cat) => cat._id === item.category
          ),
        }));

        setFoodCategories(res.data.foodCategories);
        setFoodItems(itemsWithCategories);
        if (res.data.foodCategories.length > 0) {
          setActiveCategory(res.data.foodCategories[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
        setError(err.message);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [host]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems = foodItems.filter(
    (item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.category?._id === activeCategory
  );

  return (
    <div style={{ backgroundColor: "#fffacd", minHeight: "100vh", paddingBottom: "20px" }}>
      {!isLoaded ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : error ? (
        <div className="error-container">
          <h2 style={{ color: "red", textAlign: "center" }}>Error loading menu</h2>
          <p style={{ textAlign: "center" }}>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">Try Again</button>
        </div>
      ) : (
        <>
          <Carousel setSearchQuery={setSearchQuery} searchQuery={searchQuery} />

          <div className="category-tabs-container">
            <div className="category-tabs">
              {foodCategories.map((category) => (
                <button
                  key={category._id}
                  className={`category-tab ${activeCategory === category._id ? "active" : ""}`}
                  onClick={() => setActiveCategory(category._id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-container">
            {foodCategories
              .filter((category) => category._id === activeCategory)
              .map((category) => (
                <div key={category._id} className="category-section">
                  <h2 className="category-title">{category.name}</h2>
                  <p className="category-description">{category.description}</p>
                  <div className="food-items-grid">
                    {filteredItems.map((item) => (
                      <div key={item._id} className="food-item-card">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="food-item-image"
                          />
                        )}
                        <div className="food-item-details">
                          <h3>{item.name}</h3>
                          <div className="price-options">
                            {item.options &&
                              Object.entries(item.options).map(([option, price]) => (
                                <div key={option} className="price-option">
                                  <span>{option}: ₹{price}</span>
                                  <button
                                    onClick={() => addToCart(item, option, price)}
                                    className="add-to-cart-btn"
                                  >
                                    Add
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <button className="cart-button" onClick={() => setShowCart(true)}>
            🛒{" "}
            {cart.length > 0 && (
              <span className="cart-count">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>

          {showCart && (
            <div className="cart-overlay">
              <div className="cart-modal">
                <div className="cart-header">
                  <h2 className="cart-title">Your Cart</h2>
                  <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
                </div>
                <div className="cart-body">
                  {cart.length === 0 ? (
                    <div className="empty-cart">
                      <h3>Your cart is empty</h3>
                      <button className="btn outline" onClick={() => setShowCart(false)}>
                        Browse Menu
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Items First */}
                      <div className="cart-items">
                        {cart.map((item, index) => (
                          <div key={index} className="cart-item">
                            <div className="item-info">
                              <strong>{item.name}</strong> ({item.option}) - ₹{item.price}
                            </div>
                            <div className="item-controls">
                              <button onClick={() => updateQuantity(item._id, item.option, item.quantity - 1)}>-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, item.option, item.quantity + 1)}>+</button>
                              <button onClick={() => removeFromCart(item._id, item.option)}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Small Form After Items */}
                      <div className="customer-info-form small-form">
                        <h3>Customer Information</h3>
                        <div className="form-group">
                          <label htmlFor="name">Full Name*</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={customerInfo.name}
                            onChange={handleCustomerInfoChange}
                            className={formErrors.name ? "error" : ""}
                            placeholder="Enter your full name"
                          />
                          {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="phone">Phone Number*</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={customerInfo.phone}
                            onChange={handleCustomerInfoChange}
                            className={formErrors.phone ? "error" : ""}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                          />
                          {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="address">Delivery Address*</label>
                          <textarea
                            id="address"
                            name="address"
                            value={customerInfo.address}
                            onChange={handleCustomerInfoChange}
                            className={formErrors.address ? "error" : ""}
                            placeholder="Enter complete delivery address"
                            rows="3"
                          />
                          {formErrors.address && <span className="error-message">{formErrors.address}</span>}
                        </div>
                      </div>

                      <div className="cart-actions">
                        <button className="btn place-order-btn" onClick={placeOrder}>Place Order</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <Footer />

          {showBackToTop && (
            <button
              className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <FaArrowUp />
            </button>
          )}
        </>
      )}
    </div>
  );
}
