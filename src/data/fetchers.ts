// server at env.HOST and env.PORT always has /nodes endpoint returning this interface:

interface NodeData {
    id: string;
    version: string;
    type: string;
}

const URL_NODES = "http://localhost:5051/nodes";
console.log(URL_NODES);

async function fetchNodes() {
    let nodes: NodeData[] = [];
    await fetch(URL_NODES)
        .then(response => response.json())
        .then(data => {
            nodes = data["nodes"];
        })
        .catch(error => {
            console.error('Error:', error);
        });

    return nodes;
}

export type { NodeData };
export { fetchNodes};