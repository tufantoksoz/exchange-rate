import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';
import { ICurrency } from 'interfaces/ICurrency.interface';

const options = {
  ignoreAttributes: false,
};

const parser = new XMLParser(options);

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  private async addZero(number: Number | String) {
    if (number.toString().length < 2) {
      number = '0' + number;
    }
    return number;
  }

  private async getXml(date: Date) {
    let day = await this.addZero(date.getDate());
    let month = await this.addZero(date.getMonth() + 1);
    const year = date.getFullYear();

    const url = `https://www.tcmb.gov.tr/kurlar/${year}${month}/${day}${month}${year}.xml`;

    const { data } = await lastValueFrom(this.httpService.get(url));

    const jsonData = parser.parse(data);

    const currencyData = jsonData.Tarih_Date.Currency;

    return currencyData;
  }

  async getRates(date: Date) {
    const currencyData = await this.getXml(date);

    let data = currencyData.map((element) => {
      return element['CurrencyName'] + ': ' + element['BanknoteSelling'];
    });

    return data;
  }

  async currencyCalculate(from: string, to: string, amount: any, date: Date) {
    const currencyData = await this.getXml(date);

    const currency = (from?: String, to?: String) => {
      const getItem: ICurrency = currencyData.find((item) => {
        if (from === 'TRY') return item['@_CurrencyCode'] === to;
        if (to === 'TRY') return item['@_CurrencyCode'] === from;

        if (from && to !== 'TRY') return item['@_CurrencyCode'] === from;

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

      if (from === 'TRY') return amount / currency(to).BanknoteSelling;

      const calculatedNumber = amount * currency(from, to).BanknoteSelling;

      return calculatedNumber.toFixed(2);
    };

    return calculateCurrency() + ' ' + to;
  }
}
