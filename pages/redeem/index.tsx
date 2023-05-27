import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import {useRouter} from "next/router";
import {PLANS} from "@/pages/pay/[id]";
import AbandonIcon from "@/components/SVG/AbandonIcon";

const Redeem = ({user}: any) => {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [cdKey, setCdKey] = useState('')
  const [cdKeyStatus, setCdKeyStatus] = useState('idle')
  const [cdKeyData, setCdKeyData] = useState<any>(undefined)
  const checkBoxRef = useRef(null)

  const checkCdKey = useCallback(async () => {
    if (!cdKey || cdKey.length === 0) {
      setCdKeyStatus('idle')
      setCdKeyData(undefined)
      return
    }
    if (cdKey.length > 0 && cdKey.length !== 36) {
      setCdKeyStatus('error')
      setCdKeyData(undefined)
      return
    }
    setCdKeyStatus('loading')
    setCdKeyData(undefined)
    try {
      const res = await fetch(`/api/app/redeem?cdkey=${cdKey.toLowerCase()}`)
      const data = await res.json()
      if (data?.data) {
        setCdKeyData(data.data)
        setCdKeyStatus('pending')
      } else {
        setCdKeyStatus('error')
        setCdKeyData(undefined)
      }
    } catch (_) {
      setCdKeyStatus('error')
      setCdKeyData(undefined)
    }
  }, [cdKey])
  const redeem = async () => {
    if (!cdKey || cdKey.length === 0) {
      setCdKeyStatus('idle')
      return
    }
    try {
      const res = await fetch(`/api/app/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cdkey: cdKey.toLowerCase(),
        })
      })
      const data = await res.json()
      if (data.status === 'ok') {
        setCdKeyStatus('success')
      } else {
        setCdKeyStatus('redeemError')
      }
    } catch (e) {
      setCdKeyStatus('redeemError')
    }
    // @ts-ignore
    window.gtag('event', 'in_app_purchase', {
      'event_category': '按钮',
      'event_label': 'CDKEY 立即兑换',
      'value': 'CDKEY'
    })
  }

  useEffect(() => {
    checkCdKey()
  }, [checkCdKey])

  const price = useMemo(() => {
    if (cdKeyData?.quantity) {
      return PLANS.find((p) => p.quantity === cdKeyData.quantity)?.total || cdKeyData?.quantity
    }
    return '-'
  }, [cdKeyData?.quantity])

  return (
    <div className={"overflow-scroll w-full h-full relative flex z-0"}>
      <div className={"flex w-full h-full fixed z-0 flex-shrink-0 overflow-x-hidden"}>
        <div className={"w-full"}/>
        <div className={"w-full shadow-xl hidden md:inline-block"}/>
      </div>
      <div className={"flex w-full justify-center z-10"}>
        <div className={"flex flex-col md:flex-row md:gap-6 w-full"}>
          <div className={"px-6 lg:px-14 w-full flex flex-col items-end"}>
            <div className={"dark:text-white w-full md:w-[380px] md:py-6 py-3"}>
              <button className={"font-semibold text-gray-800 dark:text-white cursor-pointer"}
                      onClick={() => {
                        router.push('/chat')
                      }}>
                <div className={"flex gap-2 justify-center items-center"}>
                  <div>←</div>
                  <AbandonIcon width={'100'}/>
                </div>
              </button>
              <div className={"md:px-4"}>
                <div className={"py-8"}>
                  <div className={"text-gray-500"}>兑换 ChatGPT 会员卡</div>
                </div>
                <div className={"pb-4"}>
                  <div className={"pt-5 text-sm"}>ChatGPT {cdKeyData?.quantity || '-'} 天会员卡</div>
                  <div className={"text-xs text-gray-500"}>{cdKey.toUpperCase()}</div>
                </div>
                <div className={"text-sm py-4 flex justify-between text-black dark:text-white"}>
                  <div className={"font-semibold"}>
                    小计
                  </div>
                  <div className={"font-semibold"}>
                    {price} 元
                  </div>
                </div>
                <div className={"text-sm py-4 text-gray-500 border-t-[1px] flex justify-between"}>
                  <div className={"font-semibold"}>
                    减免
                  </div>
                  <div className={"font-semibold"}>{price} 元
                  </div>
                </div>
                <div className={"text-sm py-4 border-t-[1px] flex justify-between text-black dark:text-white"}>
                  <div className={"font-semibold"}>
                    今日应付合计
                  </div>
                  <div className={"font-semibold"}>
                    {cdKeyData?.quantity ? '0' : '-'} 元
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"px-6 lg:px-14 w-full flex flex-col items-start"}>
            <div className={"dark:text-white w-full md:w-[380px] md:py-6 py-3 text-gray-600 dark:text-gray-200"}>
              <div className={"flex flex-col py-4 gap-4"}>
                <div className={""}>联系信息</div>
                <div className={"flex gap-2 text-sm bg-gray-50 dark:bg-gray-600 p-3 rounded-md border shadow-sm"}>
                  <div className={'w-14'}>账户</div>
                  <div>{user.name}</div>
                </div>
              </div>
              <div className={"flex flex-col py-4 gap-4"}>
                <div className={""}>兑换会员卡后将立即生效</div>
                <input
                  className={`p-3 rounded-md border text-sm shadow-sm text-black ${((cdKeyData && cdKeyData?.used) || cdKeyStatus === 'error') ? 'border-red-500' : ''}`}
                  placeholder={"CDKEY"}
                  onChange={(e) => {
                    setCdKey(e.target.value.toUpperCase())
                  }} value={cdKey}/>
                {
                  cdKeyStatus === 'loading' && (
                    <LoadingIcon/>
                  )
                }
                {
                  cdKeyStatus === 'error' && cdKey.length === 36 && (
                    <div
                      className={"flex flex-col gap-2 text-sm p-3 border rounded-md bg-gray-50 dark:bg-gray-600 shadow-sm"}>
                      CDKEY 输入有误，请检查后重试
                    </div>
                  )
                }
                {
                  cdKeyStatus === 'success' && (
                    <div
                      className={"flex flex-col gap-2 text-sm p-3 border rounded-md bg-gray-50 dark:bg-gray-600 shadow-sm"}>
                      兑换成功，会员卡已生效
                    </div>
                  )
                }
                {
                  cdKeyStatus === 'redeemError' && (
                    <div
                      className={"flex flex-col gap-2 text-sm p-3 border rounded-md bg-gray-50 dark:bg-gray-600 shadow-sm"}>
                      兑换失败，请稍后重试
                    </div>
                  )
                }
                {
                  cdKeyData && cdKeyData?.used && (
                    <div
                      className={"flex flex-col gap-2 text-sm p-3 border rounded-md bg-gray-50 dark:bg-gray-600 shadow-sm"}>
                      <div className={"flex gap-2"}>
                        <div className={'w-14'}>使用人</div>
                        <div>{cdKeyData.user.name}</div>
                      </div>
                      <div className={"flex gap-2"}>
                        <div className={'w-14'}>使用时间</div>
                        <div>{new Date(cdKeyData?.updated * 1000).toLocaleString()}</div>
                      </div>
                    </div>
                  )
                }
              </div>
              <div className={"py-8 flex flex-col gap-2"}>
                <form>
                  <div className={"flex gap-2"}>
                    <input type="checkbox" className={"rounded-sm text-green-600"} ref={checkBoxRef}
                           onChange={(e) => {
                             setChecked(e.target.checked)
                           }}/>
                    <div className={"text-xs cursor-pointer"} onClick={(e) => {
                      if (checkBoxRef) {
                        if (checked) {
                          return
                        }
                        // @ts-ignore
                        checkBoxRef.current.click()
                      }
                    }}>
                      我已阅读并同意 abandon.chat <a href={"/doc/term"} rel={'noreferrer'} target={'_blank'}
                                                     className={"underline"}>服务条款</a> 和 <a
                      href={"/doc/privacy"} rel={'noreferrer'} target={'_blank'}
                      className={"underline"}>隐私政策</a>。
                    </div>
                  </div>
                </form>
                <div className={`text-xs text-red-500 ${checked ? 'hidden' : ''}`}>
                  请同意 abandon.chat 的条款以完成兑换
                </div>
              </div>
              {
                cdKeyStatus === 'pending' && cdKeyData && (
                  <button
                    className={`w-full btn-primary p-3 rounded-md`}
                    onClick={redeem}
                    disabled={cdKeyData.used || !checked}
                  >
                    {cdKeyData.used ? '该 CDKEY 已兑换' : `立即兑换 ${cdKeyData.quantity} 天付费会员`}
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Redeem
