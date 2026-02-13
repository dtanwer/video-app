'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { walletApi, Wallet, WalletTransaction } from '@/lib/api/wallet';
import { authApi } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, DollarSign, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function WalletPage() {
    const { user, refreshUser } = useAuth();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Bank Details State
    const [showBankForm, setShowBankForm] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        ifsc: '',
        beneficiaryName: '',
        phoneNumber: '',
    });
    const [bankLoading, setBankLoading] = useState(false);

    useEffect(() => {
        loadWalletData();
    }, []);

    useEffect(() => {
        if (user) {
            setBankDetails({
                accountNumber: user.bankDetails?.accountNumber || '',
                ifsc: user.bankDetails?.ifsc || '',
                beneficiaryName: user.bankDetails?.beneficiaryName || user.name || '',
                phoneNumber: user.phoneNumber || '',
            });

            // Should show bank form if details are missing?
            // Only if user tries to withdraw and details are missing.
        }
    }, [user]);

    const loadWalletData = async () => {
        try {
            const walletData = await walletApi.getWallet();
            setWallet(walletData);

            const transactionsData = await walletApi.getTransactions();
            setTransactions(transactionsData.data || []);
        } catch (err) {
            console.error('Failed to load wallet data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!user?.bankDetails?.accountNumber || !user?.phoneNumber) {
            setShowBankForm(true);
            setError('Please add your bank details and phone number to proceed with withdrawal.');
            return;
        }

        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (wallet && Number(withdrawAmount) > wallet.balance) {
            setError('Insufficient funds');
            return;
        }

        setWithdrawLoading(true);
        try {
            await walletApi.requestWithdrawal(Number(withdrawAmount));
            setSuccessMessage('Withdrawal requested successfully!');
            setWithdrawAmount('');
            loadWalletData(); // Refresh data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Withdrawal failed');
        } finally {
            setWithdrawLoading(false);
        }
    };

    const handleBankDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBankLoading(true);
        setError('');

        try {
            await authApi.updateProfile({
                phoneNumber: bankDetails.phoneNumber,
                bankDetails: {
                    accountNumber: bankDetails.accountNumber,
                    ifsc: bankDetails.ifsc,
                    beneficiaryName: bankDetails.beneficiaryName,
                }
            });
            await refreshUser();
            setShowBankForm(false);
            setSuccessMessage('Bank details updated successfully! You can now withdraw.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update bank details');
        } finally {
            setBankLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <WalletIcon className="h-8 w-8" /> Wallet
            </h1>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{wallet?.balance.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Locked (In Process)</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">₹{wallet?.lockedBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{wallet?.totalWithdrawn.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Withdrawal Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Withdraw Funds</CardTitle>
                        <CardDescription>Transfer funds to your bank account via Razorpay</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {showBankForm ? (
                            <form onSubmit={handleBankDetailsSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Beneficiary Name</Label>
                                    <Input
                                        value={bankDetails.beneficiaryName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, beneficiaryName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Number</Label>
                                    <Input
                                        value={bankDetails.accountNumber}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>IFSC Code</Label>
                                    <Input
                                        value={bankDetails.ifsc}
                                        onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number (Required for Razorpay)</Label>
                                    <Input
                                        value={bankDetails.phoneNumber}
                                        onChange={(e) => setBankDetails({ ...bankDetails, phoneNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={bankLoading}>{bankLoading ? 'Saving...' : 'Save & Continue'}</Button>
                                    <Button type="button" variant="outline" onClick={() => setShowBankForm(false)}>Cancel</Button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleWithdraw} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount to Withdraw (₹)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Enter amount"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        min="1"
                                    />
                                </div>
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {successMessage && (
                                    <Alert className="bg-green-50 text-green-800 border-green-200">
                                        <AlertTitle>Success</AlertTitle>
                                        <AlertDescription>{successMessage}</AlertDescription>
                                    </Alert>
                                )}
                                <Button type="submit" className="w-full" disabled={withdrawLoading}>
                                    {withdrawLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowDownLeft className="mr-2 h-4 w-4" />}
                                    Withdraw
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No transactions found</TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="font-medium">
                                                {tx.type} <span className="text-xs text-muted-foreground">({tx.subType})</span>
                                            </TableCell>
                                            <TableCell className={tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
                                                {tx.type === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                        tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{format(new Date(tx.createdAt), 'MMM d, yyyy')}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
