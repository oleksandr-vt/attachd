type ClientIpSources = {
  forwardedFor?: string
  realIp?: string
  socketAddress?: string
  // Only where the host overwrites these headers (Vercel); elsewhere they can be spoofed
  trustProxyHeaders: boolean
}

const expandIpv6 = (address: string) => {
  const withoutZone = address.split('%')[0] ?? address
  const [head = '', tail] = withoutZone.split('::')
  const headParts = head ? head.split(':') : []
  const tailParts = tail ? tail.split(':') : []
  const missingParts = tail === undefined ? 0 : Math.max(8 - headParts.length - tailParts.length, 0)

  return [...headParts, ...Array<string>(missingParts).fill('0'), ...tailParts]
    .map((part) => part.toLowerCase().padStart(4, '0'))
}

export const toRateLimitIpKey = (address: string) => {
  const ipv4Mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(address)

  if (ipv4Mapped?.[1]) {
    return ipv4Mapped[1]
  }

  if (!address.includes(':')) {
    return address
  }

  return `${expandIpv6(address).slice(0, 4).join(':')}::/64`
}

// null when the IP is unknown (e.g. `next dev`); callers then skip per-IP limits
export const resolveClientIp = ({
  forwardedFor,
  realIp,
  socketAddress,
  trustProxyHeaders,
}: ClientIpSources) => {
  const proxyCandidates = trustProxyHeaders ? [realIp, forwardedFor?.split(',')[0]] : []
  const address = [...proxyCandidates, socketAddress]
    .map((candidate) => candidate?.trim())
    .find(Boolean)

  return address ? toRateLimitIpKey(address) : null
}
