const InputForm = ({ type, id, ariaDescribe, value, onChange }) => {
    return (
      <input
        type={type}
        className="form-control"
        id={id}
        aria-describedby={ariaDescribe}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    );
  };
  
  export default InputForm;
  