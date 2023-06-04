import {FC, useEffect, useMemo, useRef} from "react";
import DialogBoxItem from "@/components/DialogBoxList/DialogBoxItem";
import DownIcon from "@/components/SVG/DownIcon";
import {useScrollToBottom, useSticky} from "react-scroll-to-bottom";
import Typewriter from "@/components/Typewriter";
import LoadingIcon from "@/components/SVG/LoadingIcon";

type DialogBoxListContentProps = {
  data: any
  isLoading: boolean
}

const DialogBoxListContent: FC<DialogBoxListContentProps> = ({data, isLoading}: any) => {
  const bottomRef = useRef(null);
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [data.messages]);

  const rootMessageId = useMemo(() => {
    if (!data) {
      return null
    }
    if (data.mapping?.['00000000-0000-0000-0000-000000000000']) {
      return '00000000-0000-0000-0000-000000000000'
    }
    // for those who has no root(00000000-0000-0000-0000-000000000000) message
    const ids = Object?.keys(data?.mapping || {}) || []
    if (ids.length === 0) {
      return null
    }
    let check_point = ids[0]
    while (data.mapping[check_point].parent !== null) {
      check_point = data.mapping[check_point].parent
    }
    return check_point
  }, [data])

  return (
    <div className={"w-full h-full"}>
      <div className="flex flex-col h-full items-center text-sm dark:bg-gray-800">
        {
          isLoading ? (
            <div className="flex flex-col items-center text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-800">
              <div className={"pt-4"}>
                <LoadingIcon/>
              </div>
              <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
            </div>
          ) : (
            (data?.id || rootMessageId)
              ? (
                rootMessageId && (
                  <DialogBoxItem id={rootMessageId} session={data}/>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-sm dark:bg-gray-800 h-full">
                  <h1
                    className="text-4xl font-semibold text-center text-gray-800 dark:text-gray-100">
                    <Typewriter text={'ChatGPT'}/>
                  </h1>
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                </div>
              )
          )
        }
      </div>
      {
        !sticky && (
          <button onClick={scrollToBottom} id={"scroll-to-bottom-button"}
                  className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
            <DownIcon/>
          </button>
        )
      }
    </div>
  )
}

export default DialogBoxListContent