export interface PageRouter {
  [key: string]: PageRouterData;
}

export interface PageRouterData {
  readonly path: string;
  wxml?: {
    hfunc?: string;
  };
  wxss?: {
    cssText?: string;
  };
  js?: {
    jsText?: string;
  };
}

export interface GlobalRouter {
  stack?: PageRouterData[];

  routers: PageRouter;
}