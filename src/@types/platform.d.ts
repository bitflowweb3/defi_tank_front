interface LinksObject {
  type: string
  href: string
}

interface UserObject {
  status: string,
  name: string,
  email: string,
  address: string,
  description: string,
  experience: number,

  image: string,
  coverImage: string,
  links: LinksObject[],

  golds: number,
  merit: number,
  potion: number,
  follows: number,
  ranking: number,
  borrowCount: number,
}

interface UpgradablePointsObject {
  health: number
  fireRate: number
  firePower: number
  speed: number
}

interface NftTankObject {
  id: string
  classType: number
  owner: string
  name: string
  image: string
  description: string
  chaptionBadge: number

  energy: number
  maxEnergy: number
  health: number
  fireRate: number
  firePower: number
  speed: number
  upgradablePoint: number,
  upgradedPoints: UpgradablePointsObject

  tankLevel: number
  winnerBadge: number
  experience: number
  targetExp: number
  spells: SpellObject[]
  goldForLevel: number

  borrower: string
  followers: [string]
  updatedAt: Date
  createdAt: Date
  role: string
}

interface GuildMemberObject {
  address: string
  name: string
  image: string
  coverImage: string
  followers: string[]
  experience: number
  merit: number
  potion: number
}

interface GuildObject {
  name: string
  image: string
  classType: string
  description: string

  id: string
  owner: string
  maxMembers: number

  level: number
  potion: number
  potionScore: number
  merit: number

  stakingPool: number
  maxStakingPool: number

  ownerNickName: string,
  ownerData: GuildMemberObject,
  members: GuildMemberObject[],
  requests: GuildMemberObject[],
  followers: string[],
  items: string[],
  role: string,

  guildLevel: number,
  experience: number,
  targetExp: number,
}

interface LeaderBoardObject {
  name: string
  owner?: string
  address?: string
  image: string
  merit: number
  reward: number
  rank: number
}