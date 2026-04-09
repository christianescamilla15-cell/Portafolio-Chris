// ─────────────────────────────────────────────
// SYNONYM MAP (100+ pairs)
// ─────────────────────────────────────────────
export const SYNONYM_GROUPS = [
  // Programming Languages
  ['javascript', 'js', 'ecmascript', 'es6', 'es2015'],
  ['typescript', 'ts'],
  ['python', 'py', 'python3'],
  ['c#', 'csharp', 'c sharp', 'dotnet', '.net'],
  ['c++', 'cpp', 'cplusplus'],
  ['ruby', 'rb'],
  ['golang', 'go'],
  ['rust', 'rs'],
  ['java', 'jvm'],
  ['php', 'laravel php'],
  ['swift', 'ios swift'],
  ['kotlin', 'kt'],
  ['scala', 'sc'],
  ['r', 'rlang', 'r language'],
  ['sql', 'structured query language', 'mysql', 'postgresql', 'postgres', 'mssql', 'sql server', 'sqlite', 'mariadb'],
  ['nosql', 'mongodb', 'mongo', 'dynamodb', 'cassandra', 'couchdb', 'firebase', 'firestore'],
  ['html', 'html5', 'hypertext markup language'],
  ['css', 'css3', 'cascading style sheets', 'scss', 'sass', 'less', 'stylesheets'],

  // Frontend Frameworks
  ['react', 'reactjs', 'react.js', 'react js'],
  ['next', 'nextjs', 'next.js', 'next js'],
  ['vue', 'vuejs', 'vue.js', 'vue js'],
  ['nuxt', 'nuxtjs', 'nuxt.js'],
  ['angular', 'angularjs', 'angular.js'],
  ['svelte', 'sveltejs', 'sveltekit'],
  ['tailwind', 'tailwindcss', 'tailwind css'],
  ['bootstrap', 'bootstrap css', 'bootstrap5'],
  ['material ui', 'mui', 'material design'],

  // Backend / Runtime
  ['node', 'nodejs', 'node.js', 'node js'],
  ['express', 'expressjs', 'express.js'],
  ['fastapi', 'fast api'],
  ['django', 'django rest framework', 'drf'],
  ['flask', 'flask python'],
  ['spring', 'spring boot', 'springboot'],
  ['nest', 'nestjs', 'nest.js'],
  ['deno', 'denojs'],
  ['bun', 'bunjs'],

  // AI / ML
  ['artificial intelligence', 'ai', 'ia', 'inteligencia artificial'],
  ['machine learning', 'ml', 'aprendizaje automatico', 'aprendizaje autom\u00e1tico'],
  ['deep learning', 'dl', 'aprendizaje profundo'],
  ['natural language processing', 'nlp', 'procesamiento de lenguaje natural', 'pln'],
  ['computer vision', 'cv', 'vision por computadora', 'visi\u00f3n por computadora', 'vision artificial'],
  ['large language model', 'llm', 'llms', 'modelo de lenguaje', 'modelos de lenguaje'],
  ['generative ai', 'genai', 'gen ai', 'ia generativa'],
  ['neural network', 'neural networks', 'redes neuronales', 'red neuronal'],
  ['tensorflow', 'tf', 'keras'],
  ['pytorch', 'torch'],
  ['scikit-learn', 'sklearn', 'scikit learn'],
  ['hugging face', 'huggingface', 'hf', 'transformers'],
  ['openai', 'gpt', 'chatgpt', 'gpt-4', 'gpt-3', 'gpt4', 'gpt3'],
  ['claude', 'anthropic', 'claude api'],
  ['langchain', 'lang chain'],
  ['vector database', 'vector db', 'vectordb', 'pinecone', 'weaviate', 'chroma', 'chromadb', 'qdrant'],
  ['rag', 'retrieval augmented generation', 'generaci\u00f3n aumentada por recuperaci\u00f3n'],
  ['prompt engineering', 'ingenier\u00eda de prompts', 'prompting'],

  // Cloud / DevOps
  ['amazon web services', 'aws'],
  ['google cloud', 'gcp', 'google cloud platform'],
  ['microsoft azure', 'azure'],
  ['docker', 'containers', 'contenedores', 'containerization'],
  ['kubernetes', 'k8s'],
  ['ci/cd', 'ci cd', 'cicd', 'continuous integration', 'continuous deployment', 'integraci\u00f3n continua', 'despliegue continuo'],
  ['github actions', 'gh actions'],
  ['terraform', 'iac', 'infrastructure as code', 'infraestructura como c\u00f3digo'],
  ['linux', 'unix', 'bash', 'shell'],
  ['serverless', 'lambda', 'cloud functions', 'sin servidor'],

  // Tools / Platforms
  ['git', 'github', 'gitlab', 'bitbucket', 'version control', 'control de versiones'],
  ['jira', 'atlassian', 'confluence'],
  ['figma', 'sketch', 'adobe xd', 'dise\u00f1o ui'],
  ['postman', 'insomnia', 'api testing'],
  ['make.com', 'make', 'integromat'],
  ['zapier', 'automatizacion', 'automatizaci\u00f3n'],
  ['n8n', 'n8n.io', 'workflow automation'],
  ['airtable', 'air table'],
  ['notion', 'notion.so'],
  ['bubble', 'bubble.io'],
  ['wordpress', 'wp'],
  ['shopify', 'ecommerce', 'e-commerce', 'comercio electr\u00f3nico'],
  ['power bi', 'powerbi', 'tableau', 'data visualization', 'visualizaci\u00f3n de datos'],

  // Data
  ['data analysis', 'an\u00e1lisis de datos', 'analisis de datos', 'data analytics'],
  ['data science', 'ciencia de datos'],
  ['data engineering', 'ingenier\u00eda de datos', 'ingenieria de datos'],
  ['etl', 'extract transform load', 'extracci\u00f3n transformaci\u00f3n carga'],
  ['big data', 'hadoop', 'spark', 'apache spark'],
  ['pandas', 'numpy', 'scipy', 'matplotlib'],

  // Soft Skills
  ['leadership', 'liderazgo', 'team lead', 'l\u00edder de equipo', 'lider de equipo', 'team leadership'],
  ['communication', 'comunicaci\u00f3n', 'comunicacion', 'communication skills'],
  ['teamwork', 'trabajo en equipo', 'collaboration', 'colaboraci\u00f3n', 'team player'],
  ['problem solving', 'resoluci\u00f3n de problemas', 'resolucion de problemas', 'analytical thinking', 'pensamiento anal\u00edtico'],
  ['project management', 'gesti\u00f3n de proyectos', 'gestion de proyectos', 'pm'],
  ['agile', 'scrum', 'kanban', 'metodolog\u00edas \u00e1giles', 'metodologias agiles', 'agile methodology'],
  ['time management', 'gesti\u00f3n del tiempo', 'gestion del tiempo'],
  ['critical thinking', 'pensamiento cr\u00edtico', 'pensamiento critico'],
  ['creativity', 'creatividad', 'creative thinking'],
  ['adaptability', 'adaptabilidad', 'flexibility', 'flexibilidad'],
  ['attention to detail', 'atenci\u00f3n al detalle', 'atencion al detalle'],
  ['self-motivated', 'automotivado', 'proactivo', 'proactive', 'self motivated'],
  ['customer service', 'atenci\u00f3n al cliente', 'atencion al cliente', 'servicio al cliente'],
  ['negotiation', 'negociaci\u00f3n', 'negociacion'],
  ['presentation', 'presentaci\u00f3n', 'public speaking', 'oratoria'],
  ['mentoring', 'mentor\u00eda', 'coaching'],

  // Education
  ['bachelor', 'licenciatura', 'grado', "bachelor's degree", 'titulo universitario', 't\u00edtulo universitario', 'bsc', 'ba'],
  ['master', 'maestr\u00eda', 'maestria', "master's degree", 'msc', 'mba', 'postgrado', 'posgrado'],
  ['phd', 'doctorado', 'doctorate', 'doctor', 'ph.d.'],
  ['certification', 'certificaci\u00f3n', 'certificacion', 'certified', 'certificado'],
  ['bootcamp', 'intensive course', 'curso intensivo'],
  ['computer science', 'ciencias de la computaci\u00f3n', 'ingenier\u00eda en sistemas', 'ingenieria en sistemas', 'cs', 'inform\u00e1tica', 'informatica'],
  ['engineering', 'ingenier\u00eda', 'ingenieria'],

  // Languages
  ['english', 'ingl\u00e9s', 'ingles'],
  ['spanish', 'espa\u00f1ol', 'espanol', 'castellano'],
  ['french', 'franc\u00e9s', 'frances', 'fran\u00e7ais'],
  ['german', 'alem\u00e1n', 'aleman', 'deutsch'],
  ['portuguese', 'portugu\u00e9s', 'portugues'],
  ['mandarin', 'chinese', 'chino', 'mandar\u00edn'],
  ['bilingual', 'biling\u00fce', 'bilingue'],

  // Experience levels
  ['senior', 'sr', 'sr.', 'lead', 'principal'],
  ['junior', 'jr', 'jr.', 'entry level', 'nivel inicial'],
  ['mid-level', 'mid level', 'semi-senior', 'semi senior', 'ssr'],
  ['intern', 'internship', 'practicante', 'pr\u00e1cticas', 'pasante', 'pasant\u00eda'],

  // API / Architecture
  ['rest', 'restful', 'rest api', 'restful api', 'api rest'],
  ['graphql', 'graph ql'],
  ['microservices', 'microservicios', 'micro services'],
  ['monolith', 'monol\u00edtico', 'monolithic'],
  ['websocket', 'websockets', 'ws', 'socket.io', 'real-time', 'tiempo real'],
  ['oauth', 'oauth2', 'authentication', 'autenticaci\u00f3n', 'auth'],

  // Testing
  ['testing', 'tests', 'pruebas', 'qa', 'quality assurance'],
  ['unit testing', 'pruebas unitarias', 'jest', 'mocha', 'pytest'],
  ['e2e', 'end to end', 'cypress', 'playwright', 'selenium'],
  ['tdd', 'test driven development', 'desarrollo guiado por pruebas'],

  // Mobile
  ['react native', 'rn', 'react-native'],
  ['flutter', 'dart'],
  ['mobile development', 'desarrollo m\u00f3vil', 'desarrollo movil', 'mobile app'],
  ['ios', 'apple', 'iphone'],
  ['android', 'google play'],

  // Security
  ['cybersecurity', 'ciberseguridad', 'security', 'seguridad', 'infosec'],
  ['penetration testing', 'pentesting', 'ethical hacking', 'hacking \u00e9tico'],

  // Design
  ['ui/ux', 'ui ux', 'ux/ui', 'ux ui', 'user experience', 'experiencia de usuario', 'user interface', 'interfaz de usuario'],
  ['responsive design', 'dise\u00f1o responsivo', 'responsive', 'mobile first', 'mobile-first'],
];

// Build lookup: word -> group index
export const synonymLookup = new Map();
SYNONYM_GROUPS.forEach((group, idx) => {
  group.forEach((term) => {
    synonymLookup.set(term.toLowerCase(), idx);
  });
});

export function areSynonyms(a, b) {
  const la = a.toLowerCase();
  const lb = b.toLowerCase();
  if (la === lb) return true;
  const ga = synonymLookup.get(la);
  const gb = synonymLookup.get(lb);
  if (ga !== undefined && ga === gb) return true;
  // partial match for multi-word
  if (la.includes(lb) || lb.includes(la)) return true;
  return false;
}

export function findSynonymGroup(term) {
  const idx = synonymLookup.get(term.toLowerCase());
  if (idx !== undefined) return SYNONYM_GROUPS[idx];
  return null;
}
