// import Image from "next/image";

const Beian = () => {
  return (
    <div
      className="flex flex-col items-center px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6 space-y-1">
      <div className={'flex space-x-1.5'}>
        <a href={"/doc/PrivacyPolicy"} target={'_blank'} rel={'noreferrer'}>
          隐私政策
        </a>
      </div>
      <div className={'flex space-x-1.5'}>
      {/*  <a href={"http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32068202000378"} target={'_blank'} rel={'noreferrer'}>*/}
      {/*    <div className={"flex space-x-1.5"}>*/}
      {/*      <Image src={"/images/beian.png"} width={16} height={16} alt={"备案图标"}/>*/}
      {/*      <p>*/}
      {/*        苏公网安备32068202000378号*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </a>*/}
        <a href={"https://beian.miit.gov.cn"} target={'_blank'} rel={'noreferrer'}>
          <div className={"flex space-x-1.5"}>
            <p>
              沪ICP备2023000778号-2
            </p>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Beian