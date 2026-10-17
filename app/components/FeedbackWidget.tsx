'use client';
import { useState } from 'react';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'feedback' | 'feature'>('feature');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setIsOpen(false);
    }, 2200);
  };

  return (
    <>
      {/* Floating Right-Side Tab */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-3 py-3 rounded-l-2xl shadow-2xl shadow-blue-600/50 [writing-mode:vertical-rl] rotate-180 transition tracking-wider border-l border-t border-b border-blue-400/40 flex items-center gap-2"
      >
        <span>💬 Feedback & Feature Request</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl relative animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-widest">JobAllies Support</span>
                <h3 className="text-xl font-black text-white">Send Feedback or Feature Request</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-xl"
              >
                ✕
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('feature')}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition ${
                      feedbackType === 'feature'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    💡 Feature Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('feedback')}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition ${
                      feedbackType === 'feedback'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    🛠️ General Feedback
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {feedbackType === 'feature' ? 'What feature would make JobAllies better for you?' : 'Tell us what is working or what we can improve:'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your idea or feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-lg shadow-blue-600/30"
                >
                  Submit to Engineering Team →
                </button>
              </form>
            ) : (
              <div className="bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2">
                <p className="text-lg font-extrabold text-emerald-400">✓ Thank You!</p>
                <p className="text-xs text-slate-300">Your feedback has been routed directly to the JobAllies product team.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
