import fs from 'fs';
import path from 'path';
import request from 'request';

const { log } = console;

const api = (url, callback) => {
  request(
    {
      url: `https://api.github.com/${url}`,
      headers: {
        'User-Agent': 'request'
      },
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    },
    (err, res, body) => {
      callback(JSON.parse(body));
    }
  );
};

const main = () => {
  const folder = 'avatars';

  const [user, repo] = process.argv
    .slice(2)
    .map(x => (x || '').trim().toLowerCase());

  log(`Fetching avatars for user "${user}", repo "${repo}"`);

  api(`repos/${user}/${repo}/collaborators`, data => {
    if (!data.length) return;
    !fs.existsSync('avatars') && fs.mkdirSync('avatars');
    data.map(({ login, avatar_url }) =>
      request(avatar_url).pipe(fs.createWriteStream(`avatars/${login}.png`))
    );
  });
};

export default main;
