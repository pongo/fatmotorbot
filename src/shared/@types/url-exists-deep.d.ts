declare module 'url-exists-deep' {
  export default function urlExists(
    uri: string,
    header?: object,
    method?: string,
    timeout?: number,
    pool?: object,
    prevStatus?: number,
  ): Promise<URL | false>;
}
