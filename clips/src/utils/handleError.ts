export const handleError = (err: unknown): void => {
  if (err instanceof Error) {
    throw err;
  }
};
