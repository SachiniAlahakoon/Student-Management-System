import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api/config";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        username,
        password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      const role = data.user.role;

      if (role === "admin") {
        navigate("/dashboard/admin");
      } else if (role === "student") {
        navigate("/dashboard/student");
      } else if (role === "teacher") {
        navigate("/dashboard/teacher");
      } else {
        setErr("Unknown user role");
      }
    } catch (error) {
      // Axios error handling
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErr(error.response.data.message);
      } else {
        setErr("Login failed");
      }
    }
  };

  return (
    <div className="login-root">
      <div className="left-pane">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6RebpMnWu7Hi2RSCr8JCtpj0HvcT3Lxb4FQ&s"
          alt="school"
          className="left-image"
        />
      </div>

      <div className="right-card">
        <h2 className="welcome">Welcome</h2>
        <p className="subtitle">Please login to your account.</p>

        <form onSubmit={submit} className="login-form">
          <label>Username or Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="row">
            <a className="forgot" href="/forgot">
              Forgot Password?
            </a>
            <button className="btn-login" type="submit">
              Login
            </button>
          </div>

          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  );
}
