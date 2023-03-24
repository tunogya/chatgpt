import AbandonIcon from "@/components/SVG/AbandonIcon";
import {useUser} from "@auth0/nextjs-auth0/client";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Index = () => {
  const {user, error, isLoading} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && error) {
      router.push(`/auth/error?error=${error.message}`);
    }
    if (!isLoading && user) {
      router.push('/chat');
    }
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [error, isLoading, router, user]);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5">
          <AbandonIcon/>
        </div>
        <div className="mb-2 text-center text-sm">请稍候，我们正在检查您的浏览器...</div>
      </div>
    </div>
  )
}

export default Index