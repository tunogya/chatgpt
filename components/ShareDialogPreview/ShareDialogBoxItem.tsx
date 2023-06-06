import AbIcon from "@/components/SVG/AbIcon";
import {FC, useMemo, useState} from "react";
import {Message} from "@/components/DialogBoxList/DialogBoxItem";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CodeFormat from "@/components/DialogBoxList/CodeFormat";
import AnonymouslyIcon from "@/components/SVG/AnonymouslyIcon";
import {useUser} from "@auth0/nextjs-auth0/client";
import Image from "next/image";

type ShareDialogBaseItemProps = {
  id: string,
  is_anonymous: boolean,
  message: Message | null,
}
const ShareDialogBaseItem: FC<ShareDialogBaseItemProps> = ({id, is_anonymous, message}) => {
  const {user, error, isLoading} = useUser();
  if (message === null || message?.role === 'system') {
    return <></>
  }

  if (message?.role === 'user') {
    return (
      <div className="group w-full text-gray-800 dark:text-gray-100 dark:bg-gray-800">
        <div
          className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 lg:px-0 ml-5">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            {
              is_anonymous ? (
                <div className="w-[30px]">
                  <div
                    style={{backgroundColor: '#ab68ff'}}
                    className="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center">
                    <AnonymouslyIcon/>
                  </div>
                </div>
              ) : (
                <div className={'w-[30px]'}>
                  <div className={'relative flex'}>
                    <div className={'rounded-sm overflow-hidden'}>
                      <Image src={user?.picture || ""} alt={user?.name || "avatar"} width={30} height={30} quality={80}
                             priority
                             blurDataURL={`https://dummyimage.com/30x30/ffffff/000000.png&text=${user?.name?.[0] || 'A'}`}
                      />
                    </div>
                    {/*{*/}
                    {/*  flagged && (*/}
                    {/*    <div*/}
                    {/*      className="absolute w-4 h-4 rounded-full text-[10px] flex justify-center items-center right-0 top-[20px] -mr-2 border border-white bg-orange-500 text-white">*/}
                    {/*      <div>!</div>*/}
                    {/*    </div>*/}
                    {/*  )*/}
                    {/*}*/}
                  </div>
                </div>
              )
            }
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
      className="group w-full text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-[#444654]">
      <div
        className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 lg:px-0 ml-5">
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className="w-[30px]">
            <div
              className="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center bg-gray-900"
            >
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
const ShareDialogBoxItem: FC<ShareDialogBoxItemProps> = ({id, data}) => {
  const [children_index, setChildren_index] = useState(0)
  const children = useMemo(() => {
    // filter used to remove the current id from the children list, so that the current id is not rendered twice
    return data?.mapping?.[id]?.children?.filter((c_id: string) => c_id !== id)?.map((id: string) => (
      <ShareDialogBoxItem key={id} id={id} data={data}/>
    )) || []
  }, [data, id])

  return (
    <>
      <ShareDialogBaseItem
        id={id}
        is_anonymous={data.is_anonymous}
        message={data?.mapping?.[id].message}
      />
      {
        children.length > 0 && (
          children[children_index]
        )
      }
    </>
  )
}

export default ShareDialogBoxItem

