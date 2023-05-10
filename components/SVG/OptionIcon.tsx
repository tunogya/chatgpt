import {FC} from "react";

type OptionIconProps = {
  className?: string
  strokeWidth?: string
}

const OptionIcon: FC<OptionIconProps> = ({...props}) => {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={props.strokeWidth || "2"} viewBox="0 0 24 24"
         strokeLinecap="round" strokeLinejoin="round"
         className={props.className || "h-4 w-4"} height="1em" width="1em"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}

export default OptionIcon