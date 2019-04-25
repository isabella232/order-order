function display(req, res, data) {
  let commentsFor = [];
  let commentsAgainst = [];
  const { debate } = data;

  if (debate.comments) {
    commentsFor = debate.comments.filter((comment) => {
      comment.tags.includes('for');
      return comment;
    });
    commentsAgainst = debate.comments.filter((comment) => {
      comment.tags.includes('against');
      return comment;
    });
  }

  res.render(debate.debateType, {
    title: debate.title,
    description: debate.description,
    commentsFor,
    commentsAgainst,
    user: data.user,
  });
}

module.exports = { display };
