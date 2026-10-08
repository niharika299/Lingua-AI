import React, { useState } from 'react';
import {
  Users,
  Search,
  MessageCircle,
  Heart,
  Share2,
  PlusCircle,
  Check,
  Star,
  MapPin,
} from 'lucide-react';
import { CommunityPost, SpecialistProfile, NavPage } from '../../types';
import { BackNavigationButton } from '../common/BackNavigationButton';

interface CommunityProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
}

export const Community: React.FC<CommunityProps> = ({ onNavigate, onBack }) => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'specialists'>('discussions');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sharedSpecialistId, setSharedSpecialistId] = useState<string | null>(null);

  // New post modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Discussions');

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Sarah J.',
      role: 'Parent',
      title: 'Visual checklists transformed our morning homework routine',
      content:
        'Instead of telling my son 3 things at once, I started using Lingua AI’s instruction cards. He can follow along independently and his confidence skyrocketed!',
      category: 'Experiences' as any,
      likes: 38,
      repliesCount: 12,
      date: 'Yesterday',
    },
    {
      id: '2',
      author: 'Dr. Marcus Vance, CCC-SLP',
      role: 'SLP / Specialist',
      title: 'Why recasting is the kindest way to teach sentence structure',
      content:
        'When your child says "The dog runned away", smile and say "Yes! The dog ran so fast!" You affirm their thought without shame.',
      category: 'Resources' as any,
      likes: 64,
      repliesCount: 19,
      date: 'Sep 26',
    },
    {
      id: '3',
      author: 'Maya P.',
      role: 'Caregiver',
      title: 'What accommodations helped your child most during 3rd grade?',
      content:
        'We have an IEP meeting next Tuesday. What accommodations should I advocate for to help with auditory processing delay?',
      category: 'Questions' as any,
      likes: 29,
      repliesCount: 22,
      date: 'Sep 24',
    },
  ]);

  const specialists: SpecialistProfile[] = [
    {
      id: 'slp-1',
      name: 'Dr. Clara Thorne, Ph.D., CCC-SLP',
      credentials: 'Board Certified Child Language Specialist',
      clinic: 'Pacific Neuro-Developmental Center',
      location: 'San Francisco, CA (Telehealth)',
      focus: ['Developmental Language Disorder', 'Auditory Memory', 'Early Reading'],
      rating: 4.9,
      telehealth: true,
      bio: 'Over 14 years evaluating and supporting children with language comprehension differences.',
    },
    {
      id: 'slp-2',
      name: 'Julian Henderson, M.S., CCC-SLP',
      credentials: 'Pediatric Speech-Language Pathologist',
      clinic: 'Bright Horizons Therapy',
      location: 'Austin, TX (In-Clinic & Virtual)',
      focus: ['Expressive Syntax', 'Social Pragmatics', 'Executive Function'],
      rating: 4.8,
      telehealth: true,
      bio: 'Family-centered speech and communication coaching for school-age children.',
    },
  ];

  const categories = ['All', 'Discussions', 'Resources', 'Questions', 'Experiences'];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: 'You',
      role: 'Parent',
      title: newTitle,
      content: newContent,
      category: newCategory as any,
      likes: 1,
      repliesCount: 0,
      date: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowModal(false);
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b app-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
            <Users className="w-4 h-4" />
            <span>Community & Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary mt-1">
            Caregiver & Teacher Community
          </h1>
          <p className="text-xs app-text-secondary mt-0.5">
            Ask questions, share experiences, and connect with speech-language professionals.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 app-bg-surface-secondary border app-border rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'discussions'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            💬 Discussions
          </button>
          <button
            onClick={() => setActiveTab('specialists')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'specialists'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            🩺 Find a Specialist
          </button>
        </div>
      </div>

      {activeTab === 'discussions' && (
        <div className="space-y-6">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 4 Simple Categories */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-2xs'
                      : 'border app-border app-bg-surface app-text-secondary hover:bg-black/5'
                  }`}
                >
                  {cat === 'Discussions' ? '💬 Discussions' : cat === 'Resources' ? '📚 Resources' : cat === 'Questions' ? '❓ Questions' : cat === 'Experiences' ? '🌟 Experiences' : 'All'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-1 focus:ring-[#7C4DBA]"
                />
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-95 shadow-2xs shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Post</span>
              </button>
            </div>
          </div>

          {/* Posts list */}
          <div className="space-y-3.5">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-3xl border app-border app-bg-surface shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs app-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold app-text-primary">{post.author}</span>
                    <span>·</span>
                    <span className="bg-[#F1ECF8] dark:bg-[#3B2256] text-[#7C4DBA] dark:text-[#D8B4FE] px-2 py-0.5 rounded text-[10px] font-bold">
                      {post.role}
                    </span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#0D9488]">{post.category}</span>
                </div>

                <h3 className="text-sm font-extrabold app-text-primary">{post.title}</h3>
                <p className="text-xs app-text-secondary leading-relaxed">{post.content}</p>

                <div className="pt-2 border-t app-border flex items-center gap-4 text-xs app-text-muted">
                  <button
                    onClick={() =>
                      setPosts(posts.map((p) => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p)))
                    }
                    className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likes} Helpful</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} Responses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'specialists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {specialists.map((sp) => {
            const isShared = sharedSpecialistId === sp.id;
            return (
              <div
                key={sp.id}
                className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {sp.rating}
                    </span>
                    {sp.telehealth && (
                      <span className="text-[10px] bg-[#F0FDFA] dark:bg-[#134E4A] text-[#0D9488] dark:text-[#5EEAD4] px-2 py-0.5 rounded-md font-bold">
                        Telehealth
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold app-text-primary">{sp.name}</h3>
                  <div className="text-xs text-[#7C4DBA] font-medium">{sp.credentials}</div>
                  <div className="text-xs app-text-muted">{sp.clinic}</div>

                  <p className="text-xs app-text-secondary leading-relaxed pt-1">{sp.bio}</p>
                </div>

                <button
                  onClick={() => setSharedSpecialistId(sp.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isShared
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-2xs hover:opacity-95'
                  }`}
                >
                  {isShared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  <span>{isShared ? 'Progress Report Shared!' : 'Share Lingua Progress Report'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* New Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl app-bg-surface p-6 shadow-2xl border app-border space-y-4 app-text-primary">
            <h3 className="text-base font-extrabold app-text-primary">Start a New Discussion</h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-xs font-bold app-text-secondary block mb-1">Title:</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Questions about 3rd grade reading..."
                  className="w-full rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold app-text-secondary block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl border app-border p-2 text-xs app-bg-surface app-text-primary"
                >
                  <option>Discussions</option>
                  <option>Resources</option>
                  <option>Questions</option>
                  <option>Experiences</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold app-text-secondary block mb-1">Message:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Type your question or experience..."
                  className="w-full rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t app-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold app-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
