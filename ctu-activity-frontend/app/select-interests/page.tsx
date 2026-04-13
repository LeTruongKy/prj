"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterestSelector } from "@/components/common/InterestSelector";
import { useAuthStore } from "@/lib/auth-store";

export default function SelectInterestsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSuccess = () => {
    // Redirect to home after successful interests update
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chọn Sở Thích Của Bạn
          </h1>
          <p className="text-gray-600">
            Chúng tôi sẽ sử dụng thông tin này để đề xuất các hoạt động phù hợp với bạn
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle>Sở Thích Hoạt Động</CardTitle>
            <CardDescription className="text-blue-100">
              Chọn các lĩnh vực mà bạn quan tâm. Bạn có thể thay đổi điều này bất cứ lúc nào.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <InterestSelector
              userId={authUser?.id}
              onSuccess={handleSuccess}
              showSubmitButton={true}
            />
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow border-l-4 border-blue-600">
            <h3 className="font-semibold text-gray-900 mb-2">
              📌 Khám Phá Hoạt Động
            </h3>
            <p className="text-sm text-gray-600">
              Nhận các đề xuất hoạt động dựa trên sở thích của bạn
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow border-l-4 border-indigo-600">
            <h3 className="font-semibold text-gray-900 mb-2">
              🎯 Tìm Kiếm Dễ Dàng
            </h3>
            <p className="text-sm text-gray-600">
              Sắp xếp các hoạt động theo mức độ phù hợp với bạn
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow border-l-4 border-purple-600">
            <h3 className="font-semibold text-gray-900 mb-2">
              ⚙️ Tùy Chỉnh Dễ Dàng
            </h3>
            <p className="text-sm text-gray-600">
              Thay đổi sở thích của bạn bất cứ khi nào cần
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
