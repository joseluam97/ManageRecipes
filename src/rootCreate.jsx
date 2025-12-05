// src/store/rootCreate.jsx

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 1. Configuración de persistencia
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userComponent'],
};

// 2. Envolver el rootReducer con la configuración de persistencia
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Crear la store usando el reducer persistente
export const store = configureStore({ 
    reducer: persistedReducer,
    // Middleware necesario para evitar errores de serialización de redux-persist
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH'],
            },
        }),
});

// 4. Crear el persistor
export const persistor = persistStore(store);
