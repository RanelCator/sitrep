// src/sql-server/sql-server-auth.service.ts
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as sql from 'mssql'

export interface SqlServerUser {
  id: string
  username: string
  name: string
  isActive: boolean
}

@Injectable()
export class SqlServerAuthService implements OnModuleDestroy {
  private readonly logger = new Logger(SqlServerAuthService.name)
  private pool?: sql.ConnectionPool

  constructor(private readonly config: ConfigService) {}

private getConnectionConfig(): sql.config {
  const isLocal =
    this.config.get<string>('LOCAL') === 'TRUE'

  if (isLocal) {
    return {
      server: this.config.getOrThrow<string>(
        'SQLSERVER_CBMS_HOST',
      ),

      database: this.config.getOrThrow<string>(
        'SQLSERVER_CBMS_DB',
      ),

      user: this.config.getOrThrow<string>(
        'SQLSERVER_CBMS_USER',
      ),

      password: this.config.getOrThrow<string>(
        'SQLSERVER_CBMS_PASS',
      ),

      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }
  }

  return {
    server: this.config.getOrThrow<string>(
      'SQLSERVER_CBMS_HOST',
    ),

    database: this.config.getOrThrow<string>(
      'SQLSERVER_CBMS_DB',
    ),

    options: {
      encrypt: true,
      trustServerCertificate: true,
    },

    authentication: {
      type: 'ntlm',

      options: {
        domain:
          this.config.get<string>(
            'SQLSERVER_CBMS_DOMAIN',
          ) ?? '',

        userName: this.config.getOrThrow<string>(
          'SQLSERVER_CBMS_USER',
        ),

        password: this.config.getOrThrow<string>(
          'SQLSERVER_CBMS_PASS',
        ),
      },
    },
  }
}

  private async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool?.connected) {
      return this.pool
    }

    this.pool = await new sql.ConnectionPool(this.getConnectionConfig()).connect()
    this.logger.log('Connected to SQL Server COVID19')

    return this.pool
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<SqlServerUser | null> {
    const pool = await this.getPool()

    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT TOP 1
          tbl_account_info.member_id AS id,
          tbl_account_info.Username AS username,
          CONCAT(
            ISNULL(tbl_members.prefix + ' ', ''),
            ISNULL(tbl_members.firstname + ' ', ''),
            ISNULL(tbl_members.middlename + ' ', ''),
            ISNULL(tbl_members.lastname, '')
          ) AS name,
          tbl_members.isactive AS isActive
        FROM tbl_account_info
        LEFT JOIN tbl_members
          ON tbl_account_info.member_id = tbl_members.member_id
        WHERE tbl_account_info.Username = @username
          AND tbl_account_info.Password = @password
      `)

    const user = result.recordset[0]

    if (!user) {
      return null
    }

    return {
      id: String(user.id),
      username: user.username,
      name: user.name,
      isActive: Boolean(user.isActive),
    }
  }

  async onModuleDestroy() {
    if (this.pool?.connected) {
      await this.pool.close()
    }
  }
}