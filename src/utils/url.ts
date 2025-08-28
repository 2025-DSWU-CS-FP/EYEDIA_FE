const s3ToHttp = (u?: string | null, region = 'ap-northeast-2'): string => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;

  const match = /^s3:\/\/([^/]+)\/(.+)$/.exec(u);
  if (!match) return u;

  const [, bucket, rawKey] = match;
  const key = rawKey.split('/').map(encodeURIComponent).join('/');

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export default s3ToHttp;
