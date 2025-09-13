export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    // TODO: Replace this placeholder with your LLM call
    const reply = `You said: ${message}`;

    return res.status(200).json({ reply });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
