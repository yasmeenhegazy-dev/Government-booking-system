import Header from "./Header";
import styles from "./AppLayout.module.css";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

function AppLayout() {
  return (
    <div className={`${styles.layout}`}>
      <Header />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
