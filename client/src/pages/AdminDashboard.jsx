import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  ShieldCheck, Users, BookOpen, Layers, PlusCircle, 
  Trash2, Award, Sparkles, CheckCircle2, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Thêm từ vựng mới
  const [newWord, setNewWord] = useState('');
  const [newReading, setNewReading] = useState('');
  const [newRomaji, setNewRomaji] = useState('');
  const [newLevel, setNewLevel] = useState('N5');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExampleJa, setNewExampleJa] = useState('');
  const [newExampleVi, setNewExampleVi] = useState('');
  const [submittingVocab, setSubmittingVocab] = useState(false);
  const [vocabSuccessMsg, setVocabSuccessMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosClient.get('/admin/stats'),
        axiosClient.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVocab = async (e) => {
    e.preventDefault();
    setSubmittingVocab(true);
    setVocabSuccessMsg('');

    try {
      const payload = {
        word: newWord.trim(),
        reading: newReading.trim(),
        romaji: newRomaji.trim() || newWord.trim(),
        jlptLevel: newLevel,
        meanings: [newMeaning.trim()],
        examples: newExampleJa.trim() ? [{
          japanese: newExampleJa.trim(),
          furigana: newExampleJa.trim(),
          vietnamese: newExampleVi.trim()
        }] : []
      };

      await axiosClient.post('/admin/vocab', payload);
      setVocabSuccessMsg(`Đã thêm thành công từ "${newWord}" vào kho giáo trình ${newLevel}!`);
      setNewWord('');
      setNewReading('');
      setNewRomaji('');
      setNewMeaning('');
      setNewExampleJa('');
      setNewExampleVi('');
      fetchAdminData();
    } catch (err) {
      alert('Lỗi thêm từ vựng: ' + err.message);
    } finally {
      setSubmittingVocab(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của "${userName}" không?`)) return;

    try {
      await axiosClient.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      fetchAdminData();
    } catch (err) {
      alert('Lỗi xóa người dùng: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 dark:text-slate-400 text-sm">
        Đang tải bảng điều khiển Quản trị viên...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-amber-300 border border-white/10">
            <ShieldCheck size={16} /> Quyền Quản Trị Tối Cao (Super Admin)
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Admin Control Center 🛡️
          </h1>
          <p className="text-xs text-indigo-100">
            Chào mừng <strong>{user?.name}</strong>. Tại đây bạn có toàn quyền quản lý cơ sở dữ liệu JLPT, danh sách tài khoản học viên và biên soạn giáo trình.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-right">
          <span className="text-[11px] text-indigo-200 block">Tài khoản hiện tại:</span>
          <span className="font-bold text-sm text-white">{user?.email}</span>
        </div>
      </div>

      {/* System Statistics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats?.totalUsers || 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Tổng Học Viên Đăng Ký
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats?.totalVocab?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Tổng Từ Vựng N5 - N3
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats?.totalKanji || 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Tổng Chữ Hán (Kanji)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats?.totalProgress?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Lượt Ôn Tập FSRS Đã Lưu
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: User Management Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                Quản Lý Học Viên ({users.length})
              </h2>
              <p className="text-xs text-slate-500">Danh sách các tài khoản người dùng đã đăng ký trên hệ thống</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold text-xs">
                <tr>
                  <th className="py-3 px-4">Học viên</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Quyền</th>
                  <th className="py-3 px-4">Mục tiêu</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const isCurrent = u._id === user?._id;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {u.name}
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                            Bạn
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {u.role === 'admin' ? '🛡️ Admin' : 'Học viên'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {u.targetLevel || 'N5'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-amber-500 text-xs">
                        🔥 {u.streak || 0}d
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Xóa người dùng"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Add Custom Vocabulary Form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle size={18} className="text-emerald-600" />
              Thêm Từ Vựng Vào Giáo Trình
            </h2>
            <p className="text-xs text-slate-500">Bổ sung từ mới trực tiếp vào MongoDB</p>
          </div>

          {vocabSuccessMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} /> {vocabSuccessMsg}
            </div>
          )}

          <form onSubmit={handleAddVocab} className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div>
              <label className="block mb-1">Từ vựng (Kanji hoặc Kana):</label>
              <input
                type="text"
                required
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="VD: 桜 hoặc さくら"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-japanese text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Cách đọc (Hiragana):</label>
                <input
                  type="text"
                  required
                  value={newReading}
                  onChange={(e) => setNewReading(e.target.value)}
                  placeholder="VD: さくら"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-japanese text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1">Cấp độ JLPT:</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-indigo-600"
                >
                  <option value="N5">N5 (Sơ cấp)</option>
                  <option value="N4">N4 (Sơ trung)</option>
                  <option value="N3">N3 (Trung cấp)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Romaji:</label>
              <input
                type="text"
                value={newRomaji}
                onChange={(e) => setNewRomaji(e.target.value)}
                placeholder="VD: sakura"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block mb-1">Nghĩa tiếng Việt:</label>
              <input
                type="text"
                required
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="VD: Hoa anh đào"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <label className="block">Câu ví dụ (Tùy chọn):</label>
              <input
                type="text"
                value={newExampleJa}
                onChange={(e) => setNewExampleJa(e.target.value)}
                placeholder="Câu tiếng Nhật: 春に桜が咲きます。"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-japanese text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newExampleVi}
                onChange={(e) => setNewExampleVi(e.target.value)}
                placeholder="Nghĩa câu: Hoa anh đào nở vào mùa xuân."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submittingVocab}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
            >
              {submittingVocab ? 'Đang thêm vào Database...' : '+ Thêm Từ Vựng Ngay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
