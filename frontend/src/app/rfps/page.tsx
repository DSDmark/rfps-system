"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import Router from "next/router";

const columns = [
  { field: "title", headerName: "Title", width: 250 },
  { field: "budget", headerName: "Budget", width: 120 },
  { field: "status", headerName: "Status", width: 100 },
  {
    field: "createdAt",
    headerName: "Created",
    width: 150,
    valueFormatter: (params: any) =>
      new Date(params.value).toLocaleDateString(),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params: any) => (
      <Button size="small" onClick={() => Router.push(`/rfps/${params.id}`)}>
        View
      </Button>
    ),
  },
];

export default function RFPListPage() {
  const [rfps, setRfps] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchRFPs();
  }, []);

  const fetchRFPs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rfps");
      setRfps(res.data);
    } catch (err) {
      console.error("Error fetching RFPs:", err);
    }
  };

  const createNew = () => {
    router.push("/rfps/new");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        List of RFPs
      </Typography>
      <Button variant="contained" onClick={createNew} sx={{ mb: 2 }}>
        Create New RFP
      </Button>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rfps}
          columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          getRowId={(row: any) => row?._id}
        />
      </div>
    </Box>
  );
}
