import { Service } from '@/lib/types'
import { isMobileOutcallService } from '@/lib/appointment-location'

export const PATCH_TEST_DESCRIPTION =
  'A patch test and consultation for first-time Hauslash clients. Results are known after 24 hours, so please book this at least 24 hours before your lash lift appointment. The £5 attendance deposit is refunded once you attend.'

export const PATCH_TEST_REFUNDABLE_DEPOSIT_PENCE = 500

export const MOBILE_OUTCALL_DESCRIPTION =
  'The Hauslash Korean lash lift brought to you. Includes professional setup, consultation, premium product use, tinting, and aftercare guidance in the comfort of your own home. After booking, please message Hauslash on Instagram with your location and treatment address.'

function isKoreanLashLiftService(service: Pick<Service, 'name' | 'slug'>) {
  const value = `${service.name} ${service.slug}`.toLowerCase()
  return value.includes('korean') && value.includes('lash') && value.includes('lift')
}

export function isPatchTestService(service: Pick<Service, 'name' | 'slug'>) {
  const value = `${service.name} ${service.slug}`.toLowerCase()
  return value.includes('patch') && value.includes('test')
}

export function normalisePublicService<T extends Service>(service: T): T {
  if (isMobileOutcallService(service.name)) {
    return {
      ...service,
      description: MOBILE_OUTCALL_DESCRIPTION,
      duration_minutes: 90,
    }
  }

  if (isPatchTestService(service)) {
    return {
      ...service,
      description: PATCH_TEST_DESCRIPTION,
      duration_minutes: 15,
      price_pence: PATCH_TEST_REFUNDABLE_DEPOSIT_PENCE,
      deposit_pence: PATCH_TEST_REFUNDABLE_DEPOSIT_PENCE,
    }
  }

  if (isKoreanLashLiftService(service)) {
    return {
      ...service,
      duration_minutes: 90,
    }
  }

  return service
}

export function normalisePublicServices<T extends Service>(services: T[]) {
  return services
    .map((service) => normalisePublicService(service))
    .sort((a, b) => {
      const rankA = getPublicServiceDisplayRank(a)
      const rankB = getPublicServiceDisplayRank(b)

      if (rankA !== rankB) return rankA - rankB
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order

      return a.name.localeCompare(b.name)
    })
}

function getPublicServiceDisplayRank(service: Pick<Service, 'name' | 'slug'>) {
  if (isPatchTestService(service)) return 30
  if (isMobileOutcallService(service.name)) return 20
  if (isKoreanLashLiftService(service)) return 10

  return 40
}
