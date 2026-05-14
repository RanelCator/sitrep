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

  private getArrivedCount(
    item: BilletingQuarterDocument | any,
  ) {
    return (
      (item.arrived?.athletes ?? 0) +
      (item.arrived?.coaches ?? 0) +
      (item.arrived?.advance_party ?? 0) +
      (item.arrived?.trainers ?? 0)
    )
  }

  async getSummary() {
    const [
      billetingQuarters,
      misc,
      highlights,
    ] = await Promise.all([
      this.billetingQuarterModel.find().lean(),

      this.miscModel.findOne().lean(),

      this.highlightModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ])

    // =========================
    // EXPECTED DELEGATES
    // =========================

    const expectedDelegates =
      billetingQuarters.reduce(
        (sum, item) =>
          sum +
          (item.expected_delegates ?? 0),
        0,
      )

    // =========================
    // TOTAL ARRIVED
    // =========================

    const totalArrived =
      billetingQuarters.reduce(
        (sum, item) =>
          sum + this.getArrivedCount(item),
        0,
      )

    // =========================
    // REMAINING
    // =========================

    const remainingDelegates =
      expectedDelegates - totalArrived

    // =========================
    // OVERALL ARRIVAL RATE
    // =========================

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

    // =========================
    // PREPAREDNESS AVERAGE
    // =========================

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
              ) /
              billetingQuarters.length
            ).toFixed(2),
          )
        : 0

    // =========================
    // HIGHEST ARRIVAL RATE
    // =========================

    let highestArrivalRate = {
      region: 'N/A',
      rate: 0,
    }

    billetingQuarters.forEach((item) => {
      const expected =
        item.expected_delegates ?? 0

      const arrived =
        this.getArrivedCount(item)

      if (expected <= 0) return

      const rate =
        (arrived / expected) * 100

      if (rate > highestArrivalRate.rate) {
        highestArrivalRate = {
          region:
            item.Delegation ??
            'Unknown Delegation',

          rate: Number(rate.toFixed(2)),
        }
      }
    })

    // =========================
    // ASSIGNED QUARTERS
    // =========================

    const billetingQuartersAssigned =
      billetingQuarters.filter(
        (item) =>
          item.Delegation &&
          item.Delegation.trim() !== '',
      ).length

    // =========================
    // RETURN
    // =========================

    return {
      success: true,

      message:
        'Dashboard summary fetched successfully',

      data: {
        reportDate: new Date(),

        expectedDelegates,

        totalArrived,

        remainingDelegates,

        overallArrivalRate,

        highestArrivalRate,

        billetingQuartersAssigned,

        totalIdentifiedBilletingQuarters:
          misc
            ?.identified_billeting_quarters ??
          0,

        preparednessAverage,

        venueStatus: {
          infrastructure:
            misc?.infrastructure ?? 0,

          peripherals:
            misc?.peripherals ?? 0,

          sports_equipment:
            misc?.sports_equipment ?? 0,
        },

        latestHighlights: highlights,
      },
    }
  }
}