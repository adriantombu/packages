const alfy = require('alfy');
const repositories = alfy.cache.get('repositories') || [];

alfy.output(repositories.filter(repository => !!alfy.input ? repository.title.includes(alfy.input) : true));
