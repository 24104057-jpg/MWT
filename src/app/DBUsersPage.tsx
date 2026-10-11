import { useState, useEffect } from "react";
import { UserCheck, Shield, Plus, CheckCircle, Mail, User, ShieldAlert } from "lucide-react";

export default function DBUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", role: "student" });
  const [toast, setToast] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setToast(`${formData.role} added successfully!`);
        setFormData({ name: "", email: "", role: "student" });
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/users/verify/${id}`, { method: "PUT" });
      if (res.ok) {
        setToast("User verified successfully!");
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to verify user", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Database Users Verification
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and verify students and tutors connected to MongoDB.</p>
        </div>
      </div>

      {toast && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {toast}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add User Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add New User
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="John Doe" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="john@example.com" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95 text-sm">
                <Plus className="w-4 h-4" /> Add User
              </button>
            </form>
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg p-6 min-h-[400px]">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              Registered Users
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>No users found in the database.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {users.map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${user.role === 'tutor' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          {user.name}
                          {user.isVerified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </h3>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${user.role === 'tutor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    {!user.isVerified ? (
                      <button 
                        onClick={() => handleVerify(user._id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold rounded-lg text-xs transition-colors border border-emerald-200"
                      >
                        Verify Now
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-50 text-slate-400 font-semibold rounded-lg text-xs border border-slate-200">
                        Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
