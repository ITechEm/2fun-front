'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Password reset! Redirecting to login...");
      setTimeout(() => router.push("/account"), 2000);
    } else {
      setMessage(`❌ ${data.error || "Reset failed"}`);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: 10, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: 10, width: "100%" }}
        />
        <button type="submit" style={{ padding: 10, width: "100%", background: "#1f1f1f", color: "#fff" }}>
          Reset Password
        </button>
      </form>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
