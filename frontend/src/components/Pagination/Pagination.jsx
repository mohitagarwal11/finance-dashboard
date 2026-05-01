function Pagination({ txnPerPage, setCurrPage, totalTxn }) {
  let pages = [];
  for (let i = 1; i <= (totalTxn + 1) / txnPerPage; i++) {
    pages.push(i);
  }
  return (
    <div className="mt-2 flex justify-center">
      {pages.map((page, index) => (
        <button
          className="mx-1 cursor-pointer rounded-(--r-md) border border-(--border) bg-(--bg) px-2.75 py-2 text-[13px] text-(--text) hover:border-(--border-focus) focus:border-(--border-focus) focus:bg-(--surface)"
          key={index}
          onClick={() => setCurrPage(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
