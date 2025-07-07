// import React from 'react';

// export function Spinner({ className = '', size = 'default' }: { 
//   className?: string; 
//   size?: 'sm' | 'default' | 'lg' | 'xl';
// }) {
//   const sizeClasses = {
//     sm: 'w-4 h-4',
//     default: 'w-6 h-6', 
//     lg: 'w-8 h-8',
//     xl: 'w-12 h-12'
//   };

//   const borderWidth = {
//     sm: 'border-2',
//     default: 'border-3',
//     lg: 'border-4', 
//     xl: 'border-4'
//   };

//   return (
//     <div className={`flex items-center justify-center ${className}`}>
//       <div className="relative">
//         <div className={`${sizeClasses[size]} ${borderWidth[size]} border-white/20 border-t-white rounded-full animate-spin`}></div>
//         <div 
//           className={`absolute inset-0 ${sizeClasses[size]} ${borderWidth[size]} border-transparent border-t-blue-500 rounded-full animate-spin`} 
//           style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
//         ></div>
//       </div>
//     </div>
//   );
// }
'use client'
import { RotatingLines } from 'react-loader-spinner'
export default function Spinner({ className = '', size = 'default' }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{backdropFilter: 'blur(8px)'}}>
            <div className="flex items-center justify-center w-full h-full">
                <div className="w-full max-w-xs">
                    <div className="glass-card p-4 scale-in">
                        <div className="text-center mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl">
                                <RotatingLines
                                    visible={true}
                                    height="48"
                                    width="48"
                                    color="grey"
                                    strokeWidth="5"
                                    animationDuration="2"
                                    ariaLabel="rotating-lines-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </div>
                           <h2 className="text-xl font-bold text-gradient mb-2">Loading your music library...</h2>
                            <p className="text-white/60 text-sm text-center">This may take a moment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}