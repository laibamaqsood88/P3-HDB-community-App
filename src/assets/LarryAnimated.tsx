export function LarryAnimated({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * (566 / 483)}
      viewBox="0 0 483 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <style>{`
        @keyframes waveLeft {
          0%   { transform: rotate(0deg); }
          30%  { transform: rotate(-28deg); }
          60%  { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes waveRight {
          0%   { transform: rotate(0deg); }
          30%  { transform: rotate(28deg); }
          60%  { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes bounceLeft {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes bounceRight {
          0%, 100% { transform: translateY(-10px); }
          50%       { transform: translateY(0px); }
        }

        .larry-arm-left {
          transform-box: fill-box;
          transform-origin: 74px 389px;
          animation: waveLeft 2.4s ease-in-out infinite;
        }
        .larry-arm-right {
          transform-box: fill-box;
          transform-origin: 409px 389px;
          animation: waveRight 2.4s ease-in-out infinite;
        }
        .larry-leg-left {
          transform-box: fill-box;
          transform-origin: center top;
          animation: bounceLeft 1.1s ease-in-out infinite;
        }
        .larry-leg-right {
          transform-box: fill-box;
          transform-origin: center top;
          animation: bounceRight 1.1s ease-in-out infinite;
        }
      `}</style>

      <defs>
        <filter id="la_f0" x="0" y="340" width="78" height="87.3397" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_f1" x="409" y="340" width="78" height="87.3397" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_f2" x="136" y="507" width="68.9624" height="62.0128" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_f3" x="279" y="507" width="68.9624" height="62.0128" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_eye1" x="149.269" y="396.543" width="38.0752" height="38.0752" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_eye1hl" x="156.084" y="404.494" width="15.3584" height="15.3584" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_mouth" x="205.359" y="430.903" width="71.5847" height="31.9956" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_eye2" x="300.335" y="396.543" width="38.0752" height="38.0752" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_eye2hl" x="307.15" y="404.494" width="15.3584" height="15.3584" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="la_win1" x="99.792" y="84.2053" width="75.9795" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win2" x="205.361" y="84.2053" width="75.9795" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win3" x="310.932" y="84.2053" width="75.9792" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win4" x="310.932" y="184.977" width="75.9792" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win5" x="99.792" y="184.977" width="180.349" height="75.9792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win6" x="205.361" y="285.747" width="180.349" height="75.9794" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <filter id="la_win7" x="99.792" y="285.747" width="75.9795" height="75.9794" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="8" dy="8"/><feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
      </defs>

      {/* Left arm — waving */}
      <g filter="url(#la_f0)" className="larry-arm-left">
        <path d="M43.5 365.34L74 389.84V423.34C48.9685 418.253 36.6882 409.912 18.5 383.34C10.1115 385.947 6.85724 385.644 2.5 383.34C0 379.34 3.69 374.62 11 373.34C3.16953 371.355 0.221207 369.777 0 365.34C0.217583 359.935 5.00533 359.76 15 360.34C9.72053 353.208 8.45152 350.057 11 346.84C16 342.84 22.7942 347.863 31.5 354.34C30.2151 350.923 29.5 345.124 31.5 342.84C35.7158 338.024 39 340.242 41.5 342.84C45.0555 346.534 45.009 352.349 43.5 365.34Z" fill="#FEB6A5"/>
      </g>

      {/* Right arm — waving */}
      <g filter="url(#la_f1)" className="larry-arm-right">
        <path d="M441.5 342.84C437.944 346.534 437.991 352.349 439.5 365.34L419.5 381.405L409 389.84V423.34C420.427 421.413 428.259 418.922 433.603 415C444.524 408.959 453.415 399.535 464.5 383.34C472.888 385.947 476.143 385.644 480.5 383.34C483 379.34 479.31 374.62 472 373.34C479.83 371.355 482.779 369.777 483 365.34C482.782 359.935 477.995 359.76 468 360.34C473.279 353.208 474.548 350.057 472 346.84C467 342.84 460.206 347.863 451.5 354.34C452.785 350.923 453.5 345.124 451.5 342.84C447.284 338.024 444 340.242 441.5 342.84Z" fill="#FEB6A5"/>
      </g>

      {/* Body */}
      <rect x="62" y="37.4189" width="360.637" height="469.433" rx="16" fill="#FEB6A5"/>

      {/* Body shadow top strip */}
      <path d="M62.3704 48.8514C62.3704 44.8497 62.3704 42.8488 63.1492 41.3203C63.8342 39.9759 64.9273 38.8828 66.2718 38.1977C67.8002 37.4189 69.8011 37.4189 73.8028 37.4189H410.834C414.836 37.4189 416.837 37.4189 418.365 38.1977C419.71 38.8828 420.803 39.9759 421.488 41.3203C422.267 42.8488 422.267 44.8497 422.267 48.8514V66.2107H62.3704V48.8514Z" fill="black" fillOpacity="0.2"/>

      {/* Left leg — bouncing */}
      <g filter="url(#la_f2)" className="larry-leg-left">
        <path d="M156.817 533.5V507H195.817V533.5C203.028 542.171 202.317 557 195.817 560C182.743 566.034 140.817 568 136.817 558C133.317 544 141.259 537.78 156.817 533.5Z" fill="#623327"/>
      </g>

      {/* Right leg — bouncing (offset phase) */}
      <g filter="url(#la_f3)" className="larry-leg-right">
        <path d="M323.145 533.5V507H284.145V533.5C276.934 542.171 277.645 557 284.145 560C297.219 566.034 339.145 568 343.145 558C346.645 544 338.703 537.78 323.145 533.5Z" fill="#623327"/>
      </g>

      {/* Windows */}
      <g filter="url(#la_win1)">
        <rect x="99.792" y="84.2053" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
      </g>
      <g filter="url(#la_win2)">
        <rect x="205.361" y="84.2053" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
      </g>
      <g filter="url(#la_win3)">
        <rect x="310.932" y="84.2053" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
      </g>
      <g filter="url(#la_win4)">
        <rect x="310.932" y="184.977" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
      </g>
      <g filter="url(#la_win5)">
        <rect x="99.792" y="184.977" width="176.349" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
      </g>
      <g filter="url(#la_win6)">
        <rect x="205.361" y="285.747" width="176.349" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
      </g>
      <g filter="url(#la_win7)">
        <rect x="99.792" y="285.747" width="71.9793" height="71.9793" rx="7.1453" fill="black" fillOpacity="0.3"/>
      </g>

      {/* Left eye */}
      <g filter="url(#la_eye1)">
        <circle cx="167.306" cy="414.581" r="17.0376" fill="#3B2626"/>
        <circle cx="167.306" cy="414.581" r="16.1444" stroke="#3B2626" strokeWidth="1.78632"/>
      </g>
      <g filter="url(#la_eye1hl)">
        <circle cx="162.763" cy="411.173" r="5.67919" fill="white"/>
        <circle cx="162.763" cy="411.173" r="4.78603" stroke="white" strokeWidth="1.78632"/>
      </g>

      {/* Smile */}
      <g filter="url(#la_mouth)">
        <path d="M211.36 436.904C215.035 460.897 265.268 460.897 268.943 436.904" stroke="#3B2626" strokeWidth="10" strokeLinecap="round"/>
      </g>

      {/* Hat / top bar */}
      <rect x="43.5" width="392.873" height="50.3683" rx="8" fill="#FF6B47"/>
      <path d="M43.5 37.4827H436.5V41.9769C436.5 46.3952 432.918 49.9769 428.5 49.9769H51.5C47.0817 49.9769 43.5 46.3952 43.5 41.9769V37.4827Z" fill="#82483A" fillOpacity="0.3"/>

      {/* Right eye */}
      <g filter="url(#la_eye2)">
        <circle cx="318.373" cy="414.581" r="17.0376" fill="#3B2626"/>
        <circle cx="318.373" cy="414.581" r="16.1444" stroke="#3B2626" strokeWidth="1.78632"/>
      </g>
      <g filter="url(#la_eye2hl)">
        <circle cx="313.83" cy="411.173" r="5.67919" fill="white"/>
        <circle cx="313.83" cy="411.173" r="4.78603" stroke="white" strokeWidth="1.78632"/>
      </g>
    </svg>
  );
}
