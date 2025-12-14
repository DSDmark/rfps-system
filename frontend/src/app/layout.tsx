"use client";
import { Inter } from "next/font/google";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import { IChildrenProps } from "@/types";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

export default function RootLayout({ children }: IChildrenProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar
            position="static"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Toolbar>
              <Typography variant="h6" component="div">
                RFP Workflow Assistant
              </Typography>
            </Toolbar>
            <Button
              variant="text"
              LinkComponent={Link}
              href="/"
              sx={{ color: "white" }}
            >
              Dashboard
            </Button>
          </AppBar>
          <Container sx={{ mt: 4, mb: 4 }}>{children}</Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
