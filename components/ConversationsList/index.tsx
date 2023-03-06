import ConversationItem from "./ConversationItem";

const ConversationsList = () => {
  return (
    <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
      <ConversationItem/>
    </div>
  )
}

export default ConversationsList