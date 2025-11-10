import { useState } from "react";
import { signup } from "../api";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      setMsg("✅ Account created successfully!");
    } else setMsg(res.message || "Signup failed");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Create Account</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
