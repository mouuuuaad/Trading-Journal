
"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "../ui/card";

type FilterType = "asset" | "result" | "direction";

interface TradeFiltersProps {
    uniqueAssets: string[];
    filters: {
        asset: string;
        result: string;
        direction: string;
    };
    onFilterChange: (filterType: FilterType, value: string) => void;
}

export function TradeFilters({ uniqueAssets, filters, onFilterChange }: TradeFiltersProps) {
    return (
        <Card className="mb-4">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                {/* Asset Filter */}
                <div className="flex-1 min-w-[150px]">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Asset</label>
                    <Select value={filters.asset} onValueChange={(value) => onFilterChange("asset", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Asset" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Assets</SelectItem>
                            {uniqueAssets.map(asset => (
                                <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Result Filter */}
                <div className="flex-1 min-w-[150px]">
                     <label className="text-sm font-medium text-muted-foreground mb-2 block">Result</label>
                    <Select value={filters.result} onValueChange={(value) => onFilterChange("result", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Result" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Results</SelectItem>
                            <SelectItem value="Win">Win</SelectItem>
                            <SelectItem value="Loss">Loss</SelectItem>
                            <SelectItem value="BE">Break Even</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Direction Filter */}
                <div className="flex-1 min-w-[150px]">
                     <label className="text-sm font-medium text-muted-foreground mb-2 block">Direction</label>
                    <Select value={filters.direction} onValueChange={(value) => onFilterChange("direction", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Direction" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Directions</SelectItem>
                            <SelectItem value="Buy">Buy</SelectItem>
                            <SelectItem value="Sell">Sell</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
