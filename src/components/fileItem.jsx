import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const FileItem = ({node, index, moveItem, parentId, onSelect, onRename, onDelete}) => {

    const [{isDragging}, drag] = useDrag({
        type: 'FILE_ITEM',
        item: {index},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    });

    const [, drop] = useDrop({
        accept: 'FILE_ITEM',
        hover: (item) => {
            if(item.index !== index){
                moveItem(item.index, index, parentId);
                item.index = index;
            }
        }
    });

    return (
                <li key={node.id}
                 ref={nodeRef => drag(drop(nodeRef))}
                 style={{
                    opacity: isDragging ? .5 : 1,
                    background: "#f9f9f9",
                    cursor: "move"
                 }}
                >
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
                        <button className='iconNameButton' onClick={() => onRename(node)} >
                            <img src={editIcon} alt="edit" className='iconImage' />
                        </button>
                        <button className='iconNameButton' onClick={() => onDelete(node.id)} >
                            ⛔
                        </button>  
                        </div>                      
                    </span>

                   

                </li>
    );
}

export default FileItem;
