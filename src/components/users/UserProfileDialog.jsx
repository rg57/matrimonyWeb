import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Avatar,
  Grid,
  Chip,
  Divider,
  Button,
  Skeleton,
  IconButton,
} from "@mui/material"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import { getUserProfile } from "../../api/userApi"

function getInitials(user) {
  if (!user) return ""
  return (
    (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
  ).toUpperCase()
}

function InfoCard({ label, value }) {
  return (
    <Box
      sx={{
        bgcolor: "action.hover",
        borderRadius: 1.5,
        p: 1.5,
        height: "100%",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={0.4}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} color="text.primary">
        {value || "—"}
      </Typography>
    </Box>
  )
}

function SectionLabel({ children }) {
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "text.secondary",
        display: "block",
        mb: 1,
        mt: 2.5,
      }}
    >
      {children}
    </Typography>
  )
}

export default function UserProfileDialog({ open, onClose, user }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const isFemale = user?.gender === "Female"

  useEffect(() => {
    if (user && open) {
      setLoading(true)
      setData(null)
      getUserProfile(user.id)
        .then((res) => setData(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [user, open])

  const profile = data || user

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
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
          Full Profile
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        {loading ? (
          <Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={54} height={54} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" height={16} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
            <Grid container spacing={1.5}>
              {[...Array(6)].map((_, i) => (
                <Grid item xs={6} key={i}>
                  <Skeleton variant="rounded" height={56} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : profile ? (
          <>
            {/* Hero */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                pb: 2,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                mb: 0.5,
              }}
            >
              <Avatar
                sx={{
                  width: 54,
                  height: 54,
                  fontSize: 18,
                  fontWeight: 500,
                  bgcolor: isFemale ? "#FBEAF0" : "#E6F1FB",
                  color: isFemale ? "#72243E" : "#0C447C",
                  flexShrink: 0,
                }}
              >
                {getInitials(profile)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight={500}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {profile.city || "—"} &bull; {profile.age || "—"} years old
                  &bull; {profile.religion || "—"}
                </Typography>
              </Box>
              <Chip
                label={profile.status === "blocked" ? "Blocked" : "Active"}
                size="small"
                sx={{
                  height: 22,
                  fontSize: 11,
                  fontWeight: 500,
                  bgcolor: profile.status === "blocked" ? "#FCEBEB" : "#E1F5EE",
                  color: profile.status === "blocked" ? "#791F1F" : "#085041",
                  border: "none",
                }}
              />
            </Box>

            {/* Personal Details */}
            <SectionLabel>Personal details</SectionLabel>
            <Grid container spacing={1.2}>
              {[
                { label: "Gender", value: profile.gender },
                { label: "Looking for", value: profile.lookingFor },
                { label: "Religion", value: profile.religion },
                { label: "Phone", value: profile.phoneNumber },
                {
                  label: "Verification",
                  value: profile.isVerified ? "Verified" : "Pending",
                },
                {
                  label: "Joined",
                  value: profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—",
                },
              ].map((item) => (
                <Grid item xs={6} key={item.label}>
                  <InfoCard label={item.label} value={item.value} />
                </Grid>
              ))}
            </Grid>

            {/* Professional */}
            <SectionLabel>Professional</SectionLabel>
            <Grid container spacing={1.2}>
              {[
                {
                  label: "Profession",
                  value: profile.professional?.profession || profile.profession,
                },
                {
                  label: "Education",
                  value: profile.professional?.education || profile.education,
                },
              ].map((item) => (
                <Grid item xs={6} key={item.label}>
                  <InfoCard label={item.label} value={item.value} />
                </Grid>
              ))}
            </Grid>

            {/* Bio */}
            {(profile.profile?.bio || profile.bio) && (
              <>
                <SectionLabel>Bio</SectionLabel>
                <Box
                  sx={{
                    bgcolor: "action.hover",
                    borderRadius: 1.5,
                    p: 1.5,
                    fontSize: 13,
                    color: "text.secondary",
                    lineHeight: 1.6,
                  }}
                >
                  {profile.profile?.bio || profile.bio}
                </Box>
              </>
            )}
          </>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 3, textAlign: "center" }}
          >
            No profile data available.
          </Typography>
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
