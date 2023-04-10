import Image from "next/image";

const Beian = () => {
  return (
    <div className="flex justify-center px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6 space-x-1.5">
      <a href={"https://beian.miit.gov.cn"}>
        <Image src={"/images/beian.png"} width={16} height={16} alt={"备案图标"}/>
      </a>
      <a href={"https://beian.miit.gov.cn"}>
        苏ICP备2023010308号-1
      </a>
    </div>
  )
}

export default Beian