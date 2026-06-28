export const INSTAGRAM_DM_URL = 'https://ig.me/m/hauslash_co'
export const STUDIO_ADDRESS = '5 Leawood Road, Stoke-On-Trent, ST4 6JZ'

export function isMobileOutcallService(service: string) {
  const normalised = service.toLowerCase()
  return normalised.includes('mobile') && normalised.includes('outcall')
}

export function getAppointmentLocationDetails(service: string) {
  if (isMobileOutcallService(service)) {
    return {
      label: 'Mobile outcall location',
      value:
        'This is a mobile outcall appointment. Please message Hauslash on Instagram after booking to confirm where you are located and the treatment address.',
      calendarLocation: 'Mobile outcall - confirm client address via Instagram DM',
      footer: 'Hauslash mobile outcall appointment - location confirmed by Instagram DM',
      href: INSTAGRAM_DM_URL,
      linkLabel: 'Message Hauslash on Instagram',
    }
  }

  return {
    label: 'Studio address',
    value: STUDIO_ADDRESS,
    calendarLocation: STUDIO_ADDRESS,
    footer: `Hauslash, ${STUDIO_ADDRESS}`,
    href: null,
    linkLabel: null,
  }
}
