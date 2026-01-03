import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

export default function MarksTable({ filters }) {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogRows, setDialogRows] = useState([]);

  // Fetch marks
  const fetchMarks = useCallback(async () => {
    if (!filters?.class_id || !filters?.subject_id || !filters?.term || !filters?.year) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/teacher/marks", {
        params: {
          page: page + 1,
          limit: pageSize,
          search,
          ...filters,
        },
      });

      setRows(res.data.data || []);
      setRowCount(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, search]);

  useEffect(() => {
    setPage(0);
    setSelectedRowIds([]);
  }, [filters, search]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  const columns = [
    { field: "student_id", headerName: "ID", width: 80 },
    { field: "reg_no", headerName: "Reg No", width: 120 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "marks", headerName: "Marks", width: 100 },
    { field: "grade", headerName: "Grade", width: 100 },
    { field: "term", headerName: "Term", width: 90 },
    { field: "year", headerName: "Year", width: 90 },
  ];

  const handleOpenDialog = () => {
    const selected = rows.filter((r) => selectedRowIds.includes(r.result_id));
    setDialogRows(selected);
    setOpenDialog(true);
  };

  const handleDialogChange = (index, value) => {
    const updated = [...dialogRows];
    updated[index].marks = value;
    setDialogRows(updated);
  };

  const handleSubmitUpdate = async () => {
    if (!dialogRows.length) return;

    try {
      await axios.put("http://localhost:5000/api/teacher/marks/update", {
        marks: dialogRows.map((r) => ({
          result_id: r.result_id,
          marks: r.marks,
        })),
      });

      alert("Marks updated successfully");
      setOpenDialog(false);
      setSelectedRowIds([]);
      fetchMarks();
    } catch (err) {
      console.error(err);
      alert("Failed to update marks");
    }
  };

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
        <TextField
          label="Search by Name or Reg No"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          disabled={selectedRowIds.length === 0}
          onClick={handleOpenDialog}
        >
          Update Marks
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.result_id}
        checkboxSelection
        disableRowSelectionOnClick

        pagination
        paginationMode="server"
        rowCount={rowCount}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}

        loading={loading}

        selectionModel={selectedRowIds}
        onSelectionModelChange={(selection) => {
          const ids = selection.selectionModel || [];
          setSelectedRowIds(ids.map(Number));
        }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Selected Marks</DialogTitle>
        <DialogContent>
          {dialogRows.map((row, i) => (
            <Box key={row.result_id} sx={{ display: "flex", gap: 2, mb: 1 }}>
              <Box sx={{ width: 200 }}>{row.student_name}</Box>
              <TextField
                type="number"
                size="small"
                value={row.marks}
                onChange={(e) => handleDialogChange(i, e.target.value)}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmitUpdate}>
            Submit Update
          </Button>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
