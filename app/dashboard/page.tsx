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
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-50">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                {user.name}
              </CardTitle>
              <CardDescription className="text-sm font-medium">{user.email}</CardDescription>
              <div className="flex justify-center gap-2 mt-3">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                  {user.role}
                </Badge>
                <Badge variant={user.isActive ? 'outline' : 'destructive'} className={user.isActive ? "text-green-600 border-green-200 bg-green-50" : ""}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center text-sm text-gray-500 mt-4 pt-4 border-t">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link href="/dashboard/profile">
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white/80 backdrop-blur-sm group cursor-pointer">
              <CardHeader className="text-center h-full flex flex-col justify-center items-center py-12">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mb-2">Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and bio
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link href="/dashboard/settings">
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white/80 backdrop-blur-sm group cursor-pointer">
              <CardHeader className="text-center h-full flex flex-col justify-center items-center py-12">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="mb-2">Account Settings</CardTitle>
                <CardDescription>
                  Manage password and security preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        {user.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link href="/dashboard/admin">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white/80 backdrop-blur-sm group cursor-pointer">
                <CardHeader className="text-center h-full flex flex-col justify-center items-center py-12">
                  <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="mb-2">Admin Panel</CardTitle>
                  <CardDescription>
                    Manage users and system configuration
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}