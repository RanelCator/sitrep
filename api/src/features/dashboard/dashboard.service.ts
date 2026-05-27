// src/features/dashboard/dashboard.service.ts

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

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

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(BilletingQuarter.name)
    private readonly billetingQuarterModel: Model<BilletingQuarterDocument>,

    @InjectModel(Misc.name)
    private readonly miscModel: Model<MiscDocument>,

    @InjectModel(Highlight.name)
    private readonly highlightModel: Model<HighlightDocument>,
  ) {}

  private getArrivedCount(item: BilletingQuarterDocument | any) {
    return (
      (item.arrived?.athletes ?? 0) +
      (item.arrived?.coaches ?? 0) +
      (item.arrived?.advance_party ?? 0) +
      (item.arrived?.trainers ?? 0)
    )
  }

  private getDepartureCount(item: BilletingQuarterDocument | any) {
    return (
      (item.departure?.athletes ?? 0) +
      (item.departure?.coaches ?? 0) +
      (item.departure?.advance_party ?? 0) +
      (item.departure?.trainers ?? 0)
    )
  }

  async getSummary() {
    const [billetingQuarters, misc, highlights] =
      await Promise.all([
        this.billetingQuarterModel.find().lean(),

        this.miscModel.findOne().lean(),

        this.highlightModel
          .find()
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ])

    const expectedDelegates = billetingQuarters.reduce(
      (sum, item) => sum + (item.expected_delegates ?? 0),
      0,
    )

    const totalArrived = billetingQuarters.reduce(
      (sum, item) => sum + this.getArrivedCount(item),
      0,
    )

    const totalDeparted = billetingQuarters.reduce(
      (sum, item) => sum + this.getDepartureCount(item),
      0,
    )

    const remainingDelegates = expectedDelegates - totalArrived

    const remainingAfterDeparture = totalArrived - totalDeparted

    const overallArrivalRate =
      expectedDelegates > 0
        ? Number(
            ((totalArrived / expectedDelegates) * 100).toFixed(2),
          )
        : 0

    const overallDepartureRate =
      totalArrived > 0
        ? Number(
            ((totalDeparted / totalArrived) * 100).toFixed(2),
          )
        : 0

    const preparednessAverage =
      billetingQuarters.length > 0
        ? Number(
            (
              billetingQuarters.reduce(
                (sum, item) =>
                  sum + (item.Preparedness_Rating ?? 0),
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

    billetingQuarters.forEach((item) => {
      const expected = item.expected_delegates ?? 0
      const arrived = this.getArrivedCount(item)
      const departed = this.getDepartureCount(item)

      if (expected > 0) {
        const arrivalRate = (arrived / expected) * 100

        if (arrivalRate > highestArrivalRate.rate) {
          highestArrivalRate = {
            region: item.Delegation ?? 'Unknown Delegation',
            rate: Number(arrivalRate.toFixed(2)),
          }
        }
      }

      if (arrived > 0) {
        const departureRate = (departed / arrived) * 100

        if (departureRate > highestDepartureRate.rate) {
          highestDepartureRate = {
            region: item.Delegation ?? 'Unknown Delegation',
            rate: Number(departureRate.toFixed(2)),
          }
        }
      }
    })

    const billetingQuartersAssigned = billetingQuarters.filter(
      (item) =>
        item.Delegation && item.Delegation.trim() !== '',
    ).length

    return {
      success: true,
      message: 'Dashboard summary fetched successfully',

      data: {
        reportDate: new Date(),

        expectedDelegates,

        totalArrived,
        remainingDelegates,
        overallArrivalRate,
        highestArrivalRate,

        totalDeparted,
        remainingAfterDeparture,
        overallDepartureRate,
        highestDepartureRate,

        billetingQuartersAssigned,

        totalIdentifiedBilletingQuarters:
          misc?.identified_billeting_quarters ?? 0,

        preparednessAverage,

        venueStatus: {
          infrastructure: misc?.infrastructure ?? 0,
          peripherals: misc?.peripherals ?? 0,
          sports_equipment: misc?.sports_equipment ?? 0,
        },

        latestHighlights: highlights,
      },
    }
  }
}