import {FC, useState} from "react";
import Edit2Icon from "@/components/SVG/Edit2Icon";
import OpenAIIcon from "@/components/SVG/OpenAIIcon";
import LikeIcon from "@/components/SVG/LikeIcon";
import UnLikeIcon from "@/components/SVG/UnLikeIcon";
import {useSelector} from "react-redux";

export type Message = {
  id: string
  role: 'assistant' | 'user' | 'system'
  content: {
    content_type: 'text' | 'image' | 'video' | 'audio' | 'file'
    parts: string[]
  },
  author: {
    role: 'assistant' | 'user' | 'system',
    name?: string,
    metadata?: {}
  }
}

const DialogBoxItem: FC<Message> = ({...props}) => {
  const username = useSelector((state: any) => state.user.username);
  const [editMode, setEditMode] = useState(false);

  if (props.role === 'user') {
    return (
      <div className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800">
        <div
          className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
          <div className="w-[30px] flex flex-col relative items-end">
            <div className="relative flex">
              <span>
              {username}
              </span>
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            {
              editMode ? (
                <div className="flex flex-grow flex-col gap-3">
                  <textarea className="m-0 resize-none border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0"
                    style={{height: '24px', overflowY: 'hidden'}}
                  >
                    {props.content.parts[0].trim()}
                  </textarea>
                  <div className="text-center mt-2 flex justify-center">
                    <button className="btn relative btn-primary mr-2" onClick={() => {
                      // TODO: update message
                    }}>
                      <div className="flex w-full items-center justify-center gap-2">保存并提交</div>
                    </button>
                    <button className="btn relative btn-neutral" onClick={() => {
                      setEditMode(false);
                    }}>
                      <div className="flex w-full items-center justify-center gap-2">取消</div>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-grow flex-col gap-3">
                    <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                      {props.content.parts[0].trim()}
                    </div>
                  </div>
                  <div className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
                    <button className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible"
                            onClick={() => {
                              setEditMode(true)
                            }}
                    >
                      <Edit2Icon/>
                    </button>
                  </div>
                </>
              )
            }
            <div className="flex justify-between"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]">
      <div
        className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
        <div className="w-[30px] flex flex-col relative items-end">
          <div className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center"
               style={{backgroundColor: 'rgb(16, 163, 127)'}}>
            <OpenAIIcon/>
          </div>
        </div>
        <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
          <div className="flex flex-grow flex-col gap-3">
            <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
              <div className="markdown prose w-full break-words dark:prose-invert light">
                <p>
                  {props.content.parts[0].trim()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div
              className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
              <button
                className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
                <LikeIcon/>
              </button>
              <button
                className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
                <UnLikeIcon/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DialogBoxItem
