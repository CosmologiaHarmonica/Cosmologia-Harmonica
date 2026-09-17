'use client'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const canvasRef = useRef(null)
  const [audioStarted, setAudioStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2, speed: Math.random() * 0.05 + 0.01,
      opacity: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * Math.PI * 2, twinkleSpeed: Math.random() * 0.015 + 0.004,
    }))

    const GRID = 68
    let frame = 0, animId

    const drawChladni = (t) => {
      const m = 3 + 0.8 * Math.sin(t * 0.0004)
      const n = 4 + 0.8 * Math.cos(t * 0.00035)
      const mx = W * 0.05, my = H * 0.05
      const gw = W - mx * 2, gh = H - my * 2
      for (let i = 0; i <= GRID; i++) {
        for (let j = 0; j <= GRID; j++) {
          const x = (j / GRID) * Math.PI
          const y = (i / GRID) * Math.PI
          const z = Math.sin(m * x) * Math.cos(n * y) - Math.cos(m * x) * Math.sin(n * y)
          const brightness = Math.exp(-z * z * 16)
          if (brightness < 0.12) continue
          const px = mx + (j / GRID) * gw
          const py = my + (i / GRID) * gh
          const dist = Math.hypot(j / GRID - 0.5, i / GRID - 0.5)
          const hue = 45 + dist * 290
          ctx.beginPath()
          ctx.arc(px, py, brightness * 2.4, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${hue},85%,65%,${brightness * 0.6})`
          ctx.fill()
        }
      }
    }

    const drawFlower = (t) => {
      const cx = W / 2, cy = H / 2
      const r = Math.min(W, H) * 0.14
      const alpha = 0.05 + 0.02 * Math.sin(t * 0.001)
      const rot = t * 0.0009
      ctx.strokeStyle = `rgba(201,168,76,${alpha})`
      ctx.lineWidth = 0.7
      const arc = (x, y) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke() }
      arc(cx, cy)
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + rot
        arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + rot
        arc(cx + Math.cos(a) * r * 2, cy + Math.sin(a) * r * 2)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.85)
      bg.addColorStop(0, '#08082e')
      bg.addColorStop(0.45, '#05050f')
      bg.addColorStop(1, '#020208')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)
      stars.forEach(s => {
        s.y += s.speed; s.twinkle += s.twinkleSpeed
        if (s.y > H) { s.y = 0; s.x = Math.random() * W }
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(s.twinkle))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210,220,255,${s.opacity * tw})`; ctx.fill()
      })
      drawFlower(frame)
      drawChladni(frame)
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.08, W / 2, H / 2, H * 0.92)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(0.5, 'rgba(2,2,14,0.2)')
      vg.addColorStop(1, 'rgba(0,0,8,0.96)')
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
      frame++; animId = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const startAudio = () => {
    if (audioStarted) return
    const ac = new AudioContext()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain); gain.connect(ac.destination)
    osc.frequency.setValueAtTime(432, ac.currentTime)
    osc.type = 'sine'
    gain.gain.setValueAtTime(0, ac.currentTime)
    gain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 2)
    osc.start(); setAudioStarted(true)
  }

  const domains = [
    { icon: '∑', label: 'Matemática', sub: 'Proporções e Números', color: '#f59e0b' },
    { icon: '〜', label: 'Física & Acústica', sub: 'Frequência e Ondas', color: '#06b6d4' },
    { icon: '◎', label: 'Consciência', sub: 'Percepção e Intenção', color: '#a855f7' },
    { icon: '⌘', label: 'Cultura & História', sub: 'Sabedoria Ancestral', color: '#ec4899' },
    { icon: '♫', label: 'Música', sub: 'Escalas e Harmonia', color: '#10b981' },
    { icon: '✡', label: 'Geometria', sub: 'Formas e Padrões', color: '#c9a84c' },
  ]

  const patterns = ['Galáxias', 'Furacões', 'Ondas Sonoras', 'DNA', 'Cimática', 'Flores']

  const tools = [
    { num: '01', icon: '📖', color: '#c9a84c', glow: 'glow-gold',
      title: 'Cosmologia Harmônica', label: 'Conhecimento Estruturado',
      desc: 'Conteúdo organizado como um livro — partes, capítulos e sumários que integram história, ciência, espiritualidade e arte.',
      obj: 'Fornecer o mapa conceitual e o contexto da jornada.',
      tags: ['Livro Digital', 'Capítulos', 'Sumários'], href: null },
    { num: '02', icon: '🔭', color: '#a855f7', glow: 'glow-purple',
      title: 'Explorador de Escalas e Espectros', label: 'Visualização e Compreensão',
      desc: 'Régua universal logarítmica do comprimento de Planck (10⁻³⁵m) ao universo observável (10²⁷m). Espectros eletromagnético e acústico.',
      obj: 'Mostrar que padrões semelhantes se repetem em todas as escalas.',
      tags: ['Escala Cósmica', 'Espectro EM', 'Espectro Acústico'], href: '/sentidos.html' },
    { num: '03', icon: '🎵', color: '#10b981', glow: 'glow-green',
      title: 'Sintonizador Harmônico', label: 'Experiência Sonora e Afinação',
      desc: 'Explore 12-TET, Just Intonation, 3-6-9 e Ressonância de Schumann. Ouça como diferentes afinações afetam a percepção.',
      obj: 'Ouvir e sentir como diferentes afinações afetam a coerência.',
      tags: ['432 Hz', 'Just Intonation', 'Schumann', '3-6-9'], href: null },
    { num: '04', icon: '🎛️', color: '#06b6d4', glow: 'glow-cyan',
      title: 'Sintonizador Multidimensional Pro', label: 'Cimática 3D e Análise Avançada',
      desc: 'Visualização 3D de padrões cimáticos em tempo real. MIDI, ADSR, análise de espectro — som, luz, forma e movimento integrados.',
      obj: 'Ver a matéria respondendo ao som, revelando a geometria da vibração.',
      tags: ['Cimática 3D', 'MIDI', 'ADSR', 'Espectro'], href: '/sintonizador.html' },
  ]

  const journey = [
    { step: 'OBSERVAR', desc: 'Ver os padrões', color: '#c9a84c' },
    { step: 'COMPREENDER', desc: 'Entender as leis', color: '#06b6d4' },
    { step: 'SINTONIZAR', desc: 'Alinhar-se à harmonia', color: '#10b981' },
    { step: 'TRANSFORMAR', desc: 'Viver em coerência', color: '#a855f7' },
  ]

  const Sep = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '3.5rem 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3))' }} />
      <span style={{ color: '#c9a84c' }}>✦</span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.3))' }} />
    </div>
  )

  return (
    <main style={{ background: 'transparent', color: '#e8e0d0', fontFamily: 'Georgia, serif' }}>
      <style>{`
        html, body { background: #020208 !important; }
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity:.25; transform:scaleY(.6); }
          50%      { opacity:1;   transform:scaleY(1); }
        }
        .shimmer-gold {
          background: linear-gradient(90deg,#7a5c10 0%,#c9a84c 22%,#fff8d0 50%,#ffd700 72%,#c9a84c 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 7s linear infinite;
        }
        .hero-in { animation: fadeInUp 1.1s ease both; }
        .floating { animation: float 4s ease-in-out infinite; }
        .scroll-line {
          width:1px; height:52px;
          background: linear-gradient(to bottom,#c9a84c,transparent);
          animation: scrollPulse 2.2s ease-in-out infinite;
          transform-origin: top;
        }
        .tool-card {
          background: rgba(6,6,20,0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 14px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
          height: 100%;
          box-sizing: border-box;
        }
        .tool-card:hover { transform: translateY(-6px); }
        .glow-gold   { border: 1px solid rgba(201,168,76,.18); }
        .glow-gold:hover   { box-shadow: 0 8px 55px rgba(201,168,76,.25), inset 0 0 40px rgba(201,168,76,.04); border-color: rgba(201,168,76,.7); }
        .glow-purple { border: 1px solid rgba(168,85,247,.18); }
        .glow-purple:hover { box-shadow: 0 8px 55px rgba(168,85,247,.25), inset 0 0 40px rgba(168,85,247,.04); border-color: rgba(168,85,247,.7); }
        .glow-green  { border: 1px solid rgba(16,185,129,.18); }
        .glow-green:hover  { box-shadow: 0 8px 55px rgba(16,185,129,.25), inset 0 0 40px rgba(16,185,129,.04); border-color: rgba(16,185,129,.7); }
        .glow-cyan   { border: 1px solid rgba(6,182,212,.18); }
        .glow-cyan:hover   { box-shadow: 0 8px 55px rgba(6,182,212,.25), inset 0 0 40px rgba(6,182,212,.04); border-color: rgba(6,182,212,.7); }
        .domain-card {
          background: rgba(255,255,255,.022);
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 12px;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: all .3s ease;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: default;
        }
        .domain-card:hover { background: rgba(255,255,255,.055); transform: translateY(-4px); }
        .pattern-pill {
          border: 1px solid rgba(201,168,76,.2);
          color: #a09880;
          padding: .42rem 1.2rem;
          border-radius: 20px;
          font-size: .84rem;
          letter-spacing: .06em;
          transition: all .3s;
          cursor: default;
          background: transparent;
        }
        .pattern-pill:hover { border-color: rgba(201,168,76,.7); color: #c9a84c; background: rgba(201,168,76,.06); }
        .btn-outline {
          padding: 1rem 2.4rem;
          background: transparent;
          border: 1px solid #c9a84c;
          color: #c9a84c;
          cursor: pointer;
          letter-spacing: .2em;
          font-size: .85rem;
          text-transform: uppercase;
          font-family: Georgia, serif;
          transition: all .3s;
        }
        .btn-outline:hover { background: rgba(201,168,76,.1); box-shadow: 0 0 25px rgba(201,168,76,.25); }
        .btn-solid {
          padding: 1rem 2.4rem;
          background: #c9a84c;
          border: none;
          color: #020208;
          cursor: pointer;
          letter-spacing: .2em;
          font-size: .85rem;
          text-transform: uppercase;
          font-family: Georgia, serif;
          font-weight: 700;
          transition: all .3s;
        }
        .btn-solid:hover { background: #ffd700; box-shadow: 0 0 35px rgba(201,168,76,.5); transform: translateY(-2px); }
        .cta-big {
          padding: 1.3rem 4.5rem;
          background: #c9a84c;
          border: none;
          color: #020208;
          cursor: pointer;
          letter-spacing: .25em;
          font-size: 1rem;
          text-transform: uppercase;
          font-family: Georgia, serif;
          font-weight: 700;
          border-radius: 3px;
          transition: all .3s;
        }
        .cta-big:hover { background: #ffd700; box-shadow: 0 0 60px rgba(201,168,76,.6), 0 0 120px rgba(201,168,76,.2); transform: translateY(-3px); }
      `}</style>

      {/* ── CANVAS ── */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>

        <p className="hero-in" style={{ color: '#c9a84c', letterSpacing: '.35em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: '2rem', animationDelay: '.1s', opacity: 0.85 }}>
          Uma jornada sonora pelo universo
        </p>

        <h1 className="hero-in floating" style={{ fontSize: 'clamp(2.8rem,9vw,7rem)', fontWeight: 300, lineHeight: 1.08, marginBottom: '1rem', letterSpacing: '.04em', animationDelay: '.25s' }}>
          Cosmologia<br />
          <span className="shimmer-gold">Harmônica</span>
        </h1>

        <p className="hero-in" style={{ color: '#c9a84c', letterSpacing: '.28em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: '1.8rem', animationDelay: '.4s', opacity: 0.7 }}>
          Tudo é vibração&nbsp;•&nbsp;Tudo é padrão&nbsp;•&nbsp;Tudo é um
        </p>

        <p className="hero-in" style={{ color: '#a09880', fontSize: 'clamp(.95rem,2vw,1.15rem)', maxWidth: '520px', lineHeight: 2, marginBottom: '3rem', animationDelay: '.55s' }}>
          Onde a física das frequências encontra a sabedoria ancestral. Uma obra que ressoa além das palavras.
        </p>

        <div className="hero-in" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '.7s' }}>
          <button className="btn-outline" onClick={startAudio}>
            {audioStarted ? '✦ 432Hz Ativo' : '✦ Ativar 432Hz'}
          </button>
          <a href="#ecossistema" style={{ textDecoration: 'none' }}>
            <button className="btn-solid">Explorar o Livro</button>
          </a>
        </div>

        <div style={{ position: 'absolute', bottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
          <span style={{ color: '#4a4535', fontSize: '.68rem', letterSpacing: '.25em', textTransform: 'uppercase' }}>rolar</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── ECOSSISTEMA ── */}
      <section id="ecossistema" style={{ position: 'relative', zIndex: 10, padding: '7rem 2rem', maxWidth: '980px', margin: '0 auto' }}>

        <p style={{ color: '#c9a84c', letterSpacing: '.3em', fontSize: '.72rem', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1.2rem', opacity: .8 }}>
          ✦ O Ecossistema ✦
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 300, textAlign: 'center', lineHeight: 1.25, marginBottom: '1.5rem' }}>
          Um ecossistema interativo que revela<br />
          <span style={{ color: '#c9a84c' }}>a unidade por trás de tudo</span>
        </h2>
        <p style={{ color: '#a09880', textAlign: 'center', lineHeight: 1.95, maxWidth: '640px', margin: '0 auto 3.5rem', fontSize: '1rem' }}>
          Explorando escalas, espectros e padrões harmônicos que se repetem do infinitamente grande ao infinitamente pequeno — e do som à forma.
        </p>

        {/* 6 domínios */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {domains.map(d => (
            <div key={d.label} className="domain-card">
              <div style={{ fontSize: '2rem', marginBottom: '.6rem', color: d.color, textShadow: `0 0 20px ${d.color}` }}>{d.icon}</div>
              <div style={{ fontSize: '.88rem', color: '#e8e0d0', marginBottom: '.25rem' }}>{d.label}</div>
              <div style={{ fontSize: '.68rem', color: '#4a4535', lineHeight: 1.4 }}>{d.sub}</div>
            </div>
          ))}
        </div>

        <Sep />

        {/* Padrões */}
        <p style={{ color: '#c9a84c', letterSpacing: '.3em', fontSize: '.72rem', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1.5rem', opacity: .8 }}>
          Padrões que se repetem
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.75rem', marginBottom: '.8rem' }}>
          {patterns.map(p => <span key={p} className="pattern-pill">{p}</span>)}
        </div>
        <p style={{ textAlign: 'center', color: '#4a4535', fontSize: '.75rem', letterSpacing: '.2em', textTransform: 'uppercase' }}>
          Um mesmo princípio&nbsp;•&nbsp;Infinitas manifestações
        </p>

        <Sep />

        {/* 4 Ferramentas */}
        <p style={{ color: '#c9a84c', letterSpacing: '.3em', fontSize: '.72rem', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem', opacity: .8 }}>
          ✦ As 4 Ferramentas do Grimório ✦
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
          {tools.map(tool => {
            const inner = (
              <div className={`tool-card ${tool.glow}`}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right,transparent,${tool.color},transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.2rem' }}>
                  <span style={{ color: tool.color, fontFamily: 'monospace', fontSize: '.72rem', opacity: .5 }}>{tool.num}</span>
                  <span style={{ fontSize: '2rem' }}>{tool.icon}</span>
                </div>
                <h3 style={{ color: '#e8e0d0', fontSize: '1.1rem', fontWeight: 400, marginBottom: '.3rem' }}>{tool.title}</h3>
                <p style={{ color: tool.color, fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>{tool.label}</p>
                <p style={{ color: '#a09880', fontSize: '.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>{tool.desc}</p>
                <p style={{ color: '#4a4535', fontSize: '.76rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.25rem' }}>Objetivo: {tool.obj}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: tool.href ? '1.2rem' : 0 }}>
                  {tool.tags.map(t => (
                    <span key={t} style={{ background: `${tool.color}12`, border: `1px solid ${tool.color}28`, color: tool.color, padding: '.2rem .65rem', borderRadius: '20px', fontSize: '.68rem' }}>{t}</span>
                  ))}
                </div>
                {tool.href && <div style={{ color: tool.color, fontSize: '.82rem', letterSpacing: '.1em' }}>Abrir ferramenta →</div>}
              </div>
            )
            return tool.href
              ? <a key={tool.num} href={tool.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{inner}</a>
              : <div key={tool.num}>{inner}</div>
          })}
        </div>

        <Sep />

        {/* Jornada */}
        <p style={{ color: '#c9a84c', letterSpacing: '.3em', fontSize: '.72rem', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem', opacity: .8 }}>
          ✦ A Jornada ✦
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '1px', background: 'rgba(201,168,76,.1)', borderRadius: '12px', overflow: 'hidden', marginBottom: '4.5rem' }}>
          {journey.map((j, i) => (
            <div key={j.step} style={{ background: '#020208', padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ color: j.color, fontFamily: 'monospace', fontSize: '.68rem', marginBottom: '.75rem', opacity: .5 }}>0{i + 1}</div>
              <div style={{ fontSize: '.85rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.5rem', color: '#e8e0d0' }}>{j.step}</div>
              <div style={{ color: '#4a4535', fontSize: '.78rem' }}>{j.desc}</div>
            </div>
          ))}
        </div>

        {/* Ponte */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <p style={{ color: '#c9a84c', letterSpacing: '.3em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: '1.5rem', opacity: .8 }}>✦ A Tecnologia é a Ponte ✦</p>
          <p style={{ color: '#a09880', fontSize: '1.05rem', lineHeight: 1.95, maxWidth: '620px', margin: '0 auto 1.5rem' }}>
            Não estamos separados do universo. Somos parte de uma sinfonia cósmica de padrões, ritmos e proporções. Estas ferramentas transformam conhecimento ancestral e ciência moderna em experiências práticas de exploração e expansão da consciência.
          </p>
          <p style={{ color: '#4a4535', fontSize: '.75rem', letterSpacing: '.22em', textTransform: 'uppercase' }}>
            Tudo é vibração&nbsp;•&nbsp;Tudo é padrão&nbsp;•&nbsp;Tudo é um
          </p>
        </div>

        <Sep />

        {/* CTA */}
        <div style={{ textAlign: 'center', paddingBottom: '4rem' }}>
          <p style={{ color: '#a09880', fontSize: '.82rem', letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: '.75rem' }}>Acesso completo ao grimório</p>
          <p style={{ fontSize: 'clamp(2.2rem,7vw,4.5rem)', fontWeight: 300, marginBottom: '.4rem' }}>
            <span className="shimmer-gold">R$ 159,90</span>
          </p>
          <p style={{ color: '#4a4535', fontSize: '.82rem', marginBottom: '2.5rem', letterSpacing: '.05em' }}>
            Grimório completo&nbsp;·&nbsp;DropPlayer Pro&nbsp;·&nbsp;Biblioteca digital&nbsp;·&nbsp;4 ferramentas interativas
          </p>
          <button className="cta-big">Adquirir Acesso</button>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: '2rem', color: '#d9c99d', fontSize: '.82rem', lineHeight: 1.9, letterSpacing: '.06em' }}>
          <div style={{ fontWeight: 600, marginBottom: '.15rem' }}>Carlos Eduardo Xavier Junior</div>
          <div style={{ color: '#bca86d', textTransform: 'uppercase', letterSpacing: '.2em', fontSize: '.68rem' }}>K&apos;du PROD</div>
          <div style={{ marginTop: '.4rem', color: '#a09880' }}>Belo Horizonte - Brasil</div>
        </div>

      </section>
    </main>
  )
}