import Mustache from 'mustache';
import {ReformSchema} from '~/components/ReForm';

export function bindPathOptions(schema: ReformSchema[], data: Record<any, any>) {
  return schema.map((item: ReformSchema) => ({
    ...item,
    options: {
      ...(item.options || {}),
      path: item?.options?.path ? Mustache.render(item.options.path, data) : undefined,
    }
  }));
}

export function transformError(e: any) {
  let envVarFormErrors: Record<string, string> = {};
  console.log(
    e.response.data.error,
  );
  console.log(e);
  if (e.response.status === 422) {
    if (e.response.data.error.code === "VALIDATION_FAILED") {
      const {details} = e.response.data.error;
      details.forEach((detail: any) => {
        envVarFormErrors[detail.info.missingProperty] = detail.code;
      });
      return envVarFormErrors;
    }
    const {
      messages,
    } = e.response.data.error.details;
    const errorKeys = Object.keys(messages);
    envVarFormErrors = errorKeys.reduce((acc: Record<string, string>, errorKey: string) => {
      acc[errorKey] = messages[errorKey] as string;
      return acc;
    }, {});
    return envVarFormErrors;
  }
  if (e.response.status === 409) {
    envVarFormErrors[e.response.data.error.name] = e.response.data.error.message;
    return envVarFormErrors;
  }
  return envVarFormErrors;
}
