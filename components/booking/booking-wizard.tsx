'use client'

import { useState, useCallback } from 'react'
import { Service } from '@/lib/types'
import { StepIndicator } from './step-indicator'
import { ServiceStep } from './service-step'
import { DateTimeStep } from './date-time-step'
import { DetailsStep } from './details-step'
import { ReviewStep } from './review-step'

export interface BookingData {
  serviceId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  notes: string
}

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Review & Pay']

export function BookingWizard({
  services,
  preselectedSlug,
}: {
  services: Service[]
  preselectedSlug?: string
}) {
  const preselected = preselectedSlug
    ? services.find((s) => s.slug === preselectedSlug)
    : undefined

  const [step, setStep] = useState(preselected ? 1 : 0)
  const [data, setData] = useState<BookingData>({
    serviceId: preselected?.id ?? '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const update = useCallback(
    (partial: Partial<BookingData>) => setData((prev) => ({ ...prev, ...partial })),
    []
  )

  const selectedService = services.find((s) => s.id === data.serviceId)

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator steps={STEPS} current={step} />

      {step === 0 && (
        <ServiceStep
          services={services}
          selectedId={data.serviceId}
          onSelect={(id) => {
            update({ serviceId: id })
            setStep(1)
          }}
        />
      )}

      {step === 1 && selectedService && (
        <DateTimeStep
          service={selectedService}
          selectedDate={data.date}
          selectedTime={data.time}
          onSelect={(date, time) => {
            update({ date, time })
            setStep(2)
          }}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <DetailsStep
          data={data}
          onUpdate={update}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && selectedService && (
        <ReviewStep
          data={data}
          service={selectedService}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}
