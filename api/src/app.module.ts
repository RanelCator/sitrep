import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { SqlServerAuthService } from './sql-server/sql-server-auth.service';
import { FormsModule } from './features/forms/forms.module';
import { BilletingQuartersModule } from './features/billeting-quarters/billeting-quarters.module';
import { MiscModule } from './features/misc/misc.module';
import { HighlightsModule } from './features/highlights/highlights.module';
import { CurrentSituationModule } from './features/current-situation/current-situation.module';
import { ReportedIncidentsModule } from './features/reported-incidents/reported-incidents.module';
import { OtherInformationModule } from './features/other-information/other-information.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ReportsModule } from './features/reports/reports.module';
import { OtherDelegationModule } from './features/other-delegation/other-delegation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('DB_URI'),
      }),
    }),
    AuthModule,
    FormsModule,
    BilletingQuartersModule,
    MiscModule,
    HighlightsModule,
    CurrentSituationModule,
    ReportedIncidentsModule,
    OtherInformationModule,
    DashboardModule,
    ReportsModule,
    OtherDelegationModule,
  ],
  providers: [SqlServerAuthService],
})
export class AppModule {}
