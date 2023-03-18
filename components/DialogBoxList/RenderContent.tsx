import {FC} from "react";
import katex from "katex";

type RenderContentProps = {
  content: string
}

const RenderContent: FC<RenderContentProps> = ({...props}) => {
  if (props.content.startsWith('$$') && props.content.endsWith('$$')) {
    return (
      <p>
        <span dangerouslySetInnerHTML={{__html: katex.renderToString(props.content.slice(2, -2))}}/>
      </p>
    )
  }

  if (props.content.includes('$')) {
    const parts = props.content.split('$')
    return (
      <p>
        {
          parts.map((part, index) => {
            if (index % 2 === 0) {
              return part
            }
            return (
              <span key={index} dangerouslySetInnerHTML={{__html: katex.renderToString(part)}}/>
            )
          })
        }
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