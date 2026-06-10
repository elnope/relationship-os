'use client';

import Link from 'next/link';
import { CheckSquare, Calendar, ChevronRight, PlusCircle, Gift, Clock, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';

const MOCK_PROMISES = [
  { id: '1', title: 'Gửi tài liệu AI cho Lan Chi', personName: 'Lan Chi', deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: '2', title: 'Hẹn tập xà đơn cuối tuần', personName: 'Hoàng', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: '3', title: 'Cà phê bàn chiến thuật', personName: 'Nam Nguyễn', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: '4', title: 'Review PR cho feature mới', personName: 'David Đặng', deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: '5', title: 'Gửi slide presentation', personName: 'Anh Tuấn', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: '6', title: 'Gọi điện chúc mừng sinh nhật', personName: 'Bà Ngoại', deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), isCompleted: false },
  { id: '7', title: 'Mua quà tặng team', personName: 'UET FC', deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), isCompleted: true },
  { id: '8', title: 'Gửi email báo giá', personName: 'CEO Minh Phạm', deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isCompleted: true },
];

export default function PromisesPage() {
  const pendingPromises = MOCK_PROMISES.filter(p => !p.isCompleted);
  const completedPromises = MOCK_PROMISES.filter(p => p.isCompleted);

  return (
    <div className="min-h-screen bg-[#FFF5F6] pb-24 md:pb-6">
      <Sidebar activeTab="promises" />

      <main className="ml-24 p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
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
        </header>

        {/* Pending Promises */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Đang chờ
          </h2>
          
          <div className="space-y-3">
            {pendingPromises.map((promise) => {
              const daysUntil = Math.ceil((promise.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysUntil < 0;

              return (
                <div
                  key={promise.id}
                  className={cn(
                    'bg-white/80 backdrop-blur-sm border rounded-[2rem] p-5 shadow-soft',
                    'hover:shadow-soft-lg transition-all duration-200 cursor-pointer',
                    isOverdue ? 'border-red-200' : 'border-rose-100/50'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <button className="mt-1 flex-shrink-0">
                      <Circle className="w-6 h-6 text-gray-300 hover:text-rose-400 transition-colors" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 leading-tight">{promise.title}</p>
                      <p className="text-sm text-gray-500 mt-1">với {promise.personName}</p>
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

            {pendingPromises.length === 0 && (
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-[2rem] p-8 shadow-soft text-center">
                <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Không có lời hứa nào đang chờ</p>
              </div>
            )}
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
                  className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-[2rem] p-5 opacity-60"
                >
                  <div className="flex items-start gap-4">
                    <button className="mt-1 flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-400 line-through leading-tight">{promise.title}</p>
                      <p className="text-sm text-gray-400 mt-1">với {promise.personName}</p>
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
    </div>
  );
}
