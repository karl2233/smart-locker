import { RouterProvider } from "react-router-dom";
import router from "./app/router/router";
import { Toaster } from "sonner";


export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}