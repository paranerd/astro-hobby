document.addEventListener('DOMContentLoaded', () => {
  setupFilter(false);
});

function setupFilter(alwaysFade) {
  const filters = document.querySelectorAll('.filter');

  filters.forEach((el) =>
    el.addEventListener('click', (event) => {
      // Remove 'active' class from all filters
      document
        .querySelectorAll('.filter')
        .forEach((el) => el.classList.remove('active'));

      // Set current filter active
      (event.target as HTMLElement).classList.add('active');
      applyFilter((event.target as HTMLElement).dataset.filter);
    })
  );

  document.querySelectorAll('.filter-item').forEach((el) => {
    el.classList.add('filterFadeIn');

    if (alwaysFade) {
      el.addEventListener('animationend', (e) => {
        console.log('called');
        (e.target as HTMLElement).classList.remove('filterFadeIn');
      });
    }
  });
}

function applyFilter(filter) {
  document.querySelectorAll('.filter-item').forEach((el) => {
    const elementFilters = (el as HTMLElement).dataset.filters
      ?.split(',')
      .filter((el) => el);

    if (filter === 'all' || elementFilters?.includes(filter)) {
      el.classList.add('filterFadeIn');
      el.classList.remove('inactive');
    } else {
      el.classList.add('inactive');
    }
  });
}
