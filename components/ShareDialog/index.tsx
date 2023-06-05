import {Dialog} from "@headlessui/react";
import {setIsOpenShare} from "@/store/session";
import CloseIcon from "@/components/SVG/CloseIcon";
import ShareDialogBoxList from "@/components/ShareDialogBoxList";
import EditIcon from "@/components/SVG/EditIcon";
import MoreIcon from "@/components/SVG/MoreIcon";
import LinkOutIcon from "@/components/SVG/LinkOutIcon";
import LinkIcon from "@/components/SVG/LinkIcon";
import {useDispatch, useSelector} from "react-redux";
import {FC, useCallback, useEffect, useState} from "react";
import copy from "copy-to-clipboard";
import RightIcon from "@/components/SVG/RightIcon";

type ShareDialogProps = {
  data: any,
}
const ShareDialog: FC<ShareDialogProps> = ({data}) => {
  const isOpenShare = useSelector((state: any) => state.session.isOpenShare);
  const dispatch = useDispatch();
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareData, setShareData] = useState({
    share_id: '',
    title: '',
    is_anonymous: false,
    is_public: true,
    is_visible: true,
    mapping: {},
    share_url: '',
    created: 0,
  });
  const [copied, setCopied] = useState(false);
  const updateShareLink = async (shareId: string, title: string, isAnonymous: boolean) => {
    if (!shareId) {
      return
    }
    try {
      await fetch(`/api/share/${shareId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          is_anonymous: isAnonymous,
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  const deleteShareLink = async () => {
    if (!shareData.share_id) {
      return
    }
    await fetch(`/api/share/${shareData.share_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  const createShareLink = useCallback(async () => {
    if (!isOpenShare) {
      return
    }
    try {
      const res = await fetch(`/api/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: data?.id,
          current_node_id: '',
          is_anonymous: true,
        })
      })
      const resJson = await res.json();
      console.log(resJson)
      if (resJson) {
        setShareData({
          ...shareData,
          share_id: resJson.PK,
          title: resJson.title,
          is_anonymous: resJson.is_anonymous,
          is_public: resJson.is_public,
          is_visible: resJson.is_visible,
          mapping: resJson.mapping,
          share_url: resJson.share_url,
        })
      }
      // 需要获取到 share_id
    } catch (e) {
      console.log(e)
    }
  }, [data?.id, isOpenShare])

  useEffect(() => {
    createShareLink();
  }, [createShareLink])

  return (
    <Dialog open={isOpenShare} onClose={() => dispatch(setIsOpenShare(false))}>
      <div className="relative z-50">
        <div className="fixed inset-0 bg-gray-500/90 transition-opacity dark:bg-gray-800/90" aria-hidden="true"></div>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel
              className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:max-w-2xl">
              <div
                className="flex items-center justify-between border-b-[1px] border-black/10 dark:border-white/10 px-4 pb-4 pt-5 sm:p-6">
                <div className="flex items-center">
                  <div className="text-center sm:text-left">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">分享对话链接
                    </h3>
                  </div>
                </div>
                <div>
                  <div className="sm:mt-0">
                    <button className="inline-block text-gray-500 hover:text-gray-700"
                            onClick={() => dispatch(setIsOpenShare(false))}>
                      <CloseIcon className={"text-gray-900 dark:text-gray-200 h-5 w-5"}/>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 sm:pt-4">
                <div className="w-full">
                  <p className="mb-6 text-gray-500">
                    您在创建链接后发送的消息将不会被共享。知道该 URL 的任何人都可以查看共享聊天。
                  </p>
                </div>
                <div
                  className="w-full mb-4 shadow-[0_2px_12px_0px_rgba(0,0,0,0.08)] dark:bg-gray-800/90 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50">
                  <div className="flex h-full max-w-full flex-1 flex-col">
                    <main
                      className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch">
                      <div className="flex-1 overflow-hidden">
                        <div data-radix-aspect-ratio-wrapper=""
                             style={{position: "relative", width: "100%", paddingBottom: "52.6316%"}}
                        >
                          <div className="overflow-auto bg-white dark:bg-gray-800"
                               style={{position: "absolute", inset: "0px"}}
                          >
                            <ShareDialogBoxList data={data} isLoading={isLoading}/>
                          </div>
                        </div>
                        <div
                          className="flex p-4 bg-white text-white dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-700 rounded-b-lg w-full h-full">
                          <div className="flex-1 pr-1">
                            <div className="flex w-full items-center justify-left gap-2 min-h-[1.5rem]">
                              {
                                isEditTitle ? (
                                  <input type="text" className="border-none bg-transparent p-0 m-0 w-full mr-0"
                                         value={shareData.title}
                                         onChange={(e) => {
                                           setShareData({
                                             ...shareData,
                                             title: e.target.value
                                           })
                                         }}
                                         onBlur={() => {
                                           setIsEditTitle(false)
                                         }} autoFocus={true}
                                  />
                                ) : (
                                  <>
                                    {shareData.title}
                                    <button className="text-gray-500" onClick={() => setIsEditTitle(true)}>
                                      <EditIcon/>
                                    </button>
                                  </>
                                )
                              }
                            </div>
                            <div className="mt-1 text-gray-500">
                              {shareData.created ? new Date(shareData?.created * 1000).toDateString() : ''}
                            </div>
                          </div>
                          <div className="flex-none h-full mt-auto mb-auto">
                            <button className="btn relative btn-neutral mb-auto mt-auto" type="button"
                                    aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r16:"
                                    data-state="closed">
                              <div className="flex w-full gap-2 items-center justify-center">
                                <MoreIcon/>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <a href="https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq"
                       className="flex items-center gap-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                       target="_blank" rel="noreferrer">更多信息
                      <LinkOutIcon/>
                    </a>
                  </div>
                  <div className="text-right">
                    <button className="btn relative btn-primary" onClick={() => {
                      setCopied(true)
                      copy(shareData.share_url)
                      setTimeout(() => {
                        setCopied(false)
                      }, 1000)
                    }}>
                      <div className="flex w-full gap-2 items-center justify-center">
                        {copied ? <RightIcon/> : <LinkIcon/>}
                        {copied ? '复制成功' : '复制链接'}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ShareDialog