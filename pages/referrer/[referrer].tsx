import {useRouter} from 'next/router';
import AbandonIcon from "@/components/SVG/AbandonIcon";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import fetch from "node-fetch";
import {useCallback, useEffect, useState} from "react";

const Referrer = ({user}: any) => {
  const router = useRouter()
  const referrer = router.query.referrer || undefined;
  const [status, setStatus] = useState('idle')

  const newRef = async () => {
    if (referrer && user && referrer !== user.sub) {
      setStatus('loading')
      try {
        const res = await fetch('/api/app/referrer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            referrer: referrer,
            user: user.sub
          })
        })
        const data = await res.json()
        if (data.success) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (e) {
        setStatus('error')
      }
    }
  }

  return (
    <div className={"flex flex-col justify-center items-center h-full w-full gap-4"}>
      <AbandonIcon width={'140'}/>
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
              {status === 'success' && '助力成功，你和你的朋友都将免费获得1天体验卡！'}
              {status === 'error' && '助力失败！每日只能助力一次哦！'}
              {status === 'idle' && '点击助力按钮，你和你的朋友都获得1天免费体验卡！'}
              {status === 'loading' && '正在助力中...'}
            </div>
            <div className={'flex gap-4'}>
              <button className="btn relative btn-primary" disabled={status === 'loading'} onClick={() => {
                newRef()
              }}>
                <div className="flex w-full items-center justify-center gap-2">
                  {status === 'loading' ? '立即助力' : '立即助力'}
                </div>
              </button>
              <button className="btn relative" onClick={() => {
                router.push('/chat')
              }}>
                <div className="flex w-full items-center justify-center gap-2">返回首页</div>
              </button>
            </div>

          </div>
        )
      }
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Referrer