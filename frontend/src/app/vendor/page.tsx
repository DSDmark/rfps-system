"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { createVendorAPI, deleteVendorAPI, getVendorsAPI } from "@/apis/rpf";

const columns = (handleDelete: any) => [
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "contactInfo", headerName: "Contact Info", width: 200 },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params: any) => (
      <Button
        size="small"
        color="error"
        onClick={() => handleDelete(params.id)}
      >
        Delete
      </Button>
    ),
  },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactInfo: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const res = await getVendorsAPI();
    if (res.remote === "success") {
      setVendors(res.data?.data);
    }
  };

  const handleAdd = async () => {
    const res = await createVendorAPI(formData);
    if (res.remote === "success") {
      setOpenDialog(false);
      setFormData({ name: "", email: "", contactInfo: "" });
      fetchVendors();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const res = await deleteVendorAPI(id);
    if (res.remote === "success") {
      fetchVendors();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Vendors
      </Typography>
      <Button
        variant="contained"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Add Vendor
      </Button>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={vendors}
          columns={columns(handleDelete)}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          getRowId={(row: any) => row._id}
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Info"
            value={formData.contactInfo}
            onChange={(e) =>
              setFormData({ ...formData, contactInfo: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
