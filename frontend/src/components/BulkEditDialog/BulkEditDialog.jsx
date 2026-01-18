import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function BulkEditDialog({
  open,
  onClose,
  onSave,
  selectionModel,
  rows,
  bulkEditMarks,
  bulkErrors,
  setBulkEditMarks,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Bulk Update Marks</DialogTitle>
      <DialogContent>
        {selectionModel.map((id) => {
          const row = rows.find((r) => r.id === id);
          if (!row) return null;

          return (
            <div key={id} className="bulk-edit-row">
              <div className="bulk-edit-name">{row.student_name}</div>
              <div>
                <TextField
                  type="number"
                  size="small"
                  inputProps={{ min: 0, max: 100 }}
                  value={bulkEditMarks[id] ?? ""}
                  onChange={(e) =>
                    setBulkEditMarks((prev) => ({
                      ...prev,
                      [id]: e.target.value,
                    }))
                  }
                  error={!!bulkErrors[id]}
                />
                {bulkErrors[id] && (
                  <p className="error-text">{bulkErrors[id]}</p>
                )}
              </div>
            </div>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BulkEditDialog;