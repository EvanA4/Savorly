import React from "react";

function BudgetSelect(props: {
  budgetInput: number;
  setBudgetInput: React.Dispatch<React.SetStateAction<number>>;
}) {
  const NOT_SELECTED_STYLE =
    "flex justify-between border-2 border-neutral-200 " +
    "p-2 rounded-lg cursor-pointer hover:border-blue-300 active:border-blue-300 " +
    "transition-colors duration-200";
  const SELECTED_STYLE =
    "flex justify-between border-2 border-blue-300 p-2 " +
    "rounded-lg cursor-pointer transition-colors duration-200";

  return (
    <div>
      <p>Budget</p>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 lg:text-lg mt-1">
        <button
          className={
            props.budgetInput == 1 ? SELECTED_STYLE : NOT_SELECTED_STYLE
          }
          onClick={() => props.setBudgetInput(1)}
        >
          <p>$</p>
          <p className="text-neutral-500">$1-10</p>
        </button>
        <button
          className={
            props.budgetInput == 2 ? SELECTED_STYLE : NOT_SELECTED_STYLE
          }
          onClick={() => props.setBudgetInput(2)}
        >
          <p>$$</p>
          <p className="text-neutral-500">$10-25</p>
        </button>
        <button
          className={
            props.budgetInput == 3 ? SELECTED_STYLE : NOT_SELECTED_STYLE
          }
          onClick={() => props.setBudgetInput(3)}
        >
          <p>$$$</p>
          <p className="text-neutral-500">$25+</p>
        </button>
      </div>
    </div>
  );
}

export default BudgetSelect;
