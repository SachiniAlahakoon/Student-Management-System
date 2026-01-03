import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";

export const StSideBarData = [
  {
    title: "My Profile",
    icon: <AccountCircleIcon />,
    link: "/dashboard/student/s-profile", 
  },
  {
    title: "Exam Results",
    icon: <BarChartIcon />,
    link: "/dashboard/student/exam-results", 
  },
  {
    title: "Notices",
    icon: <CampaignIcon />,
    link: "/dashboard/student/notices", 
  },
];
