import alfy from 'alfy'
import { TravisRepository, Repository } from './interfaces'

const main = async () => {
  const token = alfy.config.get('token')

  if (!token) {
    return alfy.output([
      {
        title: 'API Token not found',
        subtitle: "Please run 'travis-auth TOKEN' first",
      },
    ])
  }

  // TODO: handle pagination (results limited to 100)
  const data = await alfy.fetch('https://api.travis-ci.com/repos', {
    headers: {
      'Travis-API-Version': 3,
      Authorization: `token ${token}`,
    },
  })

  const travisRepositories: TravisRepository[] = data.repositories
  const repositories = []

  for (const travisRepository of travisRepositories) {
    const url = `https://travis-ci.com/${travisRepository.slug}`

    if (!travisRepository.active) {
      continue
    }

    repositories.push(<Repository>{
      uid: travisRepository.id,
      title: travisRepository.slug,
      subtitle: travisRepository.description || url,
      arg: travisRepository.slug,
    })
  }

  alfy.cache.set('repositories', repositories)

  alfy.output([
    {
      title: 'Repository list updated!',
      subtitle: "You can now use the command 'travis repo-slug'",
    },
  ])
}

main()
