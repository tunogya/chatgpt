import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {useRouter} from "next/router";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import useSWR from "swr";
import {v4 as uuidv4} from 'uuid';
import WeixinPayLogo from "@/components/SVG/WeixinPayLogo";
import WeixinPayText from "@/components/SVG/WeixinPayText";
import {QRCodeSVG} from "qrcode.react";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import {RadioGroup} from "@headlessui/react";
import CheckIcon from "@/components/SVG/CheckIcon";
import AbandonIcon from "@/components/SVG/AbandonIcon";
import {CHATGPT_MEMBERSHIP, PRODUCTS} from "@/pages/const/misc";

const Pay = ({user}: any) => {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [codeUrl, setCodeUrl] = useState<undefined | string>(undefined)
  const [qrStatus, setQrStatus] = useState<string>('idle')
  const trade_no = router.query.id
  const checkBoxRef = useRef(null)
  const topic = router.query?.topic ?? 'GPT-3.5'
  const SelectPlans = useMemo(() => {
    return PRODUCTS.filter((item) => item.topic === topic)
  }, [topic])
  const [selected, setSelected] = useState(SelectPlans[0])

  const {
    data: dataOfOrder,
    mutate: mutateOrder
  } = useSWR(trade_no ? `/api/pay/weixin/query?out_trade_no=${trade_no}` : null, (url: string) => fetch(url).then((res) => res.json()))

  useEffect(() => {
    setSelected(SelectPlans[0])
  }, [topic, SelectPlans])

  const getCodeUrl = useCallback(() => {
    setQrStatus('loading')
    setCodeUrl(undefined)
    if (!user?.name || !user?.sub) {
      setQrStatus('error')
      return
    }
    const out_trade_no = uuidv4().replace(/-/g, '')
    fetch('/api/pay/weixin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // description, out_trade_no, user, product
      body: JSON.stringify({
        description: `${selected.name}: ${user?.name}`,
        out_trade_no,
        user: user,
        product: {
          // product topic
          topic: selected.topic,
          // product quantity
          quantity: selected.quantity,
          // total need to pay
          total: selected.total,
        },
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.data.status === 200) {
          setCodeUrl(data.data.code_url)
          setQrStatus('success')
        } else {
          setCodeUrl(undefined)
          setQrStatus('error')
        }
      })
      .catch(e => {
        setCodeUrl(undefined)
        setQrStatus('error')
      })
  }, [user?.name, user?.sub, selected])

  useEffect(() => {
    if (checked) {
      getCodeUrl()
    }
  }, [getCodeUrl, checked])

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
                  <div className={"text-gray-600"}>{topic} Subscription</div>
                  <div className={"flex items-center gap-4"}>
                    <div
                      className={"text-4xl font-semibold text-black dark:text-white"}>CNY {selected?.total?.toLocaleString("en-US", {
                      maximumFractionDigits: 2
                    })}</div>
                  </div>
                </div>
                <div className={"pb-4"}>
                  <div className={"pt-5 text-sm"}>{selected?.name} ({selected?.quantity} month)</div>
                </div>
                <div className={"flex flex-col gap-4 pt-4 lg:pt-32"}>
                  <div className={"text-gray-600 dark:text-gray-200"}>Subscriptions</div>
                  <div className={"flex gap-4 text-sm w-full"}>
                    <div className="w-full">
                      <RadioGroup value={selected} onChange={setSelected} defaultValue={selected}>
                        <RadioGroup.Label className="sr-only">all programs</RadioGroup.Label>
                        <div className="">
                          {SelectPlans
                            .map((plan) => (
                              <RadioGroup.Option
                                key={plan.name}
                                value={plan}
                                className={`${plan.name === selected.name ? 'bg-yellow-200' : 'bg-gray-50 dark:bg-gray-700'}
                    relative flex cursor-pointer p-3 bg-gray-50 rounded-md border shadow-sm mb-2`}
                              >
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="text-sm">
                                      <RadioGroup.Label
                                        as="p"
                                        className={`text-sm text-gray-800 ${
                                          plan.name === selected.name ? '' : 'dark:text-gray-200'
                                        }`}
                                      >
                                        {plan.name}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as="span"
                                        className={`inline text-gray-500 text-xs`}
                                      >
                                        ¥{(plan.total / plan.quantity).toLocaleString("en-US", {
                                          maximumFractionDigits: 2
                                        })} / mo
                                      </RadioGroup.Description>
                                    </div>
                                  </div>
                                  {plan.name === selected.name && (
                                    <CheckIcon className={"h-6 w-6"}/>
                                  )}
                                </div>
                              </RadioGroup.Option>
                            ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div>
                     <span className={`${topic === CHATGPT_MEMBERSHIP.STANDARD ? 'text-brand-purple' : 'text-gray-200'} p-3 rounded mt-12 underline cursor-pointer`}
                           onClick={() => {
                             if (topic === CHATGPT_MEMBERSHIP.STANDARD) {
                               router.push(`/pay/${router.query.id}?topic=${CHATGPT_MEMBERSHIP.PLUS}`)
                             } else {
                               router.push(`/pay/${router.query.id}?topic=${CHATGPT_MEMBERSHIP.STANDARD}`)
                             }
                           }}>
                    {
                      topic === CHATGPT_MEMBERSHIP.STANDARD ? 'Upgrade to ChatGPT Plus' : 'Look for ChatGPT Standard'
                    }
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"px-6 lg:px-14 w-full flex flex-col items-start"}>
            <div className={"dark:text-white w-full md:w-[380px] md:py-6 py-3 text-gray-600"}>
              <div className={"flex flex-col py-4 gap-4"}>
                <div className={""}>Contact</div>
                <div className={"flex gap-2 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md border shadow-sm"}>
                  <div className={"flex gap-2"}>Account</div>
                  <div>{user.name}</div>
                </div>
              </div>
              <div className={"flex flex-col py-4 gap-4"}>
                <div className={""}>Payment</div>
                <div className={"flex gap-2 items-center"}>
                  <WeixinPayLogo/>
                  <WeixinPayText/>
                </div>
              </div>
              {
                qrStatus === 'loading' && (
                  <LoadingIcon/>
                )
              }
              {
                qrStatus === 'error' && (
                  <div className={"flex flex-col items-center justify-center gap-2"} style={{paddingTop: "20px"}}>
                    <div className={"flex justify-center items-center text-red-600 font-bold text-center"}
                         style={{height: '200px'}}>Failed to get the QR code, please refresh and try again.
                    </div>
                  </div>
                )
              }
              {
                dataOfOrder?.data?.trade_state === 'SUCCESS' && (
                  <div className={"flex flex-col items-center justify-center gap-2"} style={{paddingTop: "20px"}}>
                    <div className={"flex justify-center items-center text-green-600 font-bold text-center"}
                         style={{height: '200px'}}>Payment successful!<br/>Return to the home page to continue using.
                    </div>
                  </div>
                )
              }
              {
                codeUrl && checked && (!dataOfOrder?.data?.trade_state || dataOfOrder.data.trade_state === "NOTPAY") ? (
                  <>
                    <div className={'flex p-2 rounded justify-center'}>
                      <div className={"p-4 bg-white border rounded-md"}>
                        <QRCodeSVG value={codeUrl} size={160}/>
                      </div>
                    </div>
                    <div className={`text-xs text-center md:hidden`}>
                      You can take a screenshot and open it in WeChat to complete the payment.
                    </div>
                  </>
                ) : (
                  <div className={"h-32"}>
                  </div>
                )
              }
              <div className={"py-8 flex flex-col gap-2"}>
                <form>
                  <div className={"flex gap-2"}>
                    <input type="checkbox" className={"rounded-sm text-green-600"} ref={checkBoxRef}
                           onChange={(e) => {
                             setChecked(e.target.checked)
                           }}/>
                    <div className={"text-xs"} onClick={(e) => {
                      if (checkBoxRef) {
                        if (checked) {
                          return
                        }
                        // @ts-ignore
                        checkBoxRef.current.click()
                      }
                    }}>
                      I have read and agree the <a href={"/doc/term"} rel={'noreferrer'} target={'_blank'}
                                                   className={"underline"}>terms of service</a> and <a
                      href={"/doc/privacy"} rel={'noreferrer'} target={'_blank'}
                      className={"underline"}>privacy policy</a> of Abandon Inc.
                    </div>
                  </div>
                </form>
                <div className={`text-xs text-red-500 ${checked ? 'hidden' : ''}`}>
                  Please agree to the terms of abandon.chat to complete the payment.
                </div>
              </div>
              <button className={"w-full btn-primary p-3 rounded-md"} disabled={!checked} onClick={mutateOrder}>
                If you have paid, please click here to confirm.
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Pay
