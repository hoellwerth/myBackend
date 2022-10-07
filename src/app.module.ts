import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'src/environment/dev.env' });

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_URL, { dbName: 'test' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
