import Mustache from 'mustache';
import {ReformSchema} from '~/components/Re/Form';

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
  const {response} = e;
  if (!response) {
    console.warn('Unexpected error.');
    return envVarFormErrors;
  }
  const {status, data} = response;
  if (status === 422) {
    if (data.error.code === "VALIDATION_FAILED") {
      const {details} = data.error;
      details.forEach((detail: any) => {
        envVarFormErrors[detail.info.missingProperty] = detail.code;
      });
      return envVarFormErrors;
    }
    const {
      messages,
    } = data.error.details;
    const errorKeys = Object.keys(messages);
    envVarFormErrors = errorKeys.reduce((acc: Record<string, string>, errorKey: string) => {
      acc[errorKey] = messages[errorKey] as string;
      return acc;
    }, {});
    return envVarFormErrors;
  }
  if (status === 409) {
    envVarFormErrors[data.error.name] = data.error.message;
    return envVarFormErrors;
  }
  return envVarFormErrors;
}
