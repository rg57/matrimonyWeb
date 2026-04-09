import React, { useEffect, useState } from "react"
import { getAllUsers } from "../api/userApi"
import UserTable from "../components/users/UserTable"
import { Box, Typography, Paper, Grid } from "@mui/material"
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined"
import OnlinePredictionOutlinedIcon from "@mui/icons-material/OnlinePredictionOutlined"
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined"

const statCards = [
  {
    label: "Total Users",
    key: "total",
    icon: <PeopleAltOutlinedIcon fontSize="small" />,
    color: "#185FA5",
    bg: "#E6F1FB",
  },
  {
    label: "Verified",
    key: "verified",
    icon: <VerifiedUserOutlinedIcon fontSize="small" />,
    color: "#0F6E56",
    bg: "#E1F5EE",
  },
  {
    label: "Active Today",
    key: "active",
    icon: <OnlinePredictionOutlinedIcon fontSize="small" />,
    color: "#3B6D11",
    bg: "#EAF3DE",
  },
  {
    label: "Blocked",
    key: "blocked",
    icon: <BlockOutlinedIcon fontSize="small" />,
    color: "#A32D2D",
    bg: "#FCEBEB",
  },
]

export default function Users() {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers()
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.isVerified).length,
    active: users.filter((u) => u.status === "active").length,
    blocked: users.filter((u) => u.status === "blocked").length,
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={500} color="text.primary">
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Manage all registered matrimony users
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid item xs={6} sm={3} key={card.key}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={500}
                  sx={{
                    color: card.key === "blocked" ? card.color : "text.primary",
                  }}
                >
                  {stats[card.key]}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* User Table */}
      <UserTable users={users} onRefresh={fetchUsers} />
    </Box>
  )
}
