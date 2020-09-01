type Cookie = {
  name: string;
  value: string;
  maxAge: number;
  httpOnly: boolean;
};

export interface GoodResult<TData> {
  cookies?: Array<Cookie>;
  data: TData;
}

export interface BadResult {
  status: number;
  error?: string;
}

export type Result<TData> = GoodResult<TData> | BadResult;

export function good<TData>(data: TData): Result<TData> {
  return {data};
}

export function goodWithSetCookie<TData>(data: TData, cookies: Array<Cookie>): Result<TData> {
  return {...good(data), cookies};
}

export function bad(status: number, error?: string): Result<never> {
  return {status, error};
}
