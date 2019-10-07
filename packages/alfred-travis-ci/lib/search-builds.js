const alfy = require('alfy');
const moment = require('moment');

const token = alfy.config.get('token');
const slug = alfy.input;

const data = await alfy.fetch(`https://api.travis-ci.com/repo/${slug.replace('/', '%2F')}/builds`, {
	headers: {
		'Travis-API-Version': 3,
		'Authorization': `token ${token}`
	}
});

const builds = [];

for (const build of data.builds) {
  const url = `https://travis-ci.com/${slug}/builds/${build.id}`;

	const state = !build.duration ? 'passing' : build.state;
	const subtitle = !build.duration
		? `Currently building, started at ${moment(build.started_at).format('lll')}...`
		: `From ${moment(build.started_at).format('lll')} to ${moment(build.finished_at).format('lll')} (${build.duration} seconds)`;

	builds.push({
		uid: build.id,
		title: `#${build.id} ${slug}:${build.branch.name}`,
		subtitle,
		icon: {
			path: `./icons/${state}.png`
		},
		arg: url,
		quicklookurl: url
	});
}

alfy.output(builds);
