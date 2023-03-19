// import ReIcon from "@/components/SVG/ReIcon";
import StopIcon from "@/components/SVG/StopIcon";
import {useDispatch, useSelector} from "react-redux";
import {updateMessageInSession, Message, updateSession, updateLastMessageId, setIsWaitComplete} from "@/store/session";
import {useEffect, useState} from "react";
import SendIcon from "@/components/SVG/SendIcon";
import { v4 as uuidv4 } from 'uuid';

const InputArea = () => {
  const isWaitComplete = useSelector((state: any) => state.session.isWaitComplete);
  const lastMessageId = useSelector((state: any) => state.session.lastMessageId)
  const session = useSelector((state: any) => state.session.session);
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const username = useSelector((state: any) => state.user.username);
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const complete = async (message: Message, parent: string) => {
    dispatch(setIsWaitComplete(true))
    dispatch(updateMessageInSession({
      message,
      parent: lastMessageId,
    }))
    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversation_id: session.id,
          action: 'next',
          model: 'gpt-3.5-turbo',
          messages: [message],
          parent_message_id: lastMessageId,
        }),
      })
      // @ts-ignore
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let _message = {
        author: {
          role: '',
        },
        content: {
          content_type: '',
          parts: [""],
        },
        id: '',
        role: '',
      };
      // @ts-ignore
      const readChunk = async () => {
        return reader.read().then(({value, done}) => {
          if (!done) {
            const dataString = decoder.decode(value);
            // split data by line, and remove empty line
            const lines = dataString.split('\n\n').filter((line) => line !== '').map((line) => line.trim().replace('data: ', ''));
            for (const line of lines) {
              if (line === "[DONE]") {
                dispatch(setIsWaitComplete(false))
                console.log('[DONE]')
              } else {
                try {
                  const data = JSON.parse(line);
                  // if session.id is null, update session
                  if (!session.id) {
                    dispatch(updateSession({
                      id: data.id,
                      title: data.title,
                    }))
                  }
                  _message = {
                    ..._message,
                    id: data.messages[0].id,
                    role: data.messages[0].author.role,
                    content: {
                      ..._message.content,
                      parts: [
                        _message.content.parts[0] + data.messages[0].content.parts[0]
                      ],
                    },
                    author: {
                      ..._message.author,
                      role: data.messages[0].author.role,
                    }
                  }
                  dispatch(updateMessageInSession({
                    message: _message,
                    parent: parent,
                  }))
                } catch (e) {
                  console.log(e)
                }
              }
            }
            return readChunk()
          } else {
            dispatch(setIsWaitComplete(false))
          }
        });
      };
      await readChunk();
    } catch (e) {
      dispatch(setIsWaitComplete(false))
      console.log(e)
    }
  }

  const [second, setSecond] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecond((second + 1) % 3);
    }, 1000);
    return () => clearInterval(timer);
  }, [second]);

  return (
    <div
      className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
      <form
        className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="flex ml-1 mt-1.5 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center hidden md:block">
            {/*{*/}
            {/*  session?.messages?.length >= 2 && (*/}
            {/*    <button className="btn relative btn-neutral border-0 md:border" onClick={() => {*/}
            {/*      // TODO: re-generate dialog*/}
            {/*    }}>*/}
            {/*      <div className="flex w-full items-center justify-center gap-2">*/}
            {/*        <ReIcon/>*/}
            {/*        重新生成对话*/}
            {/*      </div>*/}
            {/*    </button>*/}
            {/*  )*/}
            {/*}*/}
            {isWaitComplete && (
              <button className="btn relative btn-neutral border-0 md:border" onClick={() => {
                // TODO: stop generate dialog
                dispatch(setIsWaitComplete(false))
              }}>
                <div className="flex w-full items-center justify-center gap-2">
                  <StopIcon/>
                  停止生成对话
                </div>
              </button>
            )}
          </div>
          <div
            className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea tabIndex={0} data-id="root" style={{maxHeight: 200, height: "24px", overflowY: 'hidden'}}
                          rows={1}
                          onChange={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                            setInput(e.target.value)
                          }} value={input}
                          className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"></textarea>
            <button
              className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:bottom-0.5 md:disabled:bottom-1"
              disabled={isWaitComplete}
              onClick={async (e) => {
                e.preventDefault();
                if (input === '') return;
                const message_id = uuidv4();
                const message: Message = {
                  id: message_id,
                  author: {
                    role: 'user',
                    name: username,
                  },
                  role: 'user',
                  content: {
                    content_type: 'text',
                    parts: [input],
                  },
                }
                dispatch(updateLastMessageId(message_id));
                setInput('');
                await complete(message, message_id);
              }}>
              {
                isWaitComplete ? (
                  <div className="text-2xl">
                    <span className={''}>·</span>
                    <span className={`${second % 3 === 1 && 'invisible'}`}>·</span>
                    <span className={`${second % 3 >= 1 && 'invisible'}`}>·</span>
                  </div>
                ) : (
                  <SendIcon/>
                )
              }
            </button>
          </div>
          {
            isWaitComplete && (
              <div className="flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center md:hidden">
                <button className="btn relative btn-neutral border-0 md:border">
                  <div className="flex w-full items-center justify-center gap-2">
                    <StopIcon/>
                  </div>
                </button>
              </div>
            )
          }
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