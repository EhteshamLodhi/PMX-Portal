// permissions.js - Defines Role-Based Access Control logic

const Permissions = {
  isAdmin: (profile) => profile?.role === 'admin',
  isManager: (profile) => ['manager', 'admin'].includes(profile?.role),
  
  // Can edit another user in the tracker
  canEditTrackerUser: async (currentUserProfile, targetUserName) => {
    if (Permissions.isAdmin(currentUserProfile)) return true;
    if (currentUserProfile?.role === 'manager') {
       // Fetch target user's manager ID to see if it matches current user
       const { data, error } = await window.db
         .from('profiles')
         .select('manager_id')
         .eq('full_name', targetUserName)
         .maybeSingle();
       if (error || !data) return false;
       return data.manager_id === currentUserProfile.id;
    }
    return false; // Engineer cannot edit others
  },
  
  canApproveLeave: async (currentUserProfile, reqUserId) => {
    if (Permissions.isAdmin(currentUserProfile)) return true;
    if (currentUserProfile?.role === 'manager') {
       const { data } = await window.db.from('profiles').select('manager_id').eq('id', reqUserId).maybeSingle();
       return data?.manager_id === currentUserProfile.id;
    }
    return false;
  }
};

window.Permissions = Permissions;
