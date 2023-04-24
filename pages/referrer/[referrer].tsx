import {useRouter} from 'next/router';
import AbandonIcon from "@/components/SVG/AbandonIcon";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";

const Referrer = ({user}: any) => {
  const router = useRouter()
  const referrer = router.query.referrer || undefined;

  return (
    <div className={"flex flex-col justify-center items-center h-full w-full gap-4"}>
      <AbandonIcon/>
      {
        user?.sub === referrer ? (
          <div className={"flex flex-col justify-center items-center gap-4"}>
            <div className={"text-sm"}>
              不能自己邀请自己哦！
            </div>
            <button className="btn relative btn-primary" onClick={() => {
              router.push('/chat')
            }}>
              <div className="flex w-full items-center justify-center gap-2">返回首页</div>
            </button>
          </div>
        ) : (
          <div className={"flex flex-col justify-center items-center gap-4"}>
            <div className={"text-sm"}>
              正在助力，你和你的朋友都将获得1天免费体验卡！
            </div>
          </div>
        )
      }
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Referrer