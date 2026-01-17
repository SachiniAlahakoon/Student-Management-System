import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";

function DeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;