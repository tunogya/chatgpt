import {useDispatch, useSelector} from "react-redux";
import {
  updateMessageInSession,
  Message,
  updateSession,
  updateLastMessageId,
  setIsWaitComplete,
  setConversation
} from "@/store/session";
import {useEffect, useRef, useState} from "react";
import SendIcon from "@/components/SVG/SendIcon";
import { v4 as uuidv4 } from 'uuid';
import {useUser} from "@auth0/nextjs-auth0/client";
import {setInput} from "@/store/ui";
import {aws} from "@aws-sdk/util-endpoints/dist-types/lib";

const InputArea = () => {
  const {user} = useUser();
  const isWaitComplete = useSelector((state: any) => state.session.isWaitComplete);
  const lastMessageId = useSelector((state: any) => state.session.lastMessageId)
  const session = useSelector((state: any) => state.session.session);
  const input = useSelector((state: any) => state.ui.input);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const getConversationHistory = async () => {
    const response = await fetch('/api/conversation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    dispatch(setConversation(data.items || []));
  }

  const handleSubmit = async () => {
    if (input === '') return;
    const scroll_to_bottom_button = document.getElementById('scroll-to-bottom-button');
    if (scroll_to_bottom_button) {
      scroll_to_bottom_button.click();
    }
    const message_id = uuidv4();
    const message: Message = {
      id: message_id,
      author: {
        role: 'user',
        name: user?.name || '',
      },
      role: 'user',
      content: {
        content_type: 'text',
        parts: [input],
      },
    }
    dispatch(updateLastMessageId(message_id));
    dispatch(setInput(''));
    // @ts-ignore
    if (inputRef.current) inputRef.current.style.height = 'auto';
    await complete(message, message_id);
  }

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
    await getConversationHistory();
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
      <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea tabIndex={0} data-id="root" style={{maxHeight: 200, height: "24px", overflowY: 'hidden'}}
                          rows={1} ref={inputRef}
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              if (e.nativeEvent.isComposing) return;
                              e.preventDefault();
                              await handleSubmit();
                            } else if (e.key === 'Enter' && e.shiftKey) {
                              if (inputRef.current) {
                                // @ts-ignore
                                inputRef.current.style.height = 'auto';
                                // @ts-ignore
                                inputRef.current.style.height = e.target.scrollHeight + 'px';
                              }
                            }
                          }}
                          onChange={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                            dispatch(setInput(e.target.value));
                          }} value={input}
                          className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"></textarea>
            <button
              className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:bottom-0.5 md:disabled:bottom-1"
              disabled={isWaitComplete}
              onClick={handleSubmit}>
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
        </div>
      </form>
      <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
        <a href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes" target="_blank" rel="noreferrer"
           className="underline">abandon.chat 2.13</a>. 仅供学习交流，不得用于商业用途。
      </div>
    </div>
  )
}

export default InputArea