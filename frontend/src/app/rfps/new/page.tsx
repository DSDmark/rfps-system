"use client";
import RFPChat from "@/components/rfpchat";
import { Box, Typography } from "@mui/material";

export default function NewRFP() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Create New RFP
      </Typography>
      <RFPChat />
    </Box>
  );
}
