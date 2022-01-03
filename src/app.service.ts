import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
const {XMLParser, XMLBuilder} = require('fast-xml-parser');

const parser = new XMLParser();
const builder = new XMLBuilder();

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  // async getCurrency(date: Date) {
  //   const day = date.getDate();
  //   const month = date.getMonth() + 1;
  //   const year = date.getFullYear();

  //   const xhr = new XMLHttpRequest();

  //   const url = `https://www.tcmb.gov.tr/kurlar/${year}${month}/${day}${month}${year}.xml`;

  //   xhr.open('GET', url);
  //   xhr.send();

  //   xhr.onreadystatechange = () => {
  //     if (xhr.status === 200) {
  //      // console.log(xhr.responseText);
  //     }
  //   };
  // }

  async currencyCalculate(
    from: string,
    to: string,
    amount: Number,
    date: Date,
  ) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const url = `https://www.tcmb.gov.tr/kurlar/${year}${month}/${day}${month}${year}.xml`;


    const { data } = await lastValueFrom(this.httpService.get(url));

    const jsonData = parser.parse(data);

    console.log(jsonData);
    console.log(typeof jsonData);
  }
}
