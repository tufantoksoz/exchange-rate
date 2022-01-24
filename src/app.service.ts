import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';
import { ICurrency } from 'interfaces/ICurrency.interface';
import * as moment from 'moment';
import { CurrencyModel, CurrencySchema } from 'tools/model/currency.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

const mongoose = require('mongoose');

const options = {
  ignoreAttributes: false,
};

const parser = new XMLParser(options);

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    @InjectModel('Currency') private readonly mongoModel: Model<CurrencyModel>,
  ) {}

  async onModuleInit() {
    await this.saveCurrency();
  }

  @Cron(CronExpression.EVERY_DAY_AT_4PM)
  async handleCron() {
    await this.saveCurrency();
  }

  async saveCurrency() {
    if ((await this.validator()) === true) return null;

    const date = moment().format('YYYY-MM-DD');

    const currencyData = await this.getXml(date);

    let currencymodel = new CurrencyModel();

    currencymodel.date = date;
    currencymodel.currencyData = currencyData;

    const createdModel = new this.mongoModel(currencymodel);

    return await createdModel.save();
  }

  private validator(): Promise<Boolean> {
    mongoose.connect('mongodb://localhost/Currency');
    const date = moment().format('YYYY-MM-DD');

    const currency = this.mongoModel.exists({ date: date });

    return currency;
  }

  private async addZero(number: Number | String) {
    if (number.toString().length < 2) {
      number = '0' + number;
    }
    return number;
  }

  private async decreaseDate(date: Date) {
    const day = moment(date).date();

    if (day === 1) {
      const dateFrom = moment(date)
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');

      date = moment(dateFrom).toDate();
    } else date = moment(date).subtract(1, 'days').toDate();

    return date;
  }

  private async getXml(date: Date | String) {
    date = moment(date.toString()).toDate();
    const day = await this.addZero(moment(date).date());
    const month = await this.addZero(moment(date).month() + 1);
    const year = moment(date).year();

    const url = `https://www.tcmb.gov.tr/kurlar/${year}${month}/${day}${month}${year}.xml`;

    let currencyXml: any;

    try {
      const newData = await lastValueFrom(this.httpService.get(url));
      currencyXml = newData;
    } catch (error) {
      const newDate = await this.decreaseDate(date);
      return await this.getXml(newDate);
    }

    const jsonData = parser.parse(currencyXml.data);

    const currencyData = jsonData.Tarih_Date.Currency;

    return currencyData;
  }

  async getRates(from: string, to: string, date: Date | String) {
    const currencyData = await this.getXml(date);
    const data = currencyData.find((element) => {
      return element['@_CurrencyCode'] === to;
    });

    data.CrossRateUSD === ''
      ? from + ': ' + data.CrossRateOther + ' ' + to
      : from + ': ' + data.CrossRateUSD + ' ' + to;

    // if (data.CrossRateUSD === '') {
    //   return from + ': ' + data.CrossRateOther + ' ' + to;
    // } else return from + ': ' + data.CrossRateUSD + ' ' + to;
  }

  async currencyCalculate(from: string, to: string, amount: any, date: Date) {
    const currencyData = await this.getXml(date);

    const currency = (from?: String, to?: String) => {
      const getItem: ICurrency = currencyData.find((item) => {
        if (from === 'TRY') return item['@_CurrencyCode'] === to;
        if (to === 'TRY') return item['@_CurrencyCode'] === from;

        if (from !== 'TRY' && to !== 'TRY')
          return item['@_CurrencyCode'] === from;

        return item['@_CurrencyCode'] === to;
      });

      return getItem;
    };

    const calculateCurrency = () => {
      if (from === to || typeof currency === 'undefined')
        return 'Invalid currency code';

      if (from !== 'TRY' && to !== 'TRY') {
        const fromValue = currency(from).BanknoteSelling;
        const tryValue = amount * fromValue;
        const toValue = tryValue / currency(to).BanknoteSelling;
        return toValue.toFixed(2);
      }

      if (from === 'TRY')
        return (amount / currency(to).BanknoteSelling).toFixed(2);

      const calculatedNumber = amount * currency(from, to).BanknoteSelling;

      return calculatedNumber.toFixed(2);
    };

    return calculateCurrency() + ' ' + to;
  }
}
