'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { User, Settings, Users, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="flex items-center justify-center gap-2">
                  {user.name}
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Member since:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/profile">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Update your profile information and preferences
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/settings">
                <CardHeader className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <Settings className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and security
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </motion.div>

          {user.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/admin">
                  <CardHeader className="text-center">
                    <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle>Admin Panel</CardTitle>
                    <CardDescription>
                      Manage users and system settings
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}