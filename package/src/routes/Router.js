import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const Login = lazy(() => import("../views/Login.js"));
const SignUp = lazy(() => import("../views/SignUp.js"));
const AddHomework = lazy(() => import("../views/AddHomework.js"));
const AssignHomework = lazy(() => import("../views/AssignHomework.js"));
const CheckHomework = lazy(() => import("../views/CheckHomework.js"));
const AllHomework = lazy(() => import("../views/AllHomework.js"));
const AddClass = lazy(() => import("../views/AddClass.js"));
const AllClasses = lazy(() => import("../views/AllClasses.js"));
const UpdateClass = lazy(() => import("../views/UpdateClass.js"));
const AddStudents = lazy(() => import("../views/AddStudents.js"));
const UpdateHomework = lazy(() => import("../views/UpdateHomework.js"));
const AllStudents = lazy(() => import("../views/AllStudents.js"));
const AllTeachers = lazy(() => import("../views/AllTeachers.js"));
const Statistics = lazy(() => import("../views/Statistics.js"));
const FinishedAssignments = lazy(() => import("../views/FinishedAssignments.js"));
const OneStudentStatistics  = lazy(() => import("../views/OneStudentStatistics.js"));
// const Category = lazy(() => import("../views/Category.js"));
// const Trick = lazy(() => import("../views/OneTrick.js"));
// const UpdateTrick = lazy(() => import("../views/UpdateTrick.js"));
// const UpdateCategory = lazy(() => import("../views/UpdateCategory.js"));
// const UpdateComment = lazy(() => import("../views/UpdateComment.js"));
// const Add = lazy(() => import("../views/Add.js"));
// const AddCategory = lazy(() => import("../views/AddCategory.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));


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
       {path: "/statistics/:assignmentId/:studentId", element: <OneStudentStatistics/>},

      // { path: "/categories", element: <CategoriesList  />},

      // { path: "/category/:categoryName", element: <Category  />},
      // { path: "/category/:categoryId/edit", element: <UpdateCategory  />},
      // { path: "/category/create", element: <AddCategory  />},
      
      // { path: "/category/:categoryName/trick/:trickId", element: <OneTrick />},

      // { path: "/category/:categoryName/trick/:trickId/edit", element: <UpdateTrick />}, 
      // { path: "/category/:categoryName/trick/:trickId/edit/comment/:commentId", element: <UpdateComment />},

     

      // { path: "/trick", exact: true, element: <Trick /> },
      // { path: "/trick/create", exact: true, element: <Add /> },
      { path: "/about", exact: true, element: <About /> },
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
