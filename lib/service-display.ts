import { Service } from '@/lib/types'

export const PATCH_TEST_DESCRIPTION =
  'A quick consultation and patch test for first-time Hauslash clients. Results are known after 24 hours, so please book this at least 24 hours before your lash lift appointment.'

export function isPatchTestService(service: Pick<Service, 'name' | 'slug'>) {
  const value = `${service.name} ${service.slug}`.toLowerCase()
  return value.includes('patch') && value.includes('test')
}

export function normalisePublicService<T extends Service>(service: T): T {
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
