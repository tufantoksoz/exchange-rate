import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import * as moment from 'moment';
import { CurrencyModel } from 'tools/model/currency.model';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async saveCurrency(): Promise<CurrencyModel> {
    return await this.appService.saveCurrency();
  }

  @Get('/rate/:from')
  async getRates(@Param('from') from: string) {
    const date = moment().format('YYYY-MM-DD');
    const to = 'AUD';
    return await this.appService.getRates(from, to, date);
  }

  @Get('/calc?')
  async currencyCalculate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: number,
    @Query('date') date: Date,
  ) {
    return this.appService.currencyCalculate(from, to, amount, date);
  }
}
