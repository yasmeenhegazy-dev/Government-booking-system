function Statistics({ children, title, statistics }) {
  return (
    <div className={`d-flex align-items-center gap-3 card-standard`}>
      {children}
      <div className="d-flex flex-column">
        <span className="fs-4 fw-bold">{statistics}</span>
        <span className="fs-6 text-secondary">{title}</span>
      </div>
    </div>
  );
}

export default Statistics;
