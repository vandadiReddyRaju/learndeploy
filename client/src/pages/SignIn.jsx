import { useState } from "react";
import { signin } from "../api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signin(email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      setMsg("✅ Signed in successfully!");
    } else setMsg(res.message || "Signin failed");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign In</h2>
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
        <button type="submit">Sign In</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
