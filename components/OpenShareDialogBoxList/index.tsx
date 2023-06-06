import {FC, useMemo} from "react";
import OpenShareDialogBoxItem from "@/components/OpenShareDialogBoxList/OpenShareDialogBoxItem";

type OpenShareDialogBoxListProps = {
  data: any
}

const OpenShareDialogBoxList: FC<OpenShareDialogBoxListProps> = ({data}) => {
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
        (data?.id || rootMessageId) && (
          rootMessageId && (
            <OpenShareDialogBoxItem id={rootMessageId} data={data}/>
          )
        )
      }
    </div>
  )
}

export default OpenShareDialogBoxList