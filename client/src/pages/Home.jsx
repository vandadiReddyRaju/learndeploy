export default function Home() {
  const token = localStorage.getItem("token");
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to MERN Auth App</h1>
      {token ? <p>✅ You are logged in!</p> : <p>🔒 Please sign in first.</p>}
    </div>
  );
}
