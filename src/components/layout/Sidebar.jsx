import React from "react"
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"

const drawerWidth = 220

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Reports", path: "/reports" },
  ]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#1e1e2f",
          color: "#fff",
        },
      }}
    >
      <h2 style={{ padding: "16px" }}>Admin Panel</h2>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.name}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3f51b5",
              },
            }}
          >
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}
