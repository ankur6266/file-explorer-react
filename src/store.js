import { configureStore } from "@reduxjs/toolkit";
import fileSystemReducer from "./features/filesystem/fileSystemSlice";


export default configureStore({
        reducer: {
        fileSystem: fileSystemReducer
    }
});