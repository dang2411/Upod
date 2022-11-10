export const cutOut = (value: string) => {
  if (value && value.length > 40) {
    return value.substring(0, 40) + '...';
  }
  return value;
};
