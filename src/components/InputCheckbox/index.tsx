import classNames from "classnames"
import { useRef } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {

  // console.log(" the id is", id, checked, disabled)

  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label>
      <input
        id={inputId}
        type="checkbox"
        //BUG 2: CHECKBOX TOGGLES NOW: INITIALLY CSS APPLIED TO LABLE INSTAD OF INPUT TAG
        // className="RampInputCheckbox--input"
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(!checked)}
      />
      </label>
    </div>
  )
}
