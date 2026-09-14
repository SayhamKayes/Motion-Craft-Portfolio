import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Plus, Quote } from 'lucide-react';
import { Testimonial, SiteSettings } from '../../types';
import { playSound } from '../../utils/audio';
import { subscribeToTestimonials } from '../../services/firebaseTestimonials';

interface TestimonialsSectionProps {
  isActive: boolean;
  settings: SiteSettings;
  onOpenReviewModal: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  isActive,
  settings,
  onOpenReviewModal,
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToTestimonials((data) => {
      // Filter based on settings
      const filtered = data.filter((t) => {
        if (t.status !== 'approved') return false;
        if (settings.testimonialMinRating && t.rating < settings.testimonialMinRating) return false;
        return true;
      });
      setTestimonials(filtered);
      setActiveIndex(Math.floor(filtered.length / 2)); // Center the active item initially
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [settings.testimonialMinRating]);

  // Auto-play logic
  useEffect(() => {
    if (testimonials.length <= 1 || isHovered || dragStartX !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // slide every 4 seconds
    return () => clearInterval(interval);
  }, [testimonials.length, isHovered, dragStartX]);

  // Drag logic
  const handleDragStart = (clientX: number) => {
    setDragStartX(clientX);
  };

  const handleDragEnd = (clientX: number) => {
    if (dragStartX === null) return;
    const diff = clientX - dragStartX;
    if (diff > 50) {
      // Swiped right -> go to previous
      setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else if (diff < -50) {
      // Swiped left -> go to next
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }
    setDragStartX(null);
  };

  return (
    <section
      id="section-testimonials"
      className="relative w-full min-h-screen flex flex-col justify-between px-6 sm:px-16 pt-24 pb-8 overflow-hidden select-none z-10"
    >
      {/* Header & Button */}
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>05 / Client Feedback</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Testimonials
          </h2>
        </div>

        <button
          onClick={() => {
            playSound('click', settings.soundEnabled);
            onOpenReviewModal();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-mono-code text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Leave a Review</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div
        className={`my-auto py-10 w-full transition-all duration-700 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div 
            className="relative w-full h-[450px] flex justify-center items-center overflow-hidden touch-none" 
            style={{ perspective: '1000px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={(e) => {
              setIsHovered(false);
              if (dragStartX !== null) handleDragEnd(e.clientX);
            }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseUp={(e) => handleDragEnd(e.clientX)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
          >
            {testimonials.map((testimonial, idx) => {
              // Calculate infinite wrap offset
              let offset = (idx - activeIndex) % testimonials.length;
              if (offset > Math.floor(testimonials.length / 2)) {
                offset -= testimonials.length;
              } else if (offset < -Math.floor(testimonials.length / 2)) {
                offset += testimonials.length;
              }
              
              const absOffset = Math.abs(offset);

              const translateX = offset * 140; // Horizontal shift
              const scale = 1 - absOffset * 0.15; // Scale down side cards
              const rotateY = offset * -15; // Rotate towards center
              const zIndex = testimonials.length - absOffset;
              const opacity = absOffset > 3 ? 0 : 1;
              const pointerEvents = opacity === 0 ? 'none' : 'auto';

              return (
                <div
                  key={testimonial.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`absolute w-[300px] h-[400px] flex flex-col p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer ${offset === 0 ? 'border-cyan-400/70' : 'border-white/20 hover:border-white/40 blur-[2px]'
                    }`}
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity,
                    pointerEvents,
                  }}
                >
                  {/* Large Protruding Quote Icon */}
                  <div className="absolute -top-8 -right-6 z-30 opacity-90 text-cyan-400 drop-shadow-[8px_20px_20px_rgba(0,0,0,0.9)] pointer-events-none">
                    <Quote size={100} strokeWidth={1} className="fill-cyan-400/30" />
                  </div>

                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.1] to-transparent pointer-events-none opacity-80 rounded-t-2xl" />

                  {/* Centered Stars and Message in middle */}
                  <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto custom-scrollbar relative z-10 mb-6 px-2 text-center">
                    <div className="flex justify-center gap-1.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'
                            }`}
                        />
                      ))}
                    </div>
                    <p 
                      className={`text-white/80 font-body italic w-full break-words ${
                        testimonial.message.length > 250 ? 'text-[11px] leading-relaxed' :
                        testimonial.message.length > 150 ? 'text-[13px] leading-relaxed' :
                        'text-[15px] leading-relaxed'
                      }`}
                    >
                      "{testimonial.message}"
                    </p>
                  </div>

                  {/* Profile info at bottom (only if some info exists) */}
                  {(testimonial.image || testimonial.name || testimonial.role || testimonial.country) && (
                    <div className="flex items-center gap-4 relative z-10 pt-4 border-t border-white/10">
                      {testimonial.image && (
                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border border-white/20 flex-shrink-0" />
                      )}
                      <div className="flex flex-col flex-1 min-w-0">
                        {testimonial.name && (
                          <h3 className="text-white font-display font-bold text-[15px] leading-tight truncate">{testimonial.name}</h3>
                        )}
                        {(testimonial.role || testimonial.country) && (
                          <p className="text-cyan-400 text-[10px] font-mono-code uppercase mt-1 truncate">
                            {testimonial.role ? testimonial.role : ''}{testimonial.role && testimonial.country ? ', ' : ''}{testimonial.country ? testimonial.country : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-400 opacity-0 transition-opacity duration-300 rounded-b-2xl z-20 group-hover:opacity-100" />

                  {/* Dark Overlay for inactive cards */}
                  {offset !== 0 && (
                    <div className="absolute inset-0 bg-black/40 z-30 pointer-events-none rounded-2xl" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/20 rounded-2xl bg-white/[0.02]">
            <MessageSquare className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-white font-display text-xl mb-2">No Reviews Yet</h3>
            <p className="text-white/50 text-sm font-mono-code">Be the first to leave a review!</p>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div
        className={`flex items-center justify-between text-xs text-white/40 font-mono-code pt-3 border-t border-white/10 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <span>WHAT PEOPLE SAY</span>
        <span className="text-cyan-400/80">AUTHENTIC FEEDBACK</span>
      </div>

    </section>
  );
};
