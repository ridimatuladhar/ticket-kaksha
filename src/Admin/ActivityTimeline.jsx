import { useEffect, useState } from "react";
import { FiClock, FiInfo } from "react-icons/fi";

const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTimeDisplay = (timestamp) => {
    if (!timestamp) return 'just now';

    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return activityDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
       //const response = await fetch("http://localhost/TICKETKAKSHA/Backend/admin/get_activity_log.php");
        const response = await fetch("https://ticketkaksha.com.np/Backend/admin/get_activity_log.php");
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data.success) {
          setActivities(data.activities);
        } else {
          throw new Error(data.message || 'Failed to fetch activities');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActionColor = (action) => {
    const actionType = action.toLowerCase();
    if (actionType.includes('create') || actionType.includes('added')) return 'bg-green-100 text-green-800';
    if (actionType.includes('update') || actionType.includes('edit')) return 'bg-blue-100 text-blue-800';
    if (actionType.includes('delete') || actionType.includes('remove')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md w-full">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2E6FB7]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md w-full">
        <div className="flex items-center justify-center py-8 text-red-500 text-center text-sm sm:text-base">
          <FiInfo className="mr-2" />
          <p>Error loading activities: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl w-full">
      <h2 className="text-lg sm:text-xl font-semibold text-[#2E6FB7] mb-4">Recent Activity Log</h2>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
          <p>No activities found</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block"></div>

          <ul className="space-y-6">
            {activities.map((activity, index) => (
              <li key={index} className="relative pl-8 sm:pl-12">
                {/* Dot on the timeline */}
                <div className={`absolute left-2 sm:left-4 top-2 w-3 h-3 rounded-full ${getActionColor(activity.action).replace('text-', 'bg-')}`}></div>

                {/* Activity Card */}
                <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                      <p className="mt-1 text-sm text-gray-700">{activity.details}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0">
                      <FiClock className="mr-1" />
                      <span>{formatTimeDisplay(activity.created_at)}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
