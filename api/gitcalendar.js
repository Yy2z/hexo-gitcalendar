const gitCalendarUrl = 'https://github.com/users/{username}/contributions';

async function getGitCalendar(username) {
  const url = gitCalendarUrl.replace('{username}', username);
  const response = await fetch(url);
  const html = await response.text();
  const datadatereg = /data-date="(.*?)" data-level/;
  const datacountreg = /data-count="(.*?)" data-date/g;
  const datadate = html.match(datadatereg);
  const datacount = html.match(datacountreg).map(str => Number(str.match(/\d+/)[0]));
  const contributions = datacount.reduce((a, b) => a + b, 0);
  const datalist = datadate.map((date, index) => ({ date, count: datacount[index] }));
  const datalistsplit = chunk(datalist, 7);
  return {
    total: contributions,
    contributions: datalistsplit,
  };
}

function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, (i + 1) * size)
  );
}

async function renderGitCalendar(username) {
  const data = await getGitCalendar(username);
  const container = document.createElement('div');
  container.classList.add('git-calendar');
  container.innerHTML = `
    <div class="contributions-count">
      <span class="count">${data.total}</span>
      <span class="description">contributions</span>
    </div>
    <div class="contributions-calendar">
      ${data.contributions
        .map(
          week =>
            `<div class="contributions-week">${week
              .map(
                day =>
                  `<span class="contributions-day ${
                    day.count > 0 ? 'has-contributions' : ''
                  }"></span>`
              )
              .join('')}</div>`
        )
        .join('')}
    </div>
  `;
  document.body.appendChild(container);
}

renderGitCalendar('your-username');
