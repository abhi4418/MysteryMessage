'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCcw, Loader2, ShieldOff } from 'lucide-react';
import { ApiResponse } from '@/types/ApiResponse';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function BlockedIPs() {
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unblockingIP, setUnblockingIP] = useState<string | null>(null);
  const [isUnblockingAll, setIsUnblockingAll] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchBlockedIPs = useCallback(async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/block-ip');
      if (response.data.success && response.data.blockedIPs) {
        setBlockedIPs(response.data.blockedIPs);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch blocked IPs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  const handleUnblockIP = async (ipToUnblock: string) => {
    setUnblockingIP(ipToUnblock);
    try {
      const response = await axios.post<ApiResponse>('/api/block-ip', {
        ipToBlock: ipToUnblock,
        action: 'unblock'
      });
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        // Remove the unblocked IP from the list
        setBlockedIPs(blockedIPs.filter(ip => ip !== ipToUnblock));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to unblock IP',
        variant: 'destructive',
      });
    } finally {
      setUnblockingIP(null);
    }
  };

  const handleUnblockAllIPs = async () => {
    setIsUnblockingAll(true);
    try {
      const response = await axios.post<ApiResponse>('/api/block-ip', {
        action: 'unblock-all'
      });
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        // Clear the blocked IPs list
        setBlockedIPs([]);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to unblock all IPs',
        variant: 'destructive',
      });
    } finally {
      setIsUnblockingAll(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchBlockedIPs();
    }
  }, [session, fetchBlockedIPs]);

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-card rounded w-full max-w-6xl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Blocked IP Addresses</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={fetchBlockedIPs} 
            variant="outline" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          
          {blockedIPs.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full sm:w-auto"
                  disabled={isUnblockingAll}
                >
                  {isUnblockingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldOff className="h-4 w-4 mr-2" />
                  )}
                  Unblock All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unblock all IP addresses?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will allow all previously blocked senders to send you messages again.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleUnblockAllIPs}
                    disabled={isUnblockingAll}
                  >
                    {isUnblockingAll ? 'Unblocking...' : 'Unblock All'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="my-4">
        <p className="text-muted-foreground">
          IP addresses that have been blocked will not be able to send you messages.
        </p>
      </div>

      {blockedIPs.length === 0 ? (
        <div className="text-center py-10 bg-muted rounded">
          <p className="text-muted-foreground">No IP addresses have been blocked.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blockedIPs.map((ip) => (
            <Card key={ip} className="border border-border">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{ip}</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unblock this IP address?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will allow the sender to send you messages again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleUnblockIP(ip)}
                          disabled={unblockingIP === ip}
                        >
                          {unblockingIP === ip ? 'Unblocking...' : 'Unblock'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">Blocked from sending messages</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 