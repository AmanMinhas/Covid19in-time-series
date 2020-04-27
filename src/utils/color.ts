export const colorSet = [
  '#FF6633', '#FFB399', '#FF33FF', '#00B3E6', '#FF1A66',
  '#E6B333', '#3366E6', '#999966', '#B34D4D', '#FF99E6',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#1AFF33', '#999933', '#E6331A',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

export const getUniqueColor = (colorsInUse: string[]) => {
  let randomColor = '';
  do {
    randomColor = colorSet[Math.floor(Math.random() * colorSet.length)];
  } while (colorsInUse.includes(randomColor));

  return randomColor;
}
