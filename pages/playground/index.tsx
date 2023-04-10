import PCNavigation from "@/components/NavigationBar/PCNavigation";
import MobileSideBar from "@/components/NavigationBar/MobileSideBar";
import MobileNavigationBar from "@/components/NavigationBar/MobileNavigationBar";
import InputArea from "@/components/Content/InputArea";
import ScrollToBottom, {useScrollToBottom, useSticky} from "react-scroll-to-bottom";
import {useCallback, useEffect, useMemo, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setSession} from "@/store/session";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import DialogBoxItem from "@/components/DialogBoxList/DialogBoxItem";
import Dashboard from "@/components/Dashboard";
import DownIcon from "@/components/SVG/DownIcon";

const DialogBoxListContent = () => {
  const bottomRef = useRef(null);
  const session = useSelector((state: any) => state.session.session);
  const dispatch = useDispatch();
  const isWaitHistory = useSelector((state: any) => state.session.isWaitHistory);
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  const updateSession = useCallback(async () => {
    const data = {
      "PK": "auth0|641c2d67be8dc981b953374c",
      "SK": "CONVERSATION#7051176590423622656",
      "created": 1681131503,
      "id": "CONVERSATION#7051176590423622656",
      "mapping": {
        "00000000-0000-0000-0000-000000000000": {
          "children": [
            "4fec09ea-8354-4269-a779-0be7c3ed51af"
          ],
          "id": "00000000-0000-0000-0000-000000000000",
          "message": null,
          "parent": null
        },
        "4fec09ea-8354-4269-a779-0be7c3ed51af": {
          "children": [
            "bdd2520b-2866-403c-84a2-da5b95b2a8d0"
          ],
          "id": "4fec09ea-8354-4269-a779-0be7c3ed51af",
          "message": {
            "author": {
              "name": "tom@abandon.chat",
              "role": "user"
            },
            "content": {
              "content_type": "text",
              "parts": [
                "如何通过谷歌广告盈利网站"
              ]
            },
            "id": "4fec09ea-8354-4269-a779-0be7c3ed51af",
            "role": "user"
          },
          "parent": "00000000-0000-0000-0000-000000000000"
        },
        "bdd2520b-2866-403c-84a2-da5b95b2a8d0": {
          "children": [
          ],
          "id": "bdd2520b-2866-403c-84a2-da5b95b2a8d0",
          "message": {
            "author": {
              "role": "assistant"
            },
            "content": {
              "content_type": "text",
              "parts": [
                "1. 注册 Google AdSense\n\nGoogle AdSense 是谷歌广告的主要服务之一，它为网站发布者提供了一个简单的方式，在他们的网站上添加广告并从中获利。 注册 AdSense 非常简单，只需将广告代码添加到您的网站页面中，并向谷歌之后确认您的帐户。\n\n2. 创建更多内容\n\n在您向您的网站添加谷歌广告之前，请确保您的网站包含丰富的内容。 搜索引擎优化、社交媒体和其他方式都可以为您网站的流量带来更多的影响，这可以使您的广告受益更多。\n\n3. 在正确的位置放置广告\n\n将广告放置在合适的位置可以增加该广告的点击率。通常，金字塔型的布局和插入式广告是和广告营销寻求者的最佳选择。\n\n4. 了解您的受众\n\n了解您的网站受众，可以使您更好地为您的个别用户调整广告。 还可以使用谷歌广告服务中的定位功能，将广告针对特定受众。\n\n5. 管理您的广告\n\n为了提高广告收入，不断监测并调整广告排名和布局，是至关重要的。 通过谷歌广告的许多数据分享功能，您可以了解广告的表现，并调整以提高收益。\n​"
              ]
            },
            "role": "assistant"
          },
          "parent": "4fec09ea-8354-4269-a779-0be7c3ed51af"
        }
      },
      "title": "如何通过谷歌广告盈利网站",
      "TTL": 1712667521
    }
    dispatch(setSession({
      // @ts-ignore
      id: data.SK,
      // @ts-ignore
      title: data.title,
      // @ts-ignore
      mapping: data.mapping,
      // @ts-ignore
      create_time: new Date(data.created * 1000).toLocaleString(),
    }))
  }, [dispatch])

  useEffect(() => {
    updateSession()
  }, [updateSession])

  // scroll to bottom when new message
  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [session.messages]);

  const rootMessageId = useMemo(() => {
    if (!session) {
      return null
    }
    if (session.mapping?.['00000000-0000-0000-0000-000000000000']) {
      return '00000000-0000-0000-0000-000000000000'
    }
    // for those who has no root(00000000-0000-0000-0000-000000000000) message
    const ids = Object?.keys(session?.mapping || {}) || []
    if (ids.length === 0) {
      return null
    }
    let check_point = ids[0]
    while (session.mapping[check_point].parent !== null) {
      check_point = session.mapping[check_point].parent
    }
    return check_point
  }, [session])

  return (
    <div className={"w-full"}>
      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
        {
          isWaitHistory ? (
            <div className="flex flex-col items-center text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-800">
              <LoadingIcon/>
              <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
            </div>
          ) : (
            // if session.id is not null, can show dialog box
            // if session id is null, but rootMessageId has value, can show dialog box
            // if session id is null, and rootMessageId is null, too, show placeholder
            (session?.id || rootMessageId)
              ? (
                rootMessageId && (
                  <DialogBoxItem id={rootMessageId}/>
                )
              ) : (
                <Dashboard/>
              )
          )
        }
      </div>
      {
        !sticky && (
          <button onClick={scrollToBottom} id={"scroll-to-bottom-button"}
                  className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
            <DownIcon/>
          </button>
        )
      }
    </div>
  )
}

const Playground = () => {
  return (
    <>
      <div className={'overflow-hidden w-full h-full relative'}>
        <PCNavigation/>
        <div className="flex h-full flex-1 flex-col md:pl-[260px]">
          <MobileNavigationBar/>
          <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
            <div className="flex-1 overflow-hidden">
              <ScrollToBottom className="h-full w-full dark:bg-gray-800">
                <DialogBoxListContent/>
              </ScrollToBottom>
            </div>
            <InputArea />
          </main>
        </div>
      </div>
      <MobileSideBar/>
    </>
  )
}

export default Playground