import {FC} from "react";

type CloseIconProps = {
  className?: string
  strokeWidth?: string
}

const CloseIcon: FC<CloseIconProps> = ({...props}) => {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={props.strokeWidth || "2"} viewBox="0 0 24 24"
         strokeLinecap="round" strokeLinejoin="round" className={props.className || "h-4 w-4"} height="1em"
         width="1em" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}

export default CloseIcon