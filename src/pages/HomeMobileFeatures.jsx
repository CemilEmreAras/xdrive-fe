
{/* Mobile Features Bar */ }
<div className="w-full max-w-[1200px] mx-auto bg-slate-900/60 backdrop-blur-sm rounded-2xl py-4 px-4 border border-white/10 mt-6 mb-8">
    <div className="grid grid-cols-2 gap-4 text-white">
        {/* Feature 1 */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="font-medium text-sm sm:text-base">{t('home.features.noHiddenFees')}</span>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.00008 11.23L4.93008 15.3C4.66598 15.5641 4.51761 15.9223 4.51761 16.2959C4.51761 16.6695 4.66598 17.0277 4.93008 17.2918L6.70828 19.07C6.83907 19.2009 6.99441 19.3048 7.16541 19.3756C7.33642 19.4465 7.51973 19.4829 7.70488 19.4829C7.89004 19.4829 8.07335 19.4465 8.24436 19.3756C8.41536 19.3048 8.5707 19.2009 8.70148 19.07L12.7715 15M9.00008 11.23L15.3643 4.8658C16.8901 3.34001 19.3643 3.34001 20.8901 4.8658C22.4159 6.3916 22.4159 8.86578 20.8901 10.3916L17.7715 13.5102M9.00008 11.23L12.7715 15M17.7715 13.5102L19.0701 14.8088C19.3342 15.0729 19.4826 15.4311 19.4826 15.8047C19.4826 16.1783 19.3342 16.5365 19.0701 16.8006L17.2919 18.5788C17.1611 18.7097 17.0057 18.8136 16.8347 18.8844C16.6637 18.9553 16.4804 18.9917 16.2953 18.9917C16.1101 18.9917 15.9268 18.9553 15.7558 18.8844C15.5848 18.8136 15.4295 18.7097 15.2987 18.5788L12.7715 16.0516M17.7715 13.5102L12.7715 15M12.7715 15L12.7715 16.0516" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="font-medium text-sm sm:text-base">{t('home.features.globalPartners')}</span>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C3 18.55 3.45 19 4 19H5C5.55 19 6 18.55 6 18V10C6 9.45 5.55 9 5 9H4C3.45 9 3 9.45 3 10V18ZM3 18C3 19.66 4.34 21 6 21H18C19.66 21 21 19.66 21 18M21 18C21 18.55 20.55 19 20 19H19C18.45 19 18 18.55 18 18V10C18 9.45 18.45 9 19 9H20C20.55 9 21 9.45 21 10V18ZM15 6H9M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="font-medium text-sm sm:text-base">{t('home.features.support247')}</span>
        </div>

        {/* Feature 4 */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="font-medium text-sm sm:text-base">{t('home.features.freeCancellations')}</span>
        </div>
    </div>
</div>
