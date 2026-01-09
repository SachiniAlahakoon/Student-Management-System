import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
export const SideBarData = [
  {
    title: "Manage Admins",
    icon: <ManageAccountsIcon />,
    link: "/dashboard/admin/manage-admin",
  },
  {
    title: "Manage Students",
    icon: <AccountCircleIcon />,
    link: "/dashboard/admin/manage-students",
  },
  {
    title: "Manage Teachers",
    icon: <BarChartIcon />,
    link: "/dashboard/admin/manage-teachers",
  },
  {
    title: "Manage Subjects",
    icon: <MenuBookIcon />,
    link: "/dashboard/admin/manage-subjects",
  },
 


];
