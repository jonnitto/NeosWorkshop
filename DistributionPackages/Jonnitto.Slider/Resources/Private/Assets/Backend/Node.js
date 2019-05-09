function getNodeType(node) {
    return typeof node.get == 'function' ? node.get('nodeType') : node.nodeType;
}

function checkNodeType(node, type) {
    return !!(typeof type == 'string' ? getNodeType(node) == type : type.includes(getNodeType(node)));
}

function checkNodeName(node, name, type = 'Neos.Neos:ContentCollection') {
    return !!(getNodeType(node) == type && node.name == name);
}

export { checkNodeName, checkNodeType };
