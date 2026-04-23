import Select from "../../ui/Select";

function BranchAppointments() {
  return (
    <div className="d-flex gap-3 w-50 m-2">
      <span className="fs-5">جدول الفترات -- اليوم</span>
      <div className="">
        <Select
          title={"الفرع"}
          options={[
            { name: "مصر الجديدة", value: "مصر الجديدة" },
            { name: "مصر الجديدة", value: "مصر الجديدة" },
            { name: "مصر الجديدة", value: "مصر الجديدة" },
          ]}
        />
      </div>
    </div>
  );
}

export default BranchAppointments;
