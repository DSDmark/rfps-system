"use client";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { getVendorsAPI } from "@/apis/rpf";

const columns = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
];

export default function VendorList() {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getVendorsAPI();
      if (res.remote === "success") {
        setVendors(res.data?.data);
      }
    })();
  }, []);
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vendors
      </Typography>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={vendors}
          columns={columns}
          // pageSize={3}
          // rowsPerPageOptions={[3]}
          getRowId={(row) => row._id}
        />
      </div>
    </Box>
  );
}
