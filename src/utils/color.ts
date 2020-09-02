export const colorSet = [
  '#ff1a66',
  '#ffa500',
  '#9a9a08',
  '#00e680',
  '#00b3e6',
  '#6666ff',
  '#ff33ff',
  '#66664d',
  '#000000',
];

export const getUniqueColor = (colorsInUse: string[]) => {
  if (colorsInUse.length === colorSet.length) return '';
  let randomColor = '';
  do {
    randomColor = colorSet[Math.floor(Math.random() * colorSet.length)];
  } while (colorsInUse.includes(randomColor));

  return randomColor;
};
