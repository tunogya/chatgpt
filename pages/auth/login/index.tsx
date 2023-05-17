import {useRouter} from "next/router";
import AbandonIcon from "@/components/SVG/AbandonIcon";

const Login = () => {
  const router = useRouter()

  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5 text-gray-700 dark:text-gray-100 animated hover:intensifies">
          <AbandonIcon width={'140'}/>
        </div>
        <div className="mb-4 text-center text-xs dark:text-white">由 OpenAI 提供技术支持</div>
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
    </div>
  )
}

export default Login