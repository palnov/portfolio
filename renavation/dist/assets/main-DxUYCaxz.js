gsap.registerPlugin(ScrollTrigger);const I=e=>{const t=e.replace(/^\.\//,"");return window.location.protocol==="file:"?`./public/${t}`:`./${t}`},a=document.getElementById("scrollytelling-canvas"),w=a.getContext("2d"),g=102,S=e=>I(`scrollytelling/hero_frame_${(e+1).toString().padStart(3,"0")}.webp`),r=[],m={frame:0};let p=0;function j(){return new Promise(e=>{for(let t=0;t<g;t++){const n=new Image;n.onload=()=>{p++,p===g&&e()},n.onerror=()=>{p++,p===g&&e()},n.src=S(t),r.push(n)}})}function b(e){if(!e)return;const t=a.width,n=a.height,s=e.naturalWidth||e.width,f=e.naturalHeight||e.height;if(s===0||f===0)return;const x=s/f,C=t/n;let c,d,h,y;C>x?(c=t,d=t/x,h=0,y=(n-d)/2):(c=n*x,d=n,h=(t-c)/2,y=0),w.clearRect(0,0,t,n),w.drawImage(e,h,y,c,d)}function E(){a.width=window.innerWidth*window.devicePixelRatio,a.height=window.innerHeight*window.devicePixelRatio,a.style.width=window.innerWidth+"px",a.style.height=window.innerHeight+"px",w.scale(window.devicePixelRatio,window.devicePixelRatio),r[m.frame]&&b(r[m.frame])}j().then(()=>{E(),window.addEventListener("resize",E),b(r[0]),gsap.to(m,{frame:g-1,snap:"frame",ease:"none",scrollTrigger:{trigger:"#hero-scrollytelling",start:"top top",end:"bottom bottom",scrub:.5,onUpdate:e=>{const t=Math.round(m.frame);r[t]&&b(r[t]),P(t)}}})});const T=document.querySelectorAll(".story-slide"),M=document.getElementById("scroll-indicator");function P(e){let t=0;e<25?t=0:e>=25&&e<50?t=1:e>=50&&e<75?t=2:t=3,T.forEach((n,s)=>{s===t?n.classList.add("active"):n.classList.remove("active")}),e>5?M.style.opacity="0":M.style.opacity="1"}const B=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?B.classList.add("scrolled"):B.classList.remove("scrolled")});const v=document.getElementById("burger-menu"),L=document.getElementById("nav-menu"),H=document.querySelectorAll(".nav-link");v.addEventListener("click",()=>{L.classList.toggle("mobile-active"),v.classList.toggle("burger-active"),L.classList.contains("mobile-active")&&gsap.fromTo(".nav-link",{opacity:0,y:20},{opacity:1,y:0,stagger:.1,duration:.4,ease:"power2.out"})});H.forEach(e=>{e.addEventListener("click",()=>{L.classList.remove("mobile-active"),v.classList.remove("burger-active")})});const _=document.createElement("style");_.textContent=`
    @media (max-width: 768px) {
        .nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            height: 100vh;
            background: #121214;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            z-index: 999;
            transition: right 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 1px solid rgba(197, 168, 128, 0.2);
        }
        .nav.mobile-active {
            right: 0;
        }
        .nav-link {
            font-size: 1.2rem;
        }
        .burger-active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        .burger-active span:nth-child(2) {
            opacity: 0;
        }
        .burger-active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;document.head.appendChild(_);const q=[{title:"Пентхаус «Materia Grand»",category:"Пентхаус • Современная классика",area:"180 м²",duration:"7 месяцев",desc:"Проект сочетает классические каноны симметрии и передовые технологии отделки. В оформлении использован широкоформатный натуральный мрамор Calacatta, декоративные панели из алькантары с латунными вставками и скрытые плинтусы теневого профиля. Особое внимание уделено скрытым системам вентиляции и бесшовному переходу климатических зон.",images:["./project_1.png","./detail_1.png","./detail_2.png","./detail_3.png"],blueprint:`
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50,50 L 350,50 L 350,250 L 50,250 Z" class="blueprint-wall" />
                <path d="M 170,50 L 170,160 L 220,160 L 220,250" class="blueprint-wall" />
                <path d="M 50,150 L 170,150" class="blueprint-wall" />
                <path d="M 220,130 L 350,130" class="blueprint-wall" />
                <path d="M 170,120 A 30,30 0 0,1 140,150" class="blueprint-door" />
                <path d="M 220,180 A 30,30 0 0,1 250,210" class="blueprint-door" />
                <line x1="50" y1="35" x2="350" y2="35" class="blueprint-line" />
                <text x="200" y="30" class="blueprint-text" text-anchor="middle">14.20 м</text>
                <line x1="35" y1="50" x2="35" y2="250" class="blueprint-line" />
                <text x="25" y="150" class="blueprint-text" text-anchor="middle" transform="rotate(-90 25 150)">9.80 м</text>
                <text x="110" y="100" class="blueprint-text" text-anchor="middle">ГОСТИНАЯ</text>
                <text x="110" y="200" class="blueprint-text" text-anchor="middle">СПАЛЬНЯ</text>
                <text x="280" y="90" class="blueprint-text" text-anchor="middle">КУХНЯ</text>
                <text x="280" y="190" class="blueprint-text" text-anchor="middle">ХОЛЛ</text>
            </svg>
        `},{title:"Апартаменты «Obsidian»",category:"Апартаменты • Минимализм",area:"145 м²",duration:"6 месяцев",desc:"Строгий архитектурный минимализм с обилием темных фактур. Стены обшиты шпонированными панелями американского ореха радиального распила. Смонтирован теневой потолочный профиль с глубокими встроенными магнитными треками. Все двери выполнены со скрытым коробом высотой 2.8 метра под потолок.",images:["./project_2.png","./detail_2.png","./detail_3.png","./detail_1.png"],blueprint:`
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40,40 L 360,40 L 360,260 L 40,260 Z" class="blueprint-wall" />
                <path d="M 150,40 L 150,260" class="blueprint-wall" />
                <path d="M 150,150 L 360,150" class="blueprint-wall" />
                <path d="M 150,100 A 25,25 0 0,1 125,125" class="blueprint-door" />
                <path d="M 250,150 A 25,25 0 0,1 275,175" class="blueprint-door" />
                <line x1="40" y1="25" x2="360" y2="25" class="blueprint-line" />
                <text x="200" y="20" class="blueprint-text" text-anchor="middle">12.80 м</text>
                <text x="95" y="145" class="blueprint-text" text-anchor="middle">МАСТЕР-СПАЛЬНЯ</text>
                <text x="250" y="95" class="blueprint-text" text-anchor="middle">КАБИНЕТ</text>
                <text x="250" y="210" class="blueprint-text" text-anchor="middle">СТУДИЯ</text>
            </svg>
        `},{title:"Резиденция «Cote d'Azur»",category:"Резиденция • Неоклассика",area:"220 м²",duration:"9 месяцев",desc:"Аристократичный интерьер в приглушенных пастельных тонах. Полы украшены модульным дубовым паркетом художественной укладки. Стены декорированы авторской лепниной из натурального гипса по индивидуальным эскизам архитектора. Зона столовой дополнена раздвижными стеклянными перегородками в тонких латунных профилях.",images:["./project_3.png","./detail_3.png","./detail_1.png","./detail_2.png"],blueprint:`
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 60,60 L 340,60 L 340,240 L 60,240 Z" class="blueprint-wall" />
                <path d="M 200,60 L 200,240" class="blueprint-wall" />
                <path d="M 60,150 L 200,150" class="blueprint-wall" />
                <path d="M 200,150 L 340,150" class="blueprint-wall" />
                <path d="M 200,110 A 30,30 0 0,1 170,140" class="blueprint-door" />
                <path d="M 200,190 A 30,30 0 0,1 230,220" class="blueprint-door" />
                <text x="130" y="110" class="blueprint-text" text-anchor="middle">СТОЛОВАЯ</text>
                <text x="130" y="200" class="blueprint-text" text-anchor="middle">КУХНЯ</text>
                <text x="270" y="110" class="blueprint-text" text-anchor="middle">ГОСТИНАЯ</text>
                <text x="270" y="200" class="blueprint-text" text-anchor="middle">ТЕРРАСА</text>
            </svg>
        `},{title:"Вилла «Symmetry»",category:"Вилла • High-Tech",area:"350 м²",duration:"12 месяцев",desc:"Высокотехнологичный загородный проект с панорамным остеклением Sky-Frame. Стены облицованы панелями из натурального архитектурного бетона, отшлифованного вручную, и стабилизированным мхом со скрытой подсветкой. Интегрирована полностью автоматизированная система центрального увлажнения воздуха и аудио-мультирум.",images:["./project_4.png","./detail_1.png","./detail_3.png","./detail_2.png"],blueprint:`
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50,50 L 350,50 L 350,250 L 50,250 Z" class="blueprint-wall" />
                <path d="M 120,50 L 120,250" class="blueprint-wall" />
                <path d="M 120,130 L 350,130" class="blueprint-wall" />
                <path d="M 240,130 L 240,250" class="blueprint-wall" />
                <path d="M 120,90 A 25,25 0 0,1 95,115" class="blueprint-door" />
                <text x="85" y="150" class="blueprint-text" text-anchor="middle" transform="rotate(-90 85 150)">SPA-ЗОНА</text>
                <text x="235" y="95" class="blueprint-text" text-anchor="middle">ХОЛЛ / АТРИУМ</text>
                <text x="180" y="200" class="blueprint-text" text-anchor="middle">СПАЛЬНЯ 1</text>
                <text x="300" y="200" class="blueprint-text" text-anchor="middle">СПАЛЬНЯ 2</text>
            </svg>
        `},{title:"Лофт «Industrial Chic»",category:"Лофт • Премиум Индустриальный",area:"160 м²",duration:"8 месяцев",desc:"Аутентичный лофт в историческом здании мануфактуры. Стены из старинного очищенного клинкерного кирпича сочетаются с полированными наливными полами тераццо. Все инженерные сети — вентиляционные короба, разводка электрики в медных трубах — спроектированы как самостоятельные декоративные элементы интерьера.",images:["./project_5.png","./detail_3.png","./detail_2.png","./detail_1.png"],blueprint:`
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40,40 L 360,40 L 360,260 L 40,260 Z" class="blueprint-wall" />
                <path d="M 40,140 L 200,140 L 200,260" class="blueprint-wall" />
                <circle cx="100" cy="90" r="8" fill="none" stroke="var(--text-secondary)" stroke-width="2" />
                <circle cx="300" cy="90" r="8" fill="none" stroke="var(--text-secondary)" stroke-width="2" />
                <circle cx="300" cy="190" r="8" fill="none" stroke="var(--text-secondary)" stroke-width="2" />
                <path d="M 200,170 A 25,25 0 0,1 225,195" class="blueprint-door" />
                <text x="120" y="205" class="blueprint-text" text-anchor="middle">ГАРДЕРОБНАЯ</text>
                <text x="210" y="90" class="blueprint-text" text-anchor="middle">СВОБОДНАЯ ЗОНА (OPEN SPACE)</text>
            </svg>
        `}],u=document.getElementById("project-modal"),R=document.getElementById("modal-overlay"),$=document.getElementById("modal-close-btn"),k=document.getElementById("modal-slides-container"),z=document.getElementById("modal-slider-counter"),W=document.getElementById("modal-project-title"),Z=document.getElementById("modal-project-cat"),F=document.getElementById("modal-project-desc"),Y=document.getElementById("modal-meta-area"),D=document.getElementById("modal-meta-duration"),O=document.getElementById("modal-blueprint-svg"),X=document.getElementById("modal-prev-btn"),G=document.getElementById("modal-next-btn");let l=0,i=[];function N(e){const t=q[e];t&&(l=0,i=t.images.map(I),W.textContent=t.title,Z.textContent=t.category,F.textContent=t.desc,Y.textContent=t.area,D.textContent=t.duration,O.innerHTML=t.blueprint,k.innerHTML=i.map(n=>`<img src="${n}" alt="Деталь проекта" class="modal-slide-img" />`).join(""),o(),u.classList.add("active"),gsap.fromTo(u.querySelector(".modal-content"),{opacity:0,y:50},{opacity:1,y:0,duration:.6,ease:"power3.out"}))}function A(){gsap.to(u.querySelector(".modal-content"),{opacity:0,y:30,duration:.4,ease:"power3.in",onComplete:()=>{u.classList.remove("active")}})}function o(){k.style.transform=`translateX(-${l*100}%)`,z.textContent=`${l+1} / ${i.length}`}document.querySelectorAll(".project-card").forEach(e=>{e.addEventListener("click",()=>{const t=parseInt(e.getAttribute("data-project"),10);N(t)})});$.addEventListener("click",A);R.addEventListener("click",A);X.addEventListener("click",()=>{l>0?(l--,o()):(l=i.length-1,o())});G.addEventListener("click",()=>{l<i.length-1?(l++,o()):(l=0,o())});document.querySelectorAll(".ph-card").forEach((e,t)=>{ScrollTrigger.create({trigger:".philosophy",start:"top 80%",onEnter:()=>{setTimeout(()=>{e.classList.add("revealed")},t*180)},once:!0})});gsap.from(".timeline-item",{scrollTrigger:{trigger:".process",start:"top 75%",toggleActions:"play none none none"},opacity:0,x:e=>e%2===0?-60:60,stagger:.3,duration:1.2,ease:"power3.out"});gsap.from(".project-card",{scrollTrigger:{trigger:".portfolio",start:"top 75%",toggleActions:"play none none none"},opacity:0,y:60,stagger:.2,duration:1,ease:"power3.out"});window.addEventListener("load",()=>{ScrollTrigger.refresh()});
