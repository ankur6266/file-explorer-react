import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header'
import FileTree from './components/fileTree'
import { useDispatch, useSelector } from 'react-redux'
import { addNode, updateFileContent } from './features/filesystem/fileSystemSlice'

function App() {
  
  const {nodes} = useSelector((state) => state.fileSystem);
  const dispatch = useDispatch();
  const [selectedfile, setSelectedfile] = useState(null);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeType, setNewNodeType] = useState("file");
  const [parentId, setParentId] = useState("root");
  const [fileContent, setFileContent] = useState("");
// console.log("nodes:", nodes);
 function getAllFolderNodes(nodes, prefix = "") {
  let folderNodes = [];
  nodes.forEach(node => {
    if(node.type === 'folder') {
      folderNodes.push({id: node.id, name: prefix + node.name});
      if(node.children){
        folderNodes = folderNodes.concat(getAllFolderNodes(node.children, prefix + node.name + "/"));
      }
    }
  });
  return folderNodes;
  }

  const handleAddNode = () => {
    if(newNodeName.trim()){
      dispatch(addNode({parentId, name: newNodeName, type: newNodeType}));
      setNewNodeName("");
    }
  }

  const handleFileSelect = (node) => {
    setSelectedfile(node);
    setFileContent(node.content || "");
  }

  const handleFileContentSave = () => {
    if(selectedfile){
      dispatch(updateFileContent({nodeId: selectedfile.id, content: fileContent}));
    }
  }

  const folderNodes = getAllFolderNodes(nodes);
  console.log("folderNodes:", folderNodes);
  return (
    <>
     {/* <Header /> */}
     <div id='mainWrapper'>
      {/* files create, update , rename */}
      <div id='fileTreeWrapper'>
        <h2>File Explorer</h2>
        <div className='fileCreateActionWrapper'>
          <div className='inputElementWrap'>
          <input name="create" className='createElementInput' type="text" onChange={(e) => setNewNodeName(e.target.value)} placeholder='New File/Folder name'/>
          <select className='selectButton' value={newNodeType} onChange={(e) => {setNewNodeType(e.target.value)}}>
            <option value="file">File</option>
            <option value="folder">Folder</option>
          </select>
          </div>
          <div className='folderSelector'>
          <select className='selectButton' value={parentId} onChange={(e) => {setParentId(e.target.value)}}>
            {folderNodes.map(folder => {
              return <option key={folder.id} value={folder.id}>{folder.name}</option>
            })}
          </select>
          <button onClick={handleAddNode}>Add</button>
          </div>
        </div>
        <FileTree nodes={nodes} onSelect={handleFileSelect} />

      </div>

    {/* file view wrapper */}
      <div id='fileViewWrapper'>
        <h2>File View</h2>
        {selectedfile ? <>
          <h3>{selectedfile.name}</h3>
          <button id='fileSaveButton' onClick={handleFileContentSave}>Save</button>
          <textarea className='fileViewTextArea'
          value={fileContent} 
          onChange={(e) => setFileContent(e.target.value)}
          />
        </> : <div>Select a file to view its content</div>
        }
      </div>

     </div>
    </>
  )
}



export default App