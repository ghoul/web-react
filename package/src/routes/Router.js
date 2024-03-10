/****Layouts*****/
import FullLayout from "../layouts/FullLayout.js";

/***** Pages ****/
import Starter from "../views/Starter.js";
import Login from "../views/Login.js";
import SignUp from "../views/SignUp.js";
import AddHomework from "../views/AddHomework.js";
import AssignHomework from "../views/AssignHomework.js";
import CheckHomework from "../views/CheckHomework.js";
import AllHomework from "../views/AllHomework.js";

import UpdateHomework from "../views/UpdateHomework.js";
import Statistics from "../views/Statistics.js";
import FinishedAssignments from "../views/FinishedAssignments.js";
import OneStudentStatistics  from "../views/OneStudentStatistics.js";
import Profile from "../views/Profile.js";
import Password from "../views/ChangePassword.js";
import AssignmentTest from "../views/AssignmentTest.js";
import Podium from "../views/PodiumAllTime.js";
import UpdateAssignment from "../views/UpdateAssignment.js";
import AddSchool from "../views/AdminSchool.js";


import Alerts from "../views/ui/Alerts";
import Badges from "../views/ui/Badges";
import Buttons from "../views/ui/Buttons";
import Cards from "../views/ui/Cards";
import Grid from "../views/ui/Grid";
import Tables from "../views/ui/Tables";
import Forms from "../views/ui/Forms";
import Breadcrumbs from "../views/ui/Breadcrumbs";


/*****Routes******/


const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      // { path: "/", element: <Navigate to="/starter" /> },
      { path: "/", exact: true, element: <Starter /> },
      { path: "/login", element: <Login  />},
      { path: "/signup", element: <SignUp  />},
      { path: "/all-homework", element: <AllHomework/>},
      { path: "/create-homework", element: <AddHomework/>},     

      { path: "/check-homework/:homeworkId", element: <CheckHomework/>},  
      { path: "/assign-homework/:homeworkId", element: <AssignHomework/>}, 
      { path: "/edit-homework/:homeworkId", element: <UpdateHomework/>},   

      { path: "/statistics/:assignmentId", element: <Statistics/>},
      { path: "/finished-assignments", element: <FinishedAssignments/>}, 
      { path: "/statistics/:assignmentId/:studentId", element: <OneStudentStatistics/>},
      { path: "/profile", exact: true, element: <Profile /> },
      { path: "/password", exact: true, element: <Password /> },
      { path: "/test/:assignmentId", element: <AssignmentTest/>},
      { path: "/assignment/edit/:assignmentId", element: <UpdateAssignment/>},
      {path: "/add-school", element: <AddSchool/>},

      { path: "/podium", element: <Podium/>}, //TODO: aid ar kazkas


      { path: "/alerts", exact: true, element: <Alerts /> },
      { path: "/badges", exact: true, element: <Badges /> },
      { path: "/buttons", exact: true, element: <Buttons /> },
      { path: "/cards", exact: true, element: <Cards /> },
      { path: "/grid", exact: true, element: <Grid /> },
      { path: "/table", exact: true, element: <Tables /> },
      { path: "/forms", exact: true, element: <Forms /> },
      { path: "/breadcrumbs", exact: true, element: <Breadcrumbs /> },
    ],
  },
];

export default ThemeRoutes;
