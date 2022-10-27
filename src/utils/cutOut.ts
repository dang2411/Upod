export const cutOut = (value: string) => {
  if (value && value.length > 70) {
    return value.substring(0, 70) + '...';
  }
  return value;
};
