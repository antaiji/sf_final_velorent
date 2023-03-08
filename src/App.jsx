import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout.jsx";
import OfficersLayout from "./layouts/OfficersLayout.jsx";
import ReportsLayout from "./layouts/ReportsLayout.jsx";

import Home from "./pages/Home.jsx";
import ReportNew from "./pages/ReportNew.jsx";
import Officers from "./pages/Officers.jsx";
import Officer from "./pages/Officer.jsx";
import Reports from "./pages/Reports.jsx";
import Report from "./pages/Report.jsx";
import LoginSignup from "./pages/LoginSignup.jsx";
import NotFound from "./pages/NotFound.jsx";

const mainRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="report" element={<ReportNew />} />
      <Route path="officers" element={<OfficersLayout />}>
        <Route index element={<Officers />} />
        <Route path=":id" element={<Officer />} />
      </Route>
      <Route path="reports" element={<ReportsLayout />}>
        <Route index element={<Reports />} />
        <Route path=":id" element={<Report />} />
      </Route>
      <Route path="logsign" element={<LoginSignup />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={mainRouter} />;
}

export default App;
