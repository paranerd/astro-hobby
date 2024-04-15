window.addEventListener('DOMContentLoaded', async (event) => {
  const resultsDiv = document.getElementById('search-results');
  const pagefind = await import('/pagefind/pagefind.js');

  document
    .getElementById('search-input')
    .addEventListener('input', async (e) => {
      if (!e.target.value) {
        hideElement('search-empty');
        resultsDiv.innerHTML = '';
        return;
      }

      const search = await pagefind.debouncedSearch(e.target.value);

      if (search) {
        resultsDiv.innerHTML = '';
      }

      if (search?.results?.length) {
        hideElement('search-empty');
        renderResults(resultsDiv, search.results);
      } else {
        unhideElement('search-empty');
      }
    });

  document.getElementById('search-clear').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
  });

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');

  if (query) {
    document.querySelector('#search input').value = query;
    document.querySelector('#search input').dispatchEvent(new Event('input'));
  }
});

function hideElement(id) {
  document.getElementById(id).classList.add('hidden');
}

function unhideElement(id) {
  document.getElementById(id).classList.remove('hidden');
}

async function renderResults(target, results) {
  for (const result of results) {
    const resultData = await result.data();

    const item = createElement('a', ['grid-item'], target);
    item['href'] = resultData.url;
    item['aria-label'] = resultData.meta.title;
    const imgWrapper = createElement('div', ['grid-item-img'], item);
    const img = createElement('img', null, imgWrapper);
    img['src'] = resultData.meta.image;
    console.log(resultData.meta.image);
    const titleWrapper = createElement(
      'div',
      ['grid-item-title-wrapper'],
      item
    );
    const title = createElement(
      'h2',
      ['grid-item-title'],
      titleWrapper,
      resultData.meta.title
    );
  }
}

function createElement(type, cls, parent, content = null) {
  const el = document.createElement(type);

  if (cls && cls.length) {
    el.classList.add(...cls);
  }

  if (content) {
    el.innerHTML = content;
  }

  parent.appendChild(el);

  return el;
}
