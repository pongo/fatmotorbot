import urlExistsDeep from 'url-exists-deep';

export async function urlExists(url: string): Promise<string | undefined> {
  const exists = await urlExistsDeep(url);
  if (exists === false) return undefined;
  return exists.href;
}
