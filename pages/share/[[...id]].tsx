import type {InferGetServerSidePropsType, GetServerSideProps} from 'next';
import AbIcon from "@/components/SVG/AbIcon";

const Share = ({props}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const data = props.pageProps.serverResponse.data;

  return (
    <div className="overflow-hidden w-full h-full relative flex z-0">
      <div className="relative flex h-full max-w-full flex-1 overflow-hidden">
        <div className="flex h-full max-w-full flex-1 flex-col">
          <main
            className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto dark:bg-gray-800">
                <div className="flex flex-col text-sm dark:bg-gray-800">
                  <div
                    className="flex items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-50">
                    <span>分享对话</span><span className="px-1">•</span>模型: {data?.model?.slug || '-'}
                  </div>
                  <div className="mx-auto w-full p-4 md:max-w-2xl lg:max-w-xl lg:px-0 xl:max-w-3xl">
                    <div className="mb-1 border-b border-gray-100 pt-3 sm:mb-2 sm:pb-10 sm:pt-8">
                      <h1
                        className="max-w-md text-3xl font-semibold leading-tight text-gray-700 dark:text-gray-100 sm:text-4xl">
                        {data.title}
                      </h1>
                      <div className="pt-3 text-base text-gray-400 sm:pt-4">{new Date(data.update_time * 1000).toDateString()}</div>
                    </div>
                  </div>
                  <div
                    className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800">
                    <div
                      className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 lg:px-0 m-auto">
                      <div className="flex-shrink-0 flex flex-col relative items-end">
                        <div className="w-[30px]">
                          <div
                            style={{backgroundColor: '#ab68ff'}}
                            className="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center">
                            <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
                                 strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em"
                                 width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div
                        className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                        <div className="flex flex-grow flex-col gap-3">
                          <div
                            className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap break-words">Hello
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
                    <div
                      className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 lg:px-0 m-auto">
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
                            className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
                            <div className="markdown prose w-full break-words dark:prose-invert light"><p>
                              Hello! How can I assist you today?</p></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-32 md:h-48 flex-shrink-0"></div>
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
              <div className="relative flex h-full w-full flex-1 items-center justify-center gap-2">
                <a target="_self"
                   className="btn relative cursor-pointer btn-primary"
                   href={data.continue_conversation_url}>
                  <div className="flex w-full gap-2 items-center justify-center">继续该对话</div>
                </a></div>
              <div
                className="px-3 pb-3 pt-2 text-center text-xs text-gray-600 dark:text-gray-300 md:px-4 md:pb-6 md:pt-3">
                <div className="flex justify-center gap-3 text-gray-500">
                  <button>内容举报</button>
                  <span>|</span><a href="https://openai.com/policies/terms-of-use" target="_blank"
                                   rel="noreferrer">使用条款</a><span>|</span><a
                  href="https://openai.com/policies/privacy-policy" target="_blank"
                  rel="noreferrer">隐私政策</a></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const data = {
    "props": {
      "pageProps": {
        "sharedConversationId": "34c27a3c-64c8-442e-bff3-b675de57b885",
        "serverResponse": {
          "type": "data",
          "data": {
            "title": "Requesting Conversation Summary.",
            "create_time": 1685863126.879145,
            "update_time": 1685863135,
            "mapping": {
              "20617eb9-8853-42d8-8b0c-1627a70a670d": {
                "id": "20617eb9-8853-42d8-8b0c-1627a70a670d",
                "message": {
                  "id": "20617eb9-8853-42d8-8b0c-1627a70a670d",
                  "author": {"role": "assistant", "metadata": {}},
                  "create_time": 1685861761.619428,
                  "content": {"content_type": "text", "parts": ["Hello! How can I assist you today?"]},
                  "status": "finished_successfully",
                  "end_turn": true,
                  "weight": 1,
                  "metadata": {
                    "model_slug": "text-davinci-002-render-sha",
                    "finish_details": {"type": "stop", "stop": "\u003c|diff_marker|\u003e"},
                    "timestamp_": "absolute",
                    "shared_conversation_id": "34c27a3c-64c8-442e-bff3-b675de57b885"
                  },
                  "recipient": "all"
                },
                "parent": "aaa26dad-9583-42ab-8fb5-7061b1832514",
                "children": []
              },
              "aaa26dad-9583-42ab-8fb5-7061b1832514": {
                "id": "aaa26dad-9583-42ab-8fb5-7061b1832514",
                "message": {
                  "id": "aaa26dad-9583-42ab-8fb5-7061b1832514",
                  "author": {"role": "user", "metadata": {}},
                  "create_time": 1685861761.092064,
                  "content": {"content_type": "text", "parts": ["Hello"]},
                  "status": "finished_successfully",
                  "weight": 1,
                  "metadata": {
                    "timestamp_": "absolute",
                    "shared_conversation_id": "34c27a3c-64c8-442e-bff3-b675de57b885"
                  },
                  "recipient": "all"
                },
                "parent": "5ddefb74-e20e-4be8-856b-dc866988b77a",
                "children": ["20617eb9-8853-42d8-8b0c-1627a70a670d"]
              },
              "5ddefb74-e20e-4be8-856b-dc866988b77a": {
                "id": "5ddefb74-e20e-4be8-856b-dc866988b77a",
                "message": {
                  "id": "5ddefb74-e20e-4be8-856b-dc866988b77a",
                  "author": {"role": "system", "metadata": {}},
                  "create_time": 1685861761.086736,
                  "content": {"content_type": "text", "parts": [""]},
                  "status": "finished_successfully",
                  "end_turn": true,
                  "weight": 1,
                  "metadata": {"shared_conversation_id": "34c27a3c-64c8-442e-bff3-b675de57b885"},
                  "recipient": "all"
                },
                "parent": "aaa1ec05-bdd1-4c02-887a-408fd6969dfe",
                "children": ["aaa26dad-9583-42ab-8fb5-7061b1832514"]
              },
              "aaa1ec05-bdd1-4c02-887a-408fd6969dfe": {
                "id": "aaa1ec05-bdd1-4c02-887a-408fd6969dfe",
                "children": ["5ddefb74-e20e-4be8-856b-dc866988b77a"]
              }
            },
            "moderation_results": [],
            "current_node": "20617eb9-8853-42d8-8b0c-1627a70a670d",
            "is_public": true,
            "linear_conversation": [{
              "id": "aaa1ec05-bdd1-4c02-887a-408fd6969dfe",
              "children": ["5ddefb74-e20e-4be8-856b-dc866988b77a"]
            }, {
              "id": "5ddefb74-e20e-4be8-856b-dc866988b77a",
              "message": {
                "id": "5ddefb74-e20e-4be8-856b-dc866988b77a",
                "author": {"role": "system", "metadata": {}},
                "create_time": 1685861761.086736,
                "content": {"content_type": "text", "parts": [""]},
                "status": "finished_successfully",
                "end_turn": true,
                "weight": 1,
                "metadata": {"shared_conversation_id": "34c27a3c-64c8-442e-bff3-b675de57b885"},
                "recipient": "all"
              },
              "parent": "aaa1ec05-bdd1-4c02-887a-408fd6969dfe",
              "children": ["aaa26dad-9583-42ab-8fb5-7061b1832514"]
            }, {
              "id": "aaa26dad-9583-42ab-8fb5-7061b1832514",
              "message": {
                "id": "aaa26dad-9583-42ab-8fb5-7061b1832514",
                "author": {"role": "user", "metadata": {}},
                "create_time": 1685861761.092064,
                "content": {"content_type": "text", "parts": ["Hello"]},
                "status": "finished_successfully",
                "weight": 1,
                "metadata": {
                  "timestamp_": "absolute",
                  "shared_conversation_id": "34c27a3c-64c8-442e-bff3-b675de57b885"
                },
                "recipient": "all"
              },
              "parent": "5ddefb74-e20e-4be8-856b-dc866988b77a",
              "children": ["20617eb9-8853-42d8-8b0c-1627a70a670d"]
            }, {
              "id": "20617eb9-8853-42d8-8b0c-1627a70a670d",
              "message": {
                "id": "20617eb9-8853-42d8-8b0c-1627a70a670d",
                "author": {"role": "assistant", "metadata": {}},
                "create_time": 1685861761.619428,
                "content": {"content_type": "text", "parts": ["Hello! How can I assist you today?"]},
                "status": "finished_successfully",
                "end_turn": true,
                "weight": 1,
                "metadata": {
                  "model_slug": "text-davinci-002-render-sha",
                  "finish_details": {"type": "stop", "stop": "\u003c|diff_marker|\u003e"},
                  "timestamp_": "absolute",
                  "shared_conversation_id": "34c27a3c-64c8-442e-bff3-b675de57b885"
                },
                "recipient": "all"
              },
              "parent": "aaa26dad-9583-42ab-8fb5-7061b1832514",
              "children": []
            }],
            "continue_conversation_url": "https://chat.openai.com/share/34c27a3c-64c8-442e-bff3-b675de57b885/continue",
            "model": {
              "slug": "text-davinci-002-render-sha",
              "max_tokens": 8191,
              "title": "Turbo (Default for free users)",
              "description": "Our fastest model, great for most everyday tasks.",
              "tags": ["gpt3.5"]
            },
            "moderation_state": {
              "has_been_moderated": false,
              "has_been_blocked": false,
              "has_been_accepted": false,
              "has_been_auto_blocked": false,
              "has_been_auto_moderated": false
            }
          }
        },
        "continueMode": false,
        "moderationMode": false,
        "plugins": null,
        "chatPageProps": {},
        "_sentryTraceData": "5f1d8ac4700d453ab0f053bf5d2039fe-a465a501cd1232aa-1",
        "_sentryBaggage": "sentry-environment=production,sentry-release=9aabe572e80cb578cedcd4200e7afea8a86fe668,sentry-transaction=%2Fshare%2F%5B%5B...shareParams%5D%5D,sentry-public_key=33f79e998f93410882ecec1e57143840,sentry-trace_id=5f1d8ac4700d453ab0f053bf5d2039fe,sentry-sample_rate=1"
      }
    }
  }
  return {
    props: {
      ...data,
    }
  }
}

export default Share