"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Box from "@/components/box"
import Flex from "@/components/flex"

interface SearchBarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
    return (
        <Flex className="items-center mb-6">
            <Box className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </Box>
        </Flex>
    )
}

