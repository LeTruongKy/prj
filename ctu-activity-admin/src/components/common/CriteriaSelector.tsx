"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { CriteriaService } from "@/services/criteriaService";
import { ICriteria } from "@/types/criteria.type";
import { toast } from "sonner";

interface CriteriaSelectorProps {
  selectedCriteriaIds: number[];
  onChange: (criteriaIds: number[]) => void;
  disabled?: boolean;
}

export function CriteriaSelector({
  selectedCriteriaIds,
  onChange,
  disabled = false,
}: CriteriaSelectorProps) {
  const [criteria, setCriteria] = useState<ICriteria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        const res = await CriteriaService.CallFetchCriteriaList();
        if (res?.statusCode === 200) {
          // Handle both response formats
          const criteriaData = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setCriteria(criteriaData);
        }
      } catch (error) {
        console.error("Error fetching criteria:", error);
        toast.error("KhÃ´ng thá»ƒ táº£i danh sÃ¡ch tiÃªu chÃ­");
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, []);

  const handleCriteriaChange = (criteriaId: number, checked: boolean) => {
    let newCriteriaIds: number[];
    if (checked) {
      newCriteriaIds = [...selectedCriteriaIds, criteriaId];
    } else {
      newCriteriaIds = selectedCriteriaIds.filter((id) => id !== criteriaId);
    }
    onChange(newCriteriaIds);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-muted-foreground">Äang táº£i tiÃªu chÃ­...</span>
      </div>
    );
  }

  if (criteria.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-md">
        Không có tiêu chí nào. Vui lòng thêm tiêu chí trước khi chọn.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {criteria.map((crit) => (
          <div key={crit.id} className="flex items-start space-x-2">
            <Checkbox
              id={`criteria-${crit.id}`}
              checked={selectedCriteriaIds.includes(crit.id)}
              onCheckedChange={(checked) =>
                handleCriteriaChange(crit.id, checked as boolean)
              }
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <Label
                htmlFor={`criteria-${crit.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {crit.name}
              </Label>
              {crit.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {crit.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
