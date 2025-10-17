
export function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

export function findNodeById(tree, id) {
    let found = null;
    function dfs(children, parent = null, path = []) {
        for (const node of children) {
            const curPath = [...path, node];
            if (node.id === id) { found = { node, parent, path: curPath }; return true; }
            if (node.children && dfs(node.children, node, curPath)) return true;
        }
        return false;
    }
    dfs(tree.rows);
    return found;
}

export function computeTotals(tree) {
    function compute(node) {
        if (node.children) {
            node.children.forEach(compute);
            node.value = node.children.reduce((s, c) => s + (Number(c.value) || 0), 0);
        } else {
            node.value = Number(node.value) || 0;
        }
    }
    tree.rows.forEach(compute);
}

export function getLeafNodes(node) {
    const leaves = [];
    function dfs(n) {
        if (!n.children || n.children.length === 0) leaves.push(n);
        else n.children.forEach(dfs);
    }
    dfs(node);
    return leaves;
}

// distribute newSubtotal across leaves proportionally to their current contribution
export function distributeToLeaves(node, newSubtotal) {
    const leaves = getLeafNodes(node);
    const oldTotal = leaves.reduce((s, l) => s + (Number(l.value) || 0), 0);
    if (oldTotal === 0) {
        const per = newSubtotal / leaves.length;
        leaves.forEach(l => l.value = +(per).toFixed(4));
    } else {
        const factor = newSubtotal / oldTotal;
        leaves.forEach(l => l.value = +(Number(l.value) * factor).toFixed(4));
    }
}
