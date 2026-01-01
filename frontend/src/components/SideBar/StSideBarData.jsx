import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";

export const StSideBarData = [
  {
    title: "My Profile",
    icon: <AccountCircleIcon />,
    link: "/dashboard/student/s-profile", // updated path
  },
  {
    title: "Exam Results",
    icon: <BarChartIcon />,
    link: "/dashboard/student/exam-results", // updated path
  },
  {
    title: "Notices",
    icon: <CampaignIcon />,
    link: "/dashboard/student/notices", // updated path
  },
];
