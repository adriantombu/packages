import alfy from 'alfy'
import { Repository } from './interfaces'

const main = () => {
  const repositories: Repository[] = alfy.cache.get('repositories') || []

  alfy.output(repositories.filter((repository) => (!!alfy.input ? repository.title.includes(alfy.input) : true)))
}

main()
