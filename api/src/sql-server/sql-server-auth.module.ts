// src/sql-server/sql-server-auth.module.ts
import { Module } from '@nestjs/common'

import { SqlServerAuthService } from '@/sql-server/sql-server-auth.service'

@Module({
  providers: [SqlServerAuthService],
  exports: [SqlServerAuthService],
})
export class SqlServerAuthModule {}