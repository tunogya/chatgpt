import {FC} from "react";

type AbandonIconProps = {
  className?: string
  width?: string | number
}

const AbIcon: FC<AbandonIconProps> = ({...props}) => {
  return (
    <svg width={`${props.width || '40'}`} viewBox="0 0 573 401" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M401.057 394.521C376.11 386.466 357.134 373.675 344.131 356.146C331.18 338.456 323.71 317.827 321.722 294.256C319.734 270.686 322.949 245.863 331.367 219.787C339.784 193.711 351.61 171.668 366.844 153.658C382.239 135.7 400.228 123.467 420.813 116.96C441.61 110.344 464.322 111.012 488.948 118.963C513.413 126.861 532.549 139.705 546.357 157.493C560.377 175.173 568.865 195.953 571.819 219.836C574.825 243.557 572.093 268.536 563.623 294.773C555.205 320.849 542.79 342.79 526.378 360.598C510.178 378.296 491.277 390.323 469.675 396.679C448.234 403.087 425.361 402.368 401.057 394.521ZM280.749 347.68L392.988 0L443.688 16.3691L392.012 176.447L386.217 174.576L325.655 362.178L280.749 347.68ZM408.787 346.627C424.883 351.824 439.486 352.007 452.599 347.175C465.872 342.396 477.318 333.916 486.937 321.736C496.769 309.447 504.465 294.691 510.025 277.468C515.533 260.406 517.866 244.096 517.023 228.539C516.342 213.033 511.934 199.435 503.8 187.744C495.666 176.053 483.23 167.506 466.49 162.101C450.717 157.009 436.433 156.662 423.637 161.063C411.003 165.515 399.957 173.857 390.498 186.089C381.201 198.373 373.642 213.529 367.823 231.557C362.003 249.585 359.273 266.3 359.633 281.701C359.992 297.103 364.13 310.436 372.046 321.701C379.962 332.966 392.209 341.275 408.787 346.627Z"
        fill="currentColor"/>
      <path
        d="M92.6008 355.37C72.3047 355.37 55.3068 351.649 41.6069 344.207C27.9071 336.595 17.5054 326.616 10.4017 314.268C3.46724 301.752 0 288.051 0 273.166C0 259.297 2.45244 247.118 7.35732 236.631C12.2622 226.145 19.535 217.265 29.1756 209.991C38.8162 202.549 50.6556 196.544 64.6937 191.978C76.8714 188.426 90.6558 185.296 106.047 182.59C121.438 179.884 137.59 177.347 154.504 174.979C171.586 172.611 188.5 170.243 205.244 167.875L185.963 178.531C186.301 157.049 181.734 141.15 172.263 130.832C162.961 120.345 146.893 115.102 124.06 115.102C109.683 115.102 96.4909 118.485 84.4824 125.251C72.4739 131.847 64.1017 142.841 59.366 158.233L9.89433 143.011C16.6597 119.5 29.5139 100.809 48.4569 86.9396C67.569 73.0698 92.9391 66.135 124.567 66.135C149.092 66.135 170.402 70.3635 188.5 78.8207C206.766 87.1087 220.128 100.302 228.584 118.4C232.982 127.365 235.688 136.837 236.703 146.816C237.718 156.796 238.225 167.536 238.225 179.038V347.759H191.29V285.091L200.424 293.21C189.092 314.184 174.631 329.829 157.041 340.147C139.62 350.296 118.14 355.37 92.6008 355.37ZM101.988 311.985C117.041 311.985 129.979 309.363 140.804 304.12C151.629 298.707 160.339 291.857 166.935 283.569C173.531 275.281 177.844 266.654 179.874 257.69C182.749 249.571 184.356 240.437 184.694 230.289C185.202 220.14 185.455 212.021 185.455 205.932L202.707 212.275C185.963 214.812 170.741 217.095 157.041 219.125C143.341 221.155 130.91 223.185 119.747 225.214C108.753 227.075 98.9433 229.358 90.3175 232.065C83.0447 234.602 76.5331 237.646 70.7825 241.198C65.2011 244.75 60.7191 249.063 57.3364 254.138C54.1229 259.212 52.5161 265.386 52.5161 272.659C52.5161 279.763 54.292 286.36 57.8438 292.449C61.3956 298.369 66.8079 303.105 74.0807 306.657C81.3534 310.209 90.6558 311.985 101.988 311.985Z"
        fill="currentColor"/>
    </svg>
  )
}

export default AbIcon