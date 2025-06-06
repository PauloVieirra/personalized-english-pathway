
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StudentSidebar from '@/components/student/StudentSidebar';
import PurchaseHistory from '@/components/student/PurchaseHistory';

export default function PurchaseHistoryPage() {
  return (
    <MainLayout requireAuth allowedRoles={['student']}>
      <div className="flex min-h-screen">
        <StudentSidebar />
        <div className="flex-1 p-8">
          <PurchaseHistory />
        </div>
      </div>
    </MainLayout>
  );
}
