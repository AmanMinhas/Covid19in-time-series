export interface ISource {
  label: string;
  value: string;
}

export const timeSeriesApiPath = {
  label: 'timeSeriesApi',
  value: 'https://api.rootnet.in/covid19-in/stats/history',
};

export const sources = [timeSeriesApiPath];
