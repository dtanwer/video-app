'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { TagInput } from '@/components/tag-input';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    file: z.any()
        .refine((files) => files?.length === 1, 'Video file is required')
        .refine((files) => files?.[0]?.type?.startsWith('video/'), 'File must be a video'),
});

export default function VideoUploadPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            tags: [],
        },
    });

    if (!user) {
        router.push('/login');
        return null;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        values.tags.forEach((tag) => formData.append('tags', tag));
        formData.append('file', values.file[0]);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:8080/video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Video uploaded successfully');
            router.push(`/video/${response.data.id}`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload video. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Video</CardTitle>
                    <CardDescription>
                        Share your video with the world.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Video title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Video description"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <TagInput
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Video File</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {!videoPreview ? (
                                                    <div className="flex items-center justify-center w-full">
                                                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                                                <p className="mb-2 text-sm text-muted-foreground">
                                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">MP4, WebM or Ogg</p>
                                                            </div>
                                                            <Input
                                                                type="file"
                                                                accept="video/*"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        onChange(e.target.files);
                                                                        setVideoPreview(URL.createObjectURL(file));
                                                                        setFileDetails({
                                                                            name: file.name,
                                                                            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                                                                            type: file.type,
                                                                        });
                                                                    }
                                                                }}
                                                                {...field}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                                                            <video
                                                                src={videoPreview}
                                                                controls
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium leading-none">{fileDetails?.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {fileDetails?.size} • {fileDetails?.type}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setVideoPreview(null);
                                                                    setFileDetails(null);
                                                                    onChange(null);
                                                                }}
                                                            >
                                                                Change
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Video
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
