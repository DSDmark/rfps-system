"use client";
import { useState } from "react";
import { Tabs, Tab, Box, Typography, Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import RFPList from "@/components/rfpList";
import VendorList from "@/components/vendorList";
import ProposalOverview from "@/components/proposalOverview";

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (_: any, newValue: number) => {
    setTabValue(newValue);

    //   if (newValue === 0) {
    //     router.push("/rfps");
    //   } else if (newValue === 1) {
    //     router.push("/vendors");
    //   } else if (newValue === 2) {
    //     router.push("/proposals");
    //   }
  };

  const handleCreateClick = () => {
    if (tabValue === 1) {
      router.push("/vendor");
    } else if (tabValue === 2) {
      router.push("/proposals");
    } else {
      router.push("/rfps/new");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Button variant="contained" onClick={handleCreateClick} sx={{ mb: 2 }}>
        {tabValue === 1 ? "view Vendors" : "Create New RFP"}
      </Button>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="RFPs" />
        <Tab label="Vendors" />
        <Tab label="Proposals" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && <RFPList />}
        {tabValue === 1 && <VendorList />}
        {tabValue === 2 && <ProposalOverview />}
      </Box>
    </Box>
  );
}
