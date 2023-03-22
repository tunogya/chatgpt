import CopyIcon from "@/components/SVG/CopyIcon";
import {FC, useEffect, useRef, useState} from "react";
import {CodeProps} from "react-markdown/lib/ast-to-react";
import copy from 'copy-to-clipboard';
import RightIcon from "@/components/SVG/RightIcon";
import hljs from 'highlight.js';

const CodeFormat: FC<CodeProps> = ({className, inline, children, ...props}) => {
  const match = /language-(\w+)/.exec(className || '')
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && children) {
      // @ts-ignore
      ref.current.innerHTML = hljs.highlightAuto(String(children)).value
    }
  }, [ref, children])

  if (!inline) {
    return (
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
          <code className={`!whitespace-pre hljs ${className}`} {...props} ref={ref}/>
        </div>
      </div>
    )
  } else {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
}

export default CodeFormat