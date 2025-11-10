// --- Test Schema & Routes ---
const testSchema = new mongoose.Schema({
  name: String,
  email: String
});

const TestUser = mongoose.model("TestUser", testSchema);

// POST /api/test-insert  → insert a document
app.post("/api/test-insert", async (req, res) => {
  try {
    const { name, email } = req.body;
    const doc = await TestUser.create({ name, email });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/test-users  → read all documents
app.get("/api/test-users", async (_req, res) => {
  const docs = await TestUser.find();
  res.json(docs);
});
