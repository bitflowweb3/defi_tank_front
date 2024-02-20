interface SpellObject {
  id: number
  tankID: number
  name: string
  description: string
  image: string
  params: string
  stat: number
}

interface TankClassObject {
  id: number
  name: string
  image: string
  description: string
  health: number
  fireRate: number
  firePower: number
  speed: number
  healthAdd: number
  fireRateAdd: number

  spells: SpellObject[]
  firePowerAdd: number
  speedAdd: number
  price: number
}

interface GuildRuleObject {
  maxMembers: number
  price: number
}