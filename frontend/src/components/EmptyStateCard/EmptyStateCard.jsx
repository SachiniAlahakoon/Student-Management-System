import React from "react";
import { Typography, Box } from "@mui/material";
import "./EmptyStateCard.css";

function EmptyStateCard({
  message,
  height = 300,
  children,
}) {
  return (
    <Box className="empty-state-card" sx={{height}}>
      <div>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>

        {children && (
          <div className="empty-state-content">
            {children}
          </div>
        )}
      </div>
    </Box>
  );
}

export default EmptyStateCard;