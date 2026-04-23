function Select({ options, title, defaultVal }) {
  return (
    <select
      class="form-select"
      aria-label="Default select example"
      defaultValue={defaultVal}
    >
      <option>{title}</option>
      {options.map((option) => (
        <option value={option.value}>{option.name}</option>
      ))}
    </select>
  );
}

export default Select;
