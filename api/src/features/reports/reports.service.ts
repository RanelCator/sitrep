// src/features/reports/reports.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  GeneratedReport,
  GeneratedReportDocument,
} from './schemas/generated-report.schema'

import { FetchGeneratedReportsDto } from './dto/fetch-generated-reports.dto'

import {
  BilletingQuarter,
  BilletingQuarterDocument,
} from '@/features/billeting-quarters/schemas/billeting-quarter.schema'

import {
  Misc,
  MiscDocument,
} from '@/features/misc/schemas/misc.schema'

import {
  Highlight,
  HighlightDocument,
} from '@/features/highlights/schemas/highlight.schema'

import {
  CurrentSituation,
  CurrentSituationDocument,
} from '@/features/current-situation/schemas/current-situation.schema'

import {
  ReportedIncident,
  ReportedIncidentDocument,
} from '@/features/reported-incidents/schemas/reported-incident.schema'

import {
  DepedIncidentReport,
  DepedIncidentReportDocument,
} from '@/features/deped-incident-report/schema/deped-incident-report.schema'

import {
  OtherInformation,
  OtherInformationDocument,
} from '@/features/other-information/schemas/other-information.schema'

import {
  OtherDelegation,
  OtherDelegationDocument,
} from '@/features/other-delegation/schemas/other-delegation.schema'

import {
  WeatherUpdate,
  WeatherUpdateDocument,
} from '@/features/weather-updates/schemas/weather-update.schema'

type ReportCutoff = '8am' | '5pm'

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(GeneratedReport.name)
    private readonly generatedReportModel: Model<GeneratedReportDocument>,

    @InjectModel(BilletingQuarter.name)
    private readonly billetingQuarterModel: Model<BilletingQuarterDocument>,

    @InjectModel(Misc.name)
    private readonly miscModel: Model<MiscDocument>,

    @InjectModel(Highlight.name)
    private readonly highlightModel: Model<HighlightDocument>,

    @InjectModel(CurrentSituation.name)
    private readonly currentSituationModel: Model<CurrentSituationDocument>,

    @InjectModel(ReportedIncident.name)
    private readonly reportedIncidentModel: Model<ReportedIncidentDocument>,

    @InjectModel(DepedIncidentReport.name)
    private readonly depedIncidentReportModel: Model<DepedIncidentReportDocument>,

    @InjectModel(OtherInformation.name)
    private readonly otherInformationModel: Model<OtherInformationDocument>,

    @InjectModel(OtherDelegation.name)
    private readonly otherDelegationModel: Model<OtherDelegationDocument>,

    @InjectModel(WeatherUpdate.name)
    private readonly weatherUpdateModel: Model<WeatherUpdateDocument>,
  ) {}

  private getDepartureCount(item: any) {
    return (
      (item.departure?.athletes ?? 0) +
      (item.departure?.coaches ?? 0) +
      (item.departure?.advance_party ?? 0) +
      (item.departure?.trainers ?? 0)
    )
  }
  private getDayRange(dateString: string) {
    const [year, month, day] = dateString
      .split('-')
      .map(Number)

    const start = new Date(
      year,
      month - 1,
      day,
      0,
      0,
      0,
      0,
    )

    const end = new Date(
      year,
      month - 1,
      day,
      23,
      59,
      59,
      999,
    )

    return {
      start,
      end,
      entryDate: dateString,
    }
  }

  private getManilaDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
) {
  // Convert PH time (UTC+8) to UTC Date
  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hour - 8,
      minute,
      0,
      0,
    ),
  )
}

private getReportCutoffRange(
  dateString: string,
  cutoff: ReportCutoff,
) {
  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  // 8AM REPORT
  // Previous day 4PM -> Current day 7AM
  if (cutoff === '8am') {
    const start = this.getManilaDate(
      year,
      month,
      day - 1,
      16,
    )

    const end = this.getManilaDate(
      year,
      month,
      day,
      7,
    )

    return { start, end }
  }

  // 5PM REPORT
  // Current day 7AM -> Current day 4PM
  const start = this.getManilaDate(
    year,
    month,
    day,
    7,
  )

  const end = this.getManilaDate(
    year,
    month,
    day,
    16,
  )
  return { start, end }
}

  private getArrivedCount(item: any) {
    return (
      (item.arrived?.athletes ?? 0) +
      (item.arrived?.coaches ?? 0) +
      (item.arrived?.advance_party ?? 0) +
      (item.arrived?.trainers ?? 0)
    )
  }

  private getWholeDayReportSectionRange(
  dateString: string,
  cutoff: ReportCutoff,
) {
  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  if (cutoff === '8am') {
    return {
      start: this.getManilaDate(year, month, day - 1, 0),
      end: this.getManilaDate(year, month, day - 1, 23, 59),
    }
  }

  return {
    start: this.getManilaDate(year, month, day, 0),
    end: this.getManilaDate(year, month, day, 23, 59),
  }
}

