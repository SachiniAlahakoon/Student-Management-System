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
import axios from "axios";

export default function MarksTable({ classId, subjectId, term, year }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [editRowId, setEditRowId] = useState(null);
  const [editMarks, setEditMarks] = useState("");
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Fetch marks from server
  const fetchMarks = useCallback(async () => {
    if (!classId || !subjectId || !term || !year) {
      setRows([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/teacher/marks", {
        params: {
          class_id: classId,
          subject_id: subjectId,
          term,
          year,
          page: page + 1,
          limit: pageSize,
          search,
        },
      });

      const data = res.data?.data || [];
      setRows(
        data.map((row) => ({
          ...row,
          marks: row.marks ?? "",
          grade: row.grade ?? "N/A",
        }))
      );
    } catch (err) {
      console.error("Fetch marks error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [classId, subjectId, term, year, page, pageSize, search]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  const handleEditClick = (row) => {
    setEditRowId(row.result_id);
    setEditMarks(row.marks ?? "");
  };

  const handleSaveClick = async (rowId) => {
    try {
      await axios.put("http://localhost:5000/api/teacher/marks/update-one", {
        result_id: rowId,
        marks: editMarks,
      });
      setRows((prev) =>
        prev.map((row) =>
          row.result_id === rowId ? { ...row, marks: editMarks } : row
        )
      );
      setEditRowId(null);
      setEditMarks("");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save mark");
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteRowId(row.result_id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.put("http://localhost:5000/api/teacher/marks/update-one", {
        result_id: deleteRowId,
        marks: null,
      });
      setRows((prev) =>
        prev.map((row) =>
          row.result_id === deleteRowId ? { ...row, marks: "" } : row
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
        editRowId === params.row?.result_id ? (
          <TextField
            type="number"
            size="small"
            value={editMarks}
            onChange={(e) => setEditMarks(e.target.value)}
          />
        ) : params.row?.marks !== null && params.row?.marks !== "" ? (
          params.row.marks
        ) : (
          "N/A"
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
      width: 120,
      getActions: (params) => [
        editRowId === params.row?.result_id ? (
          <GridActionsCellItem
            key="save"
            icon={<SaveIcon />}
            label="Save"
            onClick={() => handleSaveClick(params.row.result_id)}
          />
        ) : (
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(params.row)}
          />
        ),
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
      <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
        <TextField
          label="Search by Name or Reg No"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

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
        rowCount={rows.length} // ensures pagination component receives count
        autoHeight
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
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
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
