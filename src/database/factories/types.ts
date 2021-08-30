export type NonFunctionProperties<T> = {
  [K in keyof T]?: T[K] extends Function ? never : T[K];
};
