
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Leaf, LockKeyhole, Mail } from "lucide-react";
import "./login.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login gagal.");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <section className="login-card">
        <div className="login-brand">
          <span className="login-logo"><Leaf size={26} /></span>
          <span>
            <strong>Titik Sujud</strong>
            <small>ADMINISTRATION PORTAL</small>
          </span>
        </div>

        <p className="login-eyebrow">SELAMAT DATANG KEMBALI</p>
        <h1>Ruang pengelola.</h1>
        <p className="login-description">
          Masuk untuk mengelola pengajuan kolaborasi dan jangkauan
          layanan Titik Sujud.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email admin</label>
          <div className="login-input">
            <Mail size={18} />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="Email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>
          <div className="login-input">
            <LockKeyhole size={18} />
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Memeriksa akses..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <p className="login-footer">
          Ruang pengelola internal · Titik Sujud
        </p>
      </section>
    </main>
  );
}