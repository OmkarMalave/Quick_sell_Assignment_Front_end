import React, { useState, useEffect } from 'react';
import { ChevronDown, MoreHorizontal, Plus, Search } from 'lucide-react';

// Predefined columns from previous discussions
const initialColumns = [
  {
    title: "To Do",
    tasks: [
      { id: "CAM-4", title: "Add Multi-Language Support", assignee: "User1", type: "Feature Request", priority: 3 },
      { id: "CAM-2", title: "Implement Email Notification System", assignee: "User2", type: "Feature Request", priority: 2 },
      { id: "CAM-1", title: "Update User Profile Page UI", assignee: "User3", type: "Feature Request", priority: 1 },
    ],
  },
  {
    title: "In Progress",
    tasks: [
      { id: "CAM-3", title: "Optimize Database Queries for Performance", assignee: "User4", type: "Feature Request", priority: 4 },
    ],
  },
  {
    title: "Done",
    tasks: [
      { id: "CAM-6", title: "Enhance Search Functionality", assignee: "User5", type: "Feature Request", priority: 3 },
      { id: "CAM-7", title: "Integrate Third-Party Payment Gateway", assignee: "User6", type: "Feature Request", priority: 2 },
      { id: "CAM-11", title: "Conduct Security Vulnerability Assessment", assignee: "User7", type: "Feature Request", priority: 1 },
      { id: "CAM-10", title: "Upgrade Server Infrastructure", assignee: "User8", type: "Feature Request", priority: 0 },
      { id: "CAM-9", title: "Implement Role-Based Access Control (RBAC)", assignee: "User9", type: "Feature Request", priority: 4 },
    ],
  },
  {
    title: "Canceled",
    tasks: [],
  },
];

// Priority labels
const priorityLabels = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "No priority",
};

export default function TaskBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState('status'); // Default group by status
  const [sortBy, setSortBy] = useState('title'); // Default sort by title

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setColumns(data);
        } else {
          setColumns(initialColumns); // Fallback to predefined data
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setColumns(initialColumns); // Fallback to predefined data
      }
    };

    fetchData();
  }, []);

  // Add a new task to the specified column
  const handleAddTask = (columnTitle) => {
    const newTask = {
      id: `CAM-${Math.floor(Math.random() * 1000)}`,
      title: "New Task",
      assignee: "UserX", // Placeholder for assignee
      type: "Feature Request",
      priority: Math.floor(Math.random() * 5), // Random priority for demonstration
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.title === columnTitle
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  };

  // Group tasks based on the selected criterion
  const groupedColumns = () => {
    const grouped = {};
    
    columns.forEach(column => {
      column.tasks.forEach(task => {
        let key;
        if (groupBy === 'status') {
          key = column.title;
        } else if (groupBy === 'user') {
          key = task.assignee; // Adjust this if assignee is an object
        } else if (groupBy === 'priority') {
          key = priorityLabels[task.priority];
        }

        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(task);
      });
    });

    return grouped;
  };

  // Sort tasks based on the selected criterion
  const sortedTasks = (tasks) => {
    if (sortBy === 'priority') {
      return tasks.sort((a, b) => b.priority - a.priority);
    } else if (sortBy === 'title') {
      return tasks.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tasks;
  };

  const filteredColumns = groupedColumns();

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-600 flex items-center">
            Display <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          <div className="relative">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-gray-600"
            >
              <option value="status">Group by Status</option>
              <option value="user">Group by User</option>
              <option value="priority">Group by Priority</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-gray-600"
            >
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-64 px-3 py-2 border border-gray-300 rounded-md pl-10"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(filteredColumns).map(([columnTitle, tasks]) => (
          <div key={columnTitle} className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-medium flex items-center">
                {columnTitle}
                <span className={`ml-2 w-6 h-6 rounded-full ${getIconColor(tasks.length)} flex items-center justify-center text-xs`}>
                  {tasks.length}
                </span>
              </h3>
              <button
                onClick={() => handleAddTask(columnTitle)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {sortedTasks(tasks).filter(task => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(task => (
                <div key={task.id} className="p-2 border rounded-md shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{task.id}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">U</span> {/* Replace 'U' with user initials if needed */}
                    </div>
                  </div>
                  <p className="text-sm">{task.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{priorityLabels[task.priority]}</span>
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to determine icon color based on task count
function getIconColor(count) {
  if (count > 0) {
    return "bg-green-400"; // Example color for non-empty column
  }
  return "bg-gray-200"; // Example color for empty column
}
