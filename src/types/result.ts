type Cookie = {
  name: string;
  value: string;
  maxAge: number;
  httpOnly: boolean;
};

export interface GoodResult<T> {
  cookies?: Array<Cookie>;
  data: Array<T>;
}

export interface BadResult {
  status: number;
  error?: string;
}

export type Result<T> = GoodResult<T> | BadResult;

export function good<T>(t: T | Array<T>): Result<T> {
  return {data: Array.isArray(t) ? t : [t]};
}

export function goodWithSetCookie<T>(t: T | Array<T>, cookies: Array<Cookie>): Result<T> {
  return {...good(t), cookies};
}

export function bad(status: number, error?: string): Result<never> {
  return {status, error};
}
