import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { path: "dashboard", Component: Dashboard },
      {
        path: "appointments",
        Component: Appointments,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
