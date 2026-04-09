import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined"
// TODO: replace with your actual reports API
// import { getUserReports } from "../../api/userApi"

export default function ReportDialog({ open, onClose, user }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && open) {
      setLoading(true)

      // TODO: replace with real API call:
      // getUserReports(user.id).then(res => setReports(res.data)).finally(() => setLoading(false))

      // Mock data — remove once API is connected
      setTimeout(() => {
        setReports([
          {
            id: 1,
            reason: "Fake Profile",
            message:
              "This user appears to be using fabricated photos and false information.",
            reportedBy: "Anonymous",
            date: "2024-04-01",
          },
          {
            id: 2,
            reason: "Abusive Behavior",
            message:
              "Sent inappropriate and offensive messages to multiple users.",
            reportedBy: "Anonymous",
            date: "2024-04-03",
          },
        ])
        setLoading(false)
      }, 400)
    }
  }, [user, open])

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        elevation: 0,
        sx: {
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "0.5px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1" fontWeight={500}>
          User Reports
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        {/* Subheading */}
        {user && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1.5}
          >
            Reports against{" "}
            <Box
              component="span"
              sx={{ color: "text.primary", fontWeight: 500 }}
            >
              {user.firstName} {user.lastName}
            </Box>
          </Typography>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={90}
                sx={{ borderRadius: 1.5 }}
              />
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <FlagOutlinedIcon sx={{ fontSize: 32, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">
              No reports found for this user
            </Typography>
          </Box>
        )}

        {/* Report Cards */}
        {!loading && reports.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {reports.map((r) => (
              <Box
                key={r.id}
                sx={{
                  border: "0.5px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 1.5,
                }}
              >
                {/* Reason tag + title */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.8,
                  }}
                >
                  <Chip
                    label="Report"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 500,
                      bgcolor: "#FCEBEB",
                      color: "#A32D2D",
                      border: "none",
                      "& .MuiChip-label": { px: 0.8 },
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.primary"
                  >
                    {r.reason}
                  </Typography>
                </Box>

                {/* Message */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  lineHeight={1.5}
                  mb={0.8}
                >
                  {r.message}
                </Typography>

                {/* Footer */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    Reported by {r.reportedBy}
                  </Typography>
                  {r.date && (
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(r.date)}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={onClose}
          sx={{ fontSize: 13, textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
