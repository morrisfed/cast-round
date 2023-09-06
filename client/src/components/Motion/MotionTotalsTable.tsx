import React, { useCallback, useMemo } from "react";

import { ModelVoteDefinition } from "interfaces/motion";
import { MotionVoteSubtotal } from "interfaces/motion-vote";

export interface MotionTotalsTableProps {
  voteDefinition: ModelVoteDefinition;
  subtotals: MotionVoteSubtotal[];
}

const MotionTotalsTable: React.FC<MotionTotalsTableProps> = ({
  voteDefinition,
  subtotals,
}) => {
  const buildResponseRow = useCallback(
    (responseCode: string, label: string, key: React.Key) => {
      const nonAdvancedSubtotals = subtotals
        .filter(
          (subtotal) =>
            subtotal.responseCode === responseCode &&
            subtotal.advanced === false
        )
        .map((subtotal) => subtotal.subtotal)
        .reduce((a, b) => a + b, 0);
      const advancedSubtotal = subtotals
        .filter(
          (subtotal) =>
            subtotal.responseCode === responseCode && subtotal.advanced === true
        )
        .map((subtotal) => subtotal.subtotal)
        .reduce((a, b) => a + b, 0);

      return (
        <tr key={key}>
          <td>{responseCode}</td>
          <td>{advancedSubtotal}</td>
          <td>{nonAdvancedSubtotals}</td>
          <td>{nonAdvancedSubtotals + advancedSubtotal}</td>
          <td>{label}</td>
        </tr>
      );
    },
    [subtotals]
  );

  const subTotalRow = useMemo(() => {
    const nonAdvancedSubtotals = subtotals
      .filter((subtotal) => subtotal.advanced === false)
      .map((subtotal) => subtotal.subtotal)
      .reduce((a, b) => a + b, 0);
    const advancedSubtotal = subtotals
      .filter((subtotal) => subtotal.advanced === true)
      .map((subtotal) => subtotal.subtotal)
      .reduce((a, b) => a + b, 0);

    return (
      <tr key="totals">
        <td>TOTAL</td>
        <td>{advancedSubtotal}</td>
        <td>{nonAdvancedSubtotals}</td>
        <td>{nonAdvancedSubtotals + advancedSubtotal}</td>
        <td>Total</td>
      </tr>
    );
  }, [subtotals]);

  const rows = useMemo(() => {
    const sortedDefinitions = voteDefinition.responses.sort(
      (a, b) => a.sequence - b.sequence
    );
    const responseRows = sortedDefinitions.map((definition) =>
      buildResponseRow(definition.code, definition.label, definition.code)
    );
    return [...responseRows, subTotalRow];
  }, [voteDefinition.responses, subTotalRow, buildResponseRow]);

  const table = useMemo(() => {
    return (
      <table className="table-compact table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Advanced</th>
            <th>Live</th>
            <th>Total</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }, [rows]);

  return table;
};

export default MotionTotalsTable;
