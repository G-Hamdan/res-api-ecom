import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LabelComp from '../components/LabelComp';
import InputForm from '../components/InputForm';
import './SignUpPage.css';

const fieldConfig = [
  { name: "firstName", label: "First Name", type: "text", id: "inputFirstName" },
  { name: "lastName", label: "Last Name", type: "text", id: "inputLastName" },
  { name: "email", label: "Email", type: "email", id: "inputEmail" },
  { name: "password", label: "Password", type: "password", id: "inputPassword" },
];

const SignUpPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://res-api-ecom.onrender.com/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const { token } = await response.json();

      // ✅ Save token and mark user as logged in
      localStorage.setItem("token", token);
      if (setIsLoggedIn) setIsLoggedIn(true);

      // ✅ Redirect to /products
      navigate("/products");

    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="signup-page-container">
      <form onSubmit={handleSubmit} className="signup-form-wrapper">
        <h1>Sign Up</h1>

        {fieldConfig.map(({ name, label, type, id }) => (
          <div className="mb-3" key={id}>
            <LabelComp htmlFor={id} displayText={label} />
            <InputForm
              id={id}
              type={type}
              value={formData[name]}
              onChange={handleChange(name)}
              ariaDescribe={`${id}Help`}
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary">
          Register
        </button>

        <div className="text-center mt-3">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
