import React from "react"
import { Box } from "@mui/material"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f5f6fa",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
