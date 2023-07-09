interface LinksObject {
  type: string
  href: string
}

interface UserObject {
  status?: string

  name: string
  email: string
  address: string
  image: string
  coverImage: string
  description: string
  links: LinksObject[]
  merit: number
  follows: number
  ranking: number

  role?: string
  borrowCount?: number
}

interface NftTankObject {
  id: string
  owner: string
  level?: string
  role?: string

  classType: number
  energy?: number
  maxEnergy?: number
  energyPool?: number
  maxEnergyPool?: number
  experience?: number
  tankLevel?: number
  name?: string
  image?: string
  description?: string
  health?: number
  fireRate?: number
  firePower?: number
  speed?: number
  borrower?: string
  followers?: [string]

  updatedAt?: Date
}

interface GuildObject {
  id: string
  name: string
  image: string
  description: string
  owner: string
  maxMembers: number
  merit?: number
  level?: number
  members?: string[]
  requests?: string[]
  followers?: string[]
  role?: string
}

interface ItemObject {
  id: string
  name: string
  image: string
  description: string
  owner: string
  limitation: number
  maxLimit: number
  merit?: number
  level?: number
  followers?: string[]
  role?: string
}