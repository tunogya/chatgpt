import {useRouter} from "next/router";
import AbandonIcon from "@/components/SVG/AbandonIcon";
import Beian from "@/components/Beian";

const Login = () => {
  const router = useRouter()

  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5 text-gray-800 dark:text-gray-100">
          <AbandonIcon/>
        </div>
        <div className="mb-2 text-center">abandon.chat</div>
        <div className="mb-4 text-center italic">&quot;To abandon yourself to a life of pleasure.&quot;</div>
        <div className="flex flex-row gap-3">
          <button className="btn relative btn-primary" onClick={() => {
            router.push('/api/auth/login?returnTo=/chat')
          }}>
            <div className="flex w-full items-center justify-center gap-2">登陆</div>
          </button>
          <button className="btn relative btn-primary" onClick={() => {
            router.push('/api/auth/login')
          }}>
            <div className="flex w-full items-center justify-center gap-2">注册</div>
          </button>
        </div>
      </div>

      <div className={"fixed bottom-0"}>
        <Beian />
      </div>
    </div>
  )
}

export default Login