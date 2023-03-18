import {FC} from "react";
import katex from "katex";

type RenderContentProps = {
  content: string
}

const RenderContent: FC<RenderContentProps> = ({...props}) => {
  /**
   * If the content starts with $$ and ends with $$, then it is a math formula
   * use katex to render the formula
   */
  if (props.content.startsWith('$$') && props.content.endsWith('$$')) {
    return (
      <p>
        <span dangerouslySetInnerHTML={{__html: katex.renderToString(props.content.slice(2, -2))}}/>
      </p>
    )
  }

  return (
    <p>
      {props.content}
    </p>
  )
}

export default RenderContent