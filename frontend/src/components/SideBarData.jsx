import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import CampaignIcon from '@mui/icons-material/Campaign';

export const SideBarData = [
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        link: "/profile"
    },
    {
        title: "Exam Results",
        icon: <BarChartIcon />,
        link: "/exam-results"
    },
    {
        title: "Notices",
        icon: <CampaignIcon />,
        link: "/notices"
    }
]
