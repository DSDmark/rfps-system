"use client";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";

export default function VendorSelector({ vendors, selected, onChange }: any) {
  const handleChange = (event: any) => {
    const value = event.target.value;
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel>Vendors</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(selected) =>
          selected
            .map((id: any) => {
              const vendor = vendors.find((v: any) => v._id === id);
              return vendor ? vendor.name : "";
            })
            .join(", ")
        }
      >
        {vendors.map((vendor: any) => (
          <MenuItem key={vendor._id} value={vendor._id}>
            <Checkbox checked={selected.indexOf(vendor._id) > -1} />
            <ListItemText primary={vendor.name} secondary={vendor.email} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
