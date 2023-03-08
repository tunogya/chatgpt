import ReIcon from "@/components/SVG/ReIcon";
import StopIcon from "@/components/SVG/StopIcon";
import {useState} from "react";

const InputArea = () => {
  const [showReGenerate, setShowReGenerate] = useState(false);
  const [showStop, setShowStop] = useState(false);

  return (
    <div
      className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
      <form
        className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="flex ml-1 mt-1.5 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
            {
              showReGenerate && (
                <button className="btn relative btn-neutral border-0 md:border">
                  <div className="flex w-full items-center justify-center gap-2">
                    <ReIcon/>
                    重新生成对话
                  </div>
                </button>
              )
            }
            {showStop && (
              <button className="btn relative btn-neutral border-0 md:border">
                <div className="flex w-full items-center justify-center gap-2">
                  <StopIcon/>
                  停止生成对话
                </div>
              </button>
            )}
          </div>
          <div
            className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea tabIndex={0} data-id="root" style={{maxHeight: 200, height: 24, overflowY: 'hidden'}}
                          rows={1}
                          className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"></textarea>
            <button
              className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
                   strokeLinejoin="round" className="h-4 w-4 mr-1" height="1em" width="1em"
                   xmlns="http://www.w3.org/2000/svg">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </form>
      <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
        <a href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes" target="_blank" rel="noreferrer"
           className="underline">ChatGPT 2.13</a>. 仅供学习交流，不得用于商业用途。
      </div>
    </div>
  )
}

export default InputArea