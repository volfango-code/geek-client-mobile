import request from '@/utils/request'

// 获取文章列表
export const getArticles = (params) => {
  return request({
    url: '/v1_0/articles',
    params
  })
}

// 获取文章详情
export const getArticle = id => {
  return request({
    url: '/v1_0/articles/' + id
  })
}

// 获取文章评论
export const getCommentsByArticle = (articleId, offset) => {
  return request({
    url: '/v1_0/comments',
    params: { type: 'a', source: articleId, offset }
  })
}

// 点赞&取消点赞
export const likeArticle = (articleId, isLike) => {
  console.log(articleId, isLike)
  // 点赞
  if (isLike) {
    return request({
      url: '/v1_0/article/likings',
      method: 'POST',
      data: { target: articleId }
    })
  } else {
    // 取消点赞
    return request({
      url: '/v1_0/article/likings/' + articleId,
      method: 'delete'
    })
  }
}

// 收藏&取消收藏
export const collectArticle = (articleId, isCollect) => {
  // 收藏
  if (isCollect) {
    return request({
      url: '/v1_0/article/collections',
      method: 'POST',
      data: { target: articleId }
    })
  } else {
    // 取消收藏
    return request({
      url: '/v1_0/article/collections/' + articleId,
      method: 'delete'
    })
  }
}

// 获取回复
export const getReplyByComment = (commentId, offset) => {
  return request({
    url: '/v1_0/comments',
    params: { type: 'c', source: commentId, offset }
  })
}

// 发表评论
export const commentOrReply = (target, content, articleId = null) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: { target, content, art_id: articleId }
  })
}
