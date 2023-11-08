interface ReducerObject {
  type: string
  payload: any
}

interface NotifiObject {
  _id: string
  user: string
  title: string
  description: string
  status: string
  created: number
}

interface InitStateObject {
  loading: boolean
  mobileOpen: boolean

  balance: number
  signer: any | null
  account: string | null
  walletStatus: number

  guildDatas: GuildObject[]
  tankItems: NftTankObject[]
  tankClasses: TankClassObject[]
  guildRules: GuildRuleObject

  stakes: any,
  allowances: { toTank: number, toGuild: number, toPool: number }
  poolsInfo: { apy: number, totalStaked: number, totalCapacity: number }
  stakeRewards: { rewardDFTL: number, rewardETH: number }

  potionInfo: {
    price: number
    sellPrice: number
    increase: number
  }

  topPlayReward: number
  topGuildReward: number
}