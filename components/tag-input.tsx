'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { fetchTags, Tag } from '@/lib/api/tags';

// Simple debounce hook implementation if not exists
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

interface TagInputProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export function TagInput({ value, onChange }: TagInputProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [loading, setLoading] = React.useState(false);
    const debouncedSearch = useDebounceValue(inputValue, 300);

    React.useEffect(() => {
        const loadTags = async () => {
            setLoading(true);
            try {
                const response = await fetchTags(1, 20, debouncedSearch);
                setTags(response.data);
            } catch (error) {
                console.error('Failed to load tags', error);
            } finally {
                setLoading(false);
            }
        };
        loadTags();
    }, [debouncedSearch]);

    const handleSelect = (tagName: string) => {
        if (!value.includes(tagName)) {
            onChange([...value, tagName]);
        }
        setInputValue('');
        setOpen(false);
    };

    const handleRemove = (tagName: string) => {
        onChange(value.filter((t) => t !== tagName));
    };

    const handleCreate = () => {
        if (inputValue && !value.includes(inputValue)) {
            onChange([...value, inputValue]);
            setInputValue('');
            setOpen(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {value.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm py-1 px-2">
                        {tag}
                        <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRemove(tag);
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={() => handleRemove(tag)}
                        >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        Select or create tags...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search tags..."
                            value={inputValue}
                            onValueChange={setInputValue}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {inputValue && (
                                    <div className="p-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-sm"
                                            onClick={handleCreate}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create "{inputValue}"
                                        </Button>
                                    </div>
                                )}
                                {!inputValue && "No tags found."}
                            </CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                {tags.map((tag) => (
                                    <CommandItem
                                        key={tag.id}
                                        value={tag.name}
                                        onSelect={() => handleSelect(tag.name)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value.includes(tag.name) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {tag.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
