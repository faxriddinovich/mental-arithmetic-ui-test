export function fsBucketFactory(id: string) {
  return process.env.VUE_APP_FS_BUCKET_URL + "/" + id;
}

export function avatarFactory(seed: string) {
  const str = /^[A-Za-z0-9 ]+$/.test(seed) ? seed : " ".repeat(seed.length);
  return `https://avatars.dicebear.com/api/initials/${str}.svg?fontSize=35`;
}
