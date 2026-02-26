const KEY = "likedSongs";

export function getLikedIds() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isLiked(id) {
  return getLikedIds().includes(id);
}

export function toggleLike(id) {
  const liked = getLikedIds();
  const next = liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
