import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  ShieldCheck, Users, BookOpen, Layers, PlusCircle, 
  Trash2, Award, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Database, RefreshCw, Activity, ExternalLink, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [seedStatusMsg, setSeedStatusMsg] = useState('');

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

  const handleReSeedCorpus = async () => {
    if (!window.confirm('Bạn có muốn làm mới và đồng bộ lại toàn bộ 2.963 từ vựng và 640 Kanji từ OpenJLPT không?')) return;
    setSeedingLoading(true);
    setSeedStatusMsg('');
    try {
      const res = await axiosClient.get('/seed');
      setSeedStatusMsg(res.message || 'Đã đồng bộ thành công bộ ngữ liệu!');
      fetchAdminData();
    } catch (err) {
      setSeedStatusMsg('Lỗi khi nạp dữ liệu: ' + err.message);
    } finally {
      setSeedingLoading(false);
    }
  };

  const handleReSeedGrammar = async () => {
    if (!window.confirm('Bạn có muốn nạp lại bộ cấu trúc Ngữ pháp mẫu N5-N3 không?')) return;
    setSeedingLoading(true);
    setSeedStatusMsg('');
    try {
      const res = await axiosClient.post('/grammar/seed');
      setSeedStatusMsg(res.message || 'Đã nạp lại thành công dữ liệu ngữ pháp!');
      fetchAdminData();
    } catch (err) {
      setSeedStatusMsg('Lỗi khi nạp ngữ pháp: ' + err.message);
    } finally {
      setSeedingLoading(false);
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
    <div className="max-w-[1720px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Background icon glow */}
        <ShieldCheck size={260} className="absolute -right-10 -bottom-16 text-white/5 pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-amber-300 border border-white/15">
            <ShieldCheck size={16} /> Quyền Quản Trị Tối Cao (Super Admin)
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Admin Control Center 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            Chào mừng <strong className="text-white underline">{user?.name}</strong>. Bảng điều khiển quản lý toàn diện cơ sở dữ liệu JLPT, tài khoản người học và hệ thống giáo trình 4 kỹ năng.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 text-left sm:text-right relative z-10 self-stretch sm:self-auto">
          <span className="text-[11px] text-indigo-200 block font-medium">Tài khoản quản trị viên:</span>
          <span className="font-bold text-sm sm:text-base text-white font-mono break-all">{user?.email}</span>
        </div>
      </div>

      {/* System Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
              Tổng Học Viên
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.totalUsers || 0}
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              Đang hoạt động trên hệ thống
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Users size={26} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
              Tổng Từ Vựng N5 - N3
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.totalVocab?.toLocaleString() || 0}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Kho từ vựng OpenJLPT đầy đủ
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <BookOpen size={26} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
              Tổng Chữ Hán (Kanji)
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.totalKanji || 0}
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
              Tích hợp KanjiVG nét vẽ
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Layers size={26} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
              Lượt Ôn Tập FSRS
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.totalProgress?.toLocaleString() || 0}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              Lưu trữ tiến độ học vĩnh viễn
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Award size={26} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Users Table & System Tools (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* User Management Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  Quản Lý Học Viên ({users.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Danh sách các tài khoản người dùng đã đăng ký trên hệ thống</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold text-xs">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Học viên</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Quyền</th>
                    <th className="py-3 px-4">Mục tiêu</th>
                    <th className="py-3 px-4 text-center">Streak</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Thao tác</th>
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
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                              Bạn
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
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

          {/* System Control & Maintenance Tools */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database size={18} className="text-indigo-600" />
                  Quản Trị Cơ Sở Dữ Liệu & Đồng Bộ (Database Tools)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Các công cụ kiểm tra và nạp dữ liệu offline tự động</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                MongoDB Online
              </div>
            </div>

            {seedStatusMsg && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="text-indigo-500 flex-shrink-0" />
                <span>{seedStatusMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleReSeedCorpus}
                disabled={seedingLoading}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all disabled:opacity-50"
              >
                <RefreshCw size={15} className={seedingLoading ? 'animate-spin text-indigo-600' : 'text-slate-400'} />
                <span>Đồng Bộ Lại OpenJLPT (2.963 Từ)</span>
              </button>

              <button
                onClick={handleReSeedGrammar}
                disabled={seedingLoading}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all disabled:opacity-50"
              >
                <RefreshCw size={15} className={seedingLoading ? 'animate-spin text-emerald-600' : 'text-slate-400'} />
                <span>Nạp Lại Ngữ Pháp N5-N3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Add Custom Vocabulary Form (5 cols) */}
        <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle size={20} className="text-emerald-600" />
              Thêm Từ Vựng Vào Giáo Trình
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Bổ sung từ mới kèm ví dụ trực tiếp vào MongoDB</p>
          </div>

          {vocabSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /> 
              <span>{vocabSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddVocab} className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div>
              <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200">
                Từ vựng (Kanji hoặc Kana): <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="VD: 桜 hoặc さくら"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-japanese text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200">
                  Cách đọc (Hiragana): <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newReading}
                  onChange={(e) => setNewReading(e.target.value)}
                  placeholder="VD: さくら"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-japanese text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200">
                  Cấp độ JLPT: <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-indigo-600 dark:text-indigo-400"
                >
                  <option value="N5">N5 (Sơ cấp)</option>
                  <option value="N4">N4 (Sơ trung)</option>
                  <option value="N3">N3 (Trung cấp)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200">
                Phiên âm Romaji:
              </label>
              <input
                type="text"
                value={newRomaji}
                onChange={(e) => setNewRomaji(e.target.value)}
                placeholder="VD: sakura"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200">
                Nghĩa tiếng Việt: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="VD: Hoa anh đào"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block font-bold text-slate-700 dark:text-slate-200">
                Câu ví dụ song ngữ (Tùy chọn):
              </label>
              <input
                type="text"
                value={newExampleJa}
                onChange={(e) => setNewExampleJa(e.target.value)}
                placeholder="Câu tiếng Nhật: 春に桜が咲きます。"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-japanese text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newExampleVi}
                onChange={(e) => setNewExampleVi(e.target.value)}
                placeholder="Nghĩa câu: Hoa anh đào nở vào mùa xuân."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submittingVocab}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm mt-2"
            >
              {submittingVocab ? 'Đang thêm vào Database...' : '+ Thêm Từ Vựng Vào MongoDB'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
