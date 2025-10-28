import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteNode, renameNode } from '../features/filesystem/fileSystemSlice';
import editIcon from '../assets/edit.png'

const FileTree = ({nodes, onSelect}) => {

    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState({});
    const [renamingId, setRenamingId] = useState(null);
    const [newName, setNewName] = useState(""); 

    const handleExpand = (nodeId) => {
        setExpanded(prev => ({ ...prev, [nodeId]: !prev[nodeId] }) );
    }
    const handleRename = (nodeId, name) => {
        setRenamingId(nodeId);
        setNewName(name);
    }

    const handleRenameSubmit = (nodeId) => {
        if(newName.trim()){
            dispatch(renameNode({nodeId, newName}));
            setRenamingId(null);
        }
    }

    const handleDelete = (nodeId) => {
        dispatch(deleteNode({nodeId}));
    }

    return (
        <>
        <ul>
            {nodes.map(node => (
                <>
                <li key={node.id}>
                    <span className='fileItem' onClick={() => node.type === 'file' ? onSelect(node) : handleExpand(node.id) }>
                        {node.type === 'folder' ? (
                            <button className='iconNameButton'>
                            {expanded[node.id] ? '📂' : '📁'}
                            </button>
                        ) : (
                            <span className='iconNameButton' role='img'>📄</span>
                        )}
                        {renamingId === node.id ? 
                        (<>
                            <input value={newName} 
                            onChange={(e) => setNewName(e.target.value)} 
                            onBlur={() => handleRenameSubmit(node.id)}
                            autoFocus
                            />
                        </>)
                        :
                        (<>
                            <span style={{cursor: "pointer"}}>
                                {node.name}
                            </span>
                        </>)}
                        <div className='fileActionWrap'>
                        <button className='iconNameButton' onClick={() => handleRename(node.id, node.name)} >
                            <img src={editIcon} alt="edit" className='iconImage' />
                        </button>
                        <button className='iconNameButton' onClick={() => handleDelete(node.id)} >
                            ⛔
                        </button>  
                        </div>                      
                    </span>

                    {node.children && expanded[node.id] && (
                        <>
                            <FileTree nodes={node.children} onSelect={onSelect} />
                        </>
                    )}

                </li>
                </>
            ))}
        </ul>
        </>
    );
}

export default FileTree;
