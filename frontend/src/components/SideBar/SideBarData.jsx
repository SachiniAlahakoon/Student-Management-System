import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";

export const SideBarData = [
  
  {
    title: "Manage Admins",
    icon: <ManageAccountsIcon />,
    link: "/dashboard/admin/manage-admin",
    role: "admin",
  },
  {
    title: "Manage Students",
    icon: <AccountCircleIcon />,
    link: "/dashboard/admin/manage-students",
    role: "admin",
  },
  {
    title: "Manage Teachers",
    icon: <BarChartIcon />,
    link: "/dashboard/admin/manage-teachers",
    role: "admin",
  },
  {
    title: "Manage Subjects",
    icon: <MenuBookIcon />,
    link: "/dashboard/admin/manage-subjects",
    role: "admin",
  },

  //STUDENT
  {
    title: "My Profile",
    icon: <AccountCircleIcon />,
    link: "/dashboard/student/profile",
    role: "student",
  },
  {
    title: "Exam Results",
    icon: <AssignmentIcon />,
    link: "/dashboard/student/exam-results",
    role: "student",
  },
  //TEACHER
  {
    title: "My Profile",
    icon: <AccountCircleIcon />,
    link: "/dashboard/teacher/profile",
    role: "teacher",
  },
  {
    title: "Attendance",
    icon: <CampaignIcon />,
    link: "/dashboard/teacher/attendance",
    role: "teacher",
  },
  {
    title: "Marks",
    icon: <AssignmentIcon />,
    link: "/dashboard/teacher/marks",
    role: "teacher",
  },
];
