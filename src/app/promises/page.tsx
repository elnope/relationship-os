'use client';

import { useState } from 'react';
import { CheckSquare, Calendar, Gift, Clock, CheckCircle, Circle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePromises, useTogglePromise, useCreatePromise } from '@/lib/hooks';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import AddPromiseModal from '@/components/AddPromiseModal';
import EmptyState from '@/components/EmptyState';

export default function PromisesPage() {
  const { data: promises, isLoading } = usePromises();
  const togglePromise = useTogglePromise();
  const createPromise = useCreatePromise();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingPromises = promises?.filter(p => !p.isCompleted) || [];
  const completedPromises = promises?.filter(p => p.isCompleted) || [];

  const handleToggle = (id: string, currentState: boolean) => {
    togglePromise.mutate({ id, isCompleted: !currentState });
  };

  const handleCreatePromise = (data: { personId: string; title: string; deadline: string; description?: string }) => {
    createPromise.mutate(data);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      <Sidebar activeTab="promises" />

      <main className="ml-0 md:ml-20 p-4 md:p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center shadow-soft">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Lời hứa</h1>
                <p className="text-sm text-gray-500">
                  {pendingPromises.length} lời hứa đang chờ
                </p>
              </div>
            </div>
            {/* Create Promise Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 text-white rounded-2xl font-medium shadow-soft hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Tạo lời hứa</span>
            </button>
          </div>
        </header>

        {/* Pending Promises */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Đang chờ
          </h2>
          
          <div className="space-y-3">
            {pendingPromises.length === 0 && !isLoading && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md">
                <EmptyState.Promises onAction={() => setIsModalOpen(true)} />
              </div>
            )}

            {isLoading && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md text-center">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto" />
                </div>
              </div>
            )}

            {!isLoading && pendingPromises.map((promise) => {
              const deadline = new Date(promise.deadline);
              const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysUntil < 0;

              return (
                <div
                  key={promise.id}
                  className={cn(
                    'bg-white border rounded-2xl p-5 shadow-md',
                    'hover:shadow-lg transition-all duration-200',
                    isOverdue ? 'border-red-200' : 'border-gray-100'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggle(promise.id, promise.isCompleted)}
                      disabled={togglePromise.isPending}
                      className="mt-1 flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      <Circle className="w-6 h-6 text-gray-300 hover:text-rose-400 transition-colors" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 leading-tight">{promise.title}</p>
                      {promise.person && (
                        <p className="text-sm text-gray-500 mt-1">với {promise.person.name}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        isOverdue ? 'text-red-500' : 'text-amber-600'
                      )}>
                        <Calendar className="w-4 h-4" />
                        {isOverdue
                          ? `${Math.abs(daysUntil)} ngày trễ`
                          : daysUntil === 0
                            ? 'Hôm nay'
                            : `${daysUntil} ngày`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Completed Promises */}
        {completedPromises.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Đã hoàn thành
            </h2>
            
            <div className="space-y-3">
              {completedPromises.map((promise) => (
                <div
                  key={promise.id}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-5 opacity-60"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggle(promise.id, promise.isCompleted)}
                      disabled={togglePromise.isPending}
                      className="mt-1 flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-400 line-through leading-tight">{promise.title}</p>
                      {promise.person && (
                        <p className="text-sm text-gray-400 mt-1">với {promise.person.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Create Promise Modal */}
      <AddPromiseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePromise}
        isLoading={createPromise.isPending}
      />
    </div>
  );
}
