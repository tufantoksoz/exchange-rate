import { ICurrency } from 'interfaces/ICurrency.interface';
import * as mongoose from 'mongoose';

export class CurrencyModel {
  id: string;
  date: string;
  currencyData: Object;
}

export const CurrencySchema = new mongoose.Schema(
  {
    date: String,
    currencyData: Object,
  },
  {
    collection: 'currencyData',
  },
);
