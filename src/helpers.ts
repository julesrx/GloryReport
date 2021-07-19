const average = (arr: number[], fractionDigits = 2): string => {
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(fractionDigits);
};

export { average };
