// api/chat.js
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error("Bad OpenAI response:", data);
      return res.status(500).json({ error: "Invalid OpenAI response", data });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.toString() });
  }
};
