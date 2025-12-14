"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { createRFPAPI } from "@/apis/rpf";

export default function RFPChat() {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMsg = { role: "user", content: input };
    setMessages((prev: any) => [...prev, userMsg]);

    try {
      const res = await createRFPAPI(input);

      if (res.remote === "success") {
        const rfp = res.data?.data;
        setMessages((prev: any) => [
          ...prev,
          {
            role: "assistant",
            content: `RFP created successfully! ID: ${rfp._id}`,
          },
        ]);
        setTimeout(() => router.push(`/rfps/${rfp._id}`), 1500);
      } else {
        setMessages((prev: any) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${res.error || "Failed to create RFP"}`,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev: any) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message || "Failed to create RFP"}`,
        },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Describe Your Procurement Needs
      </Typography>
      <Box
        sx={{
          height: 300,
          border: "1px solid grey",
          p: 1,
          mb: 2,
          overflowY: "auto",
        }}
      >
        {messages.map((msg: any, i: number) => (
          <Box
            key={i}
            sx={{
              mb: 1,
              p: 1,
              bgcolor: msg.role === "user" ? "primary.light" : "grey.100",
              borderRadius: 1,
            }}
          >
            <strong>{msg.role.toUpperCase()}:</strong> {msg.content}
          </Box>
        ))}
        {loading && (
          <Box sx={{ p: 1, bgcolor: "grey.100" }}>
            <strong>Assistant:</strong> Generating RFP...
          </Box>
        )}
      </Box>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g., I need 20 laptops with 16GB RAM, budget $50k..."
        onKeyDown={(e) =>
          e.key === "Enter" &&
          !e.shiftKey &&
          (e.preventDefault(), handleSubmit())
        }
      />
      <Button
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
      >
        Generate RFP
      </Button>
    </Box>
  );
}
