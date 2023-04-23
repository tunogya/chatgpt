import {useRouter} from 'next/router';
import AbandonIcon from "@/components/SVG/AbandonIcon";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";

const Ref = ({user}: any) => {
  const router = useRouter()
  const ref = router.query.ref || undefined;

  return (
    <div className={"flex flex-col justify-center items-center h-full w-full gap-4"}>
      <AbandonIcon/>
      {
        user?.sub === ref ? (
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

export default Ref