import {
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineUsers,
} from "react-icons/hi";
import Statistics from "../../ui/Statistics";
import styles from "./DashboardStatistics.module.css";
function DashboardStatistics() {
  return (
    <div className={`${styles.mainContainer}`}>
      <Statistics title="حجوزات اليوم" statistics="285">
        <div className="bg-primary-subtle p-2 rounded-2">
          <HiOutlineCalendar
            className={`${styles.icon}  text-primary-emphasis`}
          />
        </div>
      </Statistics>
      <Statistics title="تم تأكيدها" statistics="285">
        <div className="bg-success-subtle p-2 rounded-2">
          <HiOutlineCheck className={`${styles.icon}  text-success-emphasis`} />
        </div>
      </Statistics>
      <Statistics title="قيد الانتظار" statistics="285">
        <div className="bg-warning-subtle p-2 rounded-2">
          <HiOutlineClock className={`${styles.icon} text-warning-emphasis`} />
        </div>
      </Statistics>
      <Statistics title="المستخدمون " statistics="285">
        <div className="bg-info-subtle p-2 rounded-2">
          <HiOutlineUsers className={`${styles.icon} text-info-emphasis`} />
        </div>
      </Statistics>
    </div>
  );
}

export default DashboardStatistics;
