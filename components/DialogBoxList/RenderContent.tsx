import {FC, useEffect, useState} from "react";
import katex from "katex";
import CopyIcon from "@/components/SVG/CopyIcon";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

type RenderContentProps = {
  content: string
}

const RenderContent: FC<RenderContentProps> = ({...props}) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    hljs.initHighlighting();
  }, []);

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

  if (props.content.startsWith('```')) {
    const language = props.content.match(/```(\w+)/)?.[1] || 'javascript'

    return (
      <pre>
      <div className="bg-black rounded-md mb-4">
        <div
          className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
          <span>{language}</span>
          <button className="flex ml-auto gap-2" onClick={() => {
            setCopied(true)
            navigator.clipboard.writeText(props.content.split('\n').slice(1, -1).join('\n'))
            setTimeout(() => {
              setCopied(false)
            }, 1_000)
          }}>
            <CopyIcon/>{ copied ?  'Copy success' : 'Copy code' }
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <code className="!whitespace-pre hljs language-jsx">
            {props.content.split('\n').slice(1, -1).join('\n')}
          </code>
        </div>
      </div>
    </pre>
    )
  }



  return (
    <p>
      {props.content}
    </p>
  )
}

export default RenderContent