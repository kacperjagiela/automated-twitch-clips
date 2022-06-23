export const convertTimeToSeconds = (
  time: string,
  separator: string
): number | null => {
  if (time.includes(separator)) {
    const parts = time.split(separator);
    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);

    return minutes * 60 + seconds;
  }

  return null;
};
