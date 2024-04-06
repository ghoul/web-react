/****Layouts*****/
import FullLayout from "../layouts/FullLayout.js";

/***** Pages ****/
import Login from "../views/Login.js";
import Starter from "../views/Starter.js";

import AddHomework from "../views/AddHomework.js";
import AssignHomework from "../views/AssignHomework.js";
import CheckHomework from "../views/CheckHomework.js";
import AllHomework from "../views/AllHomework.js";
import UpdateHomework from "../views/UpdateHomework.js";

import AssignmentTest from "../views/AssignmentTest.js";
import UpdateAssignment from "../views/UpdateAssignment.js";

import Statistics from "../views/Statistics.js";
import FinishedAssignments from "../views/FinishedAssignments.js";
import OneStudentStatistics  from "../views/OneStudentStatistics.js";
import Podium from "../views/PodiumAllTime.js";

import Profile from "../views/Profile.js";
import Password from "../views/ChangePassword.js";

import AdminSchool from "../views/AdminSchool.js";

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/login", element: <Login  />},
      { path: "/", exact: true, element: <Starter /> },

      { path: "/all-homework", element: <AllHomework/>},
      { path: "/create-homework", element: <AddHomework/>},     
      { path: "/check-homework/:homeworkId", element: <CheckHomework/>},  
      { path: "/assign-homework/:homeworkId", element: <AssignHomework/>}, 
      { path: "/edit-homework/:homeworkId", element: <UpdateHomework/>},   

      { path: "/statistics/:assignmentId", element: <Statistics/>},
      { path: "/statistics/:assignmentId/:studentId", element: <OneStudentStatistics/>},
      { path: "/podium", element: <Podium/>}, 

      { path: "/test/:assignmentId", element: <AssignmentTest/>},
      { path: "/assignment/edit/:assignmentId", element: <UpdateAssignment/>},
      { path: "/finished-assignments", element: <FinishedAssignments/>}, 
      
      { path: "/profile", element: <Profile /> },
      { path: "/password", element: <Password /> },

      {path: "/manage-school", element: <AdminSchool/>},
    ],
  },
];

export default ThemeRoutes;
