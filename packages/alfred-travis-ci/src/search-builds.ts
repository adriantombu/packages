import alfy from 'alfy'
import moment from 'moment'
import { TravisBuild, Build } from './interfaces'

const main = async () => {
  const token = alfy.config.get('token')
  const slug = alfy.input || ''

  const data = await alfy.fetch(
    `https://api.travis-ci.com/repo/${slug.replace('/', '%2F')}/builds`,
    {
      headers: {
        'Travis-API-Version': 3,
        Authorization: `token ${token}`,
      },
    },
  )

  const travisBuilds: TravisBuild[] = data.builds
  const builds = []

  for (const build of travisBuilds) {
    const url = `https://travis-ci.com/${slug}/builds/${build.id}`
    const state = !build.duration ? 'passing' : build.state
    const title = `#${build.id} ${slug}:${build.branch.name}`
    const subtitle = getSubtitle(build)

    builds.push(<Build>{
      title,
      subtitle,
      icon: {
        path: `./icons/${state}.png`,
      },
      arg: url,
      quicklookurl: url,
    })
  }

  alfy.output(builds)
}

const getSubtitle = (build: TravisBuild) => {
  const startedAt = moment(build.started_at).format('lll')

  if (!build.duration) {
    return `Currently building, started at ${startedAt}...`
  }

  const finishedAt = moment(build.finished_at).format('lll')

  return `From ${startedAt} to ${finishedAt} (${build.duration} seconds)`
}

main()
