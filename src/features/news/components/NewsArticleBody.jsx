export function NewsArticleBody({ content }) {
  return (
    <div className="article-content">
      {content.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
