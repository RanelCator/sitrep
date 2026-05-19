// src/features/patient-consultation-referral-form/pages/PatientConsultationReferralFormScanPage.tsx

import { useEffect, useMemo, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { ScanHeader } from "@/shared/components/layout/ScanHeader"
import { alertError, alertSuccess } from "@/shared/lib/alert"

import { PatientConsultationReferralForm } from "@/features/patient-consultation-referral-form/components/PatientConsultationReferralForm"
import { fetchPatientPlayerById } from "@/features/patient-consultation-referral-form/services/patient-consultation-referral-form.service"
import { useCreatePatientConsultationReferralFormMutation } from "@/features/patient-consultation-referral-form/hooks/usePatientConsultationReferralFormMutation"

import type {
  CreatePatientConsultationReferralFormPayload,
  PatientConsultationReferralFormtype,
} from "@/features/patient-consultation-referral-form/types/patient-consultation-referral-form.types"

export function PatientConsultationReferralFormScanPage() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const hasScannedRef = useRef(false)

  const [scannedUrl, setScannedUrl] = useState("")
  const [initialData, setInitialData] =
    useState<PatientConsultationReferralFormtype | null>(null)

  const createMutation =
    useCreatePatientConsultationReferralFormMutation()

  const playerId = useMemo(() => {
    return scannedUrl.split("/").filter(Boolean).pop() ?? ""
  }, [scannedUrl])

  useEffect(() => {
    if (scannerRef.current || scannedUrl || initialData) return

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false,
    )

    scannerRef.current = scanner

    scanner.render(
      async (decodedText) => {
        if (hasScannedRef.current) return

        hasScannedRef.current = true
        setScannedUrl(decodedText)

        try {
          await scanner.clear()
        } catch {
          // ignore html5-qrcode cleanup issue
        } finally {
          scannerRef.current = null
        }
      },
      () => {
        // ignore scan errors
      },
    )

    return () => {
      const activeScanner = scannerRef.current
      scannerRef.current = null

      if (activeScanner) {
        activeScanner.clear().catch(() => {})
      }
    }
  }, [scannedUrl, initialData])

  const handleProceed = async () => {
    if (!playerId) {
      await alertError({
        title: "Invalid QR Code",
        text: "Unable to extract player ID.",
      })
      return
    }

    try {
      const response = await fetchPatientPlayerById(playerId)
      const player = response.data

      const patientName = [
        player.lastName,
        player.firstName,
        player.middleInitial,
      ]
        .filter(Boolean)
        .join(", ")

      setInitialData({
        _id: "",
        formDate: new Date().toISOString(),
        delegationType: "Athlete",
        delegationTypeOther: "",
        region: player.regionName ?? "",
        division: player.division ?? "",
        addressAndContactNumber: "",
        patientName,
        birthdate: "",
        ageSex: "",
        sportsEvent: player.sports ?? "",
        natureOfIncident: "",
        placeOfIncident: "",
        incidentDateTime: "",
        chiefComplaints: "",
        peFindings: "",
        allergies: "",
        bloodPressure: "",
        currentMedications: "",
        pulseRate: "",
        pastMedicalHistory: "",
        respirationRate: "",
        lastMealTaken: "",
        temperature: "",
        treatmentIntervention: "",
        impressionDiagnosis: "",
        isTreated: false,
        isUnderObservation: false,
        isReferred: false,
        remarks: "",
        nodSignature: "",
        physicianSignature: "",
        isActive: true,
        createdAt: "",
        updatedAt: "",
      })
    } catch {
      await alertError({
        title: "Player Not Found",
        text: "Unable to fetch player details.",
      })
    }
  }

  const handleSubmit = async (
    payload: CreatePatientConsultationReferralFormPayload,
  ) => {
    try {
      await createMutation.mutateAsync(payload)

      await alertSuccess({
        title: "Patient Form Saved",
        timer: 1200,
        showConfirmButton: false,
      })

      setInitialData(null)
      setScannedUrl("")
      hasScannedRef.current = false
    } catch {
      await alertError({
        title: "Save Failed",
        text: "Unable to save patient form.",
      })
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4">
      <ScanHeader title="Scan Player QR" />

      {!initialData ? (
        <div className="space-y-4 rounded-xl border bg-card p-4">
          {!scannedUrl ? (
            <div
              id="qr-reader"
              className="overflow-hidden rounded-lg"
            />
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Scanned QR Value
            </label>

            <Input value={scannedUrl} readOnly />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleProceed}
              disabled={!scannedUrl}
            >
              Proceed
            </Button>

            {scannedUrl ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setScannedUrl("")
                  setInitialData(null)
                  hasScannedRef.current = false
                }}
              >
                Scan Again
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <PatientConsultationReferralForm
          initialData={initialData}
          isSubmitting={createMutation.isPending}
          onSubmit={handleSubmit}
          readOnlyFields={[
            "patientName",
            "region",
            "division",
            "sportsEvent",
          ]}
        />
      )}
    </div>
  )
}