import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const posts = [
            { id: 1, title: 'POST 01', type: 'image', src: '01.jpg' },
            { id: 2, title: 'POST 02', type: 'carousel', images: ['02.01.png', '02.02.png', '02.03.png'] },
            { id: 3, title: 'POST 03', type: 'image', src: '03.png' },
            { id: 4, title: 'BÔNUS', type: 'image', src: 'bonus.jpg' }
        ];

        function App() {
            const [selectedPost, setSelectedPost] = useState(null);
            const [subIndex, setSubIndex] = useState(0);

            // Reseta o subIndex quando troca de post
            useEffect(() => {
                setSubIndex(0);
            }, [selectedPost]);

            const handleNext = (e) => {
                if(e) e.stopPropagation();
                const current = posts[selectedPost];
                if (current.type === 'carousel' && subIndex < current.images.length - 1) {
                    setSubIndex(prev => prev + 1);
                } else if (selectedPost < posts.length - 1) {
                    setSelectedPost(prev => prev + 1);
                }
            };

            const handlePrev = (e) => {
                if(e) e.stopPropagation();
                if (subIndex > 0) {
                    setSubIndex(prev => prev - 1);
                } else if (selectedPost > 0) {
                    setSelectedPost(prev => prev - 1);
                }
            };

            const closeFocus = () => setSelectedPost(null);

            useEffect(() => {
                const handleKeyDown = (e) => {
                    if (selectedPost === null) return;
                    if (e.key === 'Escape') closeFocus();
                    if (e.key === 'ArrowRight') handleNext(e);
                    if (e.key === 'ArrowLeft') handlePrev(e);
                };
                window.addEventListener('keydown', handleKeyDown);
                return () => window.removeEventListener('keydown', handleKeyDown);
            });

            const scrollRef = useRef(null);

            const scrollGrid = (direction) => {
                if (scrollRef.current) {
                    const scrollAmount = direction === 'left' ? -300 : 300;
                    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            };

            return (
                <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
                    {/* Background Layer Mobile */}
                    <motion.div 
                        animate={{ scale: selectedPost !== null ? 1.05 : 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat lg:hidden"
                        style={{ backgroundImage: `url('bg-mobile.jpg')` }}
                    />
                    
                    {/* Background Layer Desktop */}
                    <motion.div 
                        animate={{ scale: selectedPost !== null ? 1.05 : 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat hidden lg:block"
                        style={{ backgroundImage: `url('bg-luminus.jpg')` }}
                    />
                    
                    {/* Ambient Light / Oclusão */}
                    <motion.div 
                        animate={{ opacity: selectedPost !== null ? 0.6 : 0.2 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 z-1 bg-black mix-blend-multiply pointer-events-none" 
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[800px] lg:h-[800px] bg-cyan-500/10 blur-[100px] lg:blur-[150px] rounded-full z-1 pointer-events-none" />
                    
                    <div className="relative z-10 w-full h-full flex flex-col p-4 lg:p-8 pt-6 lg:pt-12 max-w-[1400px] mx-auto">
                        
                        {/* Header Fixo */}
                        <motion.header 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-full flex flex-col lg:flex-row justify-between items-center px-6 lg:px-10 py-4 lg:py-6 glass-panel rounded-3xl lg:rounded-full relative z-50 gap-4 lg:gap-0"
                        >
                            <img src="logo-luminus.png" alt="Luminus" className="h-6 lg:h-8 object-contain" />
                            <div className="cyber-font text-[10px] lg:text-sm tracking-[0.2em] lg:tracking-[0.3em] text-white/50 uppercase text-center">
                                {selectedPost !== null ? 'FOCUS MODE' : 'NEX x LUMINUS'}
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedPost !== null ? (
                                    <button onClick={closeFocus} className="text-white/50 hover:text-cyan-400 transition-colors flex items-center gap-2 cyber-font text-[10px] lg:text-xs tracking-widest">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        FECHAR
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                        <span className="text-cyan-400 text-[10px] lg:text-xs tracking-widest font-bold">SYSTEM ONLINE</span>
                                    </div>
                                )}
                            </div>
                        </motion.header>

                        {/* Visão de Grid (Fase 1 - Enxuto) */}
                        <AnimatePresence>
                            {selectedPost === null && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-1 w-full flex flex-col items-center justify-center relative mt-4 lg:mt-12"
                                >
                                    
                                    {/* Setas de navegação da grid */}
                                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-20 px-2 lg:px-4 lg:hidden">
                                        <button onClick={() => scrollGrid('left')} className="w-10 h-10 lg:w-14 lg:h-14 rounded-full glass-panel flex items-center justify-center text-cyan-400 pointer-events-auto hover:bg-cyan-500/20 transition-all border border-cyan-400/30">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button onClick={() => scrollGrid('right')} className="w-10 h-10 lg:w-14 lg:h-14 rounded-full glass-panel flex items-center justify-center text-cyan-400 pointer-events-auto hover:bg-cyan-500/20 transition-all border border-cyan-400/30">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>

                                    <div 
                                        ref={scrollRef}
                                        className="w-full flex flex-row lg:justify-center items-center gap-6 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-hidden px-12 lg:px-12 py-8"
                                    >
                                        {posts.map((post, idx) => (
                                            <motion.div
                                                key={post.id}
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.15, type: "spring", damping: 20 }}
                                                whileHover={{ scale: 1.05, y: -10 }}
                                                onClick={() => setSelectedPost(idx)}
                                                className="relative group cursor-pointer snap-center shrink-0"
                                            >
                                                <div className="p-2 glass-panel rounded-2xl transition-all duration-500 group-hover:neon-glow group-hover:border-cyan-500/30">
                                                    <div className="relative overflow-hidden rounded-xl w-[260px] h-[340px] lg:w-[270px] lg:h-[350px] bg-black/40 flex items-center justify-center">
                                                        <img 
                                                            src={post.type === 'image' ? post.src : post.images[0]} 
                                                            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                                        
                                                        {post.type === 'carousel' && (
                                                            <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full flex gap-1">
                                                                {post.images.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50" />)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-100 lg:opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-1 h-6 lg:h-8 bg-gradient-to-b from-cyan-400 to-transparent" />
                                                    <span className="cyber-font text-[10px] lg:text-xs tracking-[0.2em] text-cyan-400">{post.title}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Visão Focada (Fase 3 - Foco Absoluto) */}
                        <AnimatePresence>
                            {selectedPost !== null && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute inset-x-0 bottom-0 top-[180px] lg:top-[120px] flex items-center justify-center z-40 px-2 lg:px-12 pb-4 lg:pb-8"
                                    onClick={closeFocus}
                                >
                                    <div className="relative flex items-center justify-center w-full max-w-5xl" onClick={e => e.stopPropagation()}>
                                        
                                        {/* Botão Anterior */}
                                        <motion.button
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: (selectedPost > 0 || subIndex > 0) ? 1 : 0, x: 0 }}
                                            whileHover={{ scale: 1.1, x: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handlePrev}
                                            disabled={selectedPost === 0 && subIndex === 0}
                                            className="absolute left-2 lg:-left-20 w-10 h-10 lg:w-16 lg:h-16 rounded-full glass-panel flex items-center justify-center text-white/70 hover:text-cyan-400 transition-colors z-50 border border-white/10 disabled:pointer-events-none bg-black/60 lg:bg-transparent"
                                        >
                                            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </motion.button>

                                        {/* Imagem em Destaque */}
                                        <motion.div layoutId={`post-${selectedPost}`} className="p-1 lg:p-2 glass-panel rounded-2xl neon-glow relative">
                                            <div className="relative overflow-hidden rounded-xl flex items-center justify-center bg-black/40">
                                                <AnimatePresence mode="wait">
                                                    <motion.img
                                                        key={`${selectedPost}-${subIndex}`}
                                                        initial={{ opacity: 0, scale: 1.05 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.4 }}
                                                        src={posts[selectedPost].type === 'image' ? posts[selectedPost].src : posts[selectedPost].images[subIndex]}
                                                        className="max-w-[85vw] max-h-[55vh] lg:max-h-[65vh] w-auto h-auto object-contain"
                                                    />
                                                </AnimatePresence>
                                            </div>
                                            
                                            {/* Badge Lateral no Foco */}
                                            <div className="hidden lg:flex absolute -left-24 top-1/2 -translate-y-1/2 glass-panel px-6 py-4 rounded-3xl flex-col items-center">
                                                <span className="cyber-font text-xs tracking-widest text-cyan-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                                    {posts[selectedPost].title}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Ações Externas (Download e Fechar) */}
                                        <div className="absolute top-[-50px] right-2 lg:top-0 lg:-right-20 flex flex-row lg:flex-col gap-2 z-50">
                                            <button 
                                                onClick={closeFocus}
                                                className="glass-panel p-2 lg:p-3 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-400/50 transition-all text-white/70 flex items-center justify-center cursor-pointer"
                                                title="Fechar"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <a 
                                                href={posts[selectedPost].type === 'image' ? posts[selectedPost].src : posts[selectedPost].images[subIndex]} 
                                                download 
                                                onClick={(e) => e.stopPropagation()}
                                                className="glass-panel p-2 lg:p-3 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-400/50 transition-all text-white/70 flex items-center justify-center cursor-pointer"
                                                title="Baixar Imagem"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </a>
                                        </div>

                                        {/* Botão Próximo */}
                                        <motion.button
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: (selectedPost < posts.length - 1 || (posts[selectedPost].type === 'carousel' && subIndex < posts[selectedPost].images.length - 1)) ? 1 : 0, x: 0 }}
                                            whileHover={{ scale: 1.1, x: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleNext}
                                            disabled={selectedPost === posts.length - 1 && (posts[selectedPost].type !== 'carousel' || subIndex === posts[selectedPost].images.length - 1)}
                                            className="absolute right-2 lg:-right-20 w-10 h-10 lg:w-16 lg:h-16 rounded-full glass-panel flex items-center justify-center text-white/70 hover:text-cyan-400 transition-colors z-50 border border-white/10 disabled:pointer-events-none bg-black/60 lg:bg-transparent"
                                        >
                                            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.button>
                                        
                                        {/* Indicadores do Carrossel Interno */}
                                        {posts[selectedPost].type === 'carousel' && (
                                            <div className="absolute -bottom-8 lg:-bottom-16 left-1/2 -translate-x-1/2 flex gap-2 lg:gap-3">
                                                {posts[selectedPost].images.map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`h-1.5 rounded-full transition-all duration-500 ${i === subIndex ? 'w-8 lg:w-12 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-3 lg:w-4 bg-white/20'}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            );
        }

export default App;
