import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';

interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: 'USER' | 'ADMIN';
  provider: 'GOOGLE' | 'GITHUB' | 'LOCAL';
  providerId?: string;
  createdAt: string;
  updatedAt: string;
}

function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchUserCount();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/count`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user count');
      }

      const count = await response.json();
      setUserCount(count);
    } catch (err) {
      console.error('Failed to fetch user count:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'GOOGLE':
        return 'bg-red-100 text-red-800';
      case 'GITHUB':
        return 'bg-gray-100 text-gray-800';
      case 'LOCAL':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'ADMIN'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              관리자 페이지
            </h1>
            <p className="text-gray-600">
              전체 회원 정보를 조회하고 관리할 수 있습니다
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              홈으로
            </Button>
            <Button variant="outline" onClick={logout}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">총 회원 수</p>
              <p className="text-3xl font-bold text-blue-600">{userCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">로그인 사용자</p>
              <p className="text-3xl font-bold text-green-600">
                {user?.name || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">권한</p>
              <p className="text-3xl font-bold text-purple-600">
                {user?.email || 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* User List */}
      <div className="max-w-7xl mx-auto">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">전체 회원 목록</h2>
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              {loading ? '새로고침 중...' : '새로고침'}
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              오류: {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">회원 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      프로필
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      이름
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      제공자
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      권한
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      가입일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        등록된 회원이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {u.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {u.picture ? (
                            <img
                              src={u.picture}
                              alt={u.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {u.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {u.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getProviderBadgeColor(
                              u.provider
                            )}`}
                          >
                            {u.provider}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                              u.role
                            )}`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Admin;
