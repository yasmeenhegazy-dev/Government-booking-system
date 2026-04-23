import Select from "../../ui/Select";

function AppointmentForm({ appointmentToEdit = {} }) {
  const isEditing = appointmentToEdit?.id;
  const { time, capacity, reserved, status, service } = appointmentToEdit;
  return (
    <form action="" className="d-flex flex-column gap-2">
      <div class="row">
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="نوع الخدمة"
            aria-label="نوع الخدمة"
            defaultValue={isEditing ? service : ""}
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input
            type="number"
            class="form-control"
            placeholder="السعة "
            aria-label=" السعة"
            defaultValue={isEditing ? capacity : ""}
          />
        </div>
        <div class="col">
          <input
            type="number"
            class="form-control"
            placeholder="المحجوز "
            aria-label=" المحجوز"
            defaultValue={isEditing ? reserved : ""}
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label class="form-label">وقت البدء</label>
          <input
            type="time"
            class="form-control"
            placeholder="البداية "
            aria-label=" البداية"
            defaultValue={isEditing ? time.start : ""}
          />
        </div>
        <div class="col">
          <label class="form-label">وقت الانتهاء</label>
          <input
            type="time"
            class="form-control"
            placeholder="النهاية "
            aria-label=" النهاية"
            defaultValue={isEditing ? time.end : ""}
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <Select
            defaultVal={isEditing ? status : ""}
            title={"الحالة"}
            options={[
              { value: "مغلق", name: "مغلق" },
              { value: "محدود", name: "محدود" },
              { value: "متاح", name: "متاح" },
              { value: "ممتلئ", name: "ممتلئ" },
            ]}
          />
        </div>
      </div>
    </form>
  );
}

export default AppointmentForm;
