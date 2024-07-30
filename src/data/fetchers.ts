// server at env.HOST and env.PORT always has /nodes endpoint returning this interface:

import { SceneData } from "../demos/ThreeScene";

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

const URL_SERVER = "http://localhost:5051";

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

export type { NodeData, NoteData };
export { fetchNodes, fetchNotes };
