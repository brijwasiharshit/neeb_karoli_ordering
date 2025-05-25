import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddItems() {
  const host = process.env.REACT_APP_HOST || "http://localhost:5000";

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState("option");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    isAvailable: true,
    options: { Half: "", Full: "" },
    one: "",
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${host}/api/user/foodData`, {
          withCredentials: true,
        });
        setCategories(res.data.foodCategories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        alert("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, [host]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "Half" || name === "Full") {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else if (name === "isAvailable") {
      setFormData((prev) => ({
        ...prev,
        isAvailable: checked,
      }));
    } else if (name === "imageUrl") {
      setFormData((prev) => ({
        ...prev,
        imageUrl: value,
      }));
      setPreview(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const buildPayload = () => {
    const {
      name,
      description,
      category,
      imageUrl,
      isAvailable,
      options,
      portion,
    } = formData;

    if (!name.trim() || !category.trim()) {
      throw new Error("Name and category are required.");
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      isAvailable,
      imageUrl: imageUrl.trim(),
    };

    if (activeInput === "portion") {
      if (!portion.trim()) {
        throw new Error("Portion price is required.");
      }
      payload.options = { One: portion.trim() };
    } else {
      const cleanedOptions = {};
      Object.entries(options).forEach(([key, val]) => {
        if (val.trim()) cleanedOptions[key] = val.trim();
      });
      if (Object.keys(cleanedOptions).length === 0) {
        throw new Error("At least one option price (Half/Full) is required.");
      }
      payload.options = cleanedOptions;
    }

    return payload;
  };
  // this id for submiting data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = buildPayload();

      await axios.post(`${host}/api/admin/addfooditem`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      alert("✅ Item added successfully!");

      setFormData({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        isAvailable: true,
        options: { Half: "", Full: "" },
        portion: "",
      });
      setPreview(null);
      setActiveInput("option");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Check inputs.";
      alert("❌ Failed to add item: " + message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    boxShadow: "0 0 10px #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const checkboxContainer = {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
  };

  const toggleButtonStyle = (active) => ({
    padding: "0.5rem 1rem",
    backgroundColor: active ? "#4F46E5" : "#a5b4fc",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    flex: 1,
  });

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Add Food Item
      </h2>

      <label style={labelStyle}>Food Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter food name"
        style={inputStyle}
      />

      <label style={labelStyle}>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows={3}
        placeholder="Enter description"
        style={inputStyle}
      />

      <label style={labelStyle}>Category</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        style={inputStyle}
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Image URL</label>
      <input
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="Enter image URL"
        style={inputStyle}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        />
      )}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          type="button"
          onClick={() => setActiveInput("option")}
          style={toggleButtonStyle(activeInput === "option")}
        >
          Options
        </button>

        <button
          type="button"
          onClick={() => setActiveInput("portion")}
          style={toggleButtonStyle(activeInput === "portion")}
        >
          Portion
        </button>
      </div>

      {activeInput === "option" && (
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            name="Half"
            value={formData.options.Half}
            onChange={handleChange}
            placeholder="Half price"
            style={{ ...inputStyle, marginBottom: "10px" }}
          />
          <input
            type="text"
            name="Full"
            value={formData.options.Full}
            onChange={handleChange}
            placeholder="Full price"
            style={inputStyle}
          />
        </div>
      )}

      {activeInput === "portion" && (
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            name="portion"
            value={formData.portion}
            onChange={handleChange}
            placeholder="Price for Portion"
            style={inputStyle}
          />
        </div>
      )}

      <div style={checkboxContainer}>
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
          id="availableCheckbox"
        />
        <label htmlFor="availableCheckbox" style={{ marginLeft: "8px" }}>
          Available
        </label>
      </div>

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Adding..." : "Add Item"}
      </button>
    </form>
  );
}
