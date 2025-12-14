"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";
import VendorSelector from "@/components/vendorSelector";
import ProposalGrid from "@/components/proposalGrid";
import { getRFPByIdAPI, getVendorsAPI, sendRFPAPI } from "@/apis/rpf";

export default function RFPage() {
  const { id } = useParams();
  console.log(id, "here");
  const [rfp, setRfp] = useState<any>(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [showProposals, setShowProposals] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetchRFP();
    fetchVendors();
  }, [id]);

  const fetchRFP = async () => {
    const res = await getRFPByIdAPI(id as string);

    if (res.remote === "success") {
      setRfp(res.data);
    }
  };

  const fetchVendors = async () => {
    const res = await getVendorsAPI();

    if (res.remote === "success") {
      setVendors(res.data?.data);
    }
  };

  const handleSend = async () => {
    if (selectedVendors.length === 0) return;

    const res = await sendRFPAPI(id as string, selectedVendors);

    if (res.remote === "success") {
      alert("RFP sent successfully!");
      fetchRFP();
    }
  };

  if (!rfp) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {rfp.title}
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Description</Typography>
          <Typography>{rfp.description}</Typography>
          <Box sx={{ mt: 2 }}>
            <Chip label={`Budget: $${rfp.budget}`} color="primary" />
            <Chip
              label={`Status: ${rfp.status}`}
              color={rfp.status === "sent" ? "success" : "default"}
              sx={{ ml: 1 }}
            />
            <Chip label={`Delivery: ${rfp.deliveryTimeline}`} sx={{ ml: 1 }} />
          </Box>
          {rfp.status === "draft" && (
            <Box sx={{ mt: 2 }}>
              <Typography>Select Vendors to Send:</Typography>
              <VendorSelector
                vendors={vendors}
                selected={selectedVendors}
                onChange={setSelectedVendors}
              />
              <Button variant="contained" onClick={handleSend} sx={{ mt: 1 }}>
                Send RFP
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      {rfp.proposals && rfp.proposals.length > 0 && (
        <Button onClick={() => setShowProposals(!showProposals)}>
          {showProposals ? "Hide" : "Show"} Proposals
        </Button>
      )}
      {showProposals && <ProposalGrid rfpId={id} />}
    </Box>
  );
}
