'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      const message = await axios.post("/api/suggest-messages");
      console.log(message.data);
      complete(message.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl shadow-lg card-hover border-border/60">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Send a message to <span className="text-primary">@{username}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your message will be anonymous
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Write your message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your anonymous message here..."
                        className="resize-none min-h-[140px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled className="w-full sm:w-auto">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !messageContent}
                    className="w-full sm:w-auto"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="space-y-4 mt-8">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium flex items-center">
                  <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
                  Need inspiration?
                </h3>
                <Button
                  onClick={fetchSuggestedMessages}
                  variant="ghost"
                  size="sm"
                  disabled={isSuggestLoading}
                  className="text-xs"
                >
                  {isSuggestLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    "Get suggestions"
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Click on any suggestion below to use it
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {error ? (
                <p className="text-red-500 text-sm">{error.message}</p>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-sm whitespace-normal h-auto py-3 text-left justify-start"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </div>
          </div>

          <Separator className="my-8" />
          
          <div className="text-center">
            <div className="mb-3 text-sm text-muted-foreground">
              Want to receive anonymous messages too?
            </div>
            <Link href={'/sign-up'}>
              <Button className="w-full sm:w-auto" variant="outline">
                Create Your Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}