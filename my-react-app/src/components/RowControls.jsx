import React from "react";
import { TextField, Button } from "@mui/material";

export default function RowControls({ id, onPercent, onVal }) {
  const [input, setInput] = React.useState("");
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <TextField
        size="small"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g., 10 or 400"
      />
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          onPercent(id, input);
          setInput("");
        }}
      >
        Allocation %
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          onVal(id, input);
          setInput("");
        }}
      >
        Allocation Val
      </Button>
    </div>
  );
}
