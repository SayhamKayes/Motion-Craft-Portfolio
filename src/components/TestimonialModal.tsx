import React, { useState, useEffect } from 'react';
import { Star, Upload, X, Check, Image as ImageIcon, Send } from 'lucide-react';
import { addTestimonial } from '../services/firebaseTestimonials';
import { COUNTRIES } from '../constants/countries';

interface TestimonialModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const TestimonialModal: React.FC<TestimonialModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !country.trim()) {
      setError('Please fill in the required fields (Message and Country).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: any = {
      name: name.trim(),
      role: role.trim(),
      country: country.trim(),
      rating,
      message: message.trim(),
      status: 'approved'
    };
    if (image) payload.image = image;

    const id = await addTestimonial(payload);

    setIsSubmitting(false);

    if (id) {
      onSuccess();
    } else {
      setError('Failed to submit your review. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl glass-panel border border-emerald-500/40 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 bg-slate-950/80"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-display font-black text-2xl text-white mb-2">Leave a Review</h2>
            <p className="text-sm text-white/60 font-mono-code">Your feedback helps me improve.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono-code">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-1.5">Profile Picture (Optional)</label>
              <div className="flex items-center gap-4">
                {image ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/50">
                    <img src={image} alt="Profile preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/5 transition-all text-white/50 hover:text-emerald-400">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Upload className="w-5 h-5" />
                  </label>
                )}
                <span className="text-xs text-white/40 font-mono-code">
                  Upload a photo to personalize your review.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono-code focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-1.5">Role / Designation</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono-code focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all"
                placeholder="CEO at TechCorp"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-1.5">Country *</label>
              <div className="relative">
                <select
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono-code focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all appearance-none pr-10 cursor-pointer"
                >
                  <option value="" className="bg-gray-900 text-white">Select Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-gray-900 text-white">{c}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-1.5">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono-code h-28 resize-none focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all"
                placeholder="Share your experience working with me..."
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-mono-code text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Submitting...</span>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
