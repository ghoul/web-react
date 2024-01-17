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
import AddClass from "../views/AddClass.js";
import AllClasses from "../views/AllClasses.js";
import UpdateClass from "../views/UpdateClass.js";
import AddStudents from "../views/AddStudents.js";
import UpdateHomework from "../views/UpdateHomework.js";
import AllStudents from "../views/AllStudents.js";
import AllTeachers from "../views/AllTeachers.js";
import Statistics from "../views/Statistics.js";
import FinishedAssignments from "../views/FinishedAssignments.js";
import OneStudentStatistics  from "../views/OneStudentStatistics.js";
import Profile from "../views/Profile.js";
import Password from "../views/ChangePassword.js";


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
      { path: "/create-class", element: <AddClass/>},
      { path: "/all-classes", element: <AllClasses/>},
      { path: "/edit-class/:classsId", element: <UpdateClass/>},
      { path: "/add-students/:classsId", element: <AddStudents/>},
      { path: "/check-homework/:homeworkId", element: <CheckHomework/>},  
      { path: "/assign-homework/:homeworkId", element: <AssignHomework/>}, 
      { path: "/edit-homework/:homeworkId", element: <UpdateHomework/>},   
      { path: "/all-students", element: <AllStudents/>},
      { path: "/all-teachers", element: <AllTeachers/>},
      { path: "/statistics/:assignmentId", element: <Statistics/>},
      { path: "/finished-assignments", element: <FinishedAssignments/>}, 
      { path: "/statistics/:assignmentId/:studentId", element: <OneStudentStatistics/>},
      { path: "/profile", exact: true, element: <Profile /> },
      { path: "/password", exact: true, element: <Password /> },


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
