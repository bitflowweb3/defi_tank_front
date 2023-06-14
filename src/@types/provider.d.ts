interface ReducerObject {
  type: string
  payload: any
}

interface NotifiObject {
  _id: string
  type: string
  title: string
  content: string
  time: string
}

interface InitStateObject {
  loading: boolean
  mobileOpen: boolean

  balance: number
  signer: any | null
  account: string | null
  walletStatus: number

  tankItems: TankObject[]
  tankClasses: ClassesObject[]
  notifications: NotifiObject[]

  stakes: any,
  stakeRate: number,
  rewardPoolBalance: number,
  allowances: { toTank: number, toPool: number },
  poolsInfo: { totalStakedAmount: number, totalCapacity: number },
}