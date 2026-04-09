import { useNavigate } from 'react-router-dom';
import { Plus, Home, Search, MessageSquare, LogOut, Sparkles, ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getUser, logout } from '@/lib/auth';

export type SidebarView = 'home' | 'search' | 'chats' | 'chat';

export interface Chat {
  id: number;
  title: string;
  createdAt: string; // ISO string from backend
  messageCount: number;
}

interface AppSidebarProps {
  chats: Chat[];
  activeChatId: number | null;
  activeView: SidebarView;
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
  onDeleteChat: (id: number) => void;
  onNavigate: (view: SidebarView) => void;
}

export default function AppSidebar({
  chats,
  activeChatId,
  activeView,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onNavigate,
}: AppSidebarProps) {
  const navigate   = useNavigate();
  const user       = getUser();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const navItems = [
    { icon: Home,          label: 'Home',   view: 'home'  as SidebarView },
    { icon: Search,        label: 'Search', view: 'search' as SidebarView },
    { icon: MessageSquare, label: 'Chats',  view: 'chats'  as SidebarView },
  ];

  return (
    <aside className="w-[250px] h-screen bg-card border-r border-ink-10 flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-5 h-[60px] flex items-center gap-2.5 border-b border-ink-10 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-cobalt flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold text-ink tracking-tight">DocuMind</span>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            bg-cobalt-light text-cobalt hover:bg-cobalt hover:text-primary-foreground transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 pb-2 space-y-0.5 shrink-0">
        {navItems.map(({ icon: Icon, label, view }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeView === view && activeChatId === null
                ? 'bg-cream-200 text-ink'
                : 'text-ink-60 hover:bg-cream-100 hover:text-ink'}`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {view === 'chats' && chats.length > 0 && (
              <span className="ml-auto text-[10px] font-mono bg-cobalt-light text-cobalt px-1.5 py-0.5 rounded-full">
                {chats.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Recent chats list (only shown when there are chats) */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 min-h-0">
        {chats.length > 0 && (
          <>
            <p className="text-[10px] font-semibold text-ink-40 uppercase tracking-widest px-3 pt-3 pb-1.5 shrink-0">
              Recent
            </p>
            <div className="space-y-0.5">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  className="group relative"
                >
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200
                      ${activeChatId === chat.id
                        ? 'bg-cream-200 text-ink'
                        : 'text-ink-60 hover:bg-cream-100 hover:text-ink'}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-50" />
                    <div className="min-w-0 pr-6">
                      <p className="text-xs font-medium truncate leading-snug">{chat.title}</p>
                      <p className="text-[10px] text-ink-40 mt-0.5">
                        {chat.messageCount} message{chat.messageCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-ink-20 opacity-0 group-hover:opacity-100 hover:text-ruby hover:bg-ruby-light transition-all duration-200"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-28 text-center px-3 mt-2">
            <MessageSquare className="w-6 h-6 text-ink-20 mb-2" />
            <p className="text-xs text-ink-40 leading-relaxed">No chats yet.<br />Start a new conversation.</p>
          </div>
        )}
      </div>

      {/* User */}
      <div className="relative px-3 pb-4 shrink-0 border-t border-ink-10 pt-3">
        <button
          onClick={() => setShowMenu(v => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-100 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-cobalt-light text-cobalt flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-ink truncate">{user?.name || 'Guest'}</p>
            <p className="text-xs text-ink-40 truncate">{user?.email || ''}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-ink-40 shrink-0" />
        </button>

        {showMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-1 card shadow-lifted p-1 animate-pop">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ruby hover:bg-ruby-light transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}