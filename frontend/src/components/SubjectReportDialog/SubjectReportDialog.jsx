import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { DataGrid } from "@mui/x-data-grid";

import "./SubjectReportDialog.css";
import { generateSubjectReportPdf } from "../utils/subjectReportPdf";

export default function SubjectReportDialog({ open, onClose, reportData }) {
  if (!reportData) return null;

  const { stats = {}, gradeDistribution = [], students = [] } = reportData;
  const total = gradeDistribution.reduce((sum, g) => sum + g.value, 0);

  const columns = [
    { field: "reg_no", headerName: "Reg No", flex: 1 },
    { field: "student_name", headerName: "Name", flex: 2 },
    { field: "marks", headerName: "Marks", flex: 1 },
    { field: "grade", headerName: "Grade", flex: 1 },
    { field: "rank", headerName: "Rank", flex: 1 },
  ];

  const pieData = gradeDistribution.map((g, i) => ({
    id: i,
    value: g.value,
    label: g.label,
    percentage: ((g.value / total) * 100).toFixed(1),
  }));

  const statCard = (title, value, type = "default") => (
    <div className="stat-card">
      <Typography variant="subtitle2">{title}</Typography>
      <Typography
        variant="h6"
        className={`stat-value ${type === "passed" ? "passed" : ""} 
        ${type === "failed" ? "failed" : ""}`}
      >
        {value ?? 0}
      </Typography>
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Subject Marks Report</DialogTitle>

      <DialogContent dividers className="dialog-content">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item>
                {statCard("Total Students", stats.totalStudents)}
              </Grid>
              <Grid item>{statCard("Attended", stats.attended)}</Grid>
              <Grid item>{statCard("Passed", stats.passed, "passed")}</Grid>
              <Grid item>{statCard("Failed", stats.failed, "failed")}</Grid>
              <Grid item>
                {statCard("Pass Rate", stats.passRate + "%", "passRate")}
              </Grid>
              <Grid item>
                {statCard("Class Average", stats.average + "%", "average")}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} className="pie-chart-container">
            <Typography variant="subtitle1" gutterBottom>
              Grade Distribution
            </Typography>
            <PieChart
              series={[
                {
                  data: pieData,
                  arcLabel: (item) => `${item.label}: ${item.percentage}%`,
                },
              ]}
              width={300}
              height={250}
            />
          </Grid>
        </Grid>

        <Box className="student-result-table">
          <DataGrid
            rows={students.map((s, i) => ({ id: i, ...s }))}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[10]}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => generateSubjectReportPdf(reportData)}>Download PDF</Button>
        <Button color="error" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
