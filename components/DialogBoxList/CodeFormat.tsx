import CopyIcon from "@/components/SVG/CopyIcon";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {atomDark} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {FC} from "react";
import {CodeProps} from "react-markdown/lib/ast-to-react";

const CodeFormat: FC<CodeProps> = ({className, inline, children, ...props}) => {
  const match = /language-(\w+)/.exec(className || '')
  return (
    <div className={'bg-black rounded-md mb-4'}>
      <div
        className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
        <span>{match?.[1]}</span>
        <button className="flex ml-auto gap-2" onClick={() => {
          // copy children to clipboard
        }}>
          <CopyIcon/>
          Copy code
        </button>
      </div>
      <div className={'p-4 overflow-y-auto'}>
        {!inline && match ? (
          <SyntaxHighlighter
            // @ts-ignore
            style={atomDark}
            language={match[1]}
            PreTag="div"
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <div className={'p-4 overflow-y-auto'}>
            <code className={className} {...props}>
              {children}
            </code>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeFormat