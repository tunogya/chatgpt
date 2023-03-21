import {useCallback, useEffect} from "react";
import OpenAIIcon from "@/components/SVG/OpenAIIcon";
import {useRouter} from "next/router";
import {useUser} from "@auth0/nextjs-auth0/client";

const Logout = () => {
  const router = useRouter();
  const {user} = useUser()

  const logout = useCallback(async () => {
    if (user) {
      await fetch('/api/auth/logout')
      setTimeout(() => {
        router.push('/auth/login')
      }, 1000)
    } else {
      setTimeout(() => {
        router.push('/auth/login')
      }, 1000)
    }
  }, [router, user])

  useEffect(() => {
    logout()
  }, [logout])

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
