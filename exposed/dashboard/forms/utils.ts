import Mustache from 'mustache';
import {ReformSchema} from '~/components/Shared/ReForm';

export function bindPathOptions(schema: ReformSchema[], data: Record<any, any>) {
  return schema.map((item: ReformSchema) => ({
    ...item,
    options: {
      ...(item.options || {}),
      path: item?.options?.path ? Mustache.render(item.options.path, data) : undefined,
    }
  }))
}

// export function transformError422(error: any) {

// }
