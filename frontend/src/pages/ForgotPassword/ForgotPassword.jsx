import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../../api/config";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/auth/reset-password`, {
        username,
        newPassword,
      });

      setMsg("Password updated successfully. You can now login.");
      setUsername("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErr("Failed to reset password");
    }
  };

  return (
    <div className="forgot-root">
      {/* Left image */}
      <div className="left-pane">
        <img src="/logo.png" alt="school" className="left-image" />
      </div>

      {/* Right card */}
      <div className="right-card">
        <h2 className="welcome">Reset Password</h2>
        <p className="subtitle">
          Set a new password for your account.
        </p>

        <form onSubmit={submit} className="forgot-form">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-submit">
            Reset Password
          </button>

          {msg && <div className="success">{msg}</div>}
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  );
}
