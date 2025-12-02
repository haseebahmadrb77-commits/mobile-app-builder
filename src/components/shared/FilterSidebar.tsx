import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSidebarProps {
  authors?: FilterOption[];
  years?: FilterOption[];
  ratings?: number[];
  selectedAuthors?: string[];
  selectedYears?: string[];
  minRating?: number;
  onAuthorChange?: (authors: string[]) => void;
  onYearChange?: (years: string[]) => void;
  onRatingChange?: (rating: number) => void;
  onClearFilters?: () => void;
  className?: string;
}

const defaultAuthors: FilterOption[] = [
  { id: "al-ghazali", label: "Imam Al-Ghazali", count: 45 },
  { id: "ibn-kathir", label: "Ibn Kathir", count: 32 },
  { id: "rumi", label: "Jalal ad-Din Rumi", count: 28 },
  { id: "ibn-taymiyyah", label: "Ibn Taymiyyah", count: 24 },
  { id: "ibn-qayyim", label: "Ibn Qayyim", count: 21 },
];

const defaultYears: FilterOption[] = [
  { id: "2024", label: "2024", count: 120 },
  { id: "2023", label: "2023", count: 89 },
  { id: "2022", label: "2022", count: 76 },
  { id: "2021", label: "2021", count: 54 },
  { id: "classic", label: "Classic Works", count: 245 },
];

function FilterContent({
  authors = defaultAuthors,
  years = defaultYears,
  selectedAuthors = [],
  selectedYears = [],
  minRating = 0,
  onAuthorChange,
  onYearChange,
  onRatingChange,
  onClearFilters,
}: FilterSidebarProps) {
  const hasFilters = selectedAuthors.length > 0 || selectedYears.length > 0 || minRating > 0;

  return (
    <div className="space-y-6">
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </Button>
      )}

      {/* Rating Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Minimum Rating</h4>
        <div className="space-y-3">
          <Slider
            value={[minRating]}
            onValueChange={(value) => onRatingChange?.(value[0])}
            max={5}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Any</span>
            <span className="font-medium text-foreground">{minRating > 0 ? `${minRating}+ stars` : "All"}</span>
            <span>5 stars</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Author Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Authors</h4>
        <div className="space-y-2">
          {authors.map((author) => (
            <div key={author.id} className="flex items-center space-x-2">
              <Checkbox
                id={`author-${author.id}`}
                checked={selectedAuthors.includes(author.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onAuthorChange?.([...selectedAuthors, author.id]);
                  } else {
                    onAuthorChange?.(selectedAuthors.filter((id) => id !== author.id));
                  }
                }}
              />
              <Label
                htmlFor={`author-${author.id}`}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {author.label}
              </Label>
              {author.count && (
                <span className="text-xs text-muted-foreground">({author.count})</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Year Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Publication Year</h4>
        <div className="space-y-2">
          {years.map((year) => (
            <div key={year.id} className="flex items-center space-x-2">
              <Checkbox
                id={`year-${year.id}`}
                checked={selectedYears.includes(year.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onYearChange?.([...selectedYears, year.id]);
                  } else {
                    onYearChange?.(selectedYears.filter((id) => id !== year.id));
                  }
                }}
              />
              <Label
                htmlFor={`year-${year.id}`}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {year.label}
              </Label>
              {year.count && (
                <span className="text-xs text-muted-foreground">({year.count})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:block", props.className)}>
        <div className="sticky top-20 rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Filters</h3>
          <FilterContent {...props} />
        </div>
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display">Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
