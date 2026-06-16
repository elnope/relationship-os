'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Bell, Shield, Database, Palette, ChevronRight, User, LogOut, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import { showToast } from '@/components/Toast';
import UnderDevelopmentModal from '@/components/UnderDevelopmentModal';

const SETTINGS_SECTIONS = [
  {
    title: 'Tài khoản',
    items: [
      { icon: User, label: 'Hồ sơ', description: 'Cập nhật thông tin cá nhân' },
      { icon: Shield, label: 'Bảo mật', description: 'Đổi mật khẩu, xác thực' },
    ],
  },
  {
    title: 'Hiển thị',
    items: [
      { icon: Palette, label: 'Giao diện', description: 'Chủ đề sáng/tối' },
      { icon: Moon, label: 'Chế độ', description: 'Tự động theo hệ thống' },
    ],
  },
  {
    title: 'Thông báo',
    items: [
      { icon: Bell, label: 'Nhắc nhở', description: 'Lời hứa, sinh nhật' },
    ],
  },
  {
    title: 'Dữ liệu',
    items: [
      { icon: Database, label: 'Xuất dữ liệu', description: 'Tải về dữ liệu của bạn' },
    ],
  },
  {
    title: 'Hỗ trợ',
    items: [
      { icon: HelpCircle, label: 'Trợ giúp', description: 'Câu hỏi thường gặp' },
    ],
  },
];

export default function SettingsPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleSettingsClick = (label: string) => {
    setActiveFeature(label);
  };

  const handleModalClose = () => {
    setActiveFeature(null);
    showToast('Tính năng này đang được phát triển tích cực và sẽ sớm ra mắt! Xin lỗi vì sự bất tiện này.', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      <Sidebar activeTab="settings" />

      <main className="ml-0 md:ml-20 p-4 md:p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-soft">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
              <p className="text-sm text-gray-500">Tùy chỉnh ứng dụng</p>
            </div>
          </div>
        </header>

        {/* Settings Sections */}
        <div className="space-y-6 max-w-2xl">
          {SETTINGS_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === section.items.length - 1;

                  return (
                    <button
                      key={item.label}
                      onClick={() => handleSettingsClick(item.label)}
                      className={cn(
                        'w-full flex items-center gap-4 p-5 text-left',
                        'hover:bg-gray-50 transition-colors',
                        !isLast && 'border-b border-gray-100'
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sign Out */}
          <div>
            <button
              className={cn(
                'w-full flex items-center gap-4 p-5 text-left',
                'bg-white border border-gray-100 rounded-xl shadow-md',
                'hover:bg-red-50 transition-colors'
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-600">Đăng xuất</p>
                <p className="text-sm text-red-400">Thoát khỏi tài khoản</p>
              </div>
            </button>
          </div>

          {/* App Info */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-400">
              Relationship OS v0.1.0
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Made with ❤️ for meaningful connections
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Under Development Modal */}
      <UnderDevelopmentModal
        isOpen={!!activeFeature}
        onClose={handleModalClose}
        featureName={activeFeature || undefined}
      />
    </div>
  );
}
