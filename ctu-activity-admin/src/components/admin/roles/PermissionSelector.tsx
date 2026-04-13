// PermissionSelector.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PermissionModule, IPermission } from "@/types/permission.type";
import { useState } from "react";
import clsx from "clsx";

export default function PermissionSelector({
  listPermissions,
  onChange,
}: {
  listPermissions: PermissionModule[] | null;
  onChange: (selected: number[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);

  const togglePermission = (id: number) => {
    let updated;
    if (selected.includes(id)) {
      updated = selected.filter((x) => x !== id);
    } else {
      updated = [...selected, id];
    }
    setSelected(updated);
    onChange(updated);
  };

  const toggleModule = (permissions: IPermission[], enable: boolean) => {
    const ids = permissions.map((p) => p.id);
    let updated;

    if (enable) {
      updated = Array.from(new Set([...selected, ...ids]));
    } else {
      updated = selected.filter((x) => !ids.includes(x));
    }
    setSelected(updated);
    onChange(updated);
  };

  if (!listPermissions) return null;

  return (
    <div className="mt-6 min-w-[720px]">
      <Label className="text-base font-semibold">Quyền hạn</Label>

      <Accordion type="multiple" className="mt-4 space-y-3">
        {listPermissions.map((module) => {
          const allIds = module.permissions.map((p) => p.id);
          const isAllChecked = allIds.every((id) => selected.includes(id));

          return (
            <AccordionItem key={module.module} value={module.module} className="border rounded-md">
              <div className="flex items-center justify-between w-full border rounded-md">
                <AccordionTrigger className="px-4 hover:no-underline flex-1 text-left cursor-pointer">
                  <span className="font-semibold">{module.module}</span>
                </AccordionTrigger>

                <div className="px-4" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  <Switch
                    checked={isAllChecked}
                    onCheckedChange={(v) => toggleModule(module.permissions, v)}
                    className="data-[state=checked]:bg-blue-600 cursor-pointer"
                  />
                </div>
              </div>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 p-4 gap-6">
                  {module.permissions.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-3 flex items-center justify-between shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{item.slug}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1 flex-wrap">
                          <span
                            className={clsx(
                              "px-2 py-0.5 rounded text-white text-xs font-semibold",
                              item.action === "GET" && "bg-blue-500",
                              item.action === "POST" && "bg-green-500",
                              item.action === "DELETE" && "bg-red-500",
                              item.action === "PATCH" && "bg-yellow-500",
                              item.action === "PUT" && "bg-purple-500",
                            )}
                          >
                            {item.action}
                          </span>
                          <span className="truncate">{item.resource}</span>
                        </p>
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={selected.includes(item.id)}
                          onCheckedChange={() => togglePermission(item.id)}
                          className="data-[state=checked]:bg-blue-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
