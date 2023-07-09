interface TankClassObject {
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

interface ItemClassObject {
  id: number
  name: string
  image: string
  description: string
  price: number
  limitation: number
  maxLimit: number
}

interface GuildRuleObject {
  maxMembers: number
  price: number
}