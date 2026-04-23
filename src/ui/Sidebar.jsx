import {
  HiOutlineCalendar,
  HiOutlineChartPie,
  HiOutlineClipboard,
  HiOutlineCollection,
  HiOutlineLocationMarker,
  HiOutlineLogout,
  HiOutlineShieldCheck,
  HiOutlineTable,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiUser,
} from "react-icons/hi";
import { NavLink } from "react-router";
import styles from "./Sidebar.module.css";
function Sidebar() {
  return (
    <nav className={`${styles.sidebar} d-flex flex-column gap-2 p-3 fs-8`}>
      <ul className="d-flex flex-column gap-3 mb-auto p-0">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineViewGrid />
            <span> لوحة التحكم</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineUserGroup />
            <span> إدارة المستخدمين</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineClipboard />
            <span> الخدمات </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/branches"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineLocationMarker />
            <span> الفروع </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineCalendar />
            <span>المواعيد و الفترات</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/slots"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineCollection />
            <span> الحجوزات</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineChartPie />
            <span> التقارير و التحليلات</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/roles"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineShieldCheck />
            <span> الادوار و الصلاحيات</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiOutlineTable />
            <span> سجلات النظام</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.navitem} ${isActive ? styles.active : ""}`
            }
          >
            <HiUser />
            <span> الملف الشخصى</span>
          </NavLink>
        </li>
      </ul>
      <div>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${styles.navitem} ${isActive ? styles.active : ""}`
          }
        >
          <HiOutlineLogout />
          <span> تسجيل الخروج</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Sidebar;
