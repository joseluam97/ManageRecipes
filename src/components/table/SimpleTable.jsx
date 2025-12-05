import React, { useEffect, useState } from 'react';
import {
    TextField,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Box,
    Typography,
    Tooltip
} from '@mui/material';
import { Edit, Delete, Visibility, Check, Close, Add } from '@mui/icons-material';
import { useDispatch } from 'react-redux';

const SimpleTable = ({ title_element, list_element, createNewElement, editElement, deleteElement, getListRecipesIncludes, showListRecipesIncludes }) => {
    const dispatch = useDispatch();
    const [filteredList, setFilteredList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAsc, setSortAsc] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [addingMode, setAddingMode] = useState(false);
    const [newElementName, setNewElementName] = useState('');

    useEffect(() => {

    }, []);

    useEffect(() => {
        filterList();
    }, [list_element, searchTerm]);

    const filterList = () => {
        const filtered = list_element.filter((ing) =>
            ing.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredList(filtered);
    };

    const toggleSort = () => {
        const sorted = [...filteredList].sort((a, b) =>
            sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
        setFilteredList(sorted);
        setSortAsc(!sortAsc);
    };

    const handleEdit = (id, name) => {
        setEditingId(id);
        setEditedName(name);
    };

    const handleSave = () => {
        console.log(`Save: ${editedName} to ID: ${editingId}`);
        editElement(editingId, editedName);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedName('');
    };

    const handleShowRecipes = (elementId) => {
        console.log(`Show recipes for ingredient ID: ${elementId}`);
        getListRecipesIncludes(elementId)
    };

    const handleDelete = (elementId) => {
        console.log(`Delete ${title_element} ID: ${elementId}`);
        deleteElement(elementId)
    };

    const handleStartAdd = () => {
        setAddingMode(true);
        setSearchTerm('');
        setNewElementName('');
    };

    const handleSaveNew = () => {
        console.log('Save new element:', newElementName);
        createNewElement(newElementName);
        setAddingMode(false);
    };

    const handleCancelNew = () => {
        setAddingMode(false);
        setNewElementName('');
    };

    return (
        <Box p={3} sx={{ backgroundColor: '#f9f9f9', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    label={addingMode ? 'New ' + title_element : 'Search for ' + title_element}
                    variant="outlined"
                    fullWidth
                    value={addingMode ? newElementName : searchTerm}
                    onChange={(e) => {
                        addingMode
                            ? setNewElementName(e.target.value)
                            : setSearchTerm(e.target.value);
                    }}
                    sx={{ mr: 2 }}
                />
                {addingMode ? (
                    <>
                        <Tooltip title={"Save new " + title_element}>
                            <IconButton onClick={handleSaveNew} color="success">
                                <Check />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                            <IconButton onClick={handleCancelNew} color="error">
                                <Close />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <Tooltip title={"Add " + title_element}>
                        <IconButton onClick={handleStartAdd} color="primary">
                            <Add />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Table>
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                    <TableRow>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                            <TableSortLabel
                                active
                                direction={sortAsc ? 'asc' : 'desc'}
                                onClick={toggleSort}
                                sx={{
                                    '& .MuiTableSortLabel-icon': {
                                        color: '#FFFFFF !important',
                                    },
                                    '&.MuiTableSortLabel-root': {
                                        color: '#FFFFFF',
                                    }
                                }}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredList.map((element) => (
                        <TableRow key={element.id} sx={{ backgroundColor: editingId === element.id ? '#fff9c4' : 'inherit' }}>
                            <TableCell>{element.id}</TableCell>
                            <TableCell>
                                {editingId === element.id ? (
                                    <TextField
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                ) : (
                                    element.name
                                )}
                            </TableCell>
                            <TableCell align="right">
                                {editingId === element.id ? (
                                    <>
                                        <Tooltip title="Save">
                                            <IconButton onClick={handleSave} color="success">
                                                <Check />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel">
                                            <IconButton onClick={handleCancel} color="error">
                                                <Close />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEdit(element.id, element.name)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        {showListRecipesIncludes == true ? (
                                            <Tooltip title="See recipes">
                                                <IconButton onClick={() => handleShowRecipes(element.id)}>
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (<></>)}
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(element.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {filteredList.length === 0 && !addingMode && (
                <Typography variant="body2" color="text.secondary" mt={2}>
                    {"No " + title_element + " found."}
                </Typography>
            )}
        </Box>
    );
};

export default SimpleTable;
