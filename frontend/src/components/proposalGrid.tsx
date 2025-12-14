"use client";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, Typography, Box } from "@mui/material";
import axios from "axios";
import { getRFPProposalsAPI } from "@/apis/rpf";

export default function ProposalGrid({ rfpId }: any) {
  const [proposals, setProposals] = useState([]);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, [rfpId]);

  const fetchProposals = async () => {
    try {
      setLoading(true);

      const res = await getRFPProposalsAPI(rfpId);

      if (res.remote === "success") {
        setProposals(res.data?.proposals || []);
        setComparison(res.data?.comparison || []);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      field: "vendor",
      headerName: "Vendor",
      width: 150,
      valueGetter: (params: any) => params.row.vendor?.name,
    },
    {
      field: "totalPrice",
      headerName: "Total Price",
      width: 120,
      valueGetter: (params: any) =>
        params?.row?.pricing?.reduce(
          (sum: any, p: any) => sum + (p.price * p.quantity || 0),
          0,
        ),
    },
    { field: "score", headerName: "AI Score", width: 100 },
    { field: "deliveryEstimate", headerName: "Delivery", width: 120 },
    {
      field: "actions",
      headerName: "Details",
      width: 100,
      renderCell: (params: any) => (
        <Button
          size="small"
          onClick={() => alert(JSON.stringify(params.row, null, 2))}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) return <Typography>Loading proposals...</Typography>;

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">Proposal Comparison</Typography>
      <div style={{ height: 400, width: "100%", marginTop: 2 }}>
        <DataGrid
          rows={proposals?.length ? proposals : []}
          columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          getRowId={(row: any) => row._id}
        />
      </div>
      {comparison && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50" }}>
          <Typography variant="h6">AI Evaluation</Typography>
          <Typography>
            <strong>Summary:</strong> {comparison.summary}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Recommendation:</strong> {comparison.recommendation.vendor}{" "}
            because {comparison.recommendation.why}
          </Typography>
        </Box>
      )}
      <Button onClick={fetchProposals} variant="outlined" sx={{ mt: 1 }}>
        Refresh
      </Button>
    </Card>
  );
}
