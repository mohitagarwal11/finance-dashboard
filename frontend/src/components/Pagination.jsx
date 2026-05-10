function Pagination({ currPage, setCurrPage, totalPages }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-2 flex justify-center">
      {pages.map((page) => (
        <button
          className={`mx-1 cursor-pointer rounded-(--r-md) border px-2.75 py-2 text-[13px] hover:border-(--border-focus) focus:border-(--border-focus) ${
            currPage === page
              ? "border-(--accent) bg-(--accent) text-white focus:bg-(--accent)"
              : "border-(--border) bg-(--bg) text-(--text) focus:bg-(--surface)"
          }`}
          key={page}
          onClick={() => setCurrPage(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
