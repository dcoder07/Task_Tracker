"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getUsers, getUserByEmail, updateUser, deleteUser, hasPermission } from "@/db/actions";
import { MdPeople, MdAdminPanelSettings, MdPersonAdd, MdDelete, MdEdit } from "react-icons/md";

const ROLE_COLORS = {
  admin: "bg-red-500",
  manager: "bg-blue-500",
  developer: "bg-green-500",
  viewer: "bg-gray-500",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ role: "", is_active: true });

  useEffect(() => {
    const checkPermissions = async () => {
      if (user?.email) {
        const userData = await getUserByEmail(user.email);
        if (userData) {
          const adminAccess = await hasPermission(userData.id, "manage_users");
          setHasAdminAccess(adminAccess || userData.role === "admin");
        }
      }
    };

    const loadUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
    loadUsers();
  }, [user]);

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({ role: user.role, is_active: user.is_active });
  };

  const handleSaveUser = async (userId) => {
    try {
      await updateUser(userId, editForm);
      setUsers(users.map(u => u.id === userId ? { ...u, ...editForm } : u));
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (!hasAdminAccess) {
    return (
      <div className='max-w-screen-xl mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-500 mb-4'>Access Denied</h1>
          <p className='text-slate-300'>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='max-w-screen-xl mx-auto px-4 py-8'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='max-w-screen-2xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'>
            Admin Dashboard
          </h1>
          <p className='text-slate-400 mt-2'>Manage users, roles, and permissions</p>
        </div>
        <Link
          href="/admin/users/new"
          className='primary-btn px-4 py-2 rounded-lg flex items-center gap-2'
        >
          <MdPersonAdd size={20} />
          Add User
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='glass-card p-6 rounded-2xl border border-white/10'>
          <div className='flex items-center gap-3'>
            <MdPeople className='text-cyan-400' size={24} />
            <div>
              <p className='text-2xl font-bold text-white'>{users.length}</p>
              <p className='text-slate-400'>Total Users</p>
            </div>
          </div>
        </div>
        <div className='glass-card p-6 rounded-2xl border border-white/10'>
          <div className='flex items-center gap-3'>
            <MdAdminPanelSettings className='text-blue-400' size={24} />
            <div>
              <p className='text-2xl font-bold text-white'>
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className='text-slate-400'>Admins</p>
            </div>
          </div>
        </div>
        <div className='glass-card p-6 rounded-2xl border border-white/10'>
          <div className='flex items-center gap-3'>
            <MdPeople className='text-green-400' size={24} />
            <div>
              <p className='text-2xl font-bold text-white'>
                {users.filter(u => u.is_active).length}
              </p>
              <p className='text-slate-400'>Active Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className='glass-card rounded-2xl border border-white/10 overflow-hidden'>
        <div className='p-6 border-b border-white/10'>
          <h2 className='text-xl font-bold text-white'>User Management</h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-white/5'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>
                  User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>
                  Created
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/10'>
              {users.map((user) => (
                <tr key={user.id} className='hover:bg-white/5'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center'>
                          <span className='text-white font-semibold'>
                            {(user.first_name?.[0] || '') + (user.last_name?.[0] || '') || user.email[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-white'>
                          {user.first_name} {user.last_name}
                        </div>
                        <div className='text-sm text-slate-400'>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {editingUser === user.id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className='glass-panel px-3 py-1 rounded text-sm'
                      >
                        <option value="viewer">Viewer</option>
                        <option value="developer">Developer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ROLE_COLORS[user.role]} text-white`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {editingUser === user.id ? (
                      <select
                        value={editForm.is_active}
                        onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'true' })}
                        className='glass-panel px-3 py-1 rounded text-sm'
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-400'>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    {editingUser === user.id ? (
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => handleSaveUser(user.id)}
                          className='text-green-400 hover:text-green-300'
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className='text-slate-400 hover:text-slate-300'
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => handleEditUser(user)}
                          className='text-blue-400 hover:text-blue-300'
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className='text-red-400 hover:text-red-300'
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}