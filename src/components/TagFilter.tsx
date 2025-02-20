
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
}

export function TagFilter({ selectedTag, onTagChange }: TagFilterProps) {
  const { data: tags, isLoading } = useCompanyTags();

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
        value={selectedTag || ""}
        onValueChange={(value) => onTagChange(value || null)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Tags</SelectItem>
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
