"use client";

import { useState } from "react";

export default function WholesalerLoginModal({ isOpen, onClose, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    await onLogin(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
        
        <h2 className="text-xl font-semibold mb-4 text-center">
          Wholesaler Login
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-600 transition"
          >
            Login
          </button>

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}