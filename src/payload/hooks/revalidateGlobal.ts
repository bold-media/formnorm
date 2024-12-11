import { Setting } from "@payload-types";
import { revalidateTag } from "next/cache";
import { GlobalAfterChangeHook } from "payload";

export const revalidateGlobal: GlobalAfterChangeHook = ({global, doc, context, req: { payload}}) => {
    if (!context.disableRevalidate) {
        payload.logger.info(`[revalidateGlobal]: Revalidating global: ${global}`)
        revalidateTag(global.slug)
    }
    return doc
}