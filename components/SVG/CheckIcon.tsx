import {FC} from "react";

type CheckIconProps = {
  className?: string
  strokeWidth?: string
}
const CheckIcon: FC<CheckIconProps> = ({...props}) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className || ''}>
      <circle cx={12} cy={12} r={12} fill="#000" opacity="0.2"/>
      <path
        d="M7 13l3 3 7-7"
        stroke="#000"
        strokeWidth={props.strokeWidth || 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckIcon