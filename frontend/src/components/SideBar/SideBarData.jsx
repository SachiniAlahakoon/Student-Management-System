import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";

export const SideBarData = [
  {
    title: "Profile",
    icon: <AccountCircleIcon />,
    link: "/dashboard/profile",
  },
  {
    title: "Exam Results",
    icon: <BarChartIcon />,
    link: "/dashboard/exam-results",
  },
  {
    title: "Attendence",
    icon: <CampaignIcon />,
    link: "/dashboard/attendance-view",
  },
];
