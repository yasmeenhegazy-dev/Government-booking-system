function Modal({ title, show, onHide, children }) {
  const display = show ? "block" : "none";
  if (show)
    return (
      <div
        className="modal"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        style={{ display: display }}
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header ">
              <button
                type="button"
                className="btn-close m-0"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onHide}
              ></button>
              <h1 className="modal-title fs-5 " id="staticBackdropLabel">
                {title}
              </h1>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={onHide}
              >
                إغلاق
              </button>
              <button type="button" className="btn btn-primary">
                حفظ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Modal;
