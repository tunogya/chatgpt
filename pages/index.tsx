import OpenAIIcon from "@/components/SVG/OpenAIIcon";
import {useUser} from "@auth0/nextjs-auth0/client";
import Link from "next/link";

const Index = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5">
          <OpenAIIcon/>
        </div>
        <div className="mb-2 text-center text-sm">请稍候，我们正在检查您的浏览器...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5">
          <OpenAIIcon/>
        </div>
        <div className="mb-2 text-center text-sm">{error.message}</div>
      </div>
    </div>
  );

  if (user) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
        <div className="w-96 flex flex-col justify-center items-center">
          <div className="mb-5">
            <OpenAIIcon/>
          </div>
          <div className="mb-2 text-center text-sm">
            Welcome {user.name}! <Link href={"/api/auth/logout"}>Logout</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5">
          <OpenAIIcon/>
        </div>
        <Link href={"/api/auth/login"}>Login</Link>
      </div>
    </div>
  );
}

export default Index