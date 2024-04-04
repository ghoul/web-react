import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";

const App = () => {
  const routing = useRoutes(Themeroutes);
  return <div className="dark">{routing}</div>;
};

export default App;

// import { BrowserRouter } from "react-router-dom";
// import Themeroutes from "./routes/Router";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <div className="dark">
//         <Themeroutes />
//       </div>
//     </BrowserRouter>
//   );
// };

// export default App;
