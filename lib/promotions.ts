export const OCTOBER10_CODE = 'OCTOBER10'
export const OCTOBER10_PERCENTAGE = 10

const OCTOBER10_EXPIRES_AT = new Date('2026-10-31T23:59:59.999Z')

export type PromotionResult = {
  code: string
  percentage: number
  discountPence: number
  finalPricePence: number
  depositPence: number
}

export type PromotionError =
  | 'invalid_code'
  | 'expired'
  | 'ineligible_service'

export function normalisePromotionCode(code?: string | null) {
  return code?.trim().toUpperCase() || null
}

export function calculatePromotion({
  code,
  pricePence,
  depositPence,
  eligible,
  now = new Date(),
}: {
  code?: string | null
  pricePence: number | null
  depositPence: number
  eligible: boolean
  now?: Date
}): { promotion: PromotionResult | null; error: PromotionError | null } {
  const normalisedCode = normalisePromotionCode(code)

  if (!normalisedCode) return { promotion: null, error: null }
  if (normalisedCode !== OCTOBER10_CODE) {
    return { promotion: null, error: 'invalid_code' }
  }
  if (now > OCTOBER10_EXPIRES_AT) {
    return { promotion: null, error: 'expired' }
  }
  if (!eligible || !pricePence || pricePence <= 0) {
    return { promotion: null, error: 'ineligible_service' }
  }

  const discountPence = Math.round((pricePence * OCTOBER10_PERCENTAGE) / 100)
  const finalPricePence = Math.max(0, pricePence - discountPence)
  const discountedDepositPence = Math.round(
    (depositPence * (100 - OCTOBER10_PERCENTAGE)) / 100
  )

  return {
    promotion: {
      code: OCTOBER10_CODE,
      percentage: OCTOBER10_PERCENTAGE,
      discountPence,
      finalPricePence,
      depositPence: Math.min(finalPricePence, discountedDepositPence),
    },
    error: null,
  }
}

export function promotionErrorMessage(error: PromotionError) {
  switch (error) {
    case 'expired':
      return 'This offer ended on 31 October 2026.'
    case 'ineligible_service':
      return 'OCTOBER10 is for paid lash-lift appointments and does not apply to patch tests.'
    default:
      return 'That promotional code is not recognised.'
  }
}
