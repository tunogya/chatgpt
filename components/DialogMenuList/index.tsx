import DialogMenuItem, {ConversationItemProps} from "./DialogMenuItem";
import {setConversation} from "@/store/session";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import useSWR from 'swr'

const DialogMenuList = () => {
  const dispatch = useDispatch();
  const conversation = useSelector((state: any) => state.session.conversation);
  const {data, isLoading} = useSWR('/api/conversation', (url: string) => fetch(url).then((res) => res.json()))

  useEffect(() => {
    if (data) {
      dispatch(setConversation(data?.items || []));
    }
  }, [data])

  return (
    <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
      <div className="flex flex-col gap-2 text-gray-100 text-sm">
        {
          conversation.length === 0 && isLoading ? (
            <LoadingIcon/>
          ) : (
            conversation && conversation?.map((item: ConversationItemProps) => (
              <DialogMenuItem key={item.id} {...item}/>
            ))
          )
        }
      </div>
    </div>
  )
}

export default DialogMenuList