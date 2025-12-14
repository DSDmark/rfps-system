"use client";
import { useParams } from "next/navigation";
import ProposalGrid from "@/components/proposalGrid";
import { Box, Typography } from "@mui/material";

export default function ProposalsPage() {
  const { rfpId } = useParams();
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Proposals
      </Typography>
      <ProposalGrid rfpId={rfpId} />
    </Box>
  );
}
