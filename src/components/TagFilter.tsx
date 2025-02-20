
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyTags } from "@/hooks/useCompanyTags";
import { Loader2 } from "lucide-react";

interface TagFilterProps {
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  selectedSector: string;
  selectedStage: string;
  searchQuery: string;
  userSectors: string[];
  userStages: string[];
}

export function TagFilter({ 
  selectedTag, 
  onTagChange,
  selectedSector,
  selectedStage,
  searchQuery,
  userSectors,
  userStages,
}: TagFilterProps) {
  const { data: tags, isLoading } = useCompanyTags({
    selectedSector,
    selectedStage,
    searchQuery,
    userSectors,
    userStages,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading tags...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground">Tag</label>
      <Select
        value={selectedTag || "_all"}
        onValueChange={(value) => onTagChange(value === "_all" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">All Tags</SelectItem>
          {tags?.map((tag) => (
            <SelectItem key={tag.value} value={tag.value}>
              {tag.value} ({tag.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
