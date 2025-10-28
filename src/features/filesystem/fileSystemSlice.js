import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const initialState = {
    nodes: [
        {
            id: 'root',
            name: 'Root',
            type: 'folder',
            children: [
                {
                    id: nanoid(),
                    name: 'Documents',
                    type: 'folder',
                    children: [
                        {
                            id: nanoid(),
                            name: 'Resume.pdf',
                            type: 'file',
                            content: 'This file contains my resume data'
                        }
                    ]
                },
                {
                    id: nanoid(),
                    name: 'Photo.png',
                    type: 'file',
                    content: 'This file contains image data'
                }
            ]
        }
    ]
};

const fileSystemSlice = createSlice({
    name: 'fileSystem',
    initialState,
    reducers: {
        // add reducer
        addNode: (state, action) => {
            const {parentId, name, type} = action.payload;
            function recursiveAdd(nodes) {
                nodes.forEach(node => {
                    if(node.id === parentId && node.type === 'folder') {
                        node.children = node.children || [];
                        node.children.push({
                            id: nanoid(),
                            name,
                            type,
                            ...(type === 'file' ? { content: '' } : { children: [] })
                        });
                    }else if(node.children){
                        recursiveAdd(node.children);
                    }
                });
            }
            recursiveAdd(state.nodes);
        },
        // delete reduceer
        deleteNode: (state, action) => {
            const {nodeId} = action.payload;
            function recursiveDelete(nodes) {
                return nodes.filter(node => {
                    if(node.id === nodeId) return false;
                    if(node.children) {
                        node.children = recursiveDelete(node.children);
                    }
                    return true;
                });
            }
            state.nodes = recursiveDelete(state.nodes);
        },

        renameNode: (state, action) => {
            const {nodeId, newName} = action.payload;
            function recursiveRename(nodes) {
                nodes.forEach(node => {
                    if(node.id === nodeId) {
                        node.name = newName;
                    }else if(node.children){
                        recursiveRename(node.children);
                    }
                });
            }
            recursiveRename(state.nodes);
        },

        // update file content reducer
        updateFileContent: (state, action) => {
            const {nodeId, newContent} = action.payload;
            function recursiveUpdate(nodes) {
                nodes.forEach(node => {
                    if(node.id === nodeId && node.type === 'file') {
                        node.content = newContent;
                    }else if(node.children){
                        recursiveUpdate(node.children);
                    }
                });
            }
            recursiveUpdate(state.nodes);
        },
    }
});

export const { addNode, deleteNode, renameNode, updateFileContent } = fileSystemSlice.actions;
export default fileSystemSlice.reducer;