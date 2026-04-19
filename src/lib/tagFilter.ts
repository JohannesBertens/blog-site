/**
 * Shared tag filtering logic for client-side filtering of blog posts.
 * Extracts common filtering behavior used across index.astro and PostGrid.astro.
 */

/**
 * Apply tag filter based on URL query parameter.
 * Shows/hides blog cards based on their data-tags-lower attribute.
 */
export function applyTagFilter(options: { updateTitle?: boolean } = {}): void {
  const { updateTitle = false } = options;
  const urlParams = new URLSearchParams(window.location.search);
  const tag = urlParams.get('tag');
  const cards = document.querySelectorAll<HTMLElement>('.blog-card');
  const postsCount = document.querySelector('.posts-count');
  const postsTitle = updateTitle ? document.querySelector('.posts-title') : null;

  if (!tag || tag === 'all') {
    cards.forEach((card) => {
      card.style.display = '';
    });
    if (postsCount) postsCount.textContent = `${cards.length} posts`;
    if (postsTitle) postsTitle.textContent = 'All Posts';
    const emptyState = document.querySelector<HTMLElement>('.empty-state');
    if (emptyState) emptyState.style.display = 'none';
    return;
  }

  const searchTag = tag.toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const tags = (card.getAttribute('data-tags-lower') || '').split(',').map(t => t.trim());
    if (tags.includes(searchTag)) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (postsCount) {
    postsCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'post' : 'posts'}`;
  }
  if (postsTitle) {
    postsTitle.textContent = visibleCount === 0 ? 'No posts found' : `Posts tagged: ${tag}`;
  }

  const emptyState = document.querySelector<HTMLElement>('.empty-state');
  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? '' : 'none';
  }
}

/**
 * Initialize tag filter with automatic application on load and back/forward navigation.
 */
export function initTagFilter(options: { updateTitle?: boolean } = {}): void {
  applyTagFilter(options);
  window.addEventListener('popstate', () => applyTagFilter(options));
}
