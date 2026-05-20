// src/sql-server/sql-server-auth.service.ts

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as sql from 'mssql'

export type SqlServerConnectionKey = 'CBMS' | 'PMIS' | 'PALARO'

export interface SqlServerUser {
  id: string
  username: string
  name: string
  isActive: boolean
  regionID?: number
}

export interface SqlServerPalaroPlayer {
  id: string
  firstName: string
  middleInitial?: string
  lastName: string
  sports?: string
  division?: string
  regionName?: string
}

export interface SqlServerArsUser {
  id: string
  eid: string
  username: string
  name: string
  region: number
}

@Injectable()
export class SqlServerAuthService implements OnModuleDestroy {
  private readonly logger = new Logger(SqlServerAuthService.name)

  private readonly pools = new Map<
    SqlServerConnectionKey,
    sql.ConnectionPool
  >()

  constructor(private readonly config: ConfigService) {}

private getConnectionConfig(
  key: SqlServerConnectionKey,
): sql.config {
  const prefix = `SQLSERVER_${key}`

  const useSqlAuth =
    this.config.get<string>(
      `${prefix}_LOCAL`,
    ) === 'TRUE'

  if (useSqlAuth) {
    return {
      server: this.config.getOrThrow<string>(
        `${prefix}_HOST`,
      ),

      database: this.config.getOrThrow<string>(
        `${prefix}_DB`,
      ),

      user: this.config.getOrThrow<string>(
        `${prefix}_USER`,
      ),

      password: this.config.getOrThrow<string>(
        `${prefix}_PASS`,
      ),

      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }
  }

  return {
    server: this.config.getOrThrow<string>(
      `${prefix}_HOST`,
    ),

    database: this.config.getOrThrow<string>(
      `${prefix}_DB`,
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
            `${prefix}_DOMAIN`,
          ) ?? '',

        userName:
          this.config.getOrThrow<string>(
            `${prefix}_USER`,
          ),

        password:
          this.config.getOrThrow<string>(
            `${prefix}_PASS`,
          ),
      },
    },
  }
}

  private async getPool(
    key: SqlServerConnectionKey,
  ): Promise<sql.ConnectionPool> {
    const existingPool = this.pools.get(key)

    if (existingPool?.connected) {
      return existingPool
    }

    const pool = await new sql.ConnectionPool(
      this.getConnectionConfig(key),
    ).connect()

    this.pools.set(key, pool)

    this.logger.log(`Connected to SQL Server ${key}`)

    return pool
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<SqlServerUser | null> {
    const pool = await this.getPool('CBMS')

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
           0 as regionID,
          tbl_members.isactive AS isActive
        FROM tbl_account_info
        LEFT JOIN tbl_members
          ON tbl_account_info.member_id = tbl_members.member_id
        WHERE tbl_account_info.Username = @username
          AND tbl_account_info.Password = @password
      `)

    const user = result.recordset[0]

    if (!user) return null

    return {
      id: String(user.id),
      username: user.username,
      name: user.name,
      isActive: Boolean(user.isActive),
      regionID: user.regionID,
    }
  }

  async findPalaroPlayerById(
    id: string,
  ): Promise<SqlServerPalaroPlayer | null> {
    const pool = await this.getPool('PALARO')

    const result = await pool
      .request()
      .input('id', sql.VarChar, id)
      .query(`
        SELECT TOP 1
          pp.[ID],
          pp.[FirstName],
          pp.[MiddleInitial],
          pp.[LastName],
          sp.Sport AS Sports,
          sd.Division AS Division,
          sr.[Region] AS RegionName
        FROM [Palaro2026].[dbo].[ProfilePlayers] pp
        LEFT JOIN [Palaro2026].[dbo].[Schools] s
          ON pp.[SchoolID] = s.[ID]
        LEFT JOIN [Palaro2026].[dbo].[SchoolRegions] sr
          ON s.[SchoolRegionID] = sr.[ID]
        LEFT JOIN [Palaro2026].[dbo].[sports] sp
          ON pp.SportID = sp.ID
        LEFT JOIN [Palaro2026].[dbo].[SchoolLevels] sl
          ON s.SchoolLevelsID = sl.ID
        LEFT JOIN [Palaro2026].[dbo].[SchoolDivisions] sd
          ON s.SchoolDivisionID = sd.ID
        WHERE pp.[ID] = @id
      `)

    const player = result.recordset[0]

    if (!player) return null

    return {
      id: String(player.ID),
      firstName: player.FirstName ?? '',
      middleInitial: player.MiddleInitial ?? '',
      lastName: player.LastName ?? '',
      sports: player.Sports ?? '',
      division: player.Division ?? '',
      regionName: player.RegionName ?? '',
    }
  }

  async findArsUserById(id: number): Promise<SqlServerArsUser | null> {
  const pool = await this.getPool('PMIS')

  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`
      SELECT TOP 1
        a.[UserId] AS id,
        a.[Eid] AS eid,
        a.[Username] AS username,
        a.[FullName] AS name, 
        a.[RegionId] AS region
      FROM [pptf].[dbo].[TblUsers] a
      JOIN [pptf].[dbo].[TblUsersArs] b
        ON b.UserId = a.UserId
      WHERE b.ArId IN (10, 11)
        AND b.HasAccess = 1
        AND a.[UserId] = @id
    `)

  const user = result.recordset[0]

  if (!user) return null

  return {
    id: String(user.id),
    eid: String(user.eid ?? ''),
    username: user.username,
    name: user.name,
    region: user.region ?? 0,
  }
}

  async onModuleDestroy() {
    for (const pool of this.pools.values()) {
      if (pool.connected) {
        await pool.close()
      }
    }

    this.pools.clear()
  }
}