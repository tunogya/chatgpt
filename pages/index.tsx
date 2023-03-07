import OpenAIIcon from "@/components/SVG/OpenAIIcon";

const Index = () => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5">
          <OpenAIIcon/>
        </div>
        <div className="mb-2 text-center text-sm">请稍候，我们正在检查您的浏览器...</div>
      </div>
    </div>
  )
}

export default Index