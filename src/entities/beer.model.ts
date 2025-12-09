import { Types } from 'mongoose';
import { ImgData } from '../types/img.data.js';

export type Beer = {
  id: string;
  name: string;
  brewer: string;
  style: string;
  alcohol: string;
  beerImg: ImgData;
  author: Types.ObjectId;
  pubs: Types.ObjectId[];
};
