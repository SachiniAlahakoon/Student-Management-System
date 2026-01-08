import React, { useEffect, useState, useCallback } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Tooltip,
  TablePagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import "./MarksTable.css";
import axios from "axios";
import { API_BASE } from "../../api/config";
import SubjectReportDialog from "../SubjectReportDialog/SubjectReportDialog";
import EmptyStateCard from "../EmptyStateCard/EmptyStateCard";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import BulkEditDialog from "../BulkEditDialog/BulkEditDialog";

function MarksTable({ classId, subjectId, term, year }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editRowId, setEditRowId] = useState(null);
  const [editMarks, setEditMarks] = useState("");
  const [editError, setEditError] = useState("");

  const [selectionModel, setSelectionModel] = useState([]);
  const [bulkEditMarks, setBulkEditMarks] = useState({});
  const [bulkErrors, setBulkErrors] = useState({});
  const [openBulkEditDialog, setOpenBulkEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const normalizeRows = (data = []) =>
    data.map((row) => ({
      id: row.result_id ?? row.reg_no,
      student_name: row.student_name ?? "Unknown",
      reg_no: row.reg_no ?? "-",
      marks: row.marks ?? null,
    }));

  const fetchData = useCallback(async () => {
    if (!classId || !subjectId || !term || !year) {
      setRows([]);
      setSelectionModel([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/teacher/marks`, {
        params: {
          class_id: classId,
          subject_id: subjectId,
          term,
          year,
          search,
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setRows(normalizeRows(res.data?.data));
      setTotalRows(res.data?.total);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [classId, subjectId, term, year, search, page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateGrade = (marks) => {
    if (marks === null || marks === undefined) return "N/A";

    if (marks >= 75) return "A";
    if (marks >= 65) return "B";
    if (marks >= 55) return "C";
    if (marks >= 35) return "S";
    return "F";
  };

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditMarks(row.marks ?? "");
    setEditError("");
  };

  const handleSaveClick = async (id) => {
    const val = Number(editMarks);
    if (isNaN(val) || val < 0 || val > 100) {
      setEditError("Marks must be between 0-100");
      return;
    }

    try {
      await axios.put(`${API_BASE}/api/teacher/marks/update-one`, {
        result_id: id,
        marks: val,
      });

      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, marks: val } : r))
      );

      setEditRowId(null);
      setEditMarks("");
      setEditError("");
    } catch {
      alert("Failed to save");
    }
  };

  const openBulkEdit = () => {
    const initialMarks = {};
    const initialErrors = {};
    selectionModel.forEach((id) => {
      const row = rows.find((r) => r.id === id);
      if (row) {
        initialMarks[id] = row.marks ?? "";
        initialErrors[id] = "";
      }
    });
    setBulkEditMarks(initialMarks);
    setBulkErrors(initialErrors);
    setOpenBulkEditDialog(true);
  };

  const saveBulkEdit = async () => {
    const errors = {};
    let hasError = false;

    Object.entries(bulkEditMarks).forEach(([id, val]) => {
      const num = Number(val);
      if (isNaN(num) || num < 1 || num > 100) {
        errors[id] = "Marks must be 1-100";
        hasError = true;
      }
    });

    setBulkErrors(errors);
    if (hasError) return;

    try {
      await Promise.all(
        Object.entries(bulkEditMarks).map(([id, marks]) =>
          axios.put(`${API_BASE}/api/teacher/marks/update-one`, {
            result_id: id,
            marks: Number(marks),
          })
        )
      );

      setRows((prev) =>
        prev.map((r) =>
          r.id in bulkEditMarks
            ? { ...r, marks: Number(bulkEditMarks[r.id]) }
            : r
        )
      );

      setOpenBulkEditDialog(false);
      setBulkEditMarks({});
      setBulkErrors({});
      setSelectionModel([]);
    } catch {
      alert("Bulk update failed");
    }
  };

  /* Bulk Delete */
  const confirmDelete = async () => {
    try {
      await Promise.all(
        selectionModel.map((id) =>
          axios.put(`${API_BASE}/api/teacher/marks/update-one`, {
            result_id: id,
            marks: null,
          })
        )
      );
      setRows((prev) =>
        prev.map((r) =>
          selectionModel.includes(r.id) ? { ...r, marks: null } : r
        )
      );
      setSelectionModel([]);
      setOpenDeleteDialog(false);
    } catch {
      alert("Delete failed");
    }
  };

  const handleOpenReport = async () => {
    const res = await axios.get(`${API_BASE}/api/reports/subject-summary`, {
      params: {
        class_id: classId,
        subject_id: subjectId,
        year,
        term,
      },
    });

    setReportData(res.data);
    setReportOpen(true);
  };

  if (rows.length === 0 && !loading) {
    return (
      <div className="marks-table-container">
        <TextField
          label="Search by Name or Reg No"
          size="small"
          fullWidth
          className="search-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bulk-actions">
          <Button onClick={openBulkEdit} disabled={selectionModel.length === 0}>
            Bulk Edit
          </Button>
          <Button
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
            disabled={selectionModel.length === 0}
          >
            Bulk Delete
          </Button>
          <Button onClick={handleOpenReport}>Export Report</Button>
        </div>

        <EmptyStateCard message="No student records found for this selection" />
      </div>
    );
  }

  return (
    <div className="marks-table-container">
      <TextField
        label="Search by Name or Reg No"
        size="small"
        fullWidth
        className="search-field"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bulk-actions">
        <Button onClick={openBulkEdit} disabled={selectionModel.length === 0}>
          Bulk Edit
        </Button>
        <Button
          color="error"
          onClick={() => setOpenDeleteDialog(true)}
          disabled={selectionModel.length === 0}
        >
          Bulk Delete
        </Button>
        <Button onClick={handleOpenReport}>Export Report</Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="table-heading">
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    rows.length > 0 && selectionModel.length === rows.length
                  }
                  indeterminate={
                    selectionModel.length > 0 &&
                    selectionModel.length < rows.length
                  }
                  onChange={(e) =>
                    setSelectionModel(
                      e.target.checked ? rows.map((r) => r.id) : []
                    )
                  }
                />
              </TableCell>
              <TableCell className="col-reg">Reg No</TableCell>
              <TableCell className="col-name">Name</TableCell>
              <TableCell className="col-marks">Marks</TableCell>
              <TableCell className="col-grade">Grade</TableCell>
              <TableCell className="col-actions">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const isSelected = selectionModel.includes(row.id);
              const isEditing = editRowId === row.id;

              return (
                <TableRow key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) =>
                        setSelectionModel((prev) =>
                          e.target.checked
                            ? [...prev, row.id]
                            : prev.filter((id) => id !== row.id)
                        )
                      }
                    />
                  </TableCell>

                  <TableCell>{row.reg_no}</TableCell>
                  <TableCell>{row.student_name}</TableCell>

                  <TableCell>
                    {isEditing ? (
                      <div>
                        <TextField
                          type="number"
                          size="small"
                          inputProps={{ min: 0, max: 100 }}
                          value={editMarks ?? ""}
                          onChange={(e) => setEditMarks(e.target.value)}
                          error={!!editError}
                        />
                        {editError && <p className="error-text">{editError}</p>}
                      </div>
                    ) : (
                      row.marks ?? "N/A"
                    )}
                  </TableCell>

                  <TableCell>{calculateGrade(row.marks)}</TableCell>

                  <TableCell>
                    {isEditing ? (
                      <>
                        <Tooltip title="Save">
                          <Button
                            size="small"
                            sx={{ color: "primary.main" }}
                            onClick={() => handleSaveClick(row.id)}
                          >
                            <SaveIcon />
                          </Button>
                        </Tooltip>

                        <Tooltip title="Cancel">
                          <Button
                            size="small"
                            sx={{ color: "primary.main" }}
                            onClick={() => {
                              setEditRowId(null);
                              setEditMarks("");
                              setEditError("");
                            }}
                          >
                            <CloseIcon />
                          </Button>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <Button
                            size="small"
                            sx={{ color: "primary.main" }}
                            onClick={() => handleEditClick(row)}
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectionModel([row.id]);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
      />

      <BulkEditDialog
        open={openBulkEditDialog}
        onClose={() => setOpenBulkEditDialog(false)}
        onSave={saveBulkEdit}
        selectionModel={selectionModel}
        rows={rows}
        bulkEditMarks={bulkEditMarks}
        bulkErrors={bulkErrors}
        setBulkEditMarks={setBulkEditMarks}
      />

      <SubjectReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reportData={reportData}
      />
    </div>
  );
}

export default MarksTable;