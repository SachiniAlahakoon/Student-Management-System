import React from "react";
import "./AdminHome.css";
import { Grid, Card, CardContent } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="admin-home">
      <h2 className="dashboard-title">Admin Dashboard</h2>
       <p>Welcome to the Admin Dashboard of Swarnamali Girls' College, Kandy! 
        Now you can have access to the data of Admin, Students and Teachers as well as the Subjects.Now you have can;
        <ul>
            <li>Manage Administrators</li>
            <li>Manage Students</li>
            <li>Manage Teachers</li>
            <li>Manage Subjects</li>    
        </ul>
        using the side bar menu in the left side of the page Dshboard.
        As per the school we are looking for your best performance in managing the school data efficiently and effectively.
        </p>
      <Grid container spacing={3}>
         <Grid item xs={12} md={4}>
          <Card
            className="dashboard-card"
          >
            <CardContent>
              <AdminPanelSettingsIcon className="dashboard-icon" />
              <h3>Admin</h3>
              <p>Manage admin records</p>
            </CardContent>
          </Card>
          </Grid>
        <Grid item xs={12} md={4}>
          <Card
            className="dashboard-card"
          >
            <CardContent>
              <PeopleIcon className="dashboard-icon" />
              <h3>Students</h3>
              <p>Manage student records</p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            className="dashboard-card"
          >
            <CardContent>
              <SchoolIcon className="dashboard-icon" />
              <h3>Teachers</h3>
              <p>Manage teacher details</p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            className="dashboard-card"
          >
            <CardContent>
              <MenuBookIcon className="dashboard-icon" />
              <h3>Subjects</h3>
              <p>Manage subjects</p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
