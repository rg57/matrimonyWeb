import React, { useState, useMemo } from "react"
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined"
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined"
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined"
import UserProfileDialog from "./UserProfileDialog"
import ReportDialog from "./ReportDialog"
import { blockUser, deleteUser } from "../../api/userApi"

function getInitials(user) {
  return (
    (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
  ).toUpperCase()
}

function AvatarCell({ user }) {
  const isFemale = user.gender === "Female"
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar
        sx={{
          width: 34,
          height: 34,
          fontSize: 13,
          fontWeight: 500,
          bgcolor: isFemale ? "#FBEAF0" : "#E6F1FB",
          color: isFemale ? "#72243E" : "#0C447C",
        }}
      >
        {getInitials(user)}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={500} lineHeight={1.3}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.city || "—"}, {user.age || "—"} yrs
        </Typography>
      </Box>
    </Box>
  )
}

const VERIFIED_CHIP = {
  true: { label: "Verified", bgcolor: "#EAF3DE", color: "#27500A" },
  false: { label: "Pending", bgcolor: "#F1EFE8", color: "#444441" },
}

const STATUS_CHIP = {
  active: { label: "Active", bgcolor: "#E1F5EE", color: "#085041" },
  blocked: { label: "Blocked", bgcolor: "#FCEBEB", color: "#791F1F" },
}

const GENDER_CHIP = {
  Male: { label: "Male", bgcolor: "#E6F1FB", color: "#0C447C" },
  Female: { label: "Female", bgcolor: "#FBEAF0", color: "#72243E" },
}

function StatusBadge({ type, value }) {
  const map =
    type === "verified"
      ? VERIFIED_CHIP
      : type === "status"
        ? STATUS_CHIP
        : GENDER_CHIP
  const cfg = map[value] || {
    label: value,
    bgcolor: "#F1EFE8",
    color: "#444441",
  }
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 500,
        bgcolor: cfg.bgcolor,
        color: cfg.color,
        border: "none",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  )
}

const HEAD_CELLS = [
  { id: "name", label: "User", width: "22%" },
  { id: "phone", label: "Phone", width: "14%" },
  { id: "gender", label: "Gender", width: "10%" },
  { id: "verified", label: "Verified", width: "10%" },
  { id: "status", label: "Status", width: "10%" },
  { id: "joined", label: "Joined", width: "12%" },
  { id: "actions", label: "Actions", width: "22%" },
]

export default function UserTable({ users = [], onRefresh }) {
  const [search, setSearch] = useState("")
  const [genderFilter, setGenderFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [openProfile, setOpenProfile] = useState(false)
  const [openReport, setOpenReport] = useState(false)
  const [localUsers, setLocalUsers] = useState(null)

  const data = localUsers || users

  const filtered = useMemo(() => {
    return data.filter((u) => {
      const name = `${u.firstName} ${u.lastName}`.toLowerCase()
      const phone = u.phoneNumber || ""
      const matchSearch =
        !search || name.includes(search.toLowerCase()) || phone.includes(search)
      const matchGender = !genderFilter || u.gender === genderFilter
      return matchSearch && matchGender
    })
  }, [data, search, genderFilter])

  const handleBlock = async (userId) => {
    try {
      const confirmAction = window.confirm(
        "Are you sure you want to block/unblock this user?",
      )

      if (!confirmAction) return

      const res = await blockUser(userId)

      console.log("Block API Response:", res.data)

      // update UI locally (no UI change logic)
      const updated = data.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: u.status === "blocked" ? "active" : "blocked",
            }
          : u,
      )

      setLocalUsers(updated)

      // optional refresh if you use backend truth
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Block Error:", error)
      alert("Something went wrong while blocking user")
    }
  }

  const handleDelete = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to DELETE this user? This action cannot be undone.",
      )

      if (!confirmDelete) return

      const res = await deleteUser(userId)

      console.log("Delete API Response:", res.data)

      // remove user from UI
      const updated = data.filter((u) => u.id !== userId)
      setLocalUsers(updated)

      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Delete Error:", error)
      alert("Failed to delete user")
    }
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Table Header Controls */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "0.5px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            All Users
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Search name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 200,
                "& .MuiOutlinedInput-root": { fontSize: 13, height: 34 },
              }}
            />
            <Select
              size="small"
              displayEmpty
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              sx={{ fontSize: 13, height: 34, minWidth: 120 }}
            >
              <MenuItem value="">All Genders</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                {HEAD_CELLS.map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      width: cell.width,
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "text.secondary",
                      py: 1.2,
                      borderBottom: "0.5px solid",
                      borderColor: "divider",
                    }}
                  >
                    {cell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 4, color: "text.secondary", fontSize: 13 }}
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell sx={{ py: 1.5 }}>
                      <AvatarCell user={u} />
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, py: 1.5 }}>
                      {u.phoneNumber}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <StatusBadge type="gender" value={u.gender} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <StatusBadge
                        type="verified"
                        value={String(u.isVerified)}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <StatusBadge type="status" value={u.status || "active"} />
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 13, color: "text.secondary", py: 1.5 }}
                    >
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View Profile">
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: "#E6F1FB",
                              color: "#185FA5",
                              borderRadius: 1,
                              "&:hover": { bgcolor: "#B5D4F4" },
                            }}
                            onClick={() => {
                              setSelectedUser(u)
                              setOpenProfile(true)
                            }}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            u.status === "blocked"
                              ? "Unblock User"
                              : "Block User"
                          }
                        >
                          <IconButton
                            size="small"
                            sx={
                              u.status === "blocked"
                                ? {
                                    bgcolor: "#EAF3DE",
                                    color: "#3B6D11",
                                    borderRadius: 1,
                                    "&:hover": { bgcolor: "#C0DD97" },
                                  }
                                : {
                                    bgcolor: "#FCEBEB",
                                    color: "#A32D2D",
                                    borderRadius: 1,
                                    "&:hover": { bgcolor: "#F7C1C1" },
                                  }
                            }
                            onClick={() => handleBlock(u.id)}
                          >
                            {u.status === "blocked" ? (
                              <LockOpenOutlinedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <BlockOutlinedIcon sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="View Reports">
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: "#FAEEDA",
                              color: "#854F0B",
                              borderRadius: 1,
                              "&:hover": { bgcolor: "#FAC775" },
                            }}
                            onClick={() => {
                              setSelectedUser(u)
                              setOpenReport(true)
                            }}
                          >
                            <FlagOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: "#FCEBEB",
                              color: "#A32D2D",
                              borderRadius: 1,
                              "&:hover": { bgcolor: "#F7C1C1" },
                            }}
                            onClick={() => handleDelete(u.id)}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1.2,
            borderTop: "0.5px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {filtered.length} of {data.length} users
          </Typography>
        </Box>
      </Paper>

      {/* Modals */}
      <UserProfileDialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        user={selectedUser}
      />
      <ReportDialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        user={selectedUser}
      />
    </>
  )
}
