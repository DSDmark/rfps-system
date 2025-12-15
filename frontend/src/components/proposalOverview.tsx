"use client";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { getProposalsAPI } from "@/apis/rpf";
import { formatDateUtil } from "@/utils";

const columns = [
  {
    field: "rfpTitle",
    headerName: "RFP",
    width: 200,
    renderCell: (params: any) => (
      <Link href={`/rfps/${params.row.rfp._id}`}>{params.value}</Link>
    ),
  },
  { field: "vendorName", headerName: "Vendor", width: 150 },
  { field: "score", headerName: "Score", width: 80 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 120,
    valueFormatter: (params: any) => formatDateUtil(params.createdAt),
  },
];

export default function ProposalOverview() {
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getProposalsAPI();
      if (res.remote === "success") {
        setProposals(res.data?.data || []);
      }
    })();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Proposals
      </Typography>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={
            proposals?.map((p) => ({
              ...p,
              rfpTitle: p?.rfp?.title,
              vendorName: p?.vendor?.name,
            })) || []
          }
          columns={columns}
          // pageSize={3}
          // rowsPerPageOptions={[3]}
          getRowId={(row) => row._id}
        />
      </div>
    </Box>
  );
}
