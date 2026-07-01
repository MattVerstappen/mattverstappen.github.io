// Source file - edit this file, then run `npm run build` to regenerate
// js/translations.min.js which is what the HTML pages actually load.

/**
 * translations.js
 * Contains all static UI text translations for matthewderekrall.com
 * Supports: en, zh, hi, es, fr, ar, af, ja
 */

const LANG_NAMES = {
    en: 'English',
    zh: '中文',
    hi: 'हिन्दी',
    es: 'Español',
    fr: 'Français',
    ar: 'العربية',
    af: 'Afrikaans',
    ja: '日本語',
};

const TRANSLATIONS = {

    en: {
        // Nav
        nav_home:         'Home',
        nav_about:        'About',
        nav_work:         'Work',
        nav_research:     'Research',
        nav_achievements: 'Achievements',
        nav_contact:      'Contact',

        // Hero
        hero_relocating:  'Relocating to the USA',
        hero_badge:       'Game Developer & Designer',
        hero_role:        'Unity - Unreal Engine - C# - C++',
        hero_desc:        'Shipping games since 2023 - from cancer awareness shooters to card-based dungeon crawlers. BCIS in Game Design & Development, Honours in Design Leadership, and a published VR researcher.',
        hero_btn_projects: 'View Projects',
        hero_btn_cv:      'Download CV',
        hero_scroll:      'Scroll',

        // Stats
        stat_years:       'Years Dev',
        stat_degrees:     'Degrees',
        stat_publication: 'Publication',
        stat_languages:   'Languages',

        // About section
        label_about:      'About Me',
        about_heading:    'Building worlds, solving problems',
        about_p1:         "I'm a game developer from Durban, South Africa, currently completing a BA Honours in Design Leadership at Vega School. My work sits at the intersection of technical development and creative design - from building games in Unity and Unreal Engine to researching how VR can transform how programming is taught.",
        about_p2:         'Beyond development, I bring experience as a competitive esports coach and academic tutor, which has sharpened my communication, leadership, and analytical thinking. I thrive in collaborative, fast-moving environments where creative problem-solving matters.',
        about_readmore:   'Read more about me',

        // Skills section
        label_skills:     'What I Know',
        skills_heading:   'Skills & Tools',
        skills_sub:       'Everything from Unity and Unreal to the tools that sit around the edges - what I reach for when building.',
        skill_languages:  'Programming Languages',
        skill_engines:    'Game Engines & 3D',
        skill_tools:      'Tools & IDEs',
        skill_other:      'Other Skills',

        // Experience section
        label_experience: 'Work History',
        exp_heading:      'Experience',
        exp_sub:          'Game jams, classrooms, and the coaching lane - here is where I have put in the hours.',
        exp_other:        'Other Experience',

        // Education section
        label_education:  'Academic Background',
        edu_heading:      'Education',
        edu_sub:          'Four years at Vega School, two degrees - the foundation that sits under everything else I do.',

        // Publication section
        label_research:   'Research',
        research_heading: 'Publication & Research',
        research_sub:     'Peer-reviewed work and academic projects from BA Honours in Design Leadership.',
        pub_badge:        'Peer Research - 2025',
        pub_view:         'View on ResearchGate',
        research_also:    'Additional research and design work from my Honours year:',

        // Achievements section
        label_achievements: 'Recognition',
        ach_heading:      'Achievements',
        ach_sub:          'Awards, placements, and press across game jams and academia.',
        press_heading:    'Press & Media Features',

        // Projects section
        label_work:       'My Work',
        work_heading:     'Projects',
        work_sub:         'Games, research, and design work - filter by what you\'re after.',
        tab_completed:    'Completed',
        tab_wip:          'In Development',
        filter_all:       'All',
        proj_empty:       'No projects here yet - check back soon.',
        proj_view:        'View Project',
        proj_featured:    'Featured Work',
        proj_view_all:    'View all projects',

        // Contact section
        label_contact:    'Get In Touch',
        contact_heading:  'Let\'s Connect',
        contact_text:     'I\'m relocating to the USA and am actively seeking game development roles. Whether you have a project, a position, or just want to connect - reach out.',
        contact_email:    'Email',
        contact_li:       'LinkedIn',
        contact_github:   'GitHub',
        contact_insta:    'Instagram',
        contact_discord:  'Discord',
        contact_cv:       'Resume / CV',
        contact_dl:       'Download PDF',
        contact_avail:    'Currently relocating to the USA - open to remote and on-site roles',

        // Contact form
        form_heading:     'Send a Message',
        form_name:        'Name',
        form_name_ph:     'Your name',
        form_email:       'Email',
        form_email_ph:    'your@email.com',
        form_msg:         'Message',
        form_msg_ph:      'Tell me about your project or role...',
        form_submit:      'Send Message',
        form_success:     'Thanks! I\'ll get back to you soon.',

        // Quick links
        ql_projects:      'All Projects',
        ql_projects_desc: 'Games, apps, and design work',
        ql_research:      'Research & Papers',
        ql_research_desc: 'Published VR research and academic work',
        ql_ach:           'Achievements',
        ql_ach_desc:      'Awards, rankings, and press coverage',

        // Footer
        foot_rights:      'All rights reserved.',
        foot_location:    'Durban, South Africa - United States',

        // Language notice
        notice_text:      'I am personally fluent in English and Afrikaans only. This site is available in 8 languages not because I speak them all, but because I want every visitor to be able to read in their mother tongue - rather than having to accommodate me. All translations have been carefully checked for grammar, spelling, and sentence structure.',
        notice_dismiss:   'Dismiss',

        // Page titles
        title_home:       'Matthew Derek Rall - Game Developer & Designer',
        title_about:      'About - Matthew Derek Rall',
        title_work:       'Work - Matthew Derek Rall',
        title_research:   'Research - Matthew Derek Rall',
        title_ach:        'Achievements - Matthew Derek Rall',
        title_contact:    'Contact - Matthew Derek Rall',
        title_project: 'Project - Matthew Derek Rall',
    },

    af: {
        nav_home:         'Tuis',
        nav_about:        'Oor My',
        nav_work:         'Werk',
        nav_research:     'Navorsing',
        nav_achievements: 'Prestasies',
        nav_contact:      'Kontak',

        hero_relocating:  'Trek na die VSA',
        hero_badge:       'Spelontwikkelaar & Ontwerper',
        hero_role:        'Unity - Unreal Engine - C# - C++',
        hero_desc:        'Speletjies sedert 2023 - van kankerbewustheidskieters tot kaartgebaseerde kerkerverkenners. BCIS in Spelontwerp en -Ontwikkeling, Honneurs in OntwerpLeierskap, en \'n gepubliseerde VR-navorser.',
        hero_btn_projects: 'Bekyk Projekte',
        hero_btn_cv:      'Laai CV af',
        hero_scroll:      'Blaai',

        stat_years:       'Jaar Ontwikkeling',
        stat_degrees:     'Grade',
        stat_publication: 'Publikasie',
        stat_languages:   'Tale',

        label_about:      'Oor My',
        about_heading:    'Werelde bou, probleme oplos',
        about_p1:         'Ek is \'n spelontwikkelaar van Durban, Suid-Afrika. My werk staan op die kruispunt van tegniese ontwikkeling en kreatiewe ontwerp - van die bou van speletjies in Unity en Unreal Engine tot navorsing oor hoe Virtuele Realiteit die manier waarop programmering onderrig word, kan verander.',
        about_p2:         'Buiten ontwikkeling bring ek ondervinding as \'n mededingende esports-afrigter en akademiese tutor, wat my kommunikasie, leierskap en analitiese denke skerp gestel het. Ek floreer in samewerkende, vinnigbewegende omgewings waar kreatiewe probleemoplossing saak maak.',
        about_readmore:   'Lees meer oor my',

        label_skills:     'Wat Ek Weet',
        skills_heading:   'Vaardighede & Gereedskap',
        skills_sub:       'Van Unity en Unreal tot die gereedskap rondom die rande - wat ek gebruik wanneer ek bou.',
        skill_languages:  'Programmeertale',
        skill_engines:    'Spelenjins & 3D',
        skill_tools:      'Gereedskap & IDE\'s',
        skill_other:      'Ander Vaardighede',

        label_experience: 'Werksgeskiedenis',
        exp_heading:      'Ondervinding',
        exp_sub:          'Speletjiesjams, klaskamers en die afrigterbaan - hier is waar ek die ure ingesit het.',
        exp_other:        'Ander Ondervinding',

        label_education:  'Akademiese Agtergrond',
        edu_heading:      'Opleiding',
        edu_sub:          'Vier jaar by Vega Skool, twee grade - die fondament onder alles wat ek doen.',

        label_research:   'Navorsing',
        research_heading: 'Publikasie & Navorsing',
        research_sub:     'Eweknie-beoordeelde werk en akademiese projekte van BA Honneurs in OntwerpLeierskap.',
        pub_badge:        'Eweknie-navorsing - 2025',
        pub_view:         'Bekyk op ResearchGate',
        research_also:    'Verdere navorsing en ontwerpwerk van my Honneursjaar:',

        label_achievements: 'Erkenning',
        ach_heading:      'Prestasies',
        ach_sub:          'Toekennings, kompetisieuitslae, publikasies en persdekking oor my werk.',
        press_heading:    'Pers & Mediakenmerke',

        label_work:       'My Werk',
        work_heading:     'Projekte',
        work_sub:         'Speletjies, navorsing en toepassings oor my grade en persoonlike werk.',
        tab_completed:    'Voltooi',
        tab_wip:          'In Ontwikkeling',
        filter_all:       'Alles',
        proj_empty:       'Nog geen projekte hier nie - kom kyk weer binnekort.',
        proj_view:        'Bekyk Projek',
        proj_featured:    'Uitgesoekte Werk',
        proj_view_all:    'Bekyk alle projekte',

        label_contact:    'Kontak My',
        contact_heading:  'Kom Ons Skakel',
        contact_text:     'Ek trek na die VSA en soek aktief spelontwikkelingsrolle. Of jy \'n projek, \'n pos het, of net wil skakel - kontak my.',
        contact_email:    'E-pos',
        contact_li:       'LinkedIn',
        contact_github:   'GitHub',
        contact_insta:    'Instagram',
        contact_discord:  'Discord',
        contact_cv:       'CV / Herstelstaat',
        contact_dl:       'Laai PDF af',
        contact_avail:    'Tans besig om na die VSA te trek - oop vir afstand- en persoonlike rolle',

        form_heading:     'Stuur \'n Boodskap',
        form_name:        'Naam',
        form_name_ph:     'Jou naam',
        form_email:       'E-pos',
        form_email_ph:    'jou@epos.com',
        form_msg:         'Boodskap',
        form_msg_ph:      'Vertel my van jou projek of rol...',
        form_submit:      'Stuur Boodskap',
        form_success:     'Dankie! Ek sal jou gou kontak.',

        ql_projects:      'Alle Projekte',
        ql_projects_desc: 'Speletjies, toepassings en ontwerpwerk',
        ql_research:      'Navorsing & Referate',
        ql_research_desc: 'Gepubliseerde VR-navorsing en akademiese werk',
        ql_ach:           'Prestasies',
        ql_ach_desc:      'Toekennings, ranglys en persdekking',

        foot_rights:      'Alle regte voorbehou.',
        foot_location:    'Durban, Suid-Afrika - Verenigde State',

        notice_text:      'Ek is persoonlik net vlot in Engels en Afrikaans. Hierdie webwerf is in 8 tale beskikbaar, nie omdat ek hulle almal praat nie, maar omdat ek wil he elke besoeker moet in hul moedertaal kan lees - eerder as om vir my aan te pas. Alle vertalings is noukeurig nagegaan vir grammatika, spelling en sinstruktuur.',
        notice_dismiss:   'Sluit',

        title_home:       'Matthew Derek Rall - Spelontwikkelaar & Ontwerper',
        title_about:      'Oor My - Matthew Derek Rall',
        title_work:       'Werk - Matthew Derek Rall',
        title_research:   'Navorsing - Matthew Derek Rall',
        title_ach:        'Prestasies - Matthew Derek Rall',
        title_contact:    'Kontak - Matthew Derek Rall',
        title_project: 'Projek - Matthew Derek Rall',
    },

    es: {
        nav_home:         'Inicio',
        nav_about:        'Acerca de',
        nav_work:         'Trabajo',
        nav_research:     'Investigacion',
        nav_achievements: 'Logros',
        nav_contact:      'Contacto',

        hero_relocating:  'Mudandome a los EE.UU.',
        hero_badge:       'Desarrollador y Disenador de Videojuegos',
        hero_role:        'Unity - Unreal Engine - C# - C++',
        hero_desc:        'Desarrollando juegos desde 2023 - desde shooters de concienciacion sobre el cancer hasta dungeon crawlers basados en cartas. BCIS en Diseno y Desarrollo de Videojuegos, Honores en Liderazgo en Diseno, e investigador publicado en RV.',
        hero_btn_projects: 'Ver Proyectos',
        hero_btn_cv:      'Descargar CV',
        hero_scroll:      'Desplazar',

        stat_years:       'Anos Desarrollando',
        stat_degrees:     'Titulos',
        stat_publication: 'Publicacion',
        stat_languages:   'Idiomas',

        label_about:      'Sobre Mi',
        about_heading:    'Construyendo mundos, resolviendo problemas',
        about_p1:         'Soy un desarrollador de videojuegos de Durban, Sudafrica. Mi trabajo se encuentra en la interseccion entre el desarrollo tecnico y el diseno creativo - desde construir juegos en Unity y Unreal Engine hasta investigar como la Realidad Virtual puede transformar la ensenanza de la programacion.',
        about_p2:         'Mas alla del desarrollo, aporto experiencia como entrenador competitivo de esports y tutor academico, lo que ha agudizado mi comunicacion, liderazgo y pensamiento analitico. Me desenvuelvo bien en entornos colaborativos y dinamicos donde la resolucion creativa de problemas es fundamental.',
        about_readmore:   'Leer más sobre mí',

        label_skills:     'Lo Que Se',
        skills_heading:   'Habilidades y Herramientas',
        skills_sub:       'Desde Unity y Unreal hasta las herramientas complementarias - lo que uso al desarrollar.',
        skill_languages:  'Lenguajes de Programacion',
        skill_engines:    'Motores de Juego y 3D',
        skill_tools:      'Herramientas e IDEs',
        skill_other:      'Otras Habilidades',

        label_experience: 'Historial Laboral',
        exp_heading:      'Experiencia',
        exp_sub:          'Game jams, aulas y entrenamientos - aqui es donde he invertido mis horas.',
        exp_other:        'Otra Experiencia',

        label_education:  'Formacion Academica',
        edu_heading:      'Educacion',
        edu_sub:          'Cuatro anos en Vega School, dos titulos - la base que sustenta todo lo que hago.',

        label_research:   'Investigacion',
        research_heading: 'Publicacion e Investigacion',
        research_sub:     'Trabajo revisado por pares y proyectos academicos del Honores en Liderazgo en Diseno.',
        pub_badge:        'Investigacion Arbitrada - 2025',
        pub_view:         'Ver en ResearchGate',
        research_also:    'Trabajo adicional de investigacion y diseno de mi ano de Honores:',

        label_achievements: 'Reconocimientos',
        ach_heading:      'Logros',
        ach_sub:          'Premios, posiciones en competencias, publicaciones y cobertura de prensa.',
        press_heading:    'Prensa y Medios',

        label_work:       'Mi Trabajo',
        work_heading:     'Proyectos',
        work_sub:         'Juegos, investigacion y aplicaciones de mis titulos y proyectos personales.',
        tab_completed:    'Completados',
        tab_wip:          'En Desarrollo',
        filter_all:       'Todos',
        proj_empty:       'Aun no hay proyectos aqui - vuelve pronto.',
        proj_view:        'Ver Proyecto',
        proj_featured:    'Trabajo Destacado',
        proj_view_all:    'Ver todos los proyectos',

        label_contact:    'Contactame',
        contact_heading:  'Conectemos',
        contact_text:     'Me estoy mudando a los EE.UU. y busco activamente roles en desarrollo de videojuegos. Ya sea que tengas un proyecto, una vacante o simplemente quieras conectar - escribeme.',
        contact_email:    'Correo',
        contact_li:       'LinkedIn',
        contact_github:   'GitHub',
        contact_insta:    'Instagram',
        contact_discord:  'Discord',
        contact_cv:       'CV / Curriculum',
        contact_dl:       'Descargar PDF',
        contact_avail:    'Actualmente mudandome a los EE.UU. - abierto a roles remotos y presenciales',

        form_heading:     'Enviar un Mensaje',
        form_name:        'Nombre',
        form_name_ph:     'Tu nombre',
        form_email:       'Correo',
        form_email_ph:    'tu@correo.com',
        form_msg:         'Mensaje',
        form_msg_ph:      'Cuentame sobre tu proyecto o rol...',
        form_submit:      'Enviar Mensaje',
        form_success:     'Gracias! Me pondre en contacto pronto.',

        ql_projects:      'Todos los Proyectos',
        ql_projects_desc: 'Juegos, aplicaciones y diseno',
        ql_research:      'Investigacion y Articulos',
        ql_research_desc: 'Investigacion publicada en RV y trabajo academico',
        ql_ach:           'Logros',
        ql_ach_desc:      'Premios, clasificaciones y cobertura de prensa',

        foot_rights:      'Todos los derechos reservados.',
        foot_location:    'Durban, Sudafrica - Estados Unidos',

        notice_text:      'Personalmente solo hablo con fluidez ingles y afrikaans. Este sitio esta disponible en 8 idiomas no porque los hable todos, sino porque quiero que cada visitante pueda leer en su lengua materna - en lugar de tener que adaptarse a mi. Todas las traducciones han sido cuidadosamente revisadas en cuanto a gramatica, ortografia y estructura.',
        notice_dismiss:   'Cerrar',

        title_home:       'Matthew Derek Rall - Desarrollador y Disenador de Videojuegos',
        title_about:      'Sobre Mi - Matthew Derek Rall',
        title_work:       'Trabajo - Matthew Derek Rall',
        title_research:   'Investigacion - Matthew Derek Rall',
        title_ach:        'Logros - Matthew Derek Rall',
        title_contact:    'Contacto - Matthew Derek Rall',
        title_project: 'Proyecto - Matthew Derek Rall',
    },

    fr: {
        nav_home:         'Accueil',
        nav_about:        'A propos',
        nav_work:         'Travaux',
        nav_research:     'Recherche',
        nav_achievements: 'Realisations',
        nav_contact:      'Contact',

        hero_relocating:  'Demenagement aux Etats-Unis',
        hero_badge:       'Developpeur et Designer de Jeux Video',
        hero_role:        'Unity - Unreal Engine - C# - C++',
        hero_desc:        'Je developpe des jeux depuis 2023 - des shooters de sensibilisation au cancer aux dungeon crawlers a base de cartes. BCIS en Conception et Developpement de Jeux Video, Master en Leadership en Design, et chercheur publie en RV.',
        hero_btn_projects: 'Voir les Projets',
        hero_btn_cv:      'Telecharger le CV',
        hero_scroll:      'Defiler',

        stat_years:       'Ans de Dev',
        stat_degrees:     'Diplomes',
        stat_publication: 'Publication',
        stat_languages:   'Langages',

        label_about:      'A Mon Sujet',
        about_heading:    'Construire des mondes, resoudre des problemes',
        about_p1:         'Je suis un developpeur de jeux video de Durban, en Afrique du Sud. Mon travail se situe a l\'intersection du developpement technique et du design creatif - de la creation de jeux sous Unity et Unreal Engine a la recherche sur la facon dont la Realite Virtuelle peut transformer l\'enseignement de la programmation.',
        about_p2:         'Au-dela du developpement, j\'apporte une experience d\'entraineur esports competitif et de tuteur academique, ce qui a affine mes capacites de communication, de leadership et de pensee analytique. Je m\'epanouis dans des environnements collaboratifs et dynamiques ou la resolution creative de problemes est essentielle.',
        about_readmore:   'En savoir plus sur moi',

        label_skills:     'Ce Que Je Sais',
        skills_heading:   'Competences et Outils',
        skills_sub:       'De Unity et Unreal aux outils complementaires - ce que j\'utilise quand je construis.',
        skill_languages:  'Langages de Programmation',
        skill_engines:    'Moteurs de Jeu et 3D',
        skill_tools:      'Outils et IDEs',
        skill_other:      'Autres Competences',

        label_experience: 'Parcours Professionnel',
        exp_heading:      'Experience',
        exp_sub:          'Game jams, salles de classe et entrainements - voici ou j\'ai mis les heures.',
        exp_other:        'Autre Experience',

        label_education:  'Parcours Academique',
        edu_heading:      'Formation',
        edu_sub:          'Quatre ans a la Vega School, deux diplomes - le fondement de tout ce que je fais.',

        label_research:   'Recherche',
        research_heading: 'Publication et Recherche',
        research_sub:     'Travaux evalues par des pairs et projets academiques du Master en Leadership en Design.',
        pub_badge:        'Recherche Evaluee - 2025',
        pub_view:         'Voir sur ResearchGate',
        research_also:    'Travaux de recherche et de design supplementaires de mon annee de Master:',

        label_achievements: 'Distinctions',
        ach_heading:      'Realisations',
        ach_sub:          'Prix, classements en competition, publications et couverture presse.',
        press_heading:    'Presse et Medias',

        label_work:       'Mes Travaux',
        work_heading:     'Projets',
        work_sub:         'Jeux, recherches et applications issus de mes diplomes et de mes projets personnels.',
        tab_completed:    'Termines',
        tab_wip:          'En Developpement',
        filter_all:       'Tous',
        proj_empty:       'Pas encore de projets ici - revenez bientot.',
        proj_view:        'Voir le Projet',
        proj_featured:    'Travaux Selectionnes',
        proj_view_all:    'Voir tous les projets',

        label_contact:    'Me Contacter',
        contact_heading:  'Prenons Contact',
        contact_text:     'Je demenage aux Etats-Unis et recherche activement des postes en developpement de jeux video. Que vous ayez un projet, un poste ou que vous souhaitiez simplement vous connecter - contactez-moi.',
        contact_email:    'E-mail',
        contact_li:       'LinkedIn',
        contact_github:   'GitHub',
        contact_insta:    'Instagram',
        contact_discord:  'Discord',
        contact_cv:       'CV / Curriculum Vitae',
        contact_dl:       'Telecharger le PDF',
        contact_avail:    'Actuellement en cours de demenagement aux Etats-Unis - ouvert aux postes a distance et en presentiel',

        form_heading:     'Envoyer un Message',
        form_name:        'Nom',
        form_name_ph:     'Votre nom',
        form_email:       'E-mail',
        form_email_ph:    'votre@email.com',
        form_msg:         'Message',
        form_msg_ph:      'Parlez-moi de votre projet ou poste...',
        form_submit:      'Envoyer',
        form_success:     'Merci ! Je vous recontacterai bientot.',

        ql_projects:      'Tous les Projets',
        ql_projects_desc: 'Jeux, applications et design',
        ql_research:      'Recherche et Articles',
        ql_research_desc: 'Recherche publiee en RV et travaux academiques',
        ql_ach:           'Realisations',
        ql_ach_desc:      'Prix, classements et couverture presse',

        foot_rights:      'Tous droits reserves.',
        foot_location:    'Durban, Afrique du Sud - Etats-Unis',

        notice_text:      'Je parle couramment l\'anglais et l\'afrikaans uniquement. Ce site est disponible en 8 langues non pas parce que je les parle toutes, mais parce que je veux que chaque visiteur puisse lire dans sa langue maternelle - plutot que d\'avoir a s\'adapter a moi. Toutes les traductions ont ete soigneusement verifiees en termes de grammaire, d\'orthographe et de structure des phrases.',
        notice_dismiss:   'Fermer',

        title_home:       'Matthew Derek Rall - Developpeur et Designer de Jeux Video',
        title_about:      'A Propos - Matthew Derek Rall',
        title_work:       'Travaux - Matthew Derek Rall',
        title_research:   'Recherche - Matthew Derek Rall',
        title_ach:        'Realisations - Matthew Derek Rall',
        title_contact:    'Contact - Matthew Derek Rall',
        title_project: 'Projet - Matthew Derek Rall',
    },

    zh: {
        nav_home:         '首页',
        nav_about:        '关于我',
        nav_work:         '作品',
        nav_research:     '研究',
        nav_achievements: '成就',
        nav_contact:      '联系',

        hero_relocating:  '即将移居美国',
        hero_badge:       '游戏开发者与设计师',
        hero_role:        'Unity - 虚幻引擎 - C# - C++',
        hero_desc:        '自2023年起持续开发游戏 - 从癌症意识射击游戏到卡牌地下城探险。游戏设计与开发学士、设计领导力荣誉学士，并已发表VR研究论文。',
        hero_btn_projects: '查看项目',
        hero_btn_cv:      '下载简历',
        hero_scroll:      '滚动',

        stat_years:       '年开发经验',
        stat_degrees:     '学位',
        stat_publication: '已发表论文',
        stat_languages:   '编程语言',

        label_about:      '关于我',
        about_heading:    '构建世界，解决问题',
        about_p1:         '我是一名来自南非德班的游戏开发者，目前正在维嘉学院攻读设计领导力荣誉学士学位。我的工作处于技术开发与创意设计的交汇处 - 从使用Unity和虚幻引擎开发游戏，到研究虚拟现实如何革新编程教学方式。',
        about_p2:         '除开发工作外，我还拥有竞技电子竞技教练和学术辅导的经验，这磨练了我的沟通、领导力和分析思维能力。我善于在需要创造性解决问题的协作型快节奏环境中发挥所长。',
        about_readmore:   '了解更多关于我的信息',

        label_skills:     '我的技能',
        skills_heading:   '技能与工具',
        skills_sub:       '从Unity和虚幻引擎到各类辅助工具 - 这是我在开发时所使用的一切。',
        skill_languages:  '编程语言',
        skill_engines:    '游戏引擎与3D',
        skill_tools:      '工具与IDE',
        skill_other:      '其他技能',

        label_experience: '工作经历',
        exp_heading:      '经验',
        exp_sub:          '游戏开发马拉松、课堂教学和电竞训练 - 这就是我积累时间的地方。',
        exp_other:        '其他经历',

        label_education:  '学术背景',
        edu_heading:      '教育经历',
        edu_sub:          '四年维嘉学院，两个学位 - 是我一切工作的基石。',

        label_research:   '研究',
        research_heading: '发表作品与研究',
        research_sub:     '设计领导力荣誉学士课程中的同行评审作品及学术项目。',
        pub_badge:        '同行评审研究 - 2025',
        pub_view:         '在ResearchGate上查看',
        research_also:    '荣誉学士年度的其他研究与设计作品：',

        label_achievements: '荣誉',
        ach_heading:      '成就',
        ach_sub:          '奖项、竞赛名次、发表作品及媒体报道。',
        press_heading:    '新闻与媒体报道',

        label_work:       '我的作品',
        work_heading:     '项目',
        work_sub:         '涵盖学位课程及个人项目中的游戏、研究与应用程序。',
        tab_completed:    '已完成',
        tab_wip:          '开发中',
        filter_all:       '全部',
        proj_empty:       '暂无项目，请稍后再来。',
        proj_view:        '查看项目',
        proj_featured:    '精选作品',
        proj_view_all:    '查看所有项目',

        label_contact:    '联系我',
        contact_heading:  '建立联系',
        contact_text:     '我即将移居美国，正在积极寻找游戏开发相关职位。无论您有项目合作、职位机会还是只是想联系 - 欢迎随时联系我。',
        contact_email:    '邮箱',
        contact_li:       'LinkedIn',
        contact_github:   'GitHub',
        contact_insta:    'Instagram',
        contact_discord:  'Discord',
        contact_cv:       '简历',
        contact_dl:       '下载PDF',
        contact_avail:    '目前正在迁居美国中 - 接受远程及驻场职位',

        form_heading:     '发送消息',
        form_name:        '姓名',
        form_name_ph:     '您的姓名',
        form_email:       '邮箱',
        form_email_ph:    '您的邮箱地址',
        form_msg:         '消息',
        form_msg_ph:      '请告诉我您的项目或职位信息...',
        form_submit:      '发送消息',
        form_success:     '感谢您的留言！我会尽快回复。',

        ql_projects:      '所有项目',
        ql_projects_desc: '游戏、应用程序及设计作品',
        ql_research:      '研究与论文',
        ql_research_desc: '已发表的VR研究及学术作品',
        ql_ach:           '成就',
        ql_ach_desc:      '奖项、排名及媒体报道',

        foot_rights:      '版权所有。',
        foot_location:    '南非德班 - 美国',

        notice_text:      '我本人仅流利掌握英语和南非荷兰语。本网站提供8种语言，并非因为我全部精通，而是希望每位访客都能以母语阅读 - 而不必迁就我。所有译文均已仔细审核语法、拼写及句式结构。',
        notice_dismiss:   '关闭',

        title_home:       'Matthew Derek Rall - 游戏开发者与设计师',
        title_about:      '关于我 - Matthew Derek Rall',
        title_work:       '作品 - Matthew Derek Rall',
        title_research:   '研究 - Matthew Derek Rall',
        title_ach:        '成就 - Matthew Derek Rall',
        title_contact:    '联系 - Matthew Derek Rall',
        title_project: '项目 - Matthew Derek Rall',
    },

    hi: {
        nav_home:         'होम',
        nav_about:        'मेरे बारे में',
        nav_work:         'कार्य',
        nav_research:     'शोध',
        nav_achievements: 'उपलब्धियाँ',
        nav_contact:      'संपर्क',

        hero_relocating:  'अमेरिका जा रहा हूँ',
        hero_badge:       'गेम डेवलपर और डिज़ाइनर',
        hero_role:        'Unity - Unreal Engine - C# - C++',
        hero_desc:        '2023 से गेम बना रहा हूँ - कैंसर जागरूकता शूटर से लेकर कार्ड-आधारित डंजन क्रॉलर तक। गेम डिज़ाइन और डेवलपमेंट में BCIS, डिज़ाइन लीडरशिप में ऑनर्स, और प्रकाशित VR शोधकर्ता।',
        hero_btn_projects: 'प्रोजेक्ट देखें',
        hero_btn_cv:      'CV डाउनलोड करें',
        hero_scroll:      'स्क्रॉल करें',

        stat_years:       'साल का अनुभव',
        stat_degrees:     'डिग्रियाँ',
        stat_publication: 'प्रकाशन',
        stat_languages:   'भाषाएँ',

        label_about:      'मेरे बारे में',
        about_heading:    'दुनियाएँ बनाना, समस्याएँ सुलझाना',
        about_p1:         'मैं दक्षिण अफ्रीका के डरबन से एक गेम डेवलपर हूँ। मेरा काम तकनीकी विकास और रचनात्मक डिज़ाइन के बीच है - Unity और Unreal Engine में गेम बनाने से लेकर यह शोध करने तक कि VR प्रोग्रामिंग शिक्षा को कैसे बदल सकती है।',
        about_p2:         'डेवलपमेंट के अलावा, मेरे पास एक प्रतिस्पर्धी eSports कोच और शैक्षणिक ट्यूटर के रूप में अनुभव है, जिसने मेरी संचार, नेतृत्व और विश्लेषणात्मक सोच को निखारा है। मैं सहयोगात्मक, तेज़ गति वाले वातावरण में फलता-फूलता हूँ जहाँ रचनात्मक समस्या-समाधान महत्वपूर्ण होता है।',
        about_readmore:   'मेरे बारे में और पढ़ें',

        label_skills:     'मुझे क्या आता है',
        skills_heading:   'कौशल और टूल्स',
        skills_sub:       'Unity और Unreal से लेकर सहायक टूल्स तक - जो मैं बनाते समय उपयोग करता हूँ।',
        skill_languages:  'प्रोग्रामिंग भाषाएँ',
        skill_engines:    'गेम इंजन और 3D',
        skill_tools:      'टूल्स और IDE',
        skill_other:      'अन्य कौशल',

        label_experience: 'कार्य इतिहास',
        exp_heading:      'अनुभव',
        exp_sub:          'गेम जैम, कक्षाएँ और कोचिंग - यहाँ मैंने घंटे लगाए हैं।',
        exp_other:        'अन्य अनुभव',

        label_education:  'शैक्षणिक पृष्ठभूमि',
        edu_heading:      'शिक्षा',
        edu_sub:          'Vega School में चार साल, दो डिग्रियाँ - जो मेरे सभी कार्यों की नींव है।',

        label_research:   'शोध',
        research_heading: 'प्रकाशन और शोध',
        research_sub:     'डिज़ाइन लीडरशिप ऑनर्स से समकक्ष-समीक्षित कार्य और अकादमिक परियोजनाएँ।',
        pub_badge:        'समकक्ष शोध - 2025',
        pub_view:         'ResearchGate पर देखें',
        research_also:    'मेरे ऑनर्स वर्ष से अतिरिक्त शोध और डिज़ाइन कार्य:',

        label_achievements: 'पहचान',
        ach_heading:      'उपलब्धियाँ',
        ach_sub:          'पुरस्कार, प्रतियोगिता स्थान, प्रकाशन और प्रेस कवरेज।',
        press_heading:    'प्रेस और मीडिया फीचर',

        label_work:       'मेरा काम',
        work_heading:     'परियोजनाएँ',
        work_sub:         'मेरी डिग्रियों और व्यक्तिगत कार्य से गेम, शोध और एप्लिकेशन।',
        tab_completed:    'पूर्ण',
        tab_wip:          'विकास में',
        filter_all:       'सभी',
        proj_empty:       'अभी यहाँ कोई प्रोजेक्ट नहीं - जल्द वापस देखें।',
        proj_view:        'प्रोजेक्ट देखें',
        proj_featured:    'विशेष कार्य',
        proj_view_all:    'सभी प्रोजेक्ट देखें',

        label_contact:    'संपर्क करें',
        contact_heading:  'जुड़ते हैं',
        contact_text:     'मैं अमेरिका जा रहा हूँ और सक्रिय रूप से गेम डेवलपमेंट भूमिकाएँ खोज रहा हूँ। चाहे आपके पास कोई प्रोजेक्ट हो, पद हो, या बस जुड़ना हो - संपर्क करें।',
        contact_email:    'ईमेल',
        contact_li:       'LinkedIn',
        contact_github:   'GitHub',
        contact_insta:    'Instagram',
        contact_discord:  'Discord',
        contact_cv:       'रिज्यूमे / CV',
        contact_dl:       'PDF डाउनलोड करें',
        contact_avail:    'वर्तमान में अमेरिका जा रहा हूँ - दूरस्थ और ऑन-साइट भूमिकाओं के लिए उपलब्ध',

        form_heading:     'संदेश भेजें',
        form_name:        'नाम',
        form_name_ph:     'आपका नाम',
        form_email:       'ईमेल',
        form_email_ph:    'आपका@ईमेल.com',
        form_msg:         'संदेश',
        form_msg_ph:      'मुझे अपने प्रोजेक्ट या भूमिका के बारे में बताएँ...',
        form_submit:      'संदेश भेजें',
        form_success:     'धन्यवाद! मैं जल्द जवाब दूँगा।',

        ql_projects:      'सभी परियोजनाएँ',
        ql_projects_desc: 'गेम, एप्लिकेशन और डिज़ाइन कार्य',
        ql_research:      'शोध और पेपर',
        ql_research_desc: 'प्रकाशित VR शोध और अकादमिक कार्य',
        ql_ach:           'उपलब्धियाँ',
        ql_ach_desc:      'पुरस्कार, रैंकिंग और प्रेस कवरेज',

        foot_rights:      'सर्वाधिकार सुरक्षित।',
        foot_location:    'डरबन, दक्षिण अफ्रीका - संयुक्त राज्य अमेरिका',

        notice_text:      'मैं व्यक्तिगत रूप से केवल अंग्रेज़ी और अफ्रीकान्स में धाराप्रवाह हूँ। यह साइट 8 भाषाओं में उपलब्ध है, इसलिए नहीं कि मैं सब बोलता हूँ, बल्कि इसलिए कि मैं चाहता हूँ कि हर आगंतुक अपनी मातृभाषा में पढ़ सके - मेरे लिए अनुकूलन करने के बजाय। सभी अनुवादों को व्याकरण, वर्तनी और वाक्य संरचना के लिए सावधानीपूर्वक जाँचा गया है।',
        notice_dismiss:   'बंद करें',

        title_home:       'Matthew Derek Rall - गेम डेवलपर और डिज़ाइनर',
        title_about:      'मेरे बारे में - Matthew Derek Rall',
        title_work:       'कार्य - Matthew Derek Rall',
        title_research:   'शोध - Matthew Derek Rall',
        title_ach:        'उपलब्धियाँ - Matthew Derek Rall',
        title_contact:    'संपर्क - Matthew Derek Rall',
        title_project: 'परियोजना - Matthew Derek Rall',
    },

    ar: {
        nav_home:         'الرئيسية',
        nav_about:        'نبذة عني',
        nav_work:         'أعمالي',
        nav_research:     'البحث',
        nav_achievements: 'الإنجازات',
        nav_contact:      'تواصل',

        hero_relocating:  'انتقل إلى الولايات المتحدة',
        hero_badge:       'مطور ومصمم ألعاب',
        hero_role:        'Unity - Unreal Engine - C# - C++',
        hero_desc:        'أطور الألعاب منذ عام 2023 - من ألعاب إطلاق النار للتوعية بالسرطان إلى ألعاب استكشاف الأبراج المبنية على البطاقات. بكالوريوس في تصميم وتطوير الألعاب، ماجستير في قيادة التصميم، وباحث منشور في الواقع الافتراضي.',
        hero_btn_projects: 'عرض المشاريع',
        hero_btn_cv:      'تحميل السيرة الذاتية',
        hero_scroll:      'تمرير',

        stat_years:       'سنوات تطوير',
        stat_degrees:     'شهادات',
        stat_publication: 'منشور بحثي',
        stat_languages:   'لغات برمجة',

        label_about:      'نبذة عني',
        about_heading:    'بناء العوالم وحل المشكلات',
        about_p1:         'أنا مطور ألعاب من دربان، جنوب أفريقيا. يقع عملي عند تقاطع التطوير التقني والتصميم الإبداعي - من بناء الألعاب باستخدام Unity وUnreal Engine إلى البحث في كيفية تحويل الواقع الافتراضي لطريقة تدريس البرمجة.',
        about_p2:         'إلى جانب التطوير، أمتلك خبرة كمدرب إلكتروني تنافسي ومعلم أكاديمي، مما صقل مهاراتي في التواصل والقيادة والتفكير التحليلي. أزدهر في البيئات التعاونية سريعة الإيقاع التي تكون فيها حل المشكلات الإبداعية أمراً بالغ الأهمية.',
        about_readmore:   'اقرأ المزيد عني',

        label_skills:     'ما أتقنه',
        skills_heading:   'المهارات والأدوات',
        skills_sub:       'من Unity وUnreal إلى الأدوات المساندة - ما أستخدمه أثناء البناء.',
        skill_languages:  'لغات البرمجة',
        skill_engines:    'محركات الألعاب والنمذجة ثلاثية الأبعاد',
        skill_tools:      'الأدوات وبيئات التطوير',
        skill_other:      'مهارات أخرى',

        label_experience: 'المسيرة المهنية',
        exp_heading:      'الخبرة',
        exp_sub:          'جام الألعاب، قاعات الدراسة، وميادين التدريب - هنا أمضيت ساعات عملي.',
        exp_other:        'خبرات أخرى',

        label_education:  'الخلفية الأكاديمية',
        edu_heading:      'التعليم',
        edu_sub:          'أربع سنوات في مدرسة فيغا، شهادتان - الأساس الذي يقوم عليه كل ما أقوم به.',

        label_research:   'البحث العلمي',
        research_heading: 'المنشورات والبحث',
        research_sub:     'أعمال محكّمة ومشاريع أكاديمية من ماجستير قيادة التصميم.',
        pub_badge:        'بحث محكّم - 2025',
        pub_view:         'عرض على ResearchGate',
        research_also:    'أعمال بحثية وتصميمية إضافية من سنة الماجستير:',

        label_achievements: 'التقدير والإنجازات',
        ach_heading:      'الإنجازات',
        ach_sub:          'جوائز، مراتب في المسابقات، منشورات، وتغطية إعلامية.',
        press_heading:    'التغطية الإعلامية والصحفية',

        label_work:       'أعمالي',
        work_heading:     'المشاريع',
        work_sub:         'ألعاب وأبحاث وتطبيقات من شهاداتي ومشاريعي الشخصية.',
        tab_completed:    'مكتملة',
        tab_wip:          'قيد التطوير',
        filter_all:       'الكل',
        proj_empty:       'لا توجد مشاريع هنا بعد - تفقد لاحقاً.',
        proj_view:        'عرض المشروع',
        proj_featured:    'أبرز الأعمال',
        proj_view_all:    'عرض جميع المشاريع',

        label_contact:    'تواصل معي',
        contact_heading:  'لنتواصل',
        contact_text:     'أنا في طور الانتقال إلى الولايات المتحدة وأبحث بنشاط عن فرص في تطوير الألعاب. سواء كان لديك مشروع أو وظيفة أو مجرد رغبة في التواصل - تفضل بالتواصل.',
        contact_email:    'البريد الإلكتروني',
        contact_li:       'لينكدإن',
        contact_github:   'GitHub',
        contact_insta:    'إنستغرام',
        contact_discord:  'Discord',
        contact_cv:       'السيرة الذاتية',
        contact_dl:       'تحميل PDF',
        contact_avail:    'حالياً في طور الانتقال إلى الولايات المتحدة - متاح للعمل عن بُعد وحضورياً',

        form_heading:     'إرسال رسالة',
        form_name:        'الاسم',
        form_name_ph:     'اسمك',
        form_email:       'البريد الإلكتروني',
        form_email_ph:    'بريدك@الإلكتروني.com',
        form_msg:         'الرسالة',
        form_msg_ph:      'أخبرني عن مشروعك أو الوظيفة المطلوبة...',
        form_submit:      'إرسال الرسالة',
        form_success:     'شكراً! سأتواصل معك قريباً.',

        ql_projects:      'جميع المشاريع',
        ql_projects_desc: 'ألعاب وتطبيقات وأعمال تصميمية',
        ql_research:      'البحث والأوراق العلمية',
        ql_research_desc: 'أبحاث منشورة في الواقع الافتراضي وأعمال أكاديمية',
        ql_ach:           'الإنجازات',
        ql_ach_desc:      'جوائز ومراتب وتغطية إعلامية',

        foot_rights:      'جميع الحقوق محفوظة.',
        foot_location:    'دربان، جنوب أفريقيا - الولايات المتحدة',

        notice_text:      'أنا شخصياً أتحدث بطلاقة الإنجليزية والأفريكانية فقط. هذا الموقع متاح بـ8 لغات ليس لأنني أتحدثها جميعاً، بل لأنني أريد لكل زائر أن يتمكن من القراءة بلغته الأم - بدلاً من أن يتكيف معي. جميع الترجمات خضعت لمراجعة دقيقة من حيث القواعد والإملاء وبنية الجملة.',
        notice_dismiss:   'إغلاق',

        title_home:       'ماثيو ديريك رال - مطور ومصمم ألعاب',
        title_about:      'نبذة عني - Matthew Derek Rall',
        title_work:       'أعمالي - Matthew Derek Rall',
        title_research:   'البحث - Matthew Derek Rall',
        title_ach:        'الإنجازات - Matthew Derek Rall',
        title_contact:    'تواصل - Matthew Derek Rall',
        title_project: 'مشروع - Matthew Derek Rall',
    },

    ja: {
        nav_home:         'ホーム',
        nav_about:        '自己紹介',
        nav_work:         '作品',
        nav_research:     '研究',
        nav_achievements: '実績',
        nav_contact:      'お問い合わせ',

        hero_relocating:  'アメリカへの移住準備中',
        hero_badge:       'ゲーム開発者・デザイナー',
        hero_role:        'Unity - Unreal Engine - C# - C++',
        hero_desc:        '2023年からゲームを制作しています。がん啓発シューターからカードベースのダンジョンクローラーまで幅広く手がけています。ゲームデザイン・開発学士、デザインリーダーシップ優等学士取得、VR研究の論文も発表しています。',
        hero_btn_projects: 'プロジェクトを見る',
        hero_btn_cv:      'CVをダウンロード',
        hero_scroll:      'スクロール',

        stat_years:       '年の開発経験',
        stat_degrees:     '学位',
        stat_publication: '論文発表',
        stat_languages:   'プログラミング言語',

        label_about:      '自己紹介',
        about_heading:    '世界を作り、問題を解決する',
        about_p1:         '南アフリカのダーバン出身のゲーム開発者です。技術開発とクリエイティブデザインの交差点で仕事をしています。UnityとUnreal Engineでのゲーム開発から、バーチャルリアリティがプログラミング教育をどのように変えられるかの研究まで幅広く取り組んでいます。',
        about_p2:         '開発以外にも、競技esportsコーチおよびアカデミックチューターとしての経験があり、コミュニケーション能力・リーダーシップ・分析的思考を磨いてきました。創造的な問題解決が求められる、協力的でスピード感のある環境で力を発揮します。',
        about_readmore:   '私についてもっと読む',

        label_skills:     'スキル・ツール',
        skills_heading:   'スキルとツール',
        skills_sub:       'UnityやUnrealから周辺ツールまで、開発で実際に使っているものを紹介します。',
        skill_languages:  'プログラミング言語',
        skill_engines:    'ゲームエンジン・3D',
        skill_tools:      'ツール・IDE',
        skill_other:      'その他のスキル',

        label_experience: '職歴',
        exp_heading:      '経験',
        exp_sub:          'ゲームジャム、教室、コーチング - 時間を積み重ねてきた場所です。',
        exp_other:        'その他の経験',

        label_education:  '学歴',
        edu_heading:      '学歴',
        edu_sub:          'Vega Schoolで4年間、2つの学位 - すべての土台となっています。',

        label_research:   '研究',
        research_heading: '論文・研究',
        research_sub:     'デザインリーダーシップ優等課程における査読済み作品および学術プロジェクト。',
        pub_badge:        '査読済み研究 - 2025',
        pub_view:         'ResearchGateで見る',
        research_also:    '優等学士年度のその他の研究・デザイン作品：',

        label_achievements: '受賞・実績',
        ach_heading:      '実績',
        ach_sub:          '受賞、コンペ順位、論文発表、メディア掲載。',
        press_heading:    'プレス・メディア掲載',

        label_work:       '作品',
        work_heading:     'プロジェクト',
        work_sub:         '学位課程および個人制作のゲーム・研究・アプリ。',
        tab_completed:    '完成済み',
        tab_wip:          '開発中',
        filter_all:       'すべて',
        proj_empty:       'まだプロジェクトはありません。後ほどご確認ください。',
        proj_view:        'プロジェクトを見る',
        proj_featured:    '注目の作品',
        proj_view_all:    'すべてのプロジェクトを見る',

        label_contact:    'お問い合わせ',
        contact_heading:  'つながりましょう',
        contact_text:     'アメリカへの移住を控え、ゲーム開発の職を積極的に探しています。プロジェクト、求人、またはただ繋がりたい方など、お気軽にご連絡ください。',
        contact_email:    'メール',
        contact_li:       'LinkedIn',
        contact_github:   'GitHub',
        contact_insta:    'Instagram',
        contact_discord:  'Discord',
        contact_cv:       '履歴書 / CV',
        contact_dl:       'PDFをダウンロード',
        contact_avail:    '現在アメリカへの移住準備中 - リモート・現地勤務ともに対応可',

        form_heading:     'メッセージを送る',
        form_name:        'お名前',
        form_name_ph:     'あなたのお名前',
        form_email:       'メールアドレス',
        form_email_ph:    'your@email.com',
        form_msg:         'メッセージ',
        form_msg_ph:      'プロジェクトや求人内容をお知らせください...',
        form_submit:      '送信する',
        form_success:     'ありがとうございます！近日中にご返信いたします。',

        ql_projects:      'すべてのプロジェクト',
        ql_projects_desc: 'ゲーム・アプリ・デザイン作品',
        ql_research:      '研究・論文',
        ql_research_desc: 'VR研究の発表論文と学術作品',
        ql_ach:           '実績',
        ql_ach_desc:      '受賞・順位・メディア掲載',

        foot_rights:      'All rights reserved.',
        foot_location:    '南アフリカ・ダーバン - アメリカ合衆国',

        notice_text:      '私が流暢に話せるのは英語とアフリカーンス語のみです。このサイトを8言語で提供しているのは、すべて話せるからではなく、すべての訪問者が母国語で読めるようにしたいからです。私に合わせてもらうのではなく、皆さんに快適に過ごしていただくためです。すべての翻訳は文法・スペル・文章構造の観点から丁寧に確認しています。',
        notice_dismiss:   '閉じる',

        title_home:       'Matthew Derek Rall - ゲーム開発者・デザイナー',
        title_about:      '自己紹介 - Matthew Derek Rall',
        title_work:       '作品 - Matthew Derek Rall',
        title_research:   '研究 - Matthew Derek Rall',
        title_ach:        '実績 - Matthew Derek Rall',
        title_contact:    'お問い合わせ - Matthew Derek Rall',
        title_project: 'プロジェクト - Matthew Derek Rall',
    },

};

