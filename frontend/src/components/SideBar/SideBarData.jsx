import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import MenuBookIcon from "@mui/icons-material/MenuBook"

export const SideBarData = {
  student: [
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
      title: "Attendance View",
      icon: <GroupsIcon />,
      link: "/dashboard/student/attendance",
    },
  ],

  teacher: [
    {
      title: "My Profile",
      icon: <AccountCircleIcon />,
      link: "/dashboard/teacher/t-profile",
    },
    {
      title: "Student Attendance",
      icon: <GroupsIcon />,
      link: "/dashboard/teacher/attendance-manage",
    },
    {
      title: "Student Marks",
      icon: <BarChartIcon />,
      link: "/dashboard/teacher/marks-manage",
    },
  ],

  admin: [
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
   ],
};