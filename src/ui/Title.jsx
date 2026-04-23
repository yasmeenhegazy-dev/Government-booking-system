import styles from "./Title.module.css";
function Title({ title }) {
  return (
    <div>
      <span className={`${styles.main}`}>الرئيسية/</span>
      <span className={`${styles.secondary}`}> {title}</span>
      <h4 className="mb-3 mt-2">{title} </h4>
    </div>
  );
}

export default Title;
