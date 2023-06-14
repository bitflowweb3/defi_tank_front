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

interface TankObject {
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

interface ClassesObject {
  id: number
  name?: string
  image?: string
  description?: string
  health?: number
  fireRate?: number
  firePower?: number
  speed?: number
  healthAdd?: number
  fireRateAdd?: number

  firePowerAdd?: number
  speedAdd?: number
  price?: number
}