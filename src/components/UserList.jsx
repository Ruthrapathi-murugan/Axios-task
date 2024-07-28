import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const handleSave = async (user) => {
        try {
            if (user.id) {
                await axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, user);
                setUsers(users.map(u => (u.id === user.id ? user : u)));
            } else {
                const response = await axios.post('https://jsonplaceholder.typicode.com/users', user);
                setUsers([...users, response.data]);
            }
            setEditingUser(null);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    return (
        <div>
            <h1>User List</h1>
            <UserForm user={editingUser} onSave={handleSave} />
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
