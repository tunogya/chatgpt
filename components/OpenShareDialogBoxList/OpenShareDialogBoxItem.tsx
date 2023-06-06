import AbIcon from "@/components/SVG/AbIcon";
import {FC, useMemo, useState} from "react";
import {Message} from "@/components/DialogBoxList/DialogBoxItem";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CodeFormat from "@/components/DialogBoxList/CodeFormat";
import AnonymouslyIcon from "@/components/SVG/AnonymouslyIcon";

type ShareBaseDialogBoxItemProps = {
  id: string,
  message: Message | null,
}
const OpenShareBaseDialogBoxItem: FC<ShareBaseDialogBoxItemProps> = ({id, message}) => {
  if (message === null || message?.role === 'system') {
    return <></>
  }

  if (message?.role === 'user') {
    return (
      <div
        className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800">
        <div
          className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 m-auto">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <div className="w-[30px]">
              <div
                style={{backgroundColor: '#ab68ff'}}
                className="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center">
                <AnonymouslyIcon/>
              </div>
            </div>
          </div>
          <div
            className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div
                className="min-h-[20px] flex flex-col items-start gap-4 break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({...props}) {
                      return <CodeFormat {...props} />
                    }
                  }}
                  className={`markdown prose w-full break-words dark:prose-invert light`}>
                  {message?.content?.parts?.[0] || '...'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
      <div
        className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 m-auto">
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className="w-[30px]">
            <div
              className="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center bg-gray-900">
              <AbIcon width={'30'}/>
            </div>
          </div>
        </div>
        <div
          className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
          <div className="flex flex-grow flex-col gap-3">
            <div
              className="min-h-[20px] flex flex-col items-start gap-4 break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({...props}) {
                    return <CodeFormat {...props} />
                  }
                }}
                className={`markdown prose w-full break-words dark:prose-invert light`}>
                {message?.content?.parts?.[0] || '...'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


type ShareDialogBoxItemProps = {
  id: string
  data: any
}
const OpenShareDialogBoxItem: FC<ShareDialogBoxItemProps> = ({id, data}) => {
  const [children_index, setChildren_index] = useState(0)
  const children = useMemo(() => {
    // filter used to remove the current id from the children list, so that the current id is not rendered twice
    return data?.mapping?.[id]?.children?.filter((c_id: string) => c_id !== id)?.map((id: string) => (
      <OpenShareDialogBoxItem key={id} id={id} data={data}/>
    )) || []
  }, [data, id])

  return (
    <>
      <OpenShareBaseDialogBoxItem
        message={data?.mapping?.[id].message}
        id={id}
      />
      {
        children.length > 0 && (
          children[children_index]
        )
      }
    </>
  )
}

export default OpenShareDialogBoxItem