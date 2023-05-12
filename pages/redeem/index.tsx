import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {useRouter} from "next/router";
import {useRef, useState} from "react";
import WeixinPayLogo from "@/components/SVG/WeixinPayLogo";
import WeixinPayText from "@/components/SVG/WeixinPayText";
import LoadingIcon from "@/components/SVG/LoadingIcon";

const Redeem = ({user}: any) => {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const checkBoxRef = useRef(null)

  return (
    <div className={"overflow-hidden w-full h-full relative flex z-0"}>
      <div className={"flex w-full h-full fixed z-0 flex-shrink-0 overflow-x-hidden"}>
        <div className={"w-full"}/>
        <div className={"w-full shadow-xl hidden md:inline-block"}/>
      </div>
      <div className={"flex w-full justify-center z-10"}>
        <div className={"flex flex-col md:flex-row md:gap-6 w-full"}>
          <div className={"px-6 lg:px-14 w-full flex flex-col items-end"}>
            <div className={"dark:text-white w-full md:w-[380px] md:py-6 py-3"}>
              <button className={"btn font-semibold text-gray-800 dark:text-white"}
                      onClick={router.back}>
                <div className={"flex gap-2"}>
                  <div>←</div>
                  <div>abandon.chat</div>
                </div>
              </button>
              <div className={"md:px-4"}>
                <div className={"py-8"}>
                  <div className={"text-gray-500"}>兑换你的 ChatGPT 会员卡</div>
                </div>
                <div className={"pb-4"}>
                  <div className={"pt-5 text-sm"}>ChatGPT 30 天会员卡</div>
                  <div className={"text-xs text-gray-500"}>CDKEY 兑换</div>
                </div>
                <div className={"text-sm py-4 flex justify-between text-black dark:text-white"}>
                  <div className={"font-semibold"}>
                    小计
                  </div>
                  <div className={"font-semibold"}>
                    0 元
                  </div>
                </div>
                <div className={"text-sm py-4 text-gray-500 border-t-[1px] flex justify-between"}>
                  <div className={"font-semibold"}>
                    税
                  </div>
                  <div className={"font-semibold"}>0 元
                  </div>
                </div>
                <div className={"text-sm py-4 border-t-[1px] flex justify-between text-black dark:text-white"}>
                  <div className={"font-semibold"}>
                    今日应付合计
                  </div>
                  <div className={"font-semibold"}>
                    0 元
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"px-6 lg:px-14 w-full flex flex-col items-start"}>
            <div className={"dark:text-white w-full md:w-[380px] md:py-6 py-3 text-gray-600 dark:text-gray-200"}>
              <div className={"flex flex-col py-4 gap-4"}>
                <div className={""}>联系信息</div>
                <div className={"flex gap-6 text-sm bg-gray-50 dark:bg-gray-600 p-3 rounded-md border shadow-sm"}>
                  <div>账户</div>
                  <div>{user.name}</div>
                </div>
              </div>
              <div className={"flex flex-col py-4 gap-4"}>
                <div className={""}>CDKEY</div>
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
                <div className={`text-xs text-red-500 ${checked ? 'opacity-0' : 'opacity-100'}`}>
                  请同意 Abandon chat 的条款以完成兑换
                </div>
              </div>
              <div>
                <button className={"btn relative btn-primary w-full md:w-auto"} disabled={!checked}>
                  确认兑换
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Redeem