// ONLY these keys are allowed to use innerHTML (they contain known safe markup).
// Currently none are needed - all translations are plain text.
const SAFE_HTML_KEYS = new Set([
    // Add any translation keys here that legitimately need HTML markup.
]);

/**
 * Apply translations to the current page.
 * Updates all elements with data-i18n attributes.
 * @param {string} lang - language code
 */
function applyTranslations(lang) {
    const t = TRANSLATIONS[lang] ?? TRANSLATIONS['en'];
    const en = TRANSLATIONS['en'];

    // Plain text translations (safe) - always use textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // Fall back to English if the translation key is missing for this language
        const value = t[key] ?? en[key];
        if (value != null) el.textContent = value;
    });

    // Update all data-i18n-placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = t[key] ?? en[key];
        if (value != null) el.placeholder = value;
    });

    // HTML translations - ONLY for explicitly allowlisted keys
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (!SAFE_HTML_KEYS.has(key)) {
            // Key not on allowlist - fall back to textContent for safety
            console.warn('data-i18n-html key "' + key + '" is not on the allowlist. ' +
                'Use data-i18n instead, or add to SAFE_HTML_KEYS if HTML is needed.');
            const value = t[key] ?? en[key];
            if (value != null) el.textContent = value;
            return;
        }
        const value = t[key] ?? en[key];
        if (value != null) el.innerHTML = value;
    });

    // Update html lang attribute
    const langMap = {
        en: 'en', zh: 'zh', hi: 'hi', es: 'es',
        fr: 'fr', ar: 'ar', af: 'af', ja: 'ja'
    };
    document.documentElement.lang = langMap[lang] || 'en';

    // Toggle RTL for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update page title
    const titleKey = {
        '/':                   'title_home',
        '/index.html':         'title_home',
        '/about.html':         'title_about',
        '/work.html':          'title_work',
        '/research.html':      'title_research',
        '/achievements.html':  'title_ach',
        '/contact.html':       'title_contact',
        '/project.html':         'title_project',
    };
    const path = window.location.pathname;
    const tKey = titleKey[path] || 'title_home';
    if (t[tKey]) document.title = t[tKey];

    // Update language switcher button label if it exists
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = '🌐 ' + (LANG_NAMES[lang] || 'English');
    }
}
