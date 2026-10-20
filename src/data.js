// Portfolio content is grounded in CV_2025.docx, supplied by the portfolio owner.
// Periods that were inconsistent in the CV are deliberately not assigned fabricated dates.
export const LINKEDIN = 'https://www.linkedin.com/in/ftayyab';
export const OWNER = 'Faizan Tayyab';

export const domains = [
  {
    id:'gis', name:'GIS & Spatial', sub:'The Cartography Gardens', short:'Mapmaking becomes a system for understanding the world.',
    color:'#21b9a1', location:[-98,-53], style:'gis', symbol:'◎',
    description:'Geospatial systems, spatial analytics, terrain interpretation, enterprise GIS and cartographic application design form the core of this career.',
    highlights:['Spatial data engineering and 3D terrain products','ArcGIS enterprise, Python geoprocessing and web mapping','GIS for exploration, infrastructure and environmental analysis'],
    technologies:['ArcGIS','Python','PostGIS','GeoServer','QGIS','Spatial Analysis']
  },
  {
    id:'engineering', name:'Engineering', sub:'The Codeworks Quarter', short:'Practical software built around real operational problems.',
    color:'#f58d68', location:[-59,-53], style:'code', symbol:'⌘',
    description:'From enterprise applications and C# systems to custom GIS integrations, reusable software patterns and engineering team delivery.',
    highlights:['Software architecture and application development','Python, C# and JavaScript engineering','Refactoring, reusable components and delivery practices'],
    technologies:['C#','.NET','JavaScript','Python','APIs','Design Patterns']
  },
  {
    id:'cloud', name:'Cloud & Platforms', sub:'The Cloudspire District', short:'Connected platforms that make spatial intelligence scalable.',
    color:'#7b8df5', location:[-20,-53], style:'cloud', symbol:'☁',
    description:'Design and operation of enterprise geospatial platforms, cloud processing systems, modern delivery infrastructure and scalable architectures.',
    highlights:['AWS geospatial processing solutions','Enterprise systems design and infrastructure strategy','Containerization and cloud architecture'],
    technologies:['AWS','Kubernetes','Docker','Enterprise GIS','Cloud Architecture']
  },
  {
    id:'data', name:'Data Architecture', sub:'The Dataflow Arcade', short:'Complex information becomes dependable pipelines and insight.',
    color:'#e5ac43', location:[19,-53], style:'data', symbol:'▥',
    description:'Data modelling, enterprise data architecture, real-time streaming, data ingestion and analytics across large technical platforms.',
    highlights:['Enterprise data architecture and strategy','Ingestion pipelines, streaming and analytics','Data governance and cross-team engineering leadership'],
    technologies:['Data Modelling','Kafka','Spark','Snowflake','ETL','Analytics']
  },
  {
    id:'ai', name:'AI & GeoAI', sub:'The Intelligence Atrium', short:'Where location intelligence meets generative AI.',
    color:'#c77af0', location:[58,-53], style:'ai', symbol:'✧',
    description:'Generative AI applications, machine learning and emerging geospatial interfaces that make sophisticated analysis more accessible.',
    highlights:['Generative AI application development','Machine learning and geospatial analytics','Presentation of a geospatial GenAI solution at Geo 4.0 (2025)'],
    technologies:['Generative AI','Machine Learning','Python','GeoAI','Model Integration']
  },
  {
    id:'leadership', name:'Leadership & Learning', sub:'The Knowledge Pavilion', short:'Technology matters most when teams can use it.',
    color:'#6cb996', location:[97,-53], style:'leadership', symbol:'✦',
    description:'Engineering management, technical strategy, mentoring, technology presentations and specialist training across GIS and adjacent disciplines.',
    highlights:['Management of technical and architecture teams','Technical training and course delivery','Stakeholder engagement and geospatial innovation leadership'],
    technologies:['Team Leadership','Mentoring','Training','Architecture Strategy','Innovation']
  }
];

