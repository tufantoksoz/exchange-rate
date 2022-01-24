import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrencySchema } from 'tools/model/currency.model';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/Currency'),
    MongooseModule.forFeature([{ name: 'Currency', schema: CurrencySchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
