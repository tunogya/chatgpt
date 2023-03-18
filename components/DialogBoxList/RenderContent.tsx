import {FC} from "react";

type RenderContentProps = {
  content: string
}

const RenderContent: FC<RenderContentProps> = ({...props}) => {
  return (
    <p>
      {props.content}
    </p>
  )
}

export default RenderContent