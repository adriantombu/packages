export interface Repository {
  uid: string
  title: string
  subtitle: string
  arg: string
}

export interface Build {
  title: string
  subtitle: string
  icon: Icon
  arg: string
  quicklookurl: string
}

interface Icon {
  path: string
}

export interface TravisRepository {
  id: string
  slug: string
  active: boolean
  description: string
}

export interface TravisBuild {
  id: string
  state: string
  duration?: string
  started_at: string
  finished_at?: string
  branch: TravisBranch
}

interface TravisBranch {
  name: string
}