private getCurrentSituationRange(
  dateString: string,
  cutoff: ReportCutoff,
) {
  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  if (cutoff === '8am') {
    return {
      start: this.getManilaDate(year, month, day - 1, 0),
      end: this.getManilaDate(year, month, day - 1, 23, 59),
    }
  }

  return {
    start: this.getManilaDate(year, month, day, 0),
    end: this.getManilaDate(year, month, day, 23, 59),
  }
}

  async findAll(query: FetchGeneratedReportsDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const search = query.search?.trim()
    const sortBy = query.sortBy ?? 'createdAt'
    const sortOrder = query.sortOrder ?? 'desc'

    const filter: Record<string, any> = {}

    if (search) {
      filter.$or = [
        {
          entryDate: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          'data.report.title': {
            $regex: search,
            $options: 'i',
          },
        },
      ]
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    }

    const [items, total] = await Promise.all([
      this.generatedReportModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.generatedReportModel.countDocuments(filter),
    ])

    return {
      success: true,
      message: 'Generated reports fetched successfully',
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async generateDailyReport(
    reportDate: string,
    reportCutoff: ReportCutoff = '5pm',
  ) {
    const { start, end, entryDate } =
      this.getDayRange(reportDate)

    const {
      start: cutoffStart,
      end: cutoffEnd,
    } = this.getReportCutoffRange(
      reportDate,
      reportCutoff,
    )

//     const {
//   start: currentSituationStart,
//   end: currentSituationEnd,
// } = this.getCurrentSituationRange(
//   reportDate,
//   reportCutoff,
// )

const {
  start: sectionStart,
  end: sectionEnd,
} = this.getWholeDayReportSectionRange(
  reportDate,
  reportCutoff,
)

    const [
      misc,
      billetingQuarters,
      highlights,
      currentSituations,
      reportedIncidents,
      depedIncidentReports,
      otherInformation,
      otherDelegations,
      weatherUpdates,
    ] = await Promise.all([
      this.miscModel.findOne().lean(),

      this.billetingQuarterModel
        .find()
        .sort({
          Delegation: 1,
        })
        .lean(),

      this.highlightModel
  .find({
    DateTimeEntered: {
      $gte: sectionStart,
      $lte: sectionEnd,
    },
  })
        .sort({
          DateTimeEntered: 1,
        })
        .populate(
          'AddedBy',
          'name username role',
        )
        .lean(),

      this.currentSituationModel
  .find({
    createdAt: {
      $gte: sectionStart,
      $lte: sectionEnd,
    },
  })
  .sort({
    Committee: 1,
    area_concern: 1,
  })
  .populate(
    'AddedBy',
    'name username role',
  )
  .lean(),

      this.reportedIncidentModel
        .find({
          createdAt: {
            $gte: cutoffStart,
            $lte: cutoffEnd,
          },
        })
        .sort({
          Date: 1,
          Time: 1,
        })
        .populate(
          'AddedBy',
          'name username role',
        )
        .lean(),

      this.depedIncidentReportModel
        .find({
          createdAt: {
            $gte: cutoffStart,
            $lte: cutoffEnd,
          },
        })
        .sort({
          date: 1,
          time: 1,
        })
        .lean(),

      this.otherInformationModel
        .find({
          createdAt: {
            $gte: cutoffStart,
            $lte: cutoffEnd,
          },
        })
        .sort({
          createdAt: -1,
        })
        .populate(
          'AddedBy',
          'name username role',
        )
        .lean(),

      this.otherDelegationModel
        .find({
          isActive: true,
        })
        .sort({
          createdAt: 1,
        })
        .lean(),

      this.weatherUpdateModel
  .find({
    date: {
      $gte: sectionStart,
      $lte: sectionEnd,
    },
  })
      .sort({
        createdAt: 1,
      })
      .lean(),
    ])

    const expectedDelegates =
      billetingQuarters.reduce(
        (sum, item) =>
          sum +
          (item.expected_delegates ?? 0),
        0,
      )

    const totalArrived =
      billetingQuarters.reduce(
        (sum, item) =>
          sum +
          this.getArrivedCount(item),
        0,
      )

      const totalDeparted =
  billetingQuarters.reduce(
    (sum, item) =>
      sum +
      this.getDepartureCount(item),
    0,
  )

const remainingAfterDeparture =
  totalArrived - totalDeparted

const overallDepartureRate =
  totalArrived > 0
    ? Number(
        (
          (totalDeparted /
            totalArrived) *
          100
        ).toFixed(2),
      )
    : 0

    const remainingDelegates =
      expectedDelegates - totalArrived

    const overallArrivalRate =
      expectedDelegates > 0
        ? Number(
            (
              (totalArrived /
                expectedDelegates) *
              100
            ).toFixed(2),
          )
        : 0

    const otherDelegationExpected =
      otherDelegations.reduce(
        (sum, item) =>
          sum +
          (item.expected_delegates ?? 0),
        0,
      )

    const otherDelegationArrived =
      otherDelegations.reduce(
        (sum, item) =>
          sum +
          (item.arrived ?? 0),
        0,
      )

    const grandTotalExpected =
      expectedDelegates +
      otherDelegationExpected

    const grandTotalArrived =
      totalArrived +
      otherDelegationArrived

    const grandOverallArrivalRate =
      grandTotalExpected > 0
        ? Number(
            (
              (grandTotalArrived /
                grandTotalExpected) *
              100
            ).toFixed(2),
          )
        : 0

    const preparednessAverage =
      billetingQuarters.length > 0
        ? Number(
            (
              billetingQuarters.reduce(
                (sum, item) =>
                  sum +
                  (item.Preparedness_Rating ??
                    0),
                0,
              ) / billetingQuarters.length
            ).toFixed(2),
          )
        : 0

    let highestArrivalRate = {
      region: 'N/A',
      rate: 0,
    }

    let highestDepartureRate = {
  region: 'N/A',
  rate: 0,
}

    const delegationArrivalProgress =
      [...billetingQuarters]
        .sort((a, b) =>
          a._id
            .toString()
            .localeCompare(
              b._id.toString(),
            ),
        )
        .map((item) => {
          const expected =
            item.expected_delegates ?? 0

          const arrived =
            this.getArrivedCount(item)

            const departed =
  this.getDepartureCount(item)

const departureRate =
  arrived > 0
    ? Number(
        (
          (departed / arrived) *
          100
        ).toFixed(2),
      )
    : 0

if (
  departureRate >
  highestDepartureRate.rate
) {
  highestDepartureRate = {
    region:
      item.Delegation ??
      'Unknown',
    rate: departureRate,
  }
}

          const arrivalRate =
            expected > 0
              ? Number(
                  (
                    (arrived / expected) *
                    100
                  ).toFixed(2),
                )
              : 0

          if (
            arrivalRate >
            highestArrivalRate.rate
          ) {
            highestArrivalRate = {
              region:
                item.Delegation ??
                'Unknown',
              rate: arrivalRate,
            }
          }

          return {
            delegation:
              item.Delegation,

            billeting_quarter:
              item.Billeting_Quarters,

            expected_delegates:
              expected,

            arrived_total:
              arrived,

            arrival_rate:
              arrivalRate,

            preparedness_rating:
              item.Preparedness_Rating,

            arrived:
              item.arrived ?? null,

              departed_total: departed,

departure_rate: departureRate,

departure:
  item.departure ?? null,
          }
        })

    const arrivedComposition =
      billetingQuarters.reduce(
        (acc, item) => {
          acc.athletes +=
            item.arrived?.athletes ?? 0

          acc.coaches +=
            item.arrived?.coaches ?? 0

          acc.advance_party +=
            item.arrived?.advance_party ?? 0

          acc.trainers +=
            item.arrived?.trainers ?? 0

          return acc
        },
        {
          athletes: 0,
          coaches: 0,
          advance_party: 0,
          trainers: 0,
        },
      )

      const departureComposition =
  billetingQuarters.reduce(
    (acc, item) => {
      acc.athletes +=
        item.departure?.athletes ?? 0

      acc.coaches +=
        item.departure?.coaches ?? 0

      acc.advance_party +=
        item.departure?.advance_party ?? 0

      acc.trainers +=
        item.departure?.trainers ?? 0

      return acc
    },
    {
      athletes: 0,
      coaches: 0,
      advance_party: 0,
      trainers: 0,
    },
  )

    const billetingQuartersAssigned =
      misc?.billeting_quarters_assigned ??
      billetingQuarters.filter(
        (item) =>
          item.Delegation &&
          item.Delegation.trim() !== '',
      ).length

    const data = {
      report: {
        title: 'Daily Situation Report',
        reportDate:
          new Date(entryDate).toLocaleDateString(
            'en-US',
            {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            },
          ) +
          ` ${
            reportCutoff === '8am'
              ? '8AM'
              : '5PM'
          }`,
        entryDate,
        reportCutoff,
        cutoffLabel:
          reportCutoff === '8am'
            ? '8AM'
            : '5PM',
        cutoffStart,
        cutoffEnd,
        generatedAt: new Date(),
      },

      highlights,

      playingVenueStatus: {
        infrastructure:
          misc?.infrastructure ?? 0,

        infrastructure_description:
          misc?.infrastructure_description ??
          '',

        peripherals:
          misc?.peripherals ?? 0,

        peripherals_description:
          misc?.peripherals_description ??
          '',

        sports_equipment:
          misc?.sports_equipment ?? 0,

        sports_equipment_description:
          misc?.sports_equipment_description ??
          '',
      },

      billetingQuartersStatus: {
        overallAveragePreparednessRating:
          preparednessAverage,

        totalIdentifiedBilletingQuarters:
          misc?.identified_billeting_quarters ??
          0,

        billetingQuartersAssigned,

        identifiedBilletingQuartersText:
          misc?.identified_billeting_quarters_text ??
          '',

        list: [...billetingQuarters]
          .sort((a, b) =>
            a._id
              .toString()
              .localeCompare(
                b._id.toString(),
              ),
          )
          .map((item) => ({
            billeting_quarter:
              item.Billeting_Quarters,

            delegation:
              item.Delegation,

            preparedness_rating:
              item.Preparedness_Rating,

            expected_delegates:
              item.expected_delegates ?? 0,

            arrived:
              item.arrived ?? null,

            arrived_total:
              this.getArrivedCount(item),

              departure:
  item.departure ?? null,

departed_total:
  this.getDepartureCount(item),
          })),
      },

      delegationArrival: {
        totalExpectedDelegates:
          expectedDelegates,

        totalArrived,

        remainingDelegates,

        overallArrivalRate,

        highestArrivalRate,

        progressByRegion:
          delegationArrivalProgress,

        otherDelegations,

        grandTotalExpected,

        grandTotalArrived,

        grandOverallArrivalRate,

        totalDeparted,

remainingAfterDeparture,

overallDepartureRate,

highestDepartureRate,

        composition: {
          total: totalArrived,
          ...arrivedComposition,
          departure: {
  total: totalDeparted,
  ...departureComposition,
},
        },

        
      },

      currentSituation:
        currentSituations,

      reportedIncidents,

      depedIncidentReports,

      otherInformation,

      weatherUpdates: weatherUpdates.map((item) => ({
        place: item.place,
        temperature: item.temperature,
        warningLevel: item.warningLevel,
        description: item.description,
      })),
    }

    const saved =
      await this.generatedReportModel.create({
        entryDate,
        data,
      })

    return {
      success: true,
      message:
        'Daily report generated successfully',
      data: saved,
    }
  }

  async findLatestDailyReport(
    reportDate: string,
  ) {
    const { entryDate } =
      this.getDayRange(reportDate)

    const report =
      await this.generatedReportModel
        .findOne({
          entryDate,
        })
        .sort({
          createdAt: -1,
        })
        .lean()

    if (!report) {
      throw new NotFoundException(
        'Generated daily report not found',
      )
    }

    return {
      success: true,
      message:
        'Generated daily report fetched successfully',
      data: report,
    }
  }

  async findOne(id: string) {
    const report =
      await this.generatedReportModel
        .findById(id)
        .lean()

    if (!report) {
      throw new NotFoundException(
        'Generated report not found',
      )
    }

    return {
      success: true,
      message:
        'Generated report fetched successfully',
      data: report,
    }
  }
}