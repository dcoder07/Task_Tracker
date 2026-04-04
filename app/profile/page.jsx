"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserByEmail, updateUser } from "@/db/actions";
import { MdEdit, MdCheck, MdClose, MdEmail, MdPerson } from "react-icons/md";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.email) {
        try {
          const data = await getUserByEmail(user.email);
          if (data) {
            setUserData(data);
            setFormData({
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              email: data.email,
            });
          }
        } catch (error) {
          console.error("Failed to load user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser(userData.id, formData);
      setUserData({ ...userData, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      email: userData.email,
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className='max-w-screen-xl mx-auto px-4 py-8'>
        <div className='text-center'>Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='max-w-screen-xl mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-500 mb-4'>Profile Not Found</h1>
          <p className='text-slate-300'>Your profile data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-screen-xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'>
          My Profile
        </h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className='primary-btn px-4 py-2 rounded-lg flex items-center gap-2'
          >
            <MdEdit size={20} />
            Edit Profile
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Profile Card */}
        <div className='lg:col-span-1'>
          <div className='glass-card p-6 rounded-2xl border border-white/10 text-center'>
            <div className='mb-6'>
              {userData.avatar_url ? (
                <Image
                  src={userData.avatar_url}
                  alt="Profile"
                  width={120}
                  height={120}
                  className='rounded-full mx-auto border-4 border-cyan-400/30'
                />
              ) : (
                <div className='w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center mx-auto border-4 border-cyan-400/30'>
                  <span className='text-4xl text-white font-bold'>
                    {(userData.first_name?.[0] || '') + (userData.last_name?.[0] || '') || userData.email[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <h2 className='text-xl font-bold text-white mb-2'>
              {userData.first_name} {userData.last_name}
            </h2>
            <p className='text-slate-400 mb-4'>{userData.email}</p>
            <div className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white'>
              {userData.role}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className='lg:col-span-2'>
          <div className='glass-card p-6 rounded-2xl border border-white/10'>
            <h3 className='text-xl font-bold text-white mb-6'>Profile Information</h3>

            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-slate-400 mb-2'>
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type='text'
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className='w-full glass-panel px-4 py-3 rounded-lg text-white border border-cyan-400/30 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
                    />
                  ) : (
                    <div className='flex items-center gap-3 p-3 glass-panel rounded-lg'>
                      <MdPerson className='text-cyan-400' size={20} />
                      <span className='text-white'>{userData.first_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-400 mb-2'>
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type='text'
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className='w-full glass-panel px-4 py-3 rounded-lg text-white border border-cyan-400/30 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
                    />
                  ) : (
                    <div className='flex items-center gap-3 p-3 glass-panel rounded-lg'>
                      <MdPerson className='text-cyan-400' size={20} />
                      <span className='text-white'>{userData.last_name || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-400 mb-2'>
                  Email Address
                </label>
                <div className='flex items-center gap-3 p-3 glass-panel rounded-lg'>
                  <MdEmail className='text-cyan-400' size={20} />
                  <span className='text-white'>{userData.email}</span>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-slate-400 mb-2'>
                    Role
                  </label>
                  <div className='flex items-center gap-3 p-3 glass-panel rounded-lg'>
                    <MdPerson className='text-cyan-400' size={20} />
                    <span className='text-white capitalize'>{userData.role}</span>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-400 mb-2'>
                    Status
                  </label>
                  <div className='flex items-center gap-3 p-3 glass-panel rounded-lg'>
                    <div className={`w-3 h-3 rounded-full ${userData.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className='text-white'>{userData.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-400 mb-2'>
                  Member Since
                </label>
                <div className='flex items-center gap-3 p-3 glass-panel rounded-lg'>
                  <span className='text-white'>
                    {new Date(userData.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {editing && (
              <div className='flex gap-4 mt-6 pt-6 border-t border-white/10'>
                <button
                  onClick={handleSave}
                  className='bg-emerald-500/20 text-emerald-300 px-6 py-2 rounded-lg hover:bg-emerald-500/30 transition font-semibold flex items-center gap-2'
                >
                  <MdCheck size={20} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className='bg-red-500/20 text-red-300 px-6 py-2 rounded-lg hover:bg-red-500/30 transition font-semibold flex items-center gap-2'
                >
                  <MdClose size={20} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}