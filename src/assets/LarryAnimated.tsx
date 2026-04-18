export function LarryAnimated({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * (566 / 492)}
      viewBox="0 0 492 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <style>{`
        /* Body + arms jump: fast launch, brief hang, fast land, pause */
        @keyframes larryJump {
          0%        { transform: translateY(0px);   animation-timing-function: cubic-bezier(0.33,0,0.66,0); }
          35%       { transform: translateY(-36px); animation-timing-function: ease-in-out; }
          50%       { transform: translateY(-38px); animation-timing-function: cubic-bezier(0.33,1,0.66,1); }
          70%       { transform: translateY(0px);   animation-timing-function: ease; }
          100%      { transform: translateY(0px); }
        }
        /* Hat: same arc as body but delayed so it lags on launch and settles after */
        @keyframes larryHatFloat {
          0%, 100% { transform: translateY(0px); }
          45%      { transform: translateY(-56px); }
        }
        /* Arm waves */
        @keyframes larryWaveLeft {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(10deg); }
        }
        @keyframes larryWaveRight {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(-10deg); }
        }

        .larry-jump {
          animation: larryJump 1.6s ease infinite;
        }
        .larry-hat {
          animation: larryHatFloat 1.6s ease-in-out infinite;
          animation-delay: 0.13s;
        }
        .larry-arm-left {
          transform-box: fill-box;
          transform-origin: 100% 30%;
          animation: larryWaveLeft 1.6s ease-in-out infinite;
        }
        .larry-arm-right {
          transform-box: fill-box;
          transform-origin: 0% 30%;
          animation: larryWaveRight 1.6s ease-in-out infinite;
        }
      `}</style>

      <defs>
        {/* Left leg */}
        <filter id="la_f0" x="143.994" y="507" width="68.9624" height="62.0129" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        {/* Right leg */}
        <filter id="la_f1" x="286.994" y="507" width="68.9624" height="62.0129" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        {/* Right arm */}
        <filter id="la_f_rarm" x="389.999" y="350.82" width="105.338" height="91.6802" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        {/* Left arm */}
        <filter id="la_f_larm" x="0" y="350.82" width="102.5" height="88.1802" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        {/* Windows */}
        <filter id="la_win1" x="107.786" y="84.2053" width="75.9792" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win2" x="213.355" y="84.2053" width="75.9792" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win3" x="318.925" y="84.2053" width="75.9792" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win4" x="318.925" y="184.977" width="75.9792" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win5" x="107.786" y="184.977" width="180.349" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win6" x="213.355" y="285.748" width="180.349" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win7" x="107.786" y="285.748" width="75.9792" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        {/* Eyes & mouth */}
        <filter id="la_eye1" x="157.262" y="396.543" width="38.0752" height="38.0752" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_eye1hl" x="164.077" y="404.494" width="15.3584" height="15.3584" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_mouth" x="213.353" y="430.904" width="71.585" height="31.9956" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_eye2" x="308.329" y="396.543" width="38.0752" height="38.0752" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_eye2hl" x="315.144" y="404.494" width="15.3584" height="15.3584" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
      </defs>

      {/* Body + arms — all jump together */}
      <g className="larry-jump">

        {/* Left arm — new hand design */}
        <g filter="url(#la_f_larm)" className="larry-arm-left">
          <path d="M47.8418 353.84C51.3973 357.534 51.3508 363.349 49.8418 376.34L69.8418 392.406L98.5 406L96.5 435C85.0725 433.073 72.5 432.5 57.3418 424C43.8178 416.417 41.8411 411 30.8411 396C27.1311 395.245 17.3411 393.5 9.84106 389C2.34106 384.5 -1.15894 375.5 0.341064 367.5C1.84106 359.5 10.3411 355 16.8411 355C23.3411 355 28.8418 357.5 35.3418 362.5C34.0569 359.084 34.3418 355.285 36.3418 353C39.8416 349.002 45.3418 351.243 47.8418 353.84Z" fill="#FEB6A5"/>
        </g>

        {/* Right arm — new hand design */}
        <g filter="url(#la_f_rarm)" className="larry-arm-right">
          <path d="M443.496 353.84C439.94 357.534 439.987 363.349 441.496 376.34L421.496 392.406L389.999 407.5V438.5C401.427 436.573 414.499 436.411 433.996 424C447.076 415.674 449.497 411 460.497 396C464.207 395.245 473.997 393.5 481.497 389C488.997 384.5 492.497 375.5 490.997 367.5C489.497 359.5 480.997 355 474.497 355C467.997 355 462.496 357.5 455.996 362.5C457.281 359.084 456.996 355.285 454.996 353C451.496 349.002 445.996 351.243 443.496 353.84Z" fill="#FEB6A5"/>
        </g>

        {/* Body */}
        <rect x="64.9968" y="37.4189" width="360.637" height="469.433" rx="16" fill="#FEB6A5"/>
        <path d="M65.3672 48.8514C65.3672 44.8497 65.3672 42.8488 66.146 41.3203C66.831 39.9759 67.9241 38.8828 69.2686 38.1977C70.7971 37.4189 72.7979 37.4189 76.7997 37.4189H413.831C417.833 37.4189 419.834 37.4189 421.362 38.1977C422.707 38.8828 423.8 39.9759 424.485 41.3203C425.264 42.8488 425.264 44.8497 425.264 48.8514V66.2107H65.3672V48.8514Z" fill="black" fillOpacity="0.2"/>

        {/* Legs */}
        <g filter="url(#la_f0)">
          <path d="M164.811 533.5V507H203.811V533.5C211.022 542.171 210.311 557 203.811 560C190.737 566.034 148.811 568 144.811 558C141.311 544 149.253 537.78 164.811 533.5Z" fill="#623327"/>
        </g>
        <g filter="url(#la_f1)">
          <path d="M331.139 533.5V507H292.139V533.5C284.928 542.171 285.639 557 292.139 560C305.213 566.034 347.139 568 351.139 558C354.639 544 346.697 537.78 331.139 533.5Z" fill="#623327"/>
        </g>

        {/* Windows */}
        <g filter="url(#la_win1)">
          <rect x="107.786" y="84.2053" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
        </g>
        <g filter="url(#la_win2)">
          <rect x="213.355" y="84.2053" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
        </g>
        <g filter="url(#la_win3)">
          <rect x="318.925" y="84.2053" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
        </g>
        <g filter="url(#la_win4)">
          <rect x="318.925" y="184.977" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
        </g>
        <g filter="url(#la_win5)">
          <rect x="107.786" y="184.977" width="176.349" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
        </g>
        <g filter="url(#la_win6)">
          <rect x="213.355" y="285.748" width="176.349" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
        </g>
        <g filter="url(#la_win7)">
          <rect x="107.786" y="285.748" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
        </g>

        {/* Face */}
        <g filter="url(#la_eye1)">
          <circle cx="175.3" cy="414.581" r="17.0376" fill="#3B2626"/>
          <circle cx="175.3" cy="414.581" r="16.1444" stroke="#3B2626" strokeWidth="1.78632"/>
        </g>
        <g filter="url(#la_eye1hl)">
          <circle cx="170.757" cy="411.174" r="5.67919" fill="white"/>
          <circle cx="170.757" cy="411.174" r="4.78603" stroke="white" strokeWidth="1.78632"/>
        </g>
        <g filter="url(#la_mouth)">
          <path d="M219.354 436.904C223.029 460.897 273.261 460.897 276.937 436.904" stroke="#3B2626" strokeWidth="10" strokeLinecap="round"/>
        </g>
        <g filter="url(#la_eye2)">
          <circle cx="326.366" cy="414.581" r="17.0376" fill="#3B2626"/>
          <circle cx="326.366" cy="414.581" r="16.1444" stroke="#3B2626" strokeWidth="1.78632"/>
        </g>
        <g filter="url(#la_eye2hl)">
          <circle cx="321.823" cy="411.174" r="5.67919" fill="white"/>
          <circle cx="321.823" cy="411.174" r="4.78603" stroke="white" strokeWidth="1.78632"/>
        </g>
      </g>

      {/* Hat — rendered last so it always appears above the body */}
      <g className="larry-hat">
        <rect x="48.9968" width="392.873" height="50.3683" rx="8" fill="#FF6B47"/>
        <path d="M48.9968 37.4827H441.997V41.9769C441.997 46.3952 438.415 49.9769 433.997 49.9769H56.9968C52.5785 49.9769 48.9968 46.3952 48.9968 41.9769V37.4827Z" fill="#82483A" fillOpacity="0.3"/>
      </g>
    </svg>
  );
}
