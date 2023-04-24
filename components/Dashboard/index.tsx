import {useDispatch} from "react-redux";
import {setInput} from "@/store/ui";
import {useMemo, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import {useRouter} from "next/router";
import useSWR from "swr";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import {v4 as uuidv4} from 'uuid';
import {QRCodeSVG} from 'qrcode.react';
import WeixinPayLogo from "@/components/SVG/WeixinPayLogo";
import WeixinPayText from "@/components/SVG/WeixinPayText";
import CopyIcon from "@/components/SVG/CopyIcon";
import copy from "copy-to-clipboard";
import RightIcon from "@/components/SVG/RightIcon";

const Dashboard = () => {
  const dispatch = useDispatch()
  const {user} = useUser()
  const [demo, setDemo] = useState([
    '用简单的术语解释量子计算', ' 10 岁生日派对有哪些有趣的安排？', '如何在 Javascript 中发出 HTTP 请求？'
  ])
  const router = useRouter()
  const to = router.query.to
  const [codeUrl, setCodeUrl] = useState<undefined | string>(undefined)
  const [quantity, setQuantity] = useState<undefined | number>(undefined)
  const [qrStatus, setQrStatus] = useState<string>('idle')
  const [trade_no, setTradeNo] = useState<undefined | string>(undefined)
  const [copied, setCopied] = useState<boolean>(false)

  const {
    data: dataOfMetadata,
    isLoading: isLoadingOfMetadata,
    mutate: mutateMetadata
  } = useSWR('/api/app/metadata', (url: string) => fetch(url).then((res) => res.json()))

  const paidUseLeft = useMemo(() => {
    if (!dataOfMetadata?.paidUseTTL) return 0
    const time = ((dataOfMetadata.paidUseTTL - Date.now() / 1000) / 86400)
    if (time < 0) return 0
    return time.toLocaleString('en-US', {
      maximumFractionDigits: 1
    })
  }, [dataOfMetadata])

  const freeUseLeft = useMemo(() => {
    if (!dataOfMetadata?.freeUseLeft) return 0
    const time = ((dataOfMetadata.freeUseLeft - Date.now() / 1000) / 86400)
    if (time < 0) return 0
    return time.toLocaleString('en-US', {
      maximumFractionDigits: 1
    })
  }, [dataOfMetadata])

  const {
    data: dataOfOrder,
    mutate: mutateOrder
  } = useSWR(trade_no ? `/api/pay/weixin/query?out_trade_no=${trade_no}` : null, (url: string) => fetch(url).then((res) => res.json()))
  const getCodeUrl = async (quantity: number) => {
    setQrStatus('loading')
    setCodeUrl(undefined)
    const out_trade_no = uuidv4().replace(/-/g, '')
    setTradeNo(out_trade_no)
    try {
      const res = await fetch('/api/pay/weixin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `ChatGPT ${quantity} 天会员卡: ${user?.name}`,
          out_trade_no,
          quantity,
          topic: 'chatgpt',
          attach: JSON.stringify({
            topic: 'chatgpt',
            quantity,
            user: user?.sub,
          })
        })
      })
      const data = await res.json()
      if (data.data.status === 200) {
        setCodeUrl(data.data.code_url)
        setQrStatus('success')
      } else {
        setCodeUrl(undefined)
        setTradeNo(undefined)
        setQrStatus('error')
      }
    } catch (e) {
      setCodeUrl(undefined)
      setTradeNo(undefined)
      setQrStatus('error')
    }
  }

  const backButton = () => (
    <button
      className={"text-md underline font-semibold mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center hover:opacity-80"}
      onClick={() => {
        setCodeUrl(undefined)
        setQuantity(undefined)
        setTradeNo(undefined)
        setQrStatus('idle')
        mutateMetadata()
        router.push('/chat')
      }}
    >
      返回首页
    </button>
  )

  const chatPage = () => (
    <>
      <h1
        className="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
        ChatGPT
      </h1>
      <div className="md:flex items-start text-center gap-3.5">
        <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
          <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
            <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
                 strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em" width="1em"
                 xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            推荐
          </h2>
          <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
            {
              demo.map((item, index) => (
                <button
                  key={index}
                  className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                  onClick={() => {
                    dispatch(setInput(item))
                  }}
                >
                  &quot;{item}&quot; →
                </button>
              ))
            }
          </ul>
        </div>
        <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
          <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
            <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
                 strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em" width="1em"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            限制
          </h2>
          <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
            <li
              className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">可能偶尔会产生不正确的信息
            </li>
            <li
              className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">可能偶尔会产生有害的指令或有偏见的内容
            </li>
            <li
              className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">对 2021 年后的世界和事件的了解有限
            </li>
          </ul>
        </div>
        <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
          <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
            <div className={'h-6 w-6 overflow-hidden rounded-full'}>
              {
                user?.picture && (
                  <Image src={user?.picture || ""} alt={user?.name || "avatar"} width={24} height={24} quality={80}
                         blurDataURL={`https://dummyimage.com/24x24/ffffff/000000.png&text=${user?.name?.[0] || 'A'}`}
                         priority/>
                )}
            </div>
            账户 {user?.email_verified === false && '(未验证邮箱)'}
          </h2>
          <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
            {
              isLoadingOfMetadata ? (
                <LoadingIcon/>
              ) : (
                <>
                  <button
                    className="w-full bg-green-600 hover:opacity-80 text-white p-3 rounded-md"
                    onClick={() => {
                      router.push({
                        pathname: '/chat',
                        query: {
                          to: 'free'
                        }
                      })
                    }}
                  >
                    {freeUseLeft > 0 ? `免费体验卡: ${freeUseLeft} 天 →` : '领取免费体验卡 →'}
                  </button>
                  <button
                    className="w-full bg-orange-500 hover:opacity-80 text-white p-3 rounded-md"
                    onClick={() => {
                      router.push({
                        pathname: '/chat',
                        query: {
                          to: 'purchase'
                        }
                      })
                    }}
                  >
                    {paidUseLeft > 0 ? `付费会员卡: ${paidUseLeft} 天 →` : '付费会员卡，最低9.7元/月 →'}
                  </button>
                </>
              )
            }
            <a href={"https://support.qq.com/products/566478"} target={"_blank"} rel={"noreferrer"}
               className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900">发起工单
              →
            </a>
          </ul>
        </div>
      </div>
    </>
  )

  const purchasePage = () => (
    <>
      {backButton()}
      <div className={"w-screen max-w-xs"}>
        <div className={"text-md font-bold pb-4"}>账户：{user?.name}</div>
        <div className={"flex flex-col gap-2"}>
          {
            [
              {title: '年卡', quantity: 365, total: 118},
              {title: '季卡', quantity: 90, total: 45},
              {title: '月卡', quantity: 30, total: 18},
            ].map((item, index) => (
              <div key={index} className={"flex flex-col gap-3.5 w-full sm:max-w-md m-auto"}>
                <div className={"flex justify-between items-center"}>
                  <div className={'flex justify-center items-center gap-1.5'}>
                    <div className={`${quantity === item.quantity ? "text-green-600 font-bold" : ""}`}>
                      购买{item.title}
                    </div>
                    <div
                      className={`${quantity === item.quantity ? "text-green-600 font-bold" : ""} text-xs`}>({(item.total / item.quantity * 30).toLocaleString("en-US", {
                      maximumFractionDigits: 2
                    })}元/月)
                    </div>
                  </div>
                  <button
                    className={`${quantity === item.quantity ? "bg-green-500 hover:opacity-80 text-white" : "bg-gray-100 dark:bg-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200"} w-14 h-8 text-xs rounded-full`}
                    onClick={() => {
                      if (quantity === item.quantity) {
                        mutateOrder()
                        return
                      }
                      setQuantity(item.quantity)
                      getCodeUrl(item.quantity)
                    }}>
                    ¥ {item.total}
                  </button>
                </div>
              </div>
            ))
          }
          {
            qrStatus === 'loading' && (
              <LoadingIcon/>
            )
          }
          {
            qrStatus === 'error' && (
              <div className={"flex flex-col items-center justify-center gap-2"} style={{paddingTop: "20px"}}>
                <div className={"flex justify-center items-center text-red-600 font-bold text-center"}
                     style={{height: '200px'}}>获取二维码失败，请刷新重试
                </div>
              </div>
            )
          }
          {
            dataOfOrder?.data?.trade_state === 'SUCCESS' && (
              <div className={"flex flex-col items-center justify-center gap-2"} style={{paddingTop: "20px"}}>
                <div className={"flex justify-center items-center text-green-600 font-bold text-center"}
                     style={{height: '200px'}}>支付成功<br/>立即为您充值<br/>您可返回首页以继续使用
                </div>
              </div>
            )
          }
          {
            codeUrl && (!dataOfOrder?.data?.trade_state || dataOfOrder.data.trade_state === "NOTPAY") && (
              <div className={"flex flex-col items-center justify-center gap-4"} style={{paddingTop: "20px"}}>
                <div className={"flex gap-2 justify-center items-center"}>
                  <WeixinPayLogo/>
                  <WeixinPayText/>
                </div>
                <div className={'p-2 rounded bg-white'}>
                  <QRCodeSVG value={codeUrl} size={160}/>
                </div>
                <button className={"text-xs underline hover:opacity-80"} onClick={() => {
                  mutateOrder()
                  mutateMetadata()
                }}>
                  确认，我已支付
                </button>
              </div>
            )
          }
        </div>
      </div>
    </>
  )

  const refUrl = `https://www.abandon.chat/referrer/${user?.sub}`

  const freePage = () => (
    <>
      {backButton()}
      <div className={"w-screen max-w-xs"}>
        <div className={"flex pb-4 items-center gap-2 text-md font-bold"}>
          我的邀请链接
        </div>
        <div className={"flex flex-col gap-4"}>
          <div>
            好友点击你的邀请链接后，双方都将获得1天免费体验卡。
          </div>
          <a href={refUrl} target={'_blank'} rel={"noreferrer"} className={'text-xs underline'}>
            {refUrl}
          </a>
          <button
            className="w-full bg-green-600 dark:bg-white/5 p-3 rounded-md hover:opacity-80"
            onClick={() => {
              setCopied(true)
              copy(refUrl)
              setTimeout(() => {
                setCopied(false)
              }, 3_000)
            }}
            disabled={copied}
          >
            <div className={"flex justify-center items-center gap-2 text-white"}>
              { copied ? <RightIcon/> : <CopyIcon/> }
              { copied ? "复制成功，快去分享吧" : "复制并分享" }
            </div>
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex flex-col items-center text-sm dark:bg-gray-800">
      <div
        className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
        {!to && chatPage()}
        {to === 'purchase' && purchasePage()}
        {to === 'free' && freePage()}
      </div>
      <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
    </div>
  )
}

export default Dashboard