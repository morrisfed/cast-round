export interface FilterInputProps {
  filterString: string;
  setFilterString: (s: string) => void;
}

const FilterInput: React.FC<FilterInputProps> = ({
  filterString,
  setFilterString,
}) => {
  return (
    <div className="form-control">
      <label className="input-group">
        <span>Filter</span>
        <input
          type="text"
          placeholder="Filter accounts"
          className="input-bordered input"
          value={filterString}
          onChange={(e) => setFilterString(e.target.value)}
        />
        {filterString.length > 0 ? (
          <button
            className="btn-ghost btn-circle btn"
            onClick={() => setFilterString("")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        ) : null}
      </label>
    </div>
  );
};

export default FilterInput;
