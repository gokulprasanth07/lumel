import React, { useState, useMemo } from "react";
import { initial } from "./data";
import HierTable from "./components/HierTable";
import { Box, Container, Typography } from "@mui/material";

function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
}

export default function App() {
  // original snapshot for variance calc
  const originalTree = useMemo(() => deepClone(initial), []);
  const [tree, setTree] = useState(() => {
    // ensure parent totals are computed from children on load
    const t = deepClone(initial);
    const compute = (node) => {
      if (node.children) {
        node.children.forEach(compute);
        node.value = node.children.reduce((s, c) => s + (c.value || 0), 0);
      }
    };
    t.rows.forEach(compute);
    return t;
  });

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Hierarchical Allocation Table
      </Typography>
      <Box>
        <HierTable tree={tree} setTree={setTree} originalTree={originalTree} />
      </Box>
    </Container>
  );
}
