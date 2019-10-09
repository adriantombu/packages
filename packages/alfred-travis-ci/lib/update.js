const alfy = require('alfy');
const token = alfy.config.get('token');

if (!token) {
	return alfy.output([{ title: 'API Token not found', subtitle: "Please run 'travis-auth TOKEN' first" }]);
}

// TODO: handle pagination (results limited to 100)
const data = await alfy.fetch('https://api.travis-ci.com/repos', {
	headers: {
		'Travis-API-Version': 3,
		'Authorization': `token ${token}`
	}
});

const repositories = [];

for (const repository of data.repositories) {
	const url = `https://travis-ci.com/${repository.slug}`;

	if (!repository.active) {
		continue
	}

	repositories.push({
		uid: repository.id,
		title: repository.slug,
		subtitle: repository.description || url,
		arg: repository.slug
	});
}

alfy.cache.set('repositories', repositories);

alfy.output([{ title: 'Repository list updated!', subtitle: "You can now use the command 'travis repo-slug'" }]);
