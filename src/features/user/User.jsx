import styles from "./User.module.css";
function User() {
  return (
    <div className="d-flex align-items-center gap-2">
      <span>احمد محمد </span>
      <div className={styles.username}>AM</div>
    </div>
  );
}

export default User;
