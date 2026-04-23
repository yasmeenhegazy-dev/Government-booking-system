import Table from "../../ui/Table";
import AddEditAppointment from "./AddEditAppointment";
import BranchAppointments from "./BranchAppointments";

const data = [
  {
    id: 1,
    time: { start: "08:00", end: "09:00" },
    service: "تجديد البطاقة",
    capacity: 10,
    reserved: 10,
    status: "مغلق",
  },
  {
    id: 2,
    time: { start: "10:00", end: "11:00" },
    service: "جواز السفر",
    capacity: 8,
    reserved: 6,
    status: "محدود",
  },
];
function AppointmentsTable() {
  return (
    <>
      <BranchAppointments />
      {data.length !== 0 && (
        <div className="d-flex flex-column gap-2">
          <Table
            headers={["الفترة", "الخدمة", "المحجوز", "السعة", "الحالة", "--"]}
            data={data}
            render={(item) => (
              <tr>
                <td>
                  {item.time.end} - {item.time.start}
                </td>
                <td>{item.service}</td>
                <td>{item.reserved}</td>
                <td>{item.capacity}</td>
                <td className="d-flex">
                  <span
                    className={`py-1 px-2 rounded-4 w-50 text-center text-white ${item.status === "مغلق" ? "bg-danger" : item.status === "متاح" ? "bg-success" : item.status === "محدود" ? "bg-warning" : "bg-primary"}  `}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <AddEditAppointment appointmentToEdit={item} />
                </td>
              </tr>
            )}
          />
        </div>
      )}
    </>
  );
}

export default AppointmentsTable;
