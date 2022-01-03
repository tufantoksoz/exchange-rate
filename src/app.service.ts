import { Injectable } from '@nestjs/common';
import convert = require('xml-js');
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import axios from 'axios';

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

    //---------------------
    // data tam geliyor ama string olarak geliyor.

    // const { data } = await lastValueFrom(this.httpService.get(url));

    // const jsonData = convert.xml2json(data);
    // console.log(jsonData);
    // console.log(typeof jsonData)

    //---------------------
    // data eksik geliyor ama object olarak geliyor.

    const { data } = await lastValueFrom(this.httpService.get(url));

    const jsonData = convert.xml2js(data);
    console.log(jsonData);
    console.log(typeof jsonData);

    // JSON.parse çalışmıyor. O yüzden xml-js paketini kullandım.
  }
}
