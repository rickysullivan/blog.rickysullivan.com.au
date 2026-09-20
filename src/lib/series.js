const byNewest = (a, b) => b.data.date.getTime() - a.data.date.getTime();

/** @typedef {import("astro:content").CollectionEntry<"posts">} Post */

/**
 * Finds other published posts in the current post's editorial series.
 * Series is deliberately optional, so ungrouped posts retain the existing flow.
 *
 * @param {Post[]} posts
 * @param {Post} current
 * @param {number} limit
 * @returns {Post[]}
 */
export const getSeriesPeers = (posts, current, limit = 3) => {
  if (!current.data.series) return [];

  return posts
    .filter(
      (post) =>
        !post.data.draft && post.id !== current.id && post.data.series === current.data.series,
    )
    .sort(byNewest)
    .slice(0, limit);
};
