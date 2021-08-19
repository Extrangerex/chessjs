import PropTypes from "prop-types";

export function InputTextField({
  label,
  leftIcon,
  rightIcon,
  onChange,
  isEmail,
  placeHolder,
  readOnly = false,
}) {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{label}</label>
      </div>
      <div className="field-body">
        <div
          className={`control ${leftIcon && "has-icons-left"} ${
            rightIcon && "has-icons-right"
          }`}
        >
          <input
            className="input is-static"
            type={`${isEmail ? "email" : "text"}`}
            value={placeHolder}
            onChange={onChange}
            readonly={readOnly}
          />
          {leftIcon && <span className="icon is-left">{leftIcon}</span>}
          {rightIcon && <span className="icon is-right">{rightIcon}</span>}
        </div>
      </div>
    </div>
  );
}

InputTextField.propTypes = {
  label: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  isEmail: PropTypes.bool,
  placeHolder: PropTypes.string,
  readOnly: PropTypes.bool,
};
