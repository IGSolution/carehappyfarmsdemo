import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ProductFilters({ searchTerm, categoryFilter, onSearchChange, onCategoryChange }: ProductFiltersProps) {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="vegetables">Vegetables</SelectItem>
          <SelectItem value="fruits">Fruits</SelectItem>
          <SelectItem value="grains">Grains</SelectItem>
          <SelectItem value="dairy">Dairy</SelectItem>
          <SelectItem value="meat">Meat</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}