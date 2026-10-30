import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Utensils,
  BookOpen,
  HelpCircle,
  Send,
  X,
  Sparkles,
} from 'lucide-react';
import { CommunityPost } from '../types';

export const CommunityView: React.FC = () => {
  const { communityPosts, toggleLikePost, addComment, addPost, userRole } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'recipe' | 'observation' | 'qna'>('all');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>('post-1');
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  // New post modal states
  const [showAddPost, setShowAddPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'recipe' | 'observation' | 'qna'>('recipe');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/images/hongsi_dessert_latte_1793276097126.jpg');

  const filteredPosts = communityPosts.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleSendComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;
    addComment(postId, text.trim());
    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addPost({
      author: userRole === 'child' ? '어린이 탐구자' : '학부모 집사',
      authorRole: userRole,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      imageUrl: newImage,
      tags: newCategory === 'recipe' ? ['홍시디저트', '홈카페', '초간단'] : ['관찰일지', '스마트온실'],
    });

    setNewTitle('');
    setNewContent('');
    setShowAddPost(false);
  };

  const categories = [
    { id: 'all' as const, label: '전체 피드' },
    { id: 'recipe' as const, label: '홍시 레시피 🍯' },
    { id: 'observation' as const, label: '관찰 공유 📸' },
    { id: 'qna' as const, label: 'Q&A 질문방 💬' },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* Top Banner & Post Action */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-600" />
            홍시 온실 커뮤니티 라운지
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">
            관찰 기록과 달콤한 홍시 요리 레시피를 이웃들과 나눠보세요
          </p>
        </div>
        <button
          onClick={() => setShowAddPost(true)}
          className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>공유하기</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap min-h-[34px] ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommentsOpen = expandedCommentsPostId === post.id;
          return (
            <article
              key={post.id}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-3"
            >
              {/* Author & Category Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {post.author.slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">{post.author}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{post.date}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    post.category === 'recipe'
                      ? 'bg-amber-100 text-amber-800'
                      : post.category === 'observation'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {post.category === 'recipe' ? '레시피' : post.category === 'observation' ? '관찰일지' : 'Q&A'}
                </span>
              </div>

              {/* Title & Content */}
              <div>
                <h3 className="font-bold text-sm text-stone-900 leading-snug">{post.title}</h3>
                <p className="text-xs text-stone-700 leading-relaxed mt-1.5 whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Photo Image Asset */}
              {post.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-16/10 bg-stone-100 border border-stone-200/60 shadow-inner">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Post Footer (Likes & Comments buttons) */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-stone-50 text-rose-600 font-semibold transition-colors"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span>좋아요 {post.likes}</span>
                </button>

                <button
                  onClick={() =>
                    setExpandedCommentsPostId(isCommentsOpen ? null : post.id)
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-stone-50 text-stone-600 font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>댓글 {post.comments.length}개</span>
                </button>
              </div>

              {/* Comments Section Drawer */}
              {isCommentsOpen && (
                <div className="pt-2 border-t border-stone-100 space-y-2 bg-stone-50/70 p-3 rounded-2xl">
                  {/* Comments list */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {post.comments.map((c) => (
                      <div key={c.id} className="text-xs bg-white p-2 rounded-xl border border-stone-200/50 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] mb-0.5">
                          <span className="font-bold text-stone-900">{c.author}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{c.date}</span>
                        </div>
                        <p className="text-stone-700 leading-tight">{c.text}</p>
                      </div>
                    ))}
                    {post.comments.length === 0 && (
                      <div className="text-center text-xs text-stone-400 py-2">
                        첫 번째 따뜻한 댓글을 남겨보세요!
                      </div>
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="칭찬이나 질문을 남겨보세요..."
                      value={commentInput[post.id] || ''}
                      onChange={(e) =>
                        setCommentInput({ ...commentInput, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="p-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Write Post / Recipe Modal */}
      {showAddPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-sm max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm text-stone-900">새 관찰 이야기 및 레시피 공유</h3>
              </div>
              <button
                onClick={() => setShowAddPost(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">카테고리</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory('recipe')}
                    className={`py-2 rounded-xl font-semibold border ${
                      newCategory === 'recipe'
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    홍시 레시피
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory('observation')}
                    className={`py-2 rounded-xl font-semibold border ${
                      newCategory === 'observation'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    관찰 일지
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory('qna')}
                    className={`py-2 rounded-xl font-semibold border ${
                      newCategory === 'qna'
                        ? 'bg-purple-100 border-purple-300 text-purple-900'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    Q&A 질문
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍시 샤베트 아이스크림 만들기! 초간단 팁"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">내용 및 조리법</label>
                <textarea
                  required
                  rows={4}
                  placeholder="재료 준비, 만드는 법, 온실에서 수확한 홍시 꿀맛 포인트를 적어주세요!"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">대표 이미지 첨부</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() =>
                      setNewImage('/src/assets/images/hongsi_dessert_latte_1793276097126.jpg')
                    }
                    className={`p-1.5 rounded-xl border-2 cursor-pointer ${
                      newImage.includes('latte') ? 'border-orange-500 bg-orange-50' : 'border-stone-200'
                    }`}
                  >
                    <img
                      src="/src/assets/images/hongsi_dessert_latte_1793276097126.jpg"
                      alt="홍시 디저트"
                      className="rounded-lg aspect-16/10 object-cover"
                    />
                    <span className="text-[10px] text-center block mt-1 font-semibold">
                      홍시 라떼 디저트
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      setNewImage('/src/assets/images/ripe_hongsi_persimmon_1793276096985.jpg')
                    }
                    className={`p-1.5 rounded-xl border-2 cursor-pointer ${
                      newImage.includes('persimmon') ? 'border-orange-500 bg-orange-50' : 'border-stone-200'
                    }`}
                  >
                    <img
                      src="/src/assets/images/ripe_hongsi_persimmon_1793276096985.jpg"
                      alt="완숙 감"
                      className="rounded-lg aspect-16/10 object-cover"
                    />
                    <span className="text-[10px] text-center block mt-1 font-semibold">
                      완숙 홍시 과일
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPost(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-stone-900"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  게시글 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
