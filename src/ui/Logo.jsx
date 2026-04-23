import LogoImg from "../assets/logo.svg";
import styles from "./Logo.module.css";
function Logo() {
  return (
    <div className="d-flex align-items-center gap-4">
      <img src={LogoImg} alt="logo" className={styles.logo} />
      <h1 className="fs-4">بوابة الحكومة الرقمية</h1>
    </div>
  );
}

export default Logo;
