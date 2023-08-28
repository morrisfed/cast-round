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
  const buildSubtotalRow = useCallback(
    (responseCode: string, label: string) => {
      const nonProxySubtotal = subtotals
        .filter(
          (subtotal) =>
            subtotal.responseCode === responseCode && subtotal.proxy === false
        )
        .map((subtotal) => subtotal.subtotal)
        .reduce((a, b) => a + b, 0);
      const proxySubtotal = subtotals
        .filter(
          (subtotal) =>
            subtotal.responseCode === responseCode && subtotal.proxy === true
        )
        .map((subtotal) => subtotal.subtotal)
        .reduce((a, b) => a + b, 0);

      return (
        <tr>
          <td>{responseCode}</td>
          <td>{nonProxySubtotal}</td>
          <td>{proxySubtotal}</td>
          <td>{nonProxySubtotal + proxySubtotal}</td>
          <td>{label}</td>
        </tr>
      );
    },
    [subtotals]
  );

  const rows = useMemo(() => {
    const sortedDefinitions = voteDefinition.responses.sort(
      (a, b) => a.sequence - b.sequence
    );
    return sortedDefinitions.map((definition) =>
      buildSubtotalRow(definition.code, definition.label)
    );
  }, [voteDefinition, buildSubtotalRow]);

  const table = useMemo(() => {
    return (
      <table className="table-compact table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Open</th>
            <th>Proxy</th>
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
