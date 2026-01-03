import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupsIcon from "@mui/icons-material/Groups"; // missing import fixed

export const TSideBarData = [
  {
    title: "My Profile",
    icon: <AccountCircleIcon />,
    link: "/dashboard/teacher/t-profile", // updated path
  },
  {
    title: "Student Attendance",
    icon: <GroupsIcon />,
    link: "/dashboard/teacher/attendance-manage", // updated path
  },
  {
    title: "Student Marks",
    icon: <BarChartIcon />,
    link: "/dashboard/teacher/marks-manage", // updated path
  },
  {
    title: "Notices",
    icon: <CampaignIcon />,
    link: "/dashboard/teacher/notices", // updated path
  },
];
