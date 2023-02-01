import { apiHost } from '~/constants/env';
import { isBrowser } from '~/libs/browser/dom';
import type { NextPageContext } from 'next';

const _NEXT_API_ROUTES_PATHNAME = '/api';
const _NEXT_COMMON_PATHNAME = '/';

export type ApiRoutesConstant = 'hello';

export type ApiRoutes = URL | Request | ApiRoutesConstant;

export class ApiEnvirontment {
  private _url: URL | null = null;

  private _nextApiRoutes = false;

  get url() {
    if (!this._url) {
      const error = new Error();
      error.name = 'ApiEnvirontment';
      error.message = '"url" is not defined';
      throw error;
    }

    return this._url;
  }

  private readonly _hello = {
    root: 'hello',
  } as const;

  constructor(ctx?: NextPageContext) {
    if (apiHost) {
      this._url = new URL(apiHost);
    } else if (ctx && !isBrowser) {
      if (ctx.req) {
        const { headers } = ctx.req;
        const host = headers.host;
        const protocol = headers['x-forwarded-proto'] || 'http';
        const pathname = this._nextApiRoutes
          ? _NEXT_API_ROUTES_PATHNAME
          : _NEXT_COMMON_PATHNAME;
        this._url = new URL(pathname, `${protocol}://${host}`);
      }
    } else if (isBrowser) {
      const pathname = this._nextApiRoutes
        ? _NEXT_API_ROUTES_PATHNAME
        : _NEXT_COMMON_PATHNAME;
      this._url = new URL(pathname, location.origin);
    }
  }

  get hello() {
    return this._hello;
  }

  // typescript auto complete for api path "get hello()"
  generateUrl(path: ApiRoutesConstant) {
    try {
      const baseUrl = this.url.toString();
      if (
        baseUrl.endsWith(_NEXT_COMMON_PATHNAME) &&
        path.startsWith(_NEXT_COMMON_PATHNAME)
      ) {
        return `${baseUrl}${path.slice(1)}`;
      } else if (
        !baseUrl.endsWith(_NEXT_COMMON_PATHNAME) &&
        !path.startsWith(_NEXT_COMMON_PATHNAME)
      ) {
        return `${baseUrl}${_NEXT_COMMON_PATHNAME}${path}`;
      }
      return `${baseUrl}${path}`;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

let apiEnv: ApiEnvirontment;

export function getApiEnv(ctx?: NextPageContext) {
  if (!apiEnv) {
    apiEnv = new ApiEnvirontment(ctx);
  }
  return apiEnv;
}

export function setApiEnv(ctx?: NextPageContext) {
  if (!apiEnv) {
    apiEnv = new ApiEnvirontment(ctx);
  }
  return apiEnv;
}