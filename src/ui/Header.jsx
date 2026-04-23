import styles from "./Header.module.css";
import User from "../features/user/User";
import Logo from "./Logo";
function Header() {
  return (
    <header
      className={`d-flex justify-content-between p-3 align-items-center ${styles.header}`}
    >
      <Logo />
      <User />
    </header>
  );
}

export default Header;
