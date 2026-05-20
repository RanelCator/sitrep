// src/features/patient-consultation-referral-form/pages/PatientConsultationReferralFormScanPage.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  Html5Qrcode,
  type CameraDevice,
} from "html5-qrcode"
import {
  Camera,
  CheckCircle2,
  RefreshCcw,
  Search,
  SwitchCamera,
} from "lucide-react"

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
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const hasScannedRef = useRef(false)

  const [scannedUrl, setScannedUrl] = useState("")
  const [isFetchingPlayer, setIsFetchingPlayer] = useState(false)
  const [scannerError, setScannerError] = useState("")
  const [cameras, setCameras] = useState<CameraDevice[]>([])
  const [cameraIndex, setCameraIndex] = useState(0)

  const [initialData, setInitialData] =
    useState<PatientConsultationReferralFormtype | null>(null)

  const createMutation =
    useCreatePatientConsultationReferralFormMutation()

  const playerId = useMemo(() => {
    return scannedUrl.split("/").filter(Boolean).pop() ?? ""
  }, [scannedUrl])

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current

    if (!scanner) return

    try {
      if (scanner.isScanning) {
        await scanner.stop()
      }
    } catch {
      // ignore scanner stop issue
    } finally {
      scannerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (scannerRef.current || scannedUrl || initialData) return

    const html5QrCode = new Html5Qrcode("qr-reader")
    scannerRef.current = html5QrCode

    let isCancelled = false

    async function startScanner() {
      try {
        setScannerError("")

        const availableCameras = await Html5Qrcode.getCameras()

        if (isCancelled) return

        if (!availableCameras.length) {
          setScannerError("No camera found on this device.")
          return
        }

        setCameras(availableCameras)

        const defaultBackCameraIndex = availableCameras.findIndex(
          (camera) => camera.label.toLowerCase().includes("back"),
        )

        const safeCameraIndex =
          cameraIndex < availableCameras.length ? cameraIndex : 0

        const selectedCamera =
          availableCameras[safeCameraIndex] ??
          availableCameras[defaultBackCameraIndex] ??
          availableCameras[0]

        await html5QrCode.start(
          selectedCamera.id,
          {
            fps: 10,
            qrbox: {
              width: 260,
              height: 260,
            },
            aspectRatio: 1,
          },
          async (decodedText) => {
            if (hasScannedRef.current) return

            hasScannedRef.current = true
            setScannedUrl(decodedText)

            await stopScanner()
          },
          () => {
            // ignore scan frame errors
          },
        )
      } catch {
        setScannerError(
          "Unable to start camera. Please allow camera permission and try again.",
        )
      }
    }

    startScanner()

    return () => {
      isCancelled = true
      stopScanner()
    }
  }, [cameraIndex, initialData, scannedUrl, stopScanner])

  const resetScanner = async () => {
    await stopScanner()

    setScannedUrl("")
    setInitialData(null)
    setScannerError("")
    hasScannedRef.current = false
  }

  const toggleCamera = async () => {
    if (cameras.length <= 1) return

    await stopScanner()

    hasScannedRef.current = false
    setScannerError("")
    setScannedUrl("")

    setCameraIndex((prev) =>
      prev + 1 >= cameras.length ? 0 : prev + 1,
    )
  }

  const handleProceed = async () => {
    if (!playerId) {
      await alertError({
        title: "Invalid QR Code",
        text: "Unable to extract player ID.",
      })

      return
    }

    try {
      setIsFetchingPlayer(true)

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
        isEncoded: false,
        isActive: true,
        createdAt: "",
        updatedAt: "",
      })
    } catch {
      await alertError({
        title: "Player Not Found",
        text: "Unable to fetch player details.",
      })
    } finally {
      setIsFetchingPlayer(false)
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

      await resetScanner()
    } catch {
      await alertError({
        title: "Save Failed",
        text: "Unable to save patient form.",
      })
    }
  }

  const currentCameraName =
    cameras[cameraIndex]?.label || "Default Camera"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
        <ScanHeader title="Scan Player QR" />

        {!initialData ? (
          <div className="mx-auto max-w-xl space-y-5">
            <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Camera className="size-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Scan Player QR Code
                  </h2>

                  <p className="text-sm text-slate-500">
                    Camera starts automatically. Point it at the player QR code.
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Using: {currentCameraName}
                  </p>
                </div>
              </div>

              {!scannedUrl ? (
                <div className="overflow-hidden rounded-2xl border bg-slate-950 p-2">
                  <div
                    id="qr-reader"
                    className="min-h-[320px] overflow-hidden rounded-xl bg-black"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="size-5" />
                    <p className="font-semibold">
                      QR Code scanned successfully
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-emerald-700">
                    Player ID detected:{" "}
                    <span className="font-bold">{playerId}</span>
                  </p>
                </div>
              )}

              {scannerError ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {scannerError}
                </div>
              ) : null}

              <div className="mt-5 space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Scanned QR Value
                </label>

                <Input
                  value={scannedUrl}
                  readOnly
                  placeholder="Waiting for QR scan..."
                  className="h-12 text-sm"
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button
                  type="button"
                  size="lg"
                  className="h-12 text-base font-bold"
                  onClick={handleProceed}
                  disabled={!scannedUrl || isFetchingPlayer}
                >
                  <Search className="mr-2 size-5" />
                  {isFetchingPlayer ? "Fetching..." : "Proceed"}
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="h-12 text-base font-bold"
                  onClick={toggleCamera}
                  disabled={cameras.length <= 1 || Boolean(scannedUrl)}
                >
                  <SwitchCamera className="mr-2 size-5" />
                  Switch
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="h-12 text-base font-bold"
                  onClick={resetScanner}
                >
                  <RefreshCcw className="mr-2 size-5" />
                  Scan Again
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-800">Reminder</p>
              <p className="mt-1">
                Allow camera permission when prompted. Use Switch if the wrong
                camera opens.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-emerald-800">
                    Player details loaded
                  </p>

                  <p className="text-sm text-emerald-700">
                    Review and complete the patient consultation form below.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="border-emerald-300 bg-white font-bold text-emerald-700 hover:bg-emerald-100"
                  onClick={resetScanner}
                >
                  <RefreshCcw className="mr-2 size-4" />
                  Scan Another
                </Button>
              </div>
            </div>

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
          </div>
        )}
      </div>
    </div>
  )
}