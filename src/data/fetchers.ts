// server at env.HOST and env.PORT always has /nodes endpoint returning this interface:

import { SceneData } from "../demos/ThreeScene";

const HOST_BROKER = process.env.REACT_APP_HOST_BROKER;
const PORT_BROKER = process.env.REACT_APP_PORT_BROKER;

const URL_SERVER = `http://${HOST_BROKER}:${PORT_BROKER}`;

interface NodeData extends SceneData {
    version: string;
}

interface NoteData extends NodeData {
    // pydantic:
    // h0: str = "note"
    // timestamp: Union[int, str] = Field(default_factory= lambda: str(int(1000* time.time())))
    // type: str = "note"
    // origin: str = "/notes"
    // author: str = "mcfrank"
    // content: str
    h0: string;
    timestamp: number;
    origin: string;
    author: string;
    content: string;
}

async function fetchNodes() {
    let nodes: NodeData[] = [];
    await fetch(URL_SERVER + "/nodes")
        .then(response => response.json())
        .then(data => {
            nodes = data["nodes"];
        })
        .catch(error => {
            console.error('Error:', error);
        });

    return nodes;
}

async function fetchNotes() {
    let notes: NoteData[] = [];
    await fetch(URL_SERVER + "/notes")
        .then(response => response.json())
        .then(data => {
            notes = data["nodes"];
        })
        .catch(error => {
            console.error('Error:', error);
        });

    return notes;
}

interface Link {
    source_id: string;
    target_id: string;
}

interface Graph {
    nodes: NoteData[];
    links: Link[]
}

async function fetchNoteForceGraph() {
    let graph: Graph = { nodes: [], links: [] };
    await fetch(URL_SERVER + "/graph/notes/force")
        .then(response => response.json())
        .then(data => {
            graph = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    return graph;
}

export type { NodeData, NoteData, Link, Graph };
export { fetchNodes, fetchNotes, fetchNoteForceGraph };
