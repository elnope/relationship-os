'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft } from 'lucide-react';
import QuickAddModal from '@/components/QuickAddModal';
import ToastContainer from '@/components/Toast';
import { useCreateInteraction } from '@/lib/hooks';
import { showToast } from '@/components/Toast';

export default function QuickAddPage() {
  const router = useRouter();
  const createInteraction = useCreateInteraction();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const handleSubmit = (data: any) => {
    createInteraction.mutate(data);
  };

  return (
    <>
      <QuickAddModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
      <ToastContainer />
    </>
  );
}
