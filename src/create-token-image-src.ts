interface FilenameOptions {
  readonly name: string;
  readonly variant?: number | undefined;
}

interface Options {
  readonly extension?: string | undefined;
  readonly filename?: string | undefined;
  readonly name: string;
  readonly variant?: number | undefined;
}

const RAW_GITHUB_USER_CONTENT =
  'https://raw.githubusercontent.com/mtgenius/uncube/refs/heads/main/images/';

const createFilename = ({ name, variant }: FilenameOptions): string => {
  const filename: string = name
    .toLowerCase()
    .replace(/ that's all colors$/u, '')
    .replace(/ (?:and|with) ".+"/u, '')
    .replace(/[\s/,']+/gu, '-')
    .replace('-and-', '-')
    .replace('-with-', '-');

  if (typeof variant === 'undefined') {
    return filename;
  }

  return `${filename}-${variant}`;
};

export default function createTokenImageSrc({
  extension = 'png',
  filename,
  name,
  variant,
}: Options): string {
  if (typeof filename === 'string') {
    return `${RAW_GITHUB_USER_CONTENT}${filename}.${extension}`;
  }

  const newFilename: string = createFilename({ name, variant });
  return `${RAW_GITHUB_USER_CONTENT}${newFilename}.${extension}`;
}
