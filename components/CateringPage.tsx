
import React, { useState } from 'react';
import { ChefHat, Calendar, Users, Mail, CheckCircle, Phone, PartyPopper, Briefcase, Heart } from 'lucide-react';
import { dbService } from '../services/dbService';

const CateringPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    date: '',
    guestCount: 50,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createCateringRequest(formData);
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', eventType: 'Wedding', date: '', guestCount: 50, message: '' });
    }, 5000);
  };

  const services = [
    { title: 'Weddings', icon: Heart, desc: 'Make your special day unforgettable with our exquisite fusion menus tailored to your taste.' },
    { title: 'Corporate Events', icon: Briefcase, desc: 'Impress clients and colleagues with professional catering for meetings, conferences, and parties.' },
    { title: 'Social Parties', icon: PartyPopper, desc: 'From birthdays to anniversaries, we bring the flavor to any celebration.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 animate-fade-in">
      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
         <img src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1950&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Catering" />
         <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-4">
             <div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Premium Catering</h1>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto">Exceptional food for your exceptional events. Experience the perfect blend of spice and style.</p>
             </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
         {/* Services */}
         <div className="grid md:grid-cols-3 gap-8 mb-20">
            {services.map((s, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <s.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 dark:text-white">{s.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
            ))}
         </div>

         {/* Form Section */}
         <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-700">
             <div className="md:w-2/5 bg-brand-600 p-10 text-white flex flex-col justify-between">
                 <div>
                     <h2 className="text-3xl font-serif font-bold mb-6">Start Planning Your Menu</h2>
                     <p className="text-brand-100 mb-8 leading-relaxed">Fill out the form and our catering specialists will contact you within 24 hours to create a custom proposal.</p>
                     
                     <div className="space-y-6">
                         <div className="flex items-center gap-4">
                             <div className="p-3 bg-white/10 rounded-full"><Phone size={20} /></div>
                             <div>
                                 <p className="font-bold text-sm opacity-80">Call Us Directly</p>
                                 <p className="font-bold text-lg">+1 (555) 987-6543</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-4">
                             <div className="p-3 bg-white/10 rounded-full"><Mail size={20} /></div>
                             <div>
                                 <p className="font-bold text-sm opacity-80">Email Us</p>
                                 <p className="font-bold text-lg">catering@curries.com</p>
                             </div>
                         </div>
                     </div>
                 </div>
                 <div className="mt-8 pt-8 border-t border-white/20">
                     <p className="text-sm">"The food was the highlight of our wedding! Everyone loved the fusion burgers."</p>
                     <p className="font-bold mt-2">- Emily & Raj</p>
                 </div>
             </div>

             <div className="md:w-3/5 p-10">
                 {submitted ? (
                     <div className="h-full flex flex-col items-center justify-center text-center py-10">
                         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                             <CheckCircle size={40} />
                         </div>
                         <h3 className="text-2xl font-bold dark:text-white mb-2">Request Sent!</h3>
                         <p className="text-gray-600 dark:text-gray-400 mb-6">Thank you for considering us. We'll be in touch shortly.</p>
                         <button onClick={() => setSubmitted(false)} className="text-brand-600 font-bold hover:underline">Send another request</button>
                     </div>
                 ) : (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold dark:text-white mb-6 md:hidden">Inquiry Form</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Event Type</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                                    <option>Wedding</option>
                                    <option>Corporate</option>
                                    <option>Birthday</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" 
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" 
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Event Date</label>
                                <input required type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" 
                                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Est. Guests</label>
                                <input required type="number" min="10" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" 
                                    value={formData.guestCount} onChange={e => setFormData({...formData, guestCount: parseInt(e.target.value)})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Additional Details</label>
                            <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none h-32 resize-none" 
                                placeholder="Tell us about dietary restrictions, theme, or specific requests..."
                                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                        </div>

                        <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg">
                            Submit Inquiry
                        </button>
                     </form>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default CateringPage;