// Routes are chronological in storytelling order; overlapping work and secondments are disclosed in the descriptions.
export const timeline = [
  {
    id:'education-bsc', company:'University of Nottingham', kind:'Education', role:'BSc (Hons) Computing and Information Systems',
    date:'2001–2004', years:'2001–04', location:[-113,30], color:'#e7a45a', style:'campus', domainIds:['engineering'],
    short:'A foundation in computing, systems design, and software development.',
    story:'Completed a BSc (Hons) in Computing and Information Systems with Distinction at the University of Nottingham. The dissertation focused on an automated patient information system delivering outputs to multiple client platforms.',
    achievements:['BSc (Hons) Computing and Information Systems — Distinction','Thesis: Automated Patient Information System','Developed a foundation in cross-platform software and information systems'],
    technologies:['Computing','Information Systems','Software Development','Systems Design']
  },
  {
    id:'education-msc', company:'University of Nottingham', kind:'Education', role:'MSc Geographical Information Sciences',
    date:'2005–2006', years:'2005–06', location:[-95,30], color:'#54b8ae', style:'campus', domainIds:['gis','engineering'],
    short:'Spatial thinking enters the story through terrain, visibility, and geographical information.',
    story:'Completed the MSc in Geographical Information Sciences with Merit at the University of Nottingham. The dissertation evaluated viewsheds to support planning and identifying optimal hidden routes through terrain. Recipient of Developing Solution and Geography School scholarships.',
    achievements:['MSc Geographical Information Sciences — Merit','Thesis: evaluating viewsheds for hidden-route planning','Developing Solution and Geography School scholarships'],
    technologies:['GIS','Viewshed Analysis','Terrain Modelling','Geospatial Research']
  },
  {
    id:'ordnance', company:'Ordnance Survey', kind:'Career', role:'GIS Developer',
    date:'Dec 2006 – Jan 2008', years:'2006–08', location:[-77,29], color:'#26b5a7', style:'survey', domainIds:['gis','engineering'],
    short:'Where national mapping and 3D geospatial products became practical engineering.',
    story:'Supported mapping products, moved in-house tools from MapInfo to Esri, trained developers in Python and contributed research and scripts for city-scale 3D height products.',
    achievements:['Transitioned internal solutions toward Esri technologies','Developed workflows for city-scale 3D height products','Provided GIS product demonstrations and Python knowledge sharing'],
    technologies:['Esri','Python','3D Height Models','Mapping']
  },
  {
    id:'kbr', company:'KBR / Granherne', kind:'Career', role:'GIS Specialist',
    date:'Feb 2008 – Jan 2011', years:'2008–11', location:[-53,32], color:'#ef995f', style:'industrial', domainIds:['gis','engineering'],
    short:'Spatial analysis moves into engineering, pipelines, energy and the built environment.',
    story:'GIS support for engineering programmes, including pipeline modelling, wind-farm studies, environmental analysis, CAD data and custom costing applications.',
    achievements:['GIS support for infrastructure and environmental studies','Pipeline modelling and CAD integration','Developed custom analysis and costing tools'],
    technologies:['ArcGIS','CAD','Pipeline Modelling','GIS Development']
  },
  {
    id:'bp', company:'BP', kind:'Secondment', role:'GIS Technical Consultant',
    date:'2008 · secondment', years:'2008', location:[-28,29], color:'#72b975', style:'planning', domainIds:['gis','data'],
    short:'A focused consultancy chapter within the earlier engineering period.',
    story:'A three-month secondment providing technical GIS consultancy for oil and gas field-development planning, data modelling and future mapping-tool strategies. This engagement overlaps with the KBR chapter.',
    achievements:['Advised on field-development planning tools','Contributed data modelling and GIS development strategy','Worked directly on domain-specific consultancy'],
    technologies:['GIS Consulting','Spatial Data Modelling','Oil & Gas']
  },
  {
    id:'tullow', company:'Tullow Oil', kind:'Career', role:'Senior GIS Developer',
    date:'Jan 2011 – May 2014', years:'2011–14', location:[-3,31], color:'#f4ba4a', style:'globe', domainIds:['gis','engineering','leadership'],
    short:'GIS becomes an enterprise-wide network connecting people and places.',
    story:'Developed a distributed global GIS infrastructure and strategy across offices, built custom applications, automated manual processes, led developers and championed technology innovation.',
    achievements:['Designed global GIS infrastructure and strategy','Created GIS applications and real-time usage monitoring','Presented a GIS development case at the Esri developer community in 2013'],
    technologies:['Enterprise GIS','Automation','Application Development','GIS Strategy']
  },
  {
    id:'adas', company:'ADAS', kind:'Career', role:'GIS Developer / Consultant',
    date:'Jan 2015 – Apr 2015', years:'2015', location:[22,30], color:'#55b6cb', style:'utilities', domainIds:['gis','engineering'],
    short:'Client-focused GIS solutions for infrastructure and utilities.',
    story:'Provided GIS consultancy and Esri/.NET solution development for a UK power-network mapping project, gathered requirements and coordinated a small team of analysts.',
    achievements:['Delivered Esri-based web GIS components','Translated requirements into solution architecture','Led a small GIS analyst team'],
    technologies:['Esri','.NET','Web GIS','Solution Architecture']
  },
  {
    id:'scisys', company:'SCISYS', kind:'Career', role:'GIS Technical Architect · Solution Architect / Engineer',
    date:'Jun 2015 – Apr 2018', years:'2015–18', location:[47,31], color:'#aa85d9', style:'software', domainIds:['engineering','gis','leadership'],
    short:'Software architecture, modernisation and large client systems.',
    story:'Worked on GIS architecture, client-facing engineering, legacy-system modernisation and, in 2017–2018, railway signalling visualisation and data-processing software.',
    achievements:['Led GIS technical architecture and client projects','Refactored and modernised C# / ArcObjects systems','Enhanced C#/.NET railway signalling applications'],
    technologies:['C#','.NET','ArcObjects','Git','System Architecture']
  },
  {
    id:'wood-engineering', company:'Wood Mackenzie', kind:'Career', role:'Senior Engineering Manager / Architect GIS & AWS',
    date:'Apr 2018 – May 2021', years:'2018–21', location:[72,29], color:'#4f9dd6', style:'cloudtower', domainIds:['cloud','gis','engineering','leadership'],
    short:'From delivering systems to shaping geospatial and cloud strategy.',
    story:'Managed technical teams, helped lead enterprise GIS and cloud strategy, improved architecture and operations, and designed applications, analytics and data pipelines.',
    achievements:['Led software engineers, analysts and developers','Designed enterprise GIS and cloud platform improvements','Oversaw GIS architecture, streaming pipelines and analytics'],
    technologies:['AWS','ArcGIS Enterprise','Cloud Architecture','Data Pipelines']
  },
  {
    id:'verisk', company:'Verisk Analytics', kind:'Career', role:'Geospatial Engineering Manager',
    date:'2021', years:'2021', location:[99,15], color:'#eb8069', style:'processor', domainIds:['gis','cloud','engineering','leadership'],
    short:'Industrial-scale geospatial analytics in the cloud.',
    story:'Developed Python raster-processing algorithms, cloud geospatial processing systems on AWS and strategies for scalable open-source geospatial technologies.',
    achievements:['Advanced Python raster and spatial algorithms','Cloud-based geospatial processing on AWS','Worked across engineering, GIS, cloud and IT teams'],
    technologies:['Python','Raster Processing','AWS','Open-source GIS']
  },
  {
    id:'wood-data', company:'Wood Mackenzie', kind:'Career', role:'Senior Principal Data Architect',
    date:'Feb 2021 – 2022', years:'2021–22', location:[75,-8], color:'#e3a060', style:'datatower', domainIds:['data','cloud','leadership'],
    short:'The architecture of data becomes as important as the map itself.',
    story:'Led data architects and modellers, shaped enterprise data architecture strategy, and worked with engineering teams on ingestion strategies, pipelines and complex data systems.',
    achievements:['Led and developed the data architecture team','Defined enterprise architecture and ingestion strategy','Collaborated on data engineering and modelling solutions'],
    technologies:['Enterprise Data Architecture','Data Modelling','Ingestion','Team Leadership']
  },
  {
    id:'aramco', company:'Saudi Aramco', kind:'Current chapter', role:'Senior Exploration Analyst',
    date:'Jan 2022 – Present', years:'2022–Now', location:[48,-9], color:'#af7be0', style:'geolab', domainIds:['gis','ai','cloud','leadership'],
    short:'Bringing geospatial systems, exploration and generative AI together.',
    story:'Works on geospatial application development, generative AI applications, enterprise GIS and technical training in an upstream exploration setting. Presented a geospatial GenAI solution at Geo 4.0 in 2025.',
    achievements:['Geospatial applications for exploration workflows','Generative AI application development and enterprise GIS','Technology training and Geo 4.0 presentation (2025)'],
    technologies:['GeoAI','Enterprise GIS','Generative AI','Technology Training']
  }
];


// Explicitly transcribed and condensed from the supplied CV. Where the CV did not
// provide a year or exact date, none is inferred.
export const qualifications = [
 {name:'Google Certified Generative AI Leader',issuer:'Google',year:'Not specified',group:'AI & Machine Learning'},
 {name:'Google Certified Engineer',issuer:'Google',year:'Not specified',group:'Cloud & Architecture'},
 {name:'Google Certified Digital Leader',issuer:'Google',year:'Not specified',group:'Cloud & Architecture'},
 {name:'Kubernetes Developer Certification',issuer:'Linux Foundation',year:'Not specified',group:'Cloud & Architecture'},
 {name:'Data Architect Nanodegree',issuer:'Udacity',year:'2022',group:'Data & Streaming'},
 {name:'Big Data Hadoop and Spark Developer',issuer:'Simplilearn',year:'2021',group:'Data & Streaming'},
 {name:'ELK Stack',issuer:'Udemy',year:'2020',group:'Data & Streaming'},
 {name:'Cloud Architect Nanodegree',issuer:'Udacity',year:'2020',group:'Cloud & Architecture'},
 {name:'Data Streaming Nanodegree',issuer:'Udacity',year:'2020',group:'Data & Streaming'},
 {name:'Machine Learning',issuer:'Udacity',year:'2020',group:'AI & Machine Learning'},
 {name:'Linear Algebra',issuer:'Imperial College London',year:'2019',group:'AI & Machine Learning'},
 {name:'AWS Certified Solutions Architect',issuer:'AWS',year:'2019',group:'Cloud & Architecture'},
 {name:'AWS Certified Developer',issuer:'AWS',year:'2019',group:'Cloud & Architecture'},
 {name:'AWS Certified Cloud Practitioner',issuer:'AWS',year:'2018',group:'Cloud & Architecture'},
 {name:'Machine Learning & Deep Networks',issuer:'Coursera',year:'2017',group:'AI & Machine Learning'},
 {name:'PRINCE2 Foundation',issuer:'PRINCE2',year:'2013',group:'Leadership & Practice'},
 {name:'Big Data (MOOC)',issuer:'University of California',year:'Not specified',group:'Data & Streaming'},
 {name:'Apache Hadoop Framework and Architecture (MOOC)',issuer:'University of California',year:'Not specified',group:'Data & Streaming'}
];

export const skillGroups = [
 {name:'Geospatial & GIS',color:'#20b6a0',skills:['ArcGIS Desktop / Server / Enterprise','ArcObjects','QGIS','GeoServer','OpenLayers','Leaflet','PostGIS','Spatial SQL','FME','ERDAS','GPS','GML','Remote Sensing']},
 {name:'Software Engineering',color:'#f28d64',skills:['Python','C# / .NET / ASP.NET','JavaScript / ES6','Node.js / Express','Java','C / C++','WebSockets','Django','REST APIs','Design Patterns','Git','TDD / BDD']},
 {name:'Cloud & DevOps',color:'#718bf5',skills:['AWS','Kubernetes','Docker / Swarm','Terraform','Cloud Architecture','Linux','Cloud-native Platforms','Serverless GIS']},
 {name:'Data & Analytics',color:'#e3aa42',skills:['Data Architecture','Data Modelling','Snowflake','PostgreSQL / PostGIS','SQL Server','MySQL','MongoDB','Apache Kafka','Spark','Hadoop / Hive','ELK Stack','Pandas / NumPy']},
 {name:'AI & GeoAI',color:'#bd7be9',skills:['Generative AI Applications','Machine Learning','TensorFlow','scikit-learn','Deep Learning','GeoAI & Spatial Analytics']},
 {name:'Leadership & Delivery',color:'#66b98d',skills:['Team Management','Technical Mentoring','Solution Architecture','Project Strategy','Agile / Scrum','Stakeholder Engagement','Training & Presentations','PRINCE2']}
];

export const careerExtras = {
 'education-bsc':{responsibilities:['Studied computing and information systems','Designed an automated patient information system as the BSc dissertation'],roleNotes:[]},
 'education-msc':{responsibilities:['Studied geographical information science and geospatial analysis','Researched viewshed-based route planning'],roleNotes:[]},
 ordnance:{responsibilities:['Supported pre- and post-sales teams for Ordnance Survey mapping products','Led migration of internal products from MapInfo to Esri','Developed scripts for city-scale 3D height products','Trained developers in Python and supported customers'],roleNotes:[]},
 kbr:{responsibilities:['Supported environmental, wind-farm and engineering GIS studies','Modelled pipelines, imported CAD data and supported proposal work','Developed GIS-based costing and custom applications','Provided mapping and analysis to engineering teams'],roleNotes:[]},
 bp:{responsibilities:['Provided consultancy on future oil and gas field-development planning GIS tools','Advised on spatial data modelling and GIS development strategies'],roleNotes:['Three-month secondment in 2008; overlaps the KBR employment period.']},
 tullow:{responsibilities:['Developed global GIS infrastructure and enterprise GIS strategy across offices','Built and customised GIS applications and real-time monitoring tools','Led developers and analysts and an internal technology and innovation group','Conducted training, demonstrations and GIS workshops'],roleNotes:[]},
 adas:{responsibilities:['Gathered requirements for a UK Power Networks web GIS project','Designed and implemented components using Esri and .NET','Led a small GIS analyst team and provided client consultancy'],roleNotes:[]},
 scisys:{responsibilities:['Served as GIS Technical Architect and project lead on client projects','Worked on Welsh Government agricultural policy systems and ArcObjects C# modernisation','Supported solution architecture, development and technical documentation','Worked on C#/.NET railway signalling visualisation and data processing'],roleNotes:['GIS Technical Architect: Jun 2015 – Apr 2018','Solution Architect / Engineer: Apr 2017 – Apr 2018']},
 'wood-engineering':{responsibilities:['Led geospatial and cloud strategy and managed engineers, analysts and developers','Designed and administered enterprise GIS across Esri and open-source stacks','Oversaw architecture improvements, licensing and best engineering practices','Developed data-driven applications, pipelines and real-time data streaming'],roleNotes:[]},
 verisk:{responsibilities:['Developed advanced Python raster and spatial-processing algorithms','Built cloud geospatial processing systems on AWS','Defined open-source geospatial cloud strategy','Coordinated GIS, engineering, cloud and IT teams'],roleNotes:['The source CV lists a reversed month range for this role; 2021 is used without inventing corrected months.']},
 'wood-data':{responsibilities:['Led and line-managed data architects and data modellers','Developed enterprise data architecture strategy','Designed ingestion, modelling and data pipeline approaches','Partnered with data engineering to solve architecture problems'],roleNotes:[]},
 aramco:{responsibilities:['Develops and supports geospatial applications for exploration','Develops generative AI applications','Manages and develops enterprise geospatial systems','Delivers technology courses as a certified trainer'],roleNotes:[]}
};

export const learningHighlights = [
 {title:'Academic foundations',description:'BSc (Hons) Computing and Information Systems — Distinction (2004); MSc Geographical Information Sciences — Merit (2006).'},
 {title:'Scholarships',description:'Developing Solution Scholarship and Geography School Scholarship for the MSc at the University of Nottingham.'},
 {title:'Industry presentations',description:'Esri developer community presentation on GIS in oil industry (2013); geospatial Generative AI presentation at Geo 4.0, Khobar (2025).'},
 {title:'Teaching',description:'Trainer in GeoPandas, Elasticsearch, enterprise geodatabases and data pipelines; certified technology trainer for an upstream training centre.'}
];

export const archiveDestinations = [
 {id:'certifications',name:'Certification Gallery',location:[103,-23],color:'#f0ad4a',symbol:'✹'},
 {id:'skills',name:'Skills Atelier',location:[-110,-24],color:'#9d7cec',symbol:'◈'}
];

export const stationCount = timeline.length;
export function careerById(id) { return timeline.find(x=>x.id===id); }
export function domainById(id) { return domains.find(x=>x.id===id); }
export function escapeText(v) { return String(v??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
