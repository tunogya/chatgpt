import CopyIcon from "@/components/SVG/CopyIcon";
import {FC, useState} from "react";
import {CodeProps} from "react-markdown/lib/ast-to-react";
import copy from 'copy-to-clipboard';
import RightIcon from "@/components/SVG/RightIcon";

const CodeFormat: FC<CodeProps> = ({className, inline, children, ...props}) => {
  const match = /language-(\w+)/.exec(className || '')
  const [copied, setCopied] = useState(false)

  return (
    <pre>
      <div className={'bg-black rounded-md mb-4'}>
      <div
        className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
        <span>{match?.[1]}</span>
        <button className="flex ml-auto gap-2" onClick={() => {
          // copy children to clipboard
          copy(String(children))
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 1_000)
        }}>
          {
            copied ? (
              <RightIcon/>
            ) : (
              <CopyIcon/>
            )
          }
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <div className={'p-4 overflow-y-auto'}>
        <div className={'p-4 overflow-y-auto'}>
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      </div>
    </div>
    </pre>
  )
}

export default CodeFormat