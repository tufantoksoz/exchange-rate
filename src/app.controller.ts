import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // async getCurrency() {
  //   const date = new Date('2021-12-27');
  //   return await this.appService.getCurrency(date);
  // }

  @Get()
  async currencyCalculate() {
    const from = 'TRY';
    const to = 'USD';
    const amount = 100;
    const date = new Date('2021-12-27');
    return await this.appService.currencyCalculate(from, to, amount, date);
  }
}
