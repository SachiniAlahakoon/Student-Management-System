import React from "react";
import "./Attendance.css";
import { TeacherClassProvider } from "../../context/TeacherClassContext";
import AttendanceContent from "./AttendanceContent";

export default function Attendance() {
  return (
    <TeacherClassProvider>
      <AttendanceContent />
    </TeacherClassProvider>
  );
}
