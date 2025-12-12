'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authApi, User } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const userData = await authApi.getAllUsers();
      setUsers(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await authApi.banUser(userId);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to ban user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await authApi.unbanUser(userId);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unban user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(userId);
    try {
      await authApi.deleteUser(userId);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Panel
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {users.map((userData, index) => (
            <motion.div
              key={userData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>
                          {userData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{userData.name}</h3>
                        <p className="text-gray-600">{userData.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={userData.role === 'admin' ? 'default' : 'secondary'}>
                            {userData.role}
                          </Badge>
                          <Badge variant={userData.isActive ? 'default' : 'destructive'}>
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {userData.isBanned && (
                            <Badge variant="destructive">Banned</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {userData.id !== user.id && (
                        <>
                          {userData.isBanned ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnbanUser(userData.id)}
                              disabled={actionLoading === userData.id}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Unban
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBanUser(userData.id)}
                              disabled={actionLoading === userData.id}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Ban
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(userData.id)}
                            disabled={actionLoading === userData.id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}