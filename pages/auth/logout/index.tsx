import {useEffect} from "react";
import OpenAIIcon from "@/components/SVG/OpenAIIcon";
import {useRouter} from "next/router";

const Logout = () => {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout')
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }

  useEffect(() => {
    logout
  }, [])

  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5 w-[30px] h-[30px]">
          <OpenAIIcon/>
        </div>
        <div className="mb-2 text-center">正在注销您的账户...</div>
      </div>
    </div>
  )
}

export default Logout
