import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div>
      <main>
        <Outlet />  {/* This is where nested routes will render */}
      </main>
    </div>
  );
}
