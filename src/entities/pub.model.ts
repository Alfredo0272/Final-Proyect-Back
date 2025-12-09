import { Types } from 'mongoose';
import { ImgData } from '../types/img.data';

export type Pub = {
  id: string;
  name: string;
  logo: ImgData;
  direction: string;
  owner: string;
  taps: number;
  beers: Types.ObjectId[];
};
