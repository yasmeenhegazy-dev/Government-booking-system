import AddEditAppointment from "../features/appointments/AddEditAppointment";
import AppointmentsTable from "../features/appointments/AppointmentsTable";
import BranchAppointments from "../features/appointments/BranchAppointments";
import Title from "../ui/Title";

function Appointments() {
  return (
    <div className="container py-2">
      <div className=" d-flex justify-content-between  align-items-center">
        <Title title={"إدارة المواعيد و الفترات"} />
        <AddEditAppointment />
      </div>
      <AppointmentsTable />
    </div>
  );
}

export default Appointments;
