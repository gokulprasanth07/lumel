import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  deepClone,
  findNodeById,
  computeTotals,
  distributeToLeaves,
} from "../utils";
import RowControls from "./RowControls";

function format(number) {
  return Number(number).toFixed(2);
}

export default function HierTable({ tree, setTree, originalTree }) {
  const applyUpdate = (newTree) => {
    computeTotals(newTree);
    setTree({ ...newTree });
  };

  // allocation % clicked for node id
  // eslint-disable-next-line no-unused-vars
  const onAllocPercent = (id, percentStr, isPercent = true) => {
    const pct = Number(percentStr);
    if (isNaN(pct)) return;
    const newTree = deepClone(tree);
    const found = findNodeById(newTree, id);
    if (!found) return;
    const { node } = found;
    if (node.children && node.children.length) {
      // scale subtotal and distribute to leaves proportionally
      const oldSubtotal = node.children.reduce(
        (acc, curr) => acc + Number(curr.value || 0),
        0
      );
      const newSubtotal = oldSubtotal * (1 + pct / 100);
      distributeToLeaves(node, newSubtotal);
    } else {
      node.value = +(Number(node.value) * (1 + pct / 100));
    }
    computeTotals(newTree);
    applyUpdate(newTree);
  };

  const onAllocVal = (id, valStr) => {
    const val = Number(valStr);
    if (isNaN(val)) return;
    const newTree = deepClone(tree);
    const found = findNodeById(newTree, id);
    if (!found) return;
    const { node } = found;
    if (node.children && node.children.length) {
      distributeToLeaves(node, val);
    } else {
      node.value = val;
    }
    computeTotals(newTree);
    applyUpdate(newTree);
  };

  const renderRows = (nodes, level = 0) => {
    return nodes.map((n) => {
      const original = (function findOriginal(id) {
        let res = null;
        function dfs(children) {
          for (const x of children) {
            if (x.id === id) {
              res = x;
              return true;
            }
            if (x.children) if (dfs(x.children)) return true;
          }
          return false;
        }
        dfs(originalTree.rows);
        return res;
      })(n.id);

      const origVal = original ? Number(original.value || 0) : 0;
      const variance =
        origVal === 0
          ? "-"
          : (((Number(n.value) - origVal) / origVal) * 100).toFixed(2) + "%";

      return (
        <React.Fragment key={n.id}>
          <TableRow>
            <TableCell sx={{ pl: 2 + level * 3 }}>
              {level > 0 ? "— ".repeat(level) : ""}
              {n.label}
            </TableCell>
            <TableCell>{format(n.value)}</TableCell>
            <TableCell>
              <RowControls
                id={n.id}
                onPercent={onAllocPercent}
                onVal={onAllocVal}
              />
            </TableCell>
            <TableCell>{variance}</TableCell>
          </TableRow>
          {n.children && renderRows(n.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  const grandTotal = tree.rows.reduce((s, r) => s + Number(r.value || 0), 0);

  return (
    <Box>
      <Table
        sx={{
          borderCollapse: "collapse",
          "& td, & th": {
            border: "1px solid #ccc", // or your color
          },
        }}
      >
        <TableHead
          sx={{
            backgroundColor: "#f5f5f5", // light grey
            "& th": {
              border: "1px solid #ccc", // keep grid consistent
              fontWeight: 600,
            },
          }}
        >
          <TableRow>
            <TableCell>Label</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Input / Actions</TableCell>
            <TableCell>Variance %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows(tree.rows)}
          <TableRow
            sx={{
              backgroundColor: "#f5f5f5",
              "& td": {
                border: "1px solid #ccc",
                fontWeight: 500,
              },
            }}
          >
            <TableCell>
              <strong>Grand Total</strong>
            </TableCell>
            <TableCell>
              <strong>{grandTotal.toFixed(2)}</strong>
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
