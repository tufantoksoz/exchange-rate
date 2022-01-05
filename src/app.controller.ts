import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getRates() {
    const date = '2021-12-27';
    const to = 'USD';
    return await this.appService.getRates(date, to);
  }

  @Get('/calc?')
  async currencyCalculate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: number,
    @Query('date') date: string,
  ) {
    return this.appService.currencyCalculate(from, to, amount, date);
  }
}
