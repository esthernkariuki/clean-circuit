import React, { useState, useEffect } from "react";


export default function ProductModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    type: "",
    quantity: "",
    image: null,
  });


  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || "",
        quantity: initialData.quantity || "",
        image: null,
      });
    } else {
      setForm({
        type: "",
        quantity: "",
        image: null,
      });
    }
  }, [initialData]);


  if (!open) return null;


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("type", form.type);
    data.append("quantity", form.quantity);
    if (form.image) data.append("image", form.image);
    onSave(data);
  };


  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{initialData ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="product-form" data-testid="product-form">
          <label>
            Type:
            <input
              name="type"
              type="text"
              value={form.type}
              onChange={handleChange}
              required
              placeholder="Enter product type"
            />
          </label>
          <label>
            Quantity:
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="Enter quantity"
            />
          </label>
          <label>
            Image:
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          <div className="form-buttons">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
