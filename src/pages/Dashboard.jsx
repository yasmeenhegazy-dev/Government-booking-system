import DashboardStatistics from "../features/dashboard/DashboardStatistics";
import Title from "../ui/Title";

function Dashboard() {
  return (
    <div className={` container pt-2`}>
      <Title title={"لوحة التحكم"} />
      <DashboardStatistics />
    </div>
  );
}

export default Dashboard;
