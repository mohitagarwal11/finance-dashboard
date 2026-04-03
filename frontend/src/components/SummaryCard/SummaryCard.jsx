import "./SummaryCard.css";
import { formatCurrency } from "../../utils/formatters";

function SummaryCard({ title, value, type }) {
  return (
    <div className={`summary-card summary-card--${type}`}>
      <span className="summary-card__label">{title}</span>
      <p className="summary-card__value">{formatCurrency(value)}</p>
    </div>
  );
}

export default SummaryCard;
