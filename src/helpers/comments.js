import Utils from '../helpers/utils';

function getCommentReplies(originComment, commentsReplies) {
  const replies = [];

  commentsReplies.forEach(comment => {
    if (comment.replyTo === originComment.id) {
      const newComment = comment;
      newComment.formatDate = Utils.formatDate(comment.createdAt);
      newComment.replies = getCommentReplies(newComment, commentsReplies);
      replies.push(newComment);
    }
  });

  return replies;
}

function getNestedComments(originParams) {
  const defaultParams = {
    commentsDataRaw: [],
    commentsDataFiltered: [],
    paginationStart: null,
    paginationEnd: null,
    paginationRange: null,
    filterTag: null,
  };
  const params = Object.assign(defaultParams, originParams);
  const commentsNested = [];
  const commentsOrigin = [];
  const commentsReplies = [];

  params.commentsDataFiltered.forEach(comment => {
    if (!Object.prototype.hasOwnProperty.call(comment, 'replyTo')) {
      commentsOrigin.push(comment);
    } else {
      commentsReplies.push(comment);
    }
  });

  commentsOrigin.forEach(comment => {
    const newComment = comment;
    newComment.formatDate = Utils.formatDate(comment.createdAt);
    newComment.replies = getCommentReplies(newComment, params.commentsDataRaw);
    commentsNested.push(newComment);
  });

  if (
    params.paginationStart !== null ||
    params.paginationEnd !== null ||
    params.paginationRange !== null
  ) {
    // paginate results
  }

  if (params.filterTag !== null) {
    // filter results
  }

  return commentsNested;
}

function getAndNestComments(comments) {
  let commentsFor = [];
  let commentsAgainst = [];

  if (comments) {
    const commentsWithIndex = comments.map((comment, index) => ({
      ...comment,
      index,
    }));
    commentsFor = commentsWithIndex.filter(comment => {
      if (comment.tags.includes('for')) {
        return comment;
      }
    });
    commentsAgainst = commentsWithIndex.filter(comment => {
      if (comment.tags.includes('against')) {
        return comment;
      }
    });

    // adds nesting structure
    commentsFor = getNestedComments({
      commentsDataRaw: commentsWithIndex,
      commentsDataFiltered: commentsFor,
    });

    commentsAgainst = getNestedComments({
      commentsDataRaw: commentsWithIndex,
      commentsDataFiltered: commentsAgainst,
    });
  }

  return {
    commentsFor,
    commentsAgainst,
  };
}

export default {
  getAndNestComments,
};