import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { PRODUCTS } from '../api/productsData';

const STEPS = [
  {
    id: 'skin_type',
    question: 'What is your skin type?',
    subtitle: 'Choose the one that best describes your skin most days.',
    options: [
      { label: 'Dry', desc: 'Tight, flaky, or rough texture', emoji: '🏜️', value: 'dry' },
      { label: 'Oily', desc: 'Shiny by midday, visible pores', emoji: '✨', value: 'oily' },
      { label: 'Combination', desc: 'Oily T-zone, dry cheeks', emoji: '⚖️', value: 'combination' },
      { label: 'Sensitive', desc: 'Reacts easily, prone to redness', emoji: '🌸', value: 'sensitive' },
      { label: 'Normal', desc: 'Balanced, rarely reacts', emoji: '🌿', value: 'normal' },
    ]
  },
  {
    id: 'concern',
    question: 'What is your primary skin concern?',
    subtitle: 'Pick the one you want to target most right now.',
    options: [
      { label: 'Anti-Aging', desc: 'Fine lines, firmness, elasticity', emoji: '⏳', value: 'aging' },
      { label: 'Brightening', desc: 'Dullness, dark spots, uneven tone', emoji: '☀️', value: 'brightening' },
      { label: 'Hydration', desc: 'Dry patches, loss of plumpness', emoji: '💧', value: 'hydration' },
      { label: 'Acne & Pores', desc: 'Breakouts, congestion, oiliness', emoji: '🎯', value: 'acne' },
      { label: 'Texture', desc: 'Rough, bumpy, or uneven surface', emoji: '🔬', value: 'texture' },
    ]
  },
  {
    id: 'routine',
    question: 'How involved is your current routine?',
    subtitle: 'We will match your results to how much time you have.',
    options: [
      { label: 'Minimal', desc: '1–2 steps, keep it simple', emoji: '⚡', value: 'minimal' },
      { label: 'Moderate', desc: '3–5 steps, some dedication', emoji: '🛤️', value: 'moderate' },
      { label: 'Full Routine', desc: '6+ steps, all-in', emoji: '💎', value: 'full' },
    ]
  },
  {
    id: 'tools',
    question: 'Are you open to beauty tools?',
    subtitle: 'Devices can accelerate results significantly.',
    options: [
      { label: 'Yes, absolutely', desc: 'I want the full clinical experience', emoji: '🔋', value: 'yes' },
      { label: 'Maybe one', desc: 'Open to one key device', emoji: '🤔', value: 'maybe' },
      { label: 'Products only', desc: 'I prefer serums and creams', emoji: '🧴', value: 'no' },
    ]
  },
];

// Recommendation logic
function getRecommendations(answers) {
  const { skin_type, concern, routine, tools } = answers;
  const all = PRODUCTS;

  // Score each product
  const scored = all.map(p => {
    let score = 0;
    const tags = (p.tags || []).map(t => t.toLowerCase());
    const name = (p.name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    // Skin type matching
    if (skin_type === 'dry' && (tags.includes('dry') || desc.includes('hydrat') || desc.includes('moisture'))) score += 3;
    if (skin_type === 'oily' && (tags.includes('oily') || desc.includes('oil control') || desc.includes('mattif'))) score += 3;
    if (skin_type === 'sensitive' && (tags.includes('sensitive') || desc.includes('gentle') || desc.includes('soothing'))) score += 3;
    if (skin_type === 'combination' && (tags.includes('combination') || desc.includes('balance'))) score += 2;

    // Concern matching
    if (concern === 'aging' && (desc.includes('retinol') || desc.includes('peptide') || desc.includes('collagen') || desc.includes('anti-ag') || name.includes('retinol') || name.includes('peptide') || name.includes('microcurrent') || name.includes('lift'))) score += 4;
    if (concern === 'brightening' && (desc.includes('vitamin c') || desc.includes('niacinamide') || desc.includes('brightening') || name.includes('vitamin c') || name.includes('glow') || name.includes('brightening') || name.includes('led'))) score += 4;
    if (concern === 'hydration' && (desc.includes('hyaluronic') || desc.includes('hydrat') || name.includes('hyaluronic') || name.includes('moistur'))) score += 4;
    if (concern === 'acne' && (desc.includes('salicylic') || desc.includes('niacinamide') || desc.includes('pore') || name.includes('acne') || name.includes('salicylic') || name.includes('cleanser'))) score += 4;
    if (concern === 'texture' && (desc.includes('exfoliat') || desc.includes('aha') || desc.includes('bha') || name.includes('roller') || name.includes('exfoliat') || name.includes('gua'))) score += 4;

    // Tool preference
    if (tools === 'no' && cat === 'tools & devices') score -= 3;
    if (tools === 'yes' && cat === 'tools & devices') score += 2;
    if (tools === 'maybe' && cat === 'tools & devices') score += 1;

    // Routine depth — prefer skincare for minimal
    if (routine === 'minimal' && cat === 'skincare') score += 1;
    if (routine === 'full' && cat === 'tools & devices') score += 1;

    // Bestseller boost
    if (p.badge === 'BESTSELLER') score += 1;

    return { ...p, score };
  });

  // Sort by score, take top 4 (ensure mix of categories if tools allowed)
  const sorted = scored.sort((a, b) => b.score - a.score);

  // Deduplicate categories slightly — pick top 4 varied results
  const picks = [];
  const seenCats = {};
  for (const p of sorted) {
    if (picks.length >= 4) break;
    const c = p.category;
    if (!seenCats[c] || seenCats[c] < 2) {
      picks.push(p);
      seenCats[c] = (seenCats[c] || 0) + 1;
    }
  }

  // Fallback: just top 4
  return picks.length >= 2 ? picks : sorted.slice(0, 4);
}

const CONCERN_LABELS = {
  aging: 'Anti-Aging', brightening: 'Brightening',
  hydration: 'Hydration', acne: 'Acne & Pores', texture: 'Texture'
};
const SKIN_LABELS = {
  dry: 'Dry', oily: 'Oily', combination: 'Combination',
  sensitive: 'Sensitive', normal: 'Normal'
};

export default function SkinQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [animating, setAnimating] = useState(false);

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  const select = (value) => {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    setAnimating(true);
    setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(step + 1);
      } else {
        setResults(getRecommendations(newAnswers));
      }
      setAnimating(false);
    }, 280);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff', minHeight: '100vh' }}>
      <SEO title="Skin Quiz — Find Your Perfect Routine" description="Answer 4 quick questions and we'll recommend the exact BYLVRA products for your skin type and concerns." />

      {!results ? (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 96px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>
              BYLVRA Routine Finder
            </p>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '12px' }}>
              Find your perfect<br />skin routine.
            </h1>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.6 }}>
              4 questions. Clinically matched results.
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>Step {step + 1} of {STEPS.length}</span>
              <span style={{ fontSize: '12px', color: '#888' }}>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
            </div>
            <div style={{ height: '4px', background: '#F0F0F0', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((step + 1) / STEPS.length) * 100}%`,
                background: 'linear-gradient(90deg, #FCE4EC, #B8E0D2)',
                borderRadius: '99px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateX(20px)' : 'translateX(0)', transition: 'opacity 0.25s, transform 0.25s' }}>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              {current.question}
            </h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>{current.subtitle}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {current.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => select(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    background: answers[current.id] === opt.value ? '#1A1A1A' : '#FAFAFA',
                    color: answers[current.id] === opt.value ? '#fff' : '#1A1A1A',
                    border: answers[current.id] === opt.value ? '2px solid #1A1A1A' : '2px solid #F0F0F0',
                    borderRadius: '12px', padding: '18px 20px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => { if (answers[current.id] !== opt.value) { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.background = '#F5F5F5'; }}}
                  onMouseLeave={e => { if (answers[current.id] !== opt.value) { e.currentTarget.style.borderColor = '#F0F0F0'; e.currentTarget.style.background = '#FAFAFA'; }}}
                >
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{opt.emoji}</span>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 2px' }}>{opt.label}</p>
                    <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>{opt.desc}</p>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0.4, flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={back}
              style={{
                marginTop: '24px', background: 'none', border: 'none',
                color: '#888', fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'Inter, sans-serif', padding: 0,
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}
        </div>
      ) : (
        /* Results */
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 96px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ width: '56px', height: '56px', background: '#B8E0D2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>✦</div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Your Results</p>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '16px' }}>
              Your {SKIN_LABELS[answers.skin_type]} Skin<br />{CONCERN_LABELS[answers.concern]} Routine
            </h1>
            <p style={{ fontSize: '15px', color: '#888', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Based on your answers, these are the products clinically matched to your skin type and goals.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
              {[
                `Skin type: ${SKIN_LABELS[answers.skin_type]}`,
                `Concern: ${CONCERN_LABELS[answers.concern]}`,
              ].map((tag, i) => (
                <span key={i} style={{
                  background: '#F5F5F5', color: '#555', fontSize: '12px',
                  fontWeight: '600', padding: '6px 14px', borderRadius: '99px',
                  letterSpacing: '0.3px',
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Product cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {results.map((p, i) => (
              <div key={p.id} style={{
                background: '#fff', borderRadius: '12px', overflow: 'hidden',
                border: '1px solid #F0F0F0', transition: 'all 0.3s',
                position: 'relative',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px', zIndex: 1,
                    background: '#1A1A1A', color: '#fff',
                    fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px',
                    padding: '4px 10px', borderRadius: '3px', textTransform: 'uppercase',
                  }}>Best Match</div>
                )}
                <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#F8F4F4' }}>
                  <img src={p.images?.[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  {p.badge && (
                    <span style={{
                      fontSize: '9px', fontWeight: '800', letterSpacing: '1.5px',
                      textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px',
                    }}>{p.badge}</span>
                  )}
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', marginBottom: '6px', lineHeight: 1.3 }}>{p.name}</p>
                  <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.5, marginBottom: '14px' }}>
                    {p.short_description || p.description?.substring(0, 80) + '…'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A1A' }}>${Number(p.price).toFixed(2)}</p>
                    <Link
                      to={`/products/${p.slug}`}
                      style={{
                        background: '#1A1A1A', color: '#fff', textDecoration: 'none',
                        fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                        textTransform: 'uppercase', padding: '10px 16px', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      View <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Retake / Shop all */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={reset} style={{
              background: '#F5F5F5', color: '#1A1A1A', border: 'none',
              padding: '14px 28px', borderRadius: '6px', fontSize: '13px',
              fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>Retake Quiz</button>
            <Link to="/collections/all" style={{
              background: '#1A1A1A', color: '#fff', textDecoration: 'none',
              padding: '14px 28px', borderRadius: '6px', fontSize: '13px',
              fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>Shop All Products <ArrowRight size={14} /></Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .quiz-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
