
'use client';

import CaptureInterface from './components/CaptureInterface';
import TaskListView from './components/TaskListView';
import TaskDetailView from './components/TaskDetailView';
import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import { useSession } from './components/SessionProvider';
import { supabase } from './utils/supabaseClient'; // Ensure supabaseClient is correctly configured

export default function Home() {
  const [refreshTasksTrigger, setRefreshTasksTrigger] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null); // State to hold selected task for detail view
  const { session, isLoading } = useSession();

  const handleTasksCaptured = () => {
    setRefreshTasksTrigger(prev => prev + 1);
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      console.log('Signed out successfully.');
      setSelectedTask(null); // Clear selected task on logout
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Loading authentication...</p></div>;
  }

  if (!session) {
    return <AuthForm onSignIn={handleTasksCaptured} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Pixel Task Manager</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CaptureInterface onTasksCaptured={handleTasksCaptured} session={session} />
        <TaskListView refreshTrigger={refreshTasksTrigger} onTaskSelect={handleTaskSelect} session={session} />
        {selectedTask && <TaskDetailView task={selectedTask} session={session} />}
        {!selectedTask && <div className="md:col-span-1 lg:col-span-1 bg-white p-6 rounded-lg shadow-md"><p className="text-gray-600">Select a task to view details</p></div>}
      </div>
    </div>
  );
}
