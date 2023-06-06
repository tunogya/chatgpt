import {FC, useMemo} from "react";
import LoadingIcon from "@/components/SVG/LoadingIcon";
import SharePreviewBaseDialogBoxItem from "@/components/ShareDialogPreview/ShareDialogBoxItem";

type ShareDialogBoxListProps = {
  data: any
  isLoading?: boolean
}

const ShareDialogPreviewList: FC<ShareDialogBoxListProps> = ({data, isLoading}) => {
  const rootMessageId = useMemo(() => {
    if (!data) {
      return null
    }
    if (data.mapping?.['00000000-0000-0000-0000-000000000000']) {
      return '00000000-0000-0000-0000-000000000000'
    }
    // for those who has no root(00000000-0000-0000-0000-000000000000) message
    const ids = Object?.keys(data?.mapping || {}) || []
    if (ids.length === 0) {
      return null
    }
    let check_point = ids[0]
    while (data.mapping[check_point].parent !== null) {
      check_point = data.mapping[check_point].parent
    }
    return check_point
  }, [data])

  return (
    <div className="flex flex-col text-sm dark:bg-gray-800">
      {
        isLoading ? (
          <div className="flex flex-col items-center text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-800">
            <div className={"pt-4"}>
              <LoadingIcon/>
            </div>
            <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
          </div>
        ) : (
          (data?.id || rootMessageId) && (
            rootMessageId && (
              <SharePreviewBaseDialogBoxItem id={rootMessageId} data={data}/>
            )
          )
        )
      }
    </div>
  )
}

export default ShareDialogPreviewList