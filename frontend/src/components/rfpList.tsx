"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { getRFPsAPI } from "@/apis/rpf";
import { useRouter } from "next/navigation";

const columns = (router: any) => [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 100 },
  {
    field: "createdAt",
    headerName: "Created",
    width: 120,
    valueFormatter: (params: any) => params.value,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params: any) => (
      <Button size="small" onClick={() => router.push(`/rfps/${params.id}`)}>
        View
      </Button>
    ),
  },
];

export default function RFPList() {
  const [rfps, setRfps] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await getRFPsAPI();
      if (res.remote === "success") {
        setRfps(res?.data?.data);
      }
    })();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent RFPs
      </Typography>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={rfps}
          columns={columns(router)}
          // pageSize={3}
          // rowsPerPageOptions={[3]}
          getRowId={(row: any) => row._id}
        />
      </div>
    </Box>
  );
}
