function Stats({ items }) {
  if (items.length === 0)
    return (
      <p className="stats">
        <em>Start adding to your packing list 🚀</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "🎉 You got everything! Ready to go!"
          : `You have ${numItems} items, and you already packed ${numPacked} (${percentage}%).`}
      </em>
    </footer>
  );
}

export default Stats;
