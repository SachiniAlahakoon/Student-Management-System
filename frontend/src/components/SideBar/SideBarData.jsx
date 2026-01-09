import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";

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
};
