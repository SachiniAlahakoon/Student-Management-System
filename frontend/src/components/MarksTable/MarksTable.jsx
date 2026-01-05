import React, { useEffect, useState, useCallback } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

export default function MarksTable({ classId, subjectId, term, year }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editRowId, setEditRowId] = useState(null);
  const [editMarks, setEditMarks] = useState("");

  const [deleteRowId, setDeleteRowId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Pagination & search
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  // Normalize server data safely
  const normalizeRows = (data) =>
    data.map((row, index) => ({
      result_id: row.result_id ?? row.student_id ?? index,
      student_name: row.student_name ?? "Unknown",
      reg_no: row.reg_no ?? "-",
      marks: row.marks === null ? null : row.marks,
      grade: row.grade ?? "N/A",
    }));

  const fetchData = useCallback(async () => {
    if (!classId || !subjectId || !term || !year) {
      setRows([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/teacher/marks",
        {
          params: {
            class_id: classId,
            subject_id: subjectId,
            term,
            year,
            page: page + 1,
            limit: pageSize,
            search,
          },
        }
      );

      const data = res.data?.data || [];
      setRows(normalizeRows(data));
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [classId, subjectId, term, year, page, pageSize, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Edit handlers
  const handleEditClick = (row) => {
    setEditRowId(row.result_id);
    setEditMarks(row.marks ?? "");
  };

  const handleSaveClick = async (rowId) => {
    try {
      await axios.put(
        "http://localhost:5000/api/teacher/marks/update-one",
        {
          result_id: rowId,
          marks: editMarks,
        }
      );

      setRows((prev) =>
        prev.map((row) =>
          row.result_id === rowId
            ? { ...row, marks: editMarks }
            : row
        )
      );

      setEditRowId(null);
      setEditMarks("");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save mark");
    }
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditMarks("");
  };

  // Delete handlers
  const handleDeleteClick = (row) => {
    setDeleteRowId(row.result_id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/teacher/marks/update-one",
        {
          result_id: deleteRowId,
          marks: null,
        }
      );

      setRows((prev) =>
        prev.map((row) =>
          row.result_id === deleteRowId
            ? { ...row, marks: null }
            : row
        )
      );

      setDeleteRowId(null);
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete mark");
    }
  };

  const columns = [
    { field: "reg_no", headerName: "Reg No", width: 120 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    {
      field: "marks",
      headerName: "Marks",
      width: 120,
      renderCell: (params) =>
        editRowId === params.row.result_id ? (
          <TextField
            type="number"
            size="small"
            value={editMarks}
            onChange={(e) => setEditMarks(e.target.value)}
          />
        ) : params.value === null ? (
          "N/A"
        ) : (
          params.value
        ),
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 100,
      valueGetter: (params) => params.row?.grade ?? "N/A",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 140,
      getActions: (params) =>
        editRowId === params.row.result_id
          ? [
              <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Save"
                onClick={() =>
                  handleSaveClick(params.row.result_id)
                }
              />,
              <GridActionsCellItem
                key="cancel"
                icon={<CloseIcon />}
                label="Cancel"
                onClick={handleCancelEdit}
              />,
            ]
          : [
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="Edit"
                onClick={() => handleEditClick(params.row)}
              />,
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row)}
              />,
            ],
    },
  ];

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <TextField
        label="Search by Name or Reg No"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.result_id}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={rows.length}
        autoHeight
        disableSelectionOnClick
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this mark?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
