import { Service } from '@/lib/types'
import { isMobileOutcallService } from '@/lib/appointment-location'

export const PATCH_TEST_DESCRIPTION =
  'A free patch test and consultation for first-time Hauslash clients. Results are known after 24 hours, so please book or enquire about this at least 24 hours before your lash lift appointment.'

export const MOBILE_OUTCALL_DESCRIPTION =
  'The Hauslash Korean lash lift brought to you. Includes professional setup, consultation, premium product use, tinting, and aftercare guidance in the comfort of your own home. After booking, please message Hauslash on Instagram with your location and treatment address.'

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

  if (!isPatchTestService(service)) {
    return service
  }

  return {
    ...service,
    description: PATCH_TEST_DESCRIPTION,
    duration_minutes: 15,
    price_pence: 0,
    deposit_pence: 0,
  }
}

export function normalisePublicServices<T extends Service>(services: T[]) {
  return services.map((service) => normalisePublicService(service))
}
