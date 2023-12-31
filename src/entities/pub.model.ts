import { ImgData } from '../types/img.data';
import { Beer } from './beer.model.js';

export type Pub = {
  id: string;
  name: string;
  logo: ImgData;
  direction: string;
  owner: string;
  taps: number;
  beers: Beer[];
};
