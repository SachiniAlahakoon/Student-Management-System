import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import CampaignIcon from '@mui/icons-material/Campaign';

export const SideBarData = [
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        link: "/student/profile"
    },
    {
        title: "Exam Results",
        icon: <BarChartIcon />,
        link: "/student/exam-results"
    },
    {
        title: "Notices",
        icon: <CampaignIcon />,
        link: "/student/notices"
    }
]
