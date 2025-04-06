const RAW_GITHUB_USER_CONTENT =
  'https://raw.githubusercontent.com/mtgenius/uncube/refs/heads/main/images/';

export default function mapTokenNameToImageSrc(name: string): string {
  if (
    name ===
    '4/4 black Zombie creature with "Lazotep Archway enterse the battlefield tapped." and "{T}: Add {W} or {B}." named Lazotep Archway'
  ) {
    return `${RAW_GITHUB_USER_CONTENT}lazotep-archway.png`;
  }

  const fileName: string = name
    .toLowerCase()
    .replace(/ that's all colors$/u, '')
    .replace(/ with ".+"/u, '')
    .replace(/[\s/,']+/gu, '-')
    .replace('-and-', '-')
    .replace('-with-', '-');
  return `${RAW_GITHUB_USER_CONTENT}${fileName}.png`;
}
