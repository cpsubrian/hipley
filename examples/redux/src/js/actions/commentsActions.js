import {
  COMMENTS_ADD,
  COMMENTS_LIKE
} from './'

export function addComment (comment) {
  return {type: COMMENTS_ADD, comment: {...comment, likes: 0}}
}

export function likeComment (index) {
  return {type: COMMENTS_LIKE, index}
}
