import ConversationIcon from "@/components/SVG/ConversationIcon";
import {FC} from "react";

export type ConversationItemProps = {
  id: string,
  title: string,
  create_time: string,
}

const ConversationItem: FC<ConversationItemProps> = ({...props}) => {
  return (
    <div className="flex flex-col gap-2 text-gray-100 text-sm">
      <a
        className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
        <ConversationIcon/>
        <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">{props.title}
          <div
            className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
        </div>
      </a>
    </div>
  )
}

export default ConversationItem