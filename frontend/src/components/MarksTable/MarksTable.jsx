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
import { toast } from "react-toastify";

import axios from "axios";
import { API_BASE } from "../../api/config";
import SubjectReportDialog from "../SubjectReportDialog/SubjectReportDialog";
import EmptyStateCard from "../EmptyStateCard/EmptyStateCard";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import BulkEditDialog from "../BulkEditDialog/BulkEditDialog";
import "./MarksTable.css";

function MarksTable({ classId, subjectId, term, year, getAuthHeader }) {
  const [rows, setRows] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editMarks, setEditMarks] = useState("");
  const [editError, setEditError] = useState("");

  const [selectionModel, setSelectionModel] = useState([]);
  const [bulkEditMarks, setBulkEditMarks] = useState({});
  const [bulkErrors, setBulkErrors] = useState({});
  const [openBulkEditDialog, setOpenBulkEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const normalizeRows = (data = []) =>
    data.map((row) => ({
      id: row.result_id ?? row.reg_no,
      student_id: row.student_id,
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
    try {
      const res = await axios.get(`${API_BASE}/api/teacher/marks`, {
        headers: getAuthHeader(),
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
      setTotalRows(res.data?.total ?? 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    }
  }, [classId, subjectId, term, year, search, page, rowsPerPage, getAuthHeader]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateGrade = (marks) => {
    if (marks == null) return "N/A";
    if (marks >= 75) return "A";
    if (marks >= 65) return "B";
    if (marks >= 55) return "C";
    if (marks >= 35) return "S";
    return "F";
  };

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditMarks(row.marks);
    setEditError("");
  };

  const handleSaveClick = async (row) => {
    const val = Number(editMarks);
    if (isNaN(val) || val < 0 || val > 100) {
      setEditError("Marks must be between 0–100");
      return;
    }
    try {
      await axios.put(
        `${API_BASE}/api/teacher/marks/upsert`,
        {
          class_id: classId,
          subject_id: subjectId,
          year,
          term,
          marks: [{ student_id: row.student_id, marks: val }],
        },
        { headers: getAuthHeader() }
      );
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, marks: val } : r)));
      setEditRowId(null);
      setEditMarks("");
      setEditError("");
      toast.success("Marks updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    }
  };

  const openBulkEdit = () => {
    const initialMarks = {};
    const initialErrors = {};
    selectionModel.forEach((id) => {
      const row = rows.find((r) => r.id === id);
      if (row) {
        initialMarks[id] = row.marks;
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
      if (val !== "" && (isNaN(num) || num < 0 || num > 100)) {
        errors[id] = "Marks must be 0–100";
        hasError = true;
      }
    });
    setBulkErrors(errors);
    if (hasError) return;

    try {
      await axios.put(
        `${API_BASE}/api/teacher/marks/upsert`,
        {
          class_id: classId,
          subject_id: subjectId,
          year,
          term,
          marks: selectionModel.map((id) => {
            const row = rows.find((r) => r.id === id);
            return { student_id: row.student_id, marks: bulkEditMarks[id] === "" ? null : Number(bulkEditMarks[id]) };
          }),
        },
        { headers: getAuthHeader() }
      );
      setRows((prev) =>
        prev.map((r) =>
          selectionModel.includes(r.id) ? { ...r, marks: bulkEditMarks[r.id] === "" ? null : Number(bulkEditMarks[r.id]) } : r
        )
      );
      setOpenBulkEditDialog(false);
      setBulkEditMarks({});
      setBulkErrors({});
      setSelectionModel([]);
      toast.success("Marks saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Bulk save failed");
    }
  };

  const confirmDelete = async () => {
    try {
      if (rowToDelete) {
        await axios.put(
          `${API_BASE}/api/teacher/marks/upsert`,
          { class_id: classId, subject_id: subjectId, year, term, marks: [{ student_id: rowToDelete.student_id, marks: null }] },
          { headers: getAuthHeader() }
        );
        setRows((prev) => prev.map((r) => (r.id === rowToDelete.id ? { ...r, marks: null } : r)));
        toast.success("Mark deleted successfully");
      } else {
        await axios.delete(`${API_BASE}/api/teacher/marks/reset`, {
          headers: getAuthHeader(),
          data: { class_id: classId, subject_id: subjectId, term, year },
        });
        setRows((prev) => prev.map((r) => ({ ...r, marks: null })));
        setSelectionModel([]);
        toast.success("Marks deleted successfully");
      }
      setOpenDeleteDialog(false);
      setRowToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  const handleOpenReport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reports/subject-summary`, {
        headers: getAuthHeader(),
        params: { class_id: classId, subject_id: subjectId, year, term },
      });
      setReportData(res.data);
      setReportOpen(true);
    } catch (err) {
      console.error("Report error:", err);
      toast.error("Failed to load report");
    }
  };

  if (!rows.length) {
    return (
      <div>
        <TextField
          label="Search by Name or Reg No"
          size="small"
          fullWidth
          className="search-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <EmptyStateCard message="No student records found for this selection" />
      </div>
    );
  }

  return (
    <div>
      <TextField
        label="Search by Name or Reg No"
        size="small"
        fullWidth
        className="search-field"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bulk-actions-btns">
        <Button onClick={openBulkEdit} disabled={selectionModel.length === 0}>Bulk Edit</Button>
        <Button color="error" onClick={() => { setRowToDelete(null); setOpenDeleteDialog(true); }} disabled={selectionModel.length === 0}>Bulk Delete</Button>
        <Button onClick={handleOpenReport}>CREATE Report</Button>
      </div>

      <TableContainer component={Paper} className="marks-table">
        <Table>
          <TableHead className="table-heading">
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={rows.length && selectionModel.length === rows.length}
                  indeterminate={selectionModel.length > 0 && selectionModel.length < rows.length}
                  onChange={(e) => setSelectionModel(e.target.checked ? rows.map((r) => r.id) : [])}
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
                          e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{row.reg_no}</TableCell>
                  <TableCell>{row.student_name}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <div>
                        <TextField type="number" size="small" inputProps={{ min: 0, max: 100 }} value={editMarks} onChange={(e) => setEditMarks(e.target.value)} error={!!editError} />
                        {editError && <p className="error-text">{editError}</p>}
                      </div>
                    ) : row.marks ?? "N/A"}
                  </TableCell>
                  <TableCell>{calculateGrade(row.marks)}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <>
                        <Tooltip title="Save"><Button size="small" sx={{ color: "primary.main" }} onClick={() => handleSaveClick(row)}><SaveIcon /></Button></Tooltip>
                        <Tooltip title="Cancel"><Button size="small" sx={{ color: "primary.main" }} onClick={() => { setEditRowId(null); setEditMarks(""); setEditError(""); }}><CloseIcon /></Button></Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit"><Button size="small" sx={{ color: "primary.main" }} onClick={() => handleEditClick(row)}><EditIcon /></Button></Tooltip>
                        <Tooltip title="Delete"><Button size="small" color="error" onClick={() => { setRowToDelete(row); setOpenDeleteDialog(true); }}><DeleteIcon /></Button></Tooltip>
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
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={confirmDelete} />
      <BulkEditDialog open={openBulkEditDialog} onClose={() => setOpenBulkEditDialog(false)} onSave={saveBulkEdit} selectionModel={selectionModel} rows={rows} bulkEditMarks={bulkEditMarks} bulkErrors={bulkErrors} setBulkEditMarks={setBulkEditMarks} />
      <SubjectReportDialog open={reportOpen} onClose={() => setReportOpen(false)} reportData={reportData} />
    </div>
  );
}

export default MarksTable;
