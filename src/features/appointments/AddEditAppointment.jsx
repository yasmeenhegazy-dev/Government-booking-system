import { HiOutlinePlusCircle } from "react-icons/hi";
import Modal from "../../ui/Modal";
import { useState } from "react";
import AppointmentForm from "./AppointmentForm";

function AddEditAppointment({ appointmentToEdit = {} }) {
  const [modalShow, setModalShow] = useState(false);
  const isEditing = appointmentToEdit?.id;

  return (
    <>
      <button
        type="button"
        className={`${isEditing ? "px-2 rounded-3 border btn-secondary" : "p-2 rounded-2 btn-primary"}`}
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        onClick={() => setModalShow(true)}
      >
        <span> {isEditing ? "تعديل " : "إضافة قترة"} </span>
        {!isEditing && <HiOutlinePlusCircle />}
      </button>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={isEditing ? "تعديل" : "إضافة فترة"}
      >
        <AppointmentForm appointmentToEdit={appointmentToEdit} />
      </Modal>
    </>
  );
}

export default AddEditAppointment;
