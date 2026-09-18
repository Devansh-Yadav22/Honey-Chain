export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa';

export interface Translations {
  // Brand & Meta
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  
  // Landing Page - New Keys for Mockup Redesign
  landingHeroTag: string;
  landingHeroTitle: string;
  landingHeroDesc: string;
  landingHeroCta: string;
  landingHeroDiscover: string;
  landingBadgeTraceable: string;
  landingBadgeTraceableSub: string;
  landingFeatureSource: string;
  landingFeatureSourceDesc: string;
  landingFeaturePure: string;
  landingFeaturePureDesc: string;
  landingFeatureSupport: string;
  landingFeatureSupportDesc: string;
  landingFeatureHealthy: string;
  landingFeatureHealthyDesc: string;
  landingHowTag: string;
  landingHowTitle: string;
  landingHowDesc: string;
  landingStep1Title: string;
  landingStep1Desc: string;
  landingStep2Title: string;
  landingStep2Desc: string;
  landingStep3Title: string;
  landingStep3Desc: string;
  landingStep4Title: string;
  landingStep4Desc: string;
  landingMissionTitle: string;
  landingMissionDesc: string;
  landingMissionCta: string;
  landingTraceTag: string;
  landingTraceTitle: string;
  landingTraceDesc: string;
  landingTracePlaceholder: string;
  landingTraceBtn: string;
  landingTraceNote: string;

  // Navigation & Actions
  navHome: string;
  navHowItWorks: string;
  navTechnology: string;
  navVerifyHoney: string;
  navAbout: string;
  navSignIn: string;
  navDashboard: string;
  navSignOut: string;
  navOurHoney: string;
  navTrace: string;
  navContact: string;
  btnVerify: string;
  btnExplore: string;
  btnScanQr: string;
  btnEnterBatchId: string;
  btnCancel: string;
  btnSubmit: string;
  btnBack: string;
  btnInspect: string;
  
  // Two Provenance Models
  modelDirectBeekeeper: string;
  modelDirectBeekeeperDesc: string;
  modelCompanyManaged: string;
  modelCompanyManagedDesc: string;
  twoModelsTitle: string;
  twoModelsSubtitle: string;
  
  // How it works steps
  stepHive: string;
  stepHarvest: string;
  stepProcessing: string;
  stepQuality: string;
  stepLogistics: string;
  stepPackaging: string;
  stepPassport: string;
  
  // Why Honey Chain
  whyTitle: string;
  whySubtitle: string;
  featureTraceabilityTitle: string;
  featureTraceabilityDesc: string;
  featureAiTitle: string;
  featureAiDesc: string;
  featureBlockchainTitle: string;
  featureBlockchainDesc: string;
  featureLabTitle: string;
  featureLabDesc: string;
  featureConsumerTitle: string;
  featureConsumerDesc: string;
  featureIotTitle: string;
  featureIotDesc: string;

  // Technology Section
  techTitle: string;
  techSubtitle: string;
  techFabricTitle: string;
  techFabricDesc: string;
  techAiTitle: string;
  techAiDesc: string;
  techIotTitle: string;
  techIotDesc: string;
  techPassportTitle: string;
  techPassportDesc: string;
  
  // Verify Modal & Scan
  verifyModalTitle: string;
  verifyModalSubtitle: string;
  scanQrTab: string;
  manualEntryTab: string;
  scanQrPrompt: string;
  manualInputPlaceholder: string;
  tryVerifiedPreset: string;
  tryDirectPreset: string;
  trySuspiciousPreset: string;
  cameraPermissionNote: string;
  
  // Passport Page
  passportTitle: string;
  passportSubtitle: string;
  passportBatch: string;
  passportProvenanceModel: string;
  passportStatusVerified: string;
  passportStatusFlagged: string;
  passportOriginApiary: string;
  passportFloralSource: string;
  passportVolume: string;
  passportEvidenceScore: string;
  passportTimelineTitle: string;
  passportStageHarvest: string;
  passportStageProcessing: string;
  passportStageTransport: string;
  passportStagePackaging: string;
  passportBeekeeperProfile: string;
  passportCompanyProfile: string;
  passportPillarBlockchain: string;
  passportPillarAi: string;
  passportPillarLab: string;
  passportDisclaimer: string;
  passportPending: string;
  passportConfirmed: string;
  
  // Auth & Roles
  roleAdmin: string;
  roleBeekeeper: string;
  roleProcessor: string;
  roleTransporter: string;
  rolePackager: string;
  roleQualityLab: string;
  roleConsumer: string;
  
  // Footer
  footerRights: string;
  footerHonestClaim: string;
  footerTagline: string;
  footerPrivacy: string;
  footerTerms: string;
  footerSitemap: string;
}

// Shared English base — other languages derive from this structure
const en: Translations = {
  appName: 'HoneyChain',
  tagline: 'Pure Honey. Brighter Futures.',
  heroHeadline: "Know Your Honey's Journey from Flower to Jar",
  heroSubheadline: '100% authentic, lab-tested, and fully traceable. Experience complete transparency from registered forest apiaries to your kitchen table.',
  
  // Landing Page - Mockup Keys
  landingHeroTag: 'PURE HONEY. REAL STORIES.',
  landingHeroTitle: 'From Hive to Home,\nWith Complete Trust',
  landingHeroDesc: 'HoneyChain brings transparency to your table using blockchain technology. Trace the journey of your honey, support honest beekeepers, and choose purity with confidence.',
  landingHeroCta: 'Trace Your Honey',
  landingHeroDiscover: 'Discover the real story behind every drop.',
  landingBadgeTraceable: '100% Traceable',
  landingBadgeTraceableSub: 'From nature to you',
  landingFeatureSource: 'Know the Source',
  landingFeatureSourceDesc: 'Trace every step, from beekeepers to your table.',
  landingFeaturePure: 'Pure & Authentic',
  landingFeaturePureDesc: 'Verified through blockchain technology.',
  landingFeatureSupport: 'Support Beekeepers',
  landingFeatureSupportDesc: 'Empowering local communities and sustainable livelihoods.',
  landingFeatureHealthy: 'A Healthier Tomorrow',
  landingFeatureHealthyDesc: 'Good for you. Better for the planet.',
  landingHowTag: 'HOW IT WORKS',
  landingHowTitle: 'Transparency in Every Step',
  landingHowDesc: 'Follow the journey of your honey, from the hive to your home.',
  landingStep1Title: 'At the Hive',
  landingStep1Desc: 'Bees collect nectar from nature\'s best.',
  landingStep2Title: 'With Beekeepers',
  landingStep2Desc: 'Harvested ethically by local beekeepers.',
  landingStep3Title: 'Processing',
  landingStep3Desc: 'Handled with care to retain purity.',
  landingStep4Title: 'To You',
  landingStep4Desc: 'Scan and trace the full journey in seconds.',
  landingMissionTitle: 'More Than Honey',
  landingMissionDesc: 'HoneyChain is a step towards a fairer, cleaner and more transparent food system. By choosing traceable honey, you support sustainable beekeeping and stronger rural communities.',
  landingMissionCta: 'Learn More',
  landingTraceTag: 'TRACE YOUR HONEY',
  landingTraceTitle: 'Curious About Your Honey?',
  landingTraceDesc: 'Scan the QR code on your jar or enter the batch ID to see its complete journey.',
  landingTracePlaceholder: 'Enter batch ID',
  landingTraceBtn: 'Trace',
  landingTraceNote: 'Real honey. Real transparency.',

  navHome: 'Home',
  navHowItWorks: 'How It Works',
  navTechnology: 'Quality Standards',
  navVerifyHoney: 'Verify Honey',
  navAbout: 'About',
  navSignIn: 'Sign In',
  navDashboard: 'Operations Portal',
  navSignOut: 'Sign Out',
  navOurHoney: 'Our Honey',
  navTrace: 'Trace',
  navContact: 'Contact',
  btnVerify: 'Verify Honey Jar',
  btnExplore: 'Explore Quality Standards',
  btnScanQr: 'Scan QR Code',
  btnEnterBatchId: 'Enter Batch Code',
  btnCancel: 'Cancel',
  btnSubmit: 'Verify Batch',
  btnBack: 'Return to Operations Dashboard',
  btnInspect: 'View Honey Passport',
  
  modelDirectBeekeeper: 'Direct from Beekeeper',
  modelDirectBeekeeperDesc: 'Pure artisan honey purchased directly from registered local apiarists with immediate harvest verification.',
  modelCompanyManaged: 'Certified Managed Supply Chain',
  modelCompanyManagedDesc: 'Enterprise collection and distribution with multi-stage quality control, cold transit, and laboratory certification.',
  twoModelsTitle: 'Two Certified Supply Chain Pathways',
  twoModelsSubtitle: 'Empowering both independent artisan beekeepers and certified commercial producers within a unified quality ecosystem.',
  
  stepHive: 'Apiary Hive Telemetry',
  stepHarvest: 'Raw Honey Harvest',
  stepProcessing: 'Gentle Thermal Extraction',
  stepQuality: 'Accredited Laboratory Testing',
  stepLogistics: 'Temperature-Controlled Transit',
  stepPackaging: 'Tamper-Evident Jar Sealing',
  stepPassport: 'Digital Honey Passport',
  
  whyTitle: 'Why Choose Certified Honey Chain?',
  whySubtitle: 'Uncompromising purity, verified origin, and laboratory testing for complete consumer confidence.',
  featureTraceabilityTitle: 'Complete Farm-to-Table Traceability',
  featureTraceabilityDesc: 'Every harvest batch is logged with origin coordinates, floral sources, and time-stamped custody transfers.',
  featureAiTitle: 'Yield & Volume Consistency Audits',
  featureAiDesc: 'Automated validation checks ensure batch volumes match apiary harvest capacity and processing tolerances.',
  featureBlockchainTitle: 'Tamper-Evident Quality Records',
  featureBlockchainDesc: 'Historical records of custody handoffs, transport conditions, and lab assays are securely preserved.',
  featureLabTitle: 'Accredited Laboratory Testing',
  featureLabDesc: 'Every batch is analyzed for moisture content, freshness (HMF), and sucrose/C4 purity standards.',
  featureConsumerTitle: 'Instant Public QR Verification',
  featureConsumerDesc: 'Consumers can scan the on-jar QR code on any smartphone to view the verified honey passport with zero login required.',
  featureIotTitle: 'Colony & Hive Environment Monitoring',
  featureIotDesc: 'Apiaries maintain optimal colony health with continuous temperature and ambient tracking.',

  techTitle: 'Four Pillars of Honey Authenticity',
  techSubtitle: 'A comprehensive quality system ensuring raw purity and complete consumer trust.',
  techFabricTitle: '1. Verified Chain of Custody',
  techFabricDesc: 'Secure, multi-party custody records that prevent unauthorized record alterations or counterfeiting.',
  techAiTitle: '2. Volume & Yield Integrity',
  techAiDesc: 'Systematic checks verify processing yields and protect against batch dilution and unauthorized mixing.',
  techIotTitle: '3. Origin & Climate Telemetry',
  techIotDesc: 'Apiary sensors record micro-climate, altitude, and seasonal floral sources at harvest.',
  techPassportTitle: '4. Digital Honey Passport',
  techPassportDesc: 'A transparent, public certificate that brings the entire harvest and testing story directly to the consumer.',
  
  verifyModalTitle: 'Verify Honey Authenticity',
  verifyModalSubtitle: 'Scan the QR code on your honey jar or enter the batch code printed on the label.',
  scanQrTab: 'Camera Scanner',
  manualEntryTab: 'Batch Code Lookup',
  scanQrPrompt: 'Point your camera at the QR code printed on the honey jar.',
  manualInputPlaceholder: 'e.g. HC-2026-0001 or HC-2026-0010',
  tryVerifiedPreset: 'Company Managed (HC-2026-0001)',
  tryDirectPreset: 'Direct Beekeeper (HC-2026-0010)',
  trySuspiciousPreset: 'Flagged Deviation (HC-2026-0003)',
  cameraPermissionNote: 'Camera permissions are processed locally in your browser. You can also enter the batch code manually.',
  
  passportTitle: 'Digital Honey Passport',
  passportSubtitle: 'Public Authenticity & Quality Certification Record',
  passportBatch: 'Batch Code',
  passportProvenanceModel: 'Production Model',
  passportStatusVerified: 'CERTIFIED AUTHENTIC',
  passportStatusFlagged: 'DEVIATION DETECTED',
  passportOriginApiary: 'Origin Apiary',
  passportFloralSource: 'Floral Source',
  passportVolume: 'Batch Volume',
  passportEvidenceScore: 'Quality Score',
  passportTimelineTitle: 'Verified Supply Chain Timeline',
  passportStageHarvest: 'Apiary Harvest & Origin Logging',
  passportStageProcessing: 'Gentle Thermal Filtration',
  passportStageTransport: 'Cold-Chain Logistics',
  passportStagePackaging: 'Tamper-Evident Packaging & QR Release',
  passportBeekeeperProfile: 'Certified Beekeeper',
  passportCompanyProfile: 'Managing Enterprise',
  passportPillarBlockchain: 'Chain of Custody Record',
  passportPillarAi: 'Yield & Volume Audit',
  passportPillarLab: 'Accredited Lab Chemical Assay',
  passportDisclaimer: 'Disclaimer: This certificate confirms verified harvest origin, documented chain of custody, and accredited laboratory test results adhering to national food safety standards (FSSAI/Codex Alimentarius).',
  passportPending: 'Processing In Progress',
  passportConfirmed: 'Verified & Certified',
  
  roleAdmin: 'System Administrator',
  roleBeekeeper: 'Registered Beekeeper',
  roleProcessor: 'Processing Facility',
  roleTransporter: 'Logistics Transporter',
  rolePackager: 'Packaging Center',
  roleQualityLab: 'Accredited Quality Lab',
  roleConsumer: 'Public Consumer',
  
  footerRights: '© 2026 HoneyChain. All rights reserved.',
  footerHonestClaim: 'Honey Chain records and authenticates honey origin, supply chain handoffs, and laboratory test certificates for transparent consumer trust.',
  footerTagline: 'Pure Honey. Brighter Futures.',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Use',
  footerSitemap: 'Sitemap',
};

const hi: Translations = {
  appName: 'हनी चेन',
  tagline: 'शुद्ध शहद। उज्जवल भविष्य।',
  heroHeadline: 'छत्ते से लेकर जार तक, अपने शहद की असली यात्रा जानें',
  heroSubheadline: '100% प्राकृतिक, लैब-परीक्षित और पूरी तरह से ट्रेस करने योग्य। पंजीकृत वन फार्मों से लेकर आपकी रसोई तक पूर्ण पारदर्शिता।',
  
  landingHeroTag: 'शुद्ध शहद। असली कहानियाँ।',
  landingHeroTitle: 'छत्ते से घर तक,\nपूर्ण विश्वास के साथ',
  landingHeroDesc: 'हनी चेन ब्लॉकचेन तकनीक के माध्यम से आपकी मेज पर पारदर्शिता लाता है। अपने शहद की यात्रा ट्रेस करें, ईमानदार मधुमक्खी पालकों का समर्थन करें।',
  landingHeroCta: 'अपना शहद ट्रेस करें',
  landingHeroDiscover: 'हर बूंद के पीछे की असली कहानी जानें।',
  landingBadgeTraceable: '100% ट्रेस योग्य',
  landingBadgeTraceableSub: 'प्रकृति से आप तक',
  landingFeatureSource: 'स्रोत जानें',
  landingFeatureSourceDesc: 'मधुमक्खी पालकों से आपकी मेज तक, हर कदम ट्रेस करें।',
  landingFeaturePure: 'शुद्ध और प्रामाणिक',
  landingFeaturePureDesc: 'ब्लॉकचेन तकनीक द्वारा सत्यापित।',
  landingFeatureSupport: 'मधुमक्खी पालकों का समर्थन',
  landingFeatureSupportDesc: 'स्थानीय समुदायों और टिकाऊ आजीविका को सशक्त बनाना।',
  landingFeatureHealthy: 'स्वस्थ कल',
  landingFeatureHealthyDesc: 'आपके लिए अच्छा। ग्रह के लिए बेहतर।',
  landingHowTag: 'यह कैसे काम करता है',
  landingHowTitle: 'हर कदम में पारदर्शिता',
  landingHowDesc: 'अपने शहद की यात्रा का अनुसरण करें, छत्ते से आपके घर तक।',
  landingStep1Title: 'छत्ते पर',
  landingStep1Desc: 'मधुमक्खियाँ प्रकृति के सर्वश्रेष्ठ से मकरंद एकत्र करती हैं।',
  landingStep2Title: 'मधुमक्खी पालकों के साथ',
  landingStep2Desc: 'स्थानीय मधुमक्खी पालकों द्वारा नैतिक रूप से कटाई।',
  landingStep3Title: 'प्रसंस्करण',
  landingStep3Desc: 'शुद्धता बनाए रखने के लिए सावधानी से संभाला गया।',
  landingStep4Title: 'आप तक',
  landingStep4Desc: 'सेकंडों में पूरी यात्रा को स्कैन और ट्रेस करें।',
  landingMissionTitle: 'शहद से बढ़कर',
  landingMissionDesc: 'हनी चेन एक निष्पक्ष, स्वच्छ और अधिक पारदर्शी खाद्य प्रणाली की दिशा में एक कदम है। ट्रेस करने योग्य शहद चुनकर, आप टिकाऊ मधुमक्खी पालन और मजबूत ग्रामीण समुदायों का समर्थन करते हैं।',
  landingMissionCta: 'और जानें',
  landingTraceTag: 'अपना शहद ट्रेस करें',
  landingTraceTitle: 'अपने शहद के बारे में उत्सुक हैं?',
  landingTraceDesc: 'अपने जार पर QR कोड स्कैन करें या पूरी यात्रा देखने के लिए बैच ID दर्ज करें।',
  landingTracePlaceholder: 'बैच ID दर्ज करें',
  landingTraceBtn: 'ट्रेस करें',
  landingTraceNote: 'असली शहद। असली पारदर्शिता।',

  navHome: 'होम',
  navHowItWorks: 'यह कैसे काम करता है',
  navTechnology: 'गुणवत्ता मानक',
  navVerifyHoney: 'शहद सत्यापित करें',
  navAbout: 'परिचय',
  navSignIn: 'साइन इन',
  navDashboard: 'ऑपरेशन्स पोर्टल',
  navSignOut: 'साइन आउट',
  navOurHoney: 'हमारा शहद',
  navTrace: 'ट्रेस',
  navContact: 'संपर्क',
  btnVerify: 'शहद जार सत्यापित करें',
  btnExplore: 'गुणवत्ता मानक देखें',
  btnScanQr: 'QR कोड स्कैन करें',
  btnEnterBatchId: 'बैच कोड दर्ज करें',
  btnCancel: 'रद्द करें',
  btnSubmit: 'बैच सत्यापित करें',
  btnBack: 'डैशबोर्ड पर वापस जाएं',
  btnInspect: 'हनी पासपोर्ट देखें',
  
  modelDirectBeekeeper: 'सीधे मधुमक्खी पालक से',
  modelDirectBeekeeperDesc: 'स्थानीय पंजीकृत मधुमक्खी पालकों से सीधे प्राप्त शुद्ध प्राकृतिक शहद, तत्काल उद्गम सत्यापन के साथ।',
  modelCompanyManaged: 'प्रमाणित आपूर्ति श्रृंखला',
  modelCompanyManagedDesc: 'उन्नत बहु-चरणीय गुणवत्ता नियंत्रण, कोल्ड ट्रांसपोर्ट, और मान्यता प्राप्त लैब जांच के साथ प्रबंधित आपूर्ति।',
  twoModelsTitle: 'दो प्रमाणित उत्पादन मार्ग',
  twoModelsSubtitle: 'स्वतंत्र कारीगर मधुमक्खी पालकों और प्रमाणित वाणिज्यिक उत्पादकों दोनों को एक साझा गुणवत्ता मंच में सशक्त बनाना।',
  
  stepHive: 'छत्ता निगरानी',
  stepHarvest: 'शहद कटाई एवं उद्गम',
  stepProcessing: 'सौम्य प्राकृतिक निष्कर्षण',
  stepQuality: 'मान्यता प्राप्त लैब परीक्षण',
  stepLogistics: 'तापमान नियंत्रित परिवहन',
  stepPackaging: 'सुरक्षित सीलबंद पैकेजिंग',
  stepPassport: 'डिजिटल हनी पासपोर्ट',
  
  whyTitle: 'प्रमाणित हनी चेन क्यों चुनें?',
  whySubtitle: 'उपभोक्ता विश्वास के लिए असंदिग्ध शुद्धता, प्रमाणित उद्गम और प्रयोगशाला परीक्षण।',
  featureTraceabilityTitle: 'फार्म से टेबल तक पूर्ण ट्रेसिबिलिटी',
  featureTraceabilityDesc: 'प्रत्येक बैच में उद्गम स्थान, पुष्प स्रोत और समयबद्ध कस्टडी हस्तांतरण दर्ज किए जाते हैं।',
  featureAiTitle: 'मात्रा एवं उत्पादन निरंतरता जांच',
  featureAiDesc: 'स्वचालित सत्यापन प्रणाली यह सुनिश्चित करती है कि बैच की मात्रा छत्ते की क्षमता और उत्पादन मानकों के अनुरूप हो।',
  featureBlockchainTitle: 'सुरक्षित और विश्वसनीय गुणवत्ता रिकॉर्ड',
  featureBlockchainDesc: 'कस्टडी हस्तांतरण, परिवहन स्थिति और लैब परीक्षणों के ऐतिहासिक रिकॉर्ड सुरक्षित रखे जाते हैं।',
  featureLabTitle: 'मान्यता प्राप्त प्रयोगशाला परीक्षण',
  featureLabDesc: 'प्रत्येक बैच की नमी प्रतिशत, ताजगी (HMF) और शुद्धता (C4 शर्करा) की विस्तृत लैब जांच।',
  featureConsumerTitle: 'त्वरित सार्वजनिक QR सत्यापन',
  featureConsumerDesc: 'उपभोक्ता बिना लॉगिन किए जार पर लगे QR कोड को स्कैन करके शहद का प्रमाणित पासपोर्ट देख सकते हैं।',
  featureIotTitle: 'छत्ता एवं पर्यावरण निगरानी',
  featureIotDesc: 'मधुमक्खी कॉलोनी के स्वास्थ्य के लिए तापमान और परिवेश की निरंतर निगरानी।',

  techTitle: 'शहद प्रामाणिकता के चार प्रमुख स्तंभ',
  techSubtitle: 'शुद्धता और उपभोक्ता विश्वास सुनिश्चित करने वाली एक समग्र गुणवत्ता प्रणाली।',
  techFabricTitle: '1. प्रमाणित कस्टडी रिकॉर्ड',
  techFabricDesc: 'सुरक्षित आपूर्ति श्रृंखला रिकॉर्ड जो किसी भी अनधिकृत बदलाव या मिलावट को रोकते हैं।',
  techAiTitle: '2. मात्रा एवं उत्पादन संतुलन',
  techAiDesc: 'व्यवस्थित सत्यापन प्रक्रिया जो बैच में अनावश्यक मिश्रण और मात्रा वृद्धि को रोकती है।',
  techIotTitle: '3. उद्गम एवं प्राकृतिक टेलीमेट्री',
  techIotDesc: 'सेंसर कटाई के समय सूक्ष्म जलवायु, ऊंचाई और मौसमी पुष्प स्रोतों को रिकॉर्ड करते हैं।',
  techPassportTitle: '4. डिजिटल हनी पासपोर्ट',
  techPassportDesc: 'एक पारदर्शी, सार्वजनिक प्रमाण पत्र जो पूरी कटाई और परीक्षण की कहानी सीधे उपभोक्ता तक पहुंचाता है।',
  
  verifyModalTitle: 'शहद प्रामाणिकता सत्यापन',
  verifyModalSubtitle: 'अपने शहद के जार पर मुद्रित QR कोड स्कैन करें या लेबल पर लिखा बैच कोड दर्ज करें।',
  scanQrTab: 'कैमरा स्कैनर',
  manualEntryTab: 'बैच कोड खोज',
  scanQrPrompt: 'अपने कैमरे को शहद के जार पर लगे QR कोड की ओर रखें।',
  manualInputPlaceholder: 'उदा. HC-2026-0001 या HC-2026-0010',
  tryVerifiedPreset: 'कंपनी प्रबंधित (HC-2026-0001)',
  tryDirectPreset: 'मधुमक्खी पालक डायरेक्ट (HC-2026-0010)',
  trySuspiciousPreset: 'विसंगति चेतावनी (HC-2026-0003)',
  cameraPermissionNote: 'कैमरा अनुमति आपके ब्राउज़र में सुरक्षित रूप से संसाधित होती है। आप मैन्युअल रूप से भी बैच कोड दर्ज कर सकते हैं।',
  
  passportTitle: 'डिजिटल हनी पासपोर्ट',
  passportSubtitle: 'सार्वजनिक प्रामाणिकता एवं गुणवत्ता प्रमाण पत्र',
  passportBatch: 'बैच कोड',
  passportProvenanceModel: 'उत्पादन मॉडल',
  passportStatusVerified: 'प्रमाणित प्रामाणिक',
  passportStatusFlagged: 'विसंगति दर्ज',
  passportOriginApiary: 'उद्गम फार्म',
  passportFloralSource: 'पुष्प स्रोत',
  passportVolume: 'बैच मात्रा',
  passportEvidenceScore: 'गुणवत्ता स्कोर',
  passportTimelineTitle: 'प्रमाणित आपूर्ति श्रृंखला समयरेखा',
  passportStageHarvest: '1. फार्म शहद कटाई एवं पंजीकरण',
  passportStageProcessing: '2. सौम्य प्राकृतिक निष्कर्षण',
  passportStageTransport: '3. तापमान नियंत्रित कोल्ड परिवहन',
  passportStagePackaging: '4. सुरक्षित पैकेजिंग एवं QR जारी',
  passportBeekeeperProfile: 'प्रमाणित मधुमक्खी पालक',
  passportCompanyProfile: 'प्रबंधक कंपनी',
  passportPillarBlockchain: 'कस्टडी एवं उद्गम रिकॉर्ड',
  passportPillarAi: 'मात्रा एवं उत्पादन ऑडिट',
  passportPillarLab: 'मान्यता प्राप्त लैब रासायनिक जांच',
  passportDisclaimer: 'अस्वीकरण: यह प्रमाण पत्र सत्यापित कटाई उद्गम, प्रलेखित कस्टडी रिकॉर्ड और राष्ट्रीय खाद्य सुरक्षा मानकों (FSSAI/Codex Alimentarius) के अनुरूप लैब रिपोर्ट की पुष्टि करता है।',
  passportPending: 'प्रक्रिया जारी है',
  passportConfirmed: 'सत्यापित एवं प्रमाणित',
  
  roleAdmin: 'सिस्टम प्रशासक',
  roleBeekeeper: 'पंजीकृत मधुमक्खी पालक',
  roleProcessor: 'प्रसंस्करण केंद्र',
  roleTransporter: 'लॉजिस्टिक्स ट्रांसपोर्टर',
  rolePackager: 'पैकेजिंग केंद्र',
  roleQualityLab: 'मान्यता प्राप्त लैब',
  roleConsumer: 'सार्वजनिक उपभोक्ता',
  
  footerRights: '© 2026 हनी चेन। सर्वाधिकार सुरक्षित।',
  footerHonestClaim: 'हनी चेन पारदर्शी उपभोक्ता विश्वास के लिए शहद के उद्गम, आपूर्ति श्रृंखला और लैब रिपोर्ट को प्रमाणित करता है।',
  footerTagline: 'शुद्ध शहद। उज्जवल भविष्य।',
  footerPrivacy: 'गोपनीयता नीति',
  footerTerms: 'उपयोग की शर्तें',
  footerSitemap: 'साइटमैप',
};

// Helper to create regional language translations using a partial override pattern
function createLang(overrides: Translations): Translations {
  return overrides;
}

const ta: Translations = createLang({
  ...en,
  appName: 'ஹனி செயின்',
  tagline: 'தூய தேன். ஒளிமயமான எதிர்காலம்.',
  heroHeadline: 'தேன்கூட்டிலிருந்து ஜாடி வரை, உங்கள் தேனின் உண்மையான பயணத்தை அறியுங்கள்',
  heroSubheadline: '100% இயற்கையான, ஆய்வகத்தில் சோதிக்கப்பட்ட மற்றும் முழுமையாக கண்டறியக்கூடிய தேன்.',
  landingHeroTag: 'தூய தேன். உண்மையான கதைகள்.',
  landingHeroTitle: 'தேன்கூட்டிலிருந்து வீட்டிற்கு,\nமுழு நம்பிக்கையுடன்',
  landingHeroDesc: 'ஹனி செயின் பிளாக்செயின் தொழில்நுட்பத்தின் மூலம் உங்கள் மேசைக்கு வெளிப்படைத்தன்மையை கொண்டு வருகிறது.',
  landingHeroCta: 'உங்கள் தேனை கண்டறியுங்கள்',
  landingHeroDiscover: 'ஒவ்வொரு துளிக்கும் பின்னால் உள்ள உண்மையான கதையை கண்டறியுங்கள்.',
  landingBadgeTraceable: '100% கண்டறியக்கூடியது',
  landingBadgeTraceableSub: 'இயற்கையிலிருந்து உங்களுக்கு',
  landingFeatureSource: 'மூலத்தை அறியுங்கள்',
  landingFeatureSourceDesc: 'தேன்பண்ணையிலிருந்து உங்கள் மேசை வரை ஒவ்வொரு அடியையும் கண்டறியுங்கள்.',
  landingFeaturePure: 'தூய்மையான & உண்மையான',
  landingFeaturePureDesc: 'பிளாக்செயின் தொழில்நுட்பத்தால் சரிபார்க்கப்பட்டது.',
  landingFeatureSupport: 'தேனீ வளர்ப்பாளர்களை ஆதரிக்கவும்',
  landingFeatureSupportDesc: 'உள்ளூர் சமூகங்கள் மற்றும் நிலையான வாழ்வாதாரங்களை மேம்படுத்துதல்.',
  landingFeatureHealthy: 'ஆரோக்கியமான நாளை',
  landingFeatureHealthyDesc: 'உங்களுக்கு நல்லது. பூமிக்கு சிறந்தது.',
  landingHowTag: 'இது எப்படி செயல்படுகிறது',
  landingHowTitle: 'ஒவ்வொரு அடியிலும் வெளிப்படைத்தன்மை',
  landingHowDesc: 'உங்கள் தேனின் பயணத்தை பின்தொடருங்கள், தேன்கூட்டிலிருந்து உங்கள் வீட்டிற்கு.',
  landingStep1Title: 'தேன்கூட்டில்',
  landingStep1Desc: 'தேனீக்கள் இயற்கையின் சிறந்ததிலிருந்து மகரந்தத்தை சேகரிக்கின்றன.',
  landingStep2Title: 'தேனீ வளர்ப்பாளர்களுடன்',
  landingStep2Desc: 'உள்ளூர் தேனீ வளர்ப்பாளர்களால் நெறிமுறையாக அறுவடை செய்யப்படுகிறது.',
  landingStep3Title: 'பதப்படுத்துதல்',
  landingStep3Desc: 'தூய்மையை தக்க வைக்க கவனமாக கையாளப்படுகிறது.',
  landingStep4Title: 'உங்களுக்கு',
  landingStep4Desc: 'சில வினாடிகளில் முழு பயணத்தையும் ஸ்கேன் செய்து கண்டறியுங்கள்.',
  landingMissionTitle: 'தேனை விட அதிகம்',
  landingMissionDesc: 'ஹனி செயின் ஒரு நியாயமான, தூய்மையான மற்றும் அதிக வெளிப்படைத்தன்மையான உணவு அமைப்பை நோக்கிய ஒரு அடி.',
  landingMissionCta: 'மேலும் அறிக',
  landingTraceTag: 'உங்கள் தேனை கண்டறியுங்கள்',
  landingTraceTitle: 'உங்கள் தேனைப் பற்றி ஆர்வமா?',
  landingTraceDesc: 'உங்கள் ஜாடியில் உள்ள QR குறியீட்டை ஸ்கேன் செய்யவும் அல்லது பேட்ச் ID-ஐ உள்ளிடவும்.',
  landingTracePlaceholder: 'பேட்ச் ID உள்ளிடவும்',
  landingTraceBtn: 'கண்டறி',
  landingTraceNote: 'உண்மையான தேன். உண்மையான வெளிப்படைத்தன்மை.',
  navHome: 'முகப்பு',
  navHowItWorks: 'இது எப்படி செயல்படுகிறது',
  navTechnology: 'தர நிலைகள்',
  navVerifyHoney: 'தேனை சரிபார்',
  navAbout: 'பற்றி',
  navSignIn: 'உள்நுழை',
  navDashboard: 'செயல்பாட்டு போர்டல்',
  navSignOut: 'வெளியேறு',
  navOurHoney: 'எங்கள் தேன்',
  navTrace: 'கண்டறி',
  navContact: 'தொடர்பு',
  btnVerify: 'தேன் ஜாடியை சரிபார்',
  btnExplore: 'தர நிலைகளை ஆராய',
  btnScanQr: 'QR குறியீட்டை ஸ்கேன் செய்',
  btnEnterBatchId: 'பேட்ச் குறியீட்டை உள்ளிடு',
  btnCancel: 'ரத்து செய்',
  btnSubmit: 'பேட்ச் சரிபார்',
  btnBack: 'டாஷ்போர்டுக்கு திரும்பு',
  btnInspect: 'தேன் பாஸ்போர்ட் பார்',
  footerRights: '© 2026 ஹனி செயின். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
  footerHonestClaim: 'ஹனி செயின் தேனின் மூலத்தை, விநியோக சங்கிலியை மற்றும் ஆய்வக சான்றிதழ்களை நம்பகமான நுகர்வோர் நம்பிக்கைக்காக சான்றளிக்கிறது.',
  footerTagline: 'தூய தேன். ஒளிமயமான எதிர்காலம்.',
  footerPrivacy: 'தனியுரிமை கொள்கை',
  footerTerms: 'பயன்பாட்டு விதிமுறைகள்',
  footerSitemap: 'தளவரைபடம்',
});

const te: Translations = createLang({
  ...en,
  appName: 'హనీ చెయిన్',
  tagline: 'స్వచ్ఛమైన తేనె. ఉజ్వల భవిష్యత్తు.',
  heroHeadline: 'తేనెపట్టు నుండి జాడీ వరకు, మీ తేనె యొక్క నిజమైన ప్రయాణాన్ని తెలుసుకోండి',
  heroSubheadline: '100% సహజమైన, ల్యాబ్‌లో పరీక్షించబడిన మరియు పూర్తిగా ట్రేస్ చేయగలిగిన తేనె.',
  landingHeroTag: 'స్వచ్ఛమైన తేనె. నిజమైన కథలు.',
  landingHeroTitle: 'తేనెపట్టు నుండి ఇంటికి,\nపూర్ణ నమ్మకంతో',
  landingHeroDesc: 'హనీ చెయిన్ బ్లాక్‌చెయిన్ టెక్నాలజీ ద్వారా మీ బల్లకు పారదర్శకతను తీసుకువస్తుంది.',
  landingHeroCta: 'మీ తేనెను ట్రేస్ చేయండి',
  landingHeroDiscover: 'ప్రతి చుక్క వెనుక ఉన్న నిజమైన కథను కనుగొనండి.',
  landingBadgeTraceable: '100% ట్రేస్ చేయగలిగినది',
  landingBadgeTraceableSub: 'ప్రకృతి నుండి మీ వరకు',
  landingFeatureSource: 'మూలాన్ని తెలుసుకోండి',
  landingFeatureSourceDesc: 'తేనెటీగల పెంపకందారుల నుండి మీ బల్ల వరకు ప్రతి అడుగును ట్రేస్ చేయండి.',
  landingFeaturePure: 'స్వచ్ఛమైన & ప్రామాణికమైన',
  landingFeaturePureDesc: 'బ్లాక్‌చెయిన్ టెక్నాలజీ ద్వారా ధృవీకరించబడింది.',
  landingFeatureSupport: 'తేనెటీగల పెంపకందారులకు మద్దతు',
  landingFeatureSupportDesc: 'స్థానిక సమాజాలు మరియు స్థిరమైన జీవనోపాధులను బలపరచడం.',
  landingFeatureHealthy: 'ఆరోగ్యకరమైన రేపు',
  landingFeatureHealthyDesc: 'మీకు మంచిది. భూమికి మరింత మంచిది.',
  landingHowTag: 'ఇది ఎలా పనిచేస్తుంది',
  landingHowTitle: 'ప్రతి అడుగులో పారదర్శకత',
  landingHowDesc: 'మీ తేనె ప్రయాణాన్ని అనుసరించండి, తేనెపట్టు నుండి మీ ఇంటి వరకు.',
  landingStep1Title: 'తేనెపట్టు వద్ద',
  landingStep1Desc: 'తేనెటీగలు ప్రకృతి యొక్క ఉత్తమం నుండి మకరందాన్ని సేకరిస్తాయి.',
  landingStep2Title: 'తేనెటీగల పెంపకందారులతో',
  landingStep2Desc: 'స్థానిక తేనెటీగల పెంపకందారులచే నైతికంగా సేకరించబడింది.',
  landingStep3Title: 'ప్రాసెసింగ్',
  landingStep3Desc: 'స్వచ్ఛతను కాపాడేందుకు జాగ్రత్తగా నిర్వహించబడింది.',
  landingStep4Title: 'మీ వరకు',
  landingStep4Desc: 'సెకన్లలో పూర్తి ప్రయాణాన్ని స్కాన్ చేసి ట్రేస్ చేయండి.',
  landingMissionTitle: 'తేనె కంటే ఎక్కువ',
  landingMissionDesc: 'హనీ చెయిన్ మరింత నిష్పక్షమైన, స్వచ్ఛమైన మరియు పారదర్శక ఆహార వ్యవస్థ వైపు ఒక అడుగు.',
  landingMissionCta: 'మరింత తెలుసుకోండి',
  landingTraceTag: 'మీ తేనెను ట్రేస్ చేయండి',
  landingTraceTitle: 'మీ తేనె గురించి ఆసక్తిగా ఉందా?',
  landingTraceDesc: 'మీ జాడీపై ఉన్న QR కోడ్‌ను స్కాన్ చేయండి లేదా బ్యాచ్ ID ను నమోదు చేయండి.',
  landingTracePlaceholder: 'బ్యాచ్ ID నమోదు చేయండి',
  landingTraceBtn: 'ట్రేస్',
  landingTraceNote: 'నిజమైన తేనె. నిజమైన పారదర్శకత.',
  navHome: 'హోమ్',
  navHowItWorks: 'ఇది ఎలా పనిచేస్తుంది',
  navTechnology: 'నాణ్యత ప్రమాణాలు',
  navVerifyHoney: 'తేనె ధృవీకరించు',
  navAbout: 'గురించి',
  navSignIn: 'సైన్ ఇన్',
  navDashboard: 'ఆపరేషన్స్ పోర్టల్',
  navSignOut: 'సైన్ అవుట్',
  navOurHoney: 'మా తేనె',
  navTrace: 'ట్రేస్',
  navContact: 'సంప్రదించండి',
  footerRights: '© 2026 హనీ చెయిన్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
  footerTagline: 'స్వచ్ఛమైన తేనె. ఉజ్వల భవిష్యత్తు.',
  footerPrivacy: 'గోప్యతా విధానం',
  footerTerms: 'వాడుక నిబంధనలు',
  footerSitemap: 'సైట్‌మ్యాప్',
});

const kn: Translations = createLang({
  ...en,
  appName: 'ಹನಿ ಚೈನ್',
  tagline: 'ಶುದ್ಧ ಜೇನು. ಉಜ್ವಲ ಭವಿಷ್ಯ.',
  landingHeroTag: 'ಶುದ್ಧ ಜೇನು. ನೈಜ ಕಥೆಗಳು.',
  landingHeroTitle: 'ಜೇನುಗೂಡಿನಿಂದ ಮನೆಗೆ,\nಸಂಪೂರ್ಣ ನಂಬಿಕೆಯೊಂದಿಗೆ',
  landingHeroDesc: 'ಹನಿ ಚೈನ್ ಬ್ಲಾಕ್‌ಚೈನ್ ತಂತ್ರಜ್ಞಾನದ ಮೂಲಕ ನಿಮ್ಮ ಮೇಜಿಗೆ ಪಾರದರ್ಶಕತೆಯನ್ನು ತರುತ್ತದೆ.',
  landingHeroCta: 'ನಿಮ್ಮ ಜೇನನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ',
  landingHeroDiscover: 'ಪ್ರತಿ ಹನಿಯ ಹಿಂದಿನ ನಿಜವಾದ ಕಥೆಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.',
  landingBadgeTraceable: '100% ಟ್ರೇಸ್ ಮಾಡಬಹುದಾದ',
  landingBadgeTraceableSub: 'ಪ್ರಕೃತಿಯಿಂದ ನಿಮಗೆ',
  landingFeatureSource: 'ಮೂಲವನ್ನು ತಿಳಿಯಿರಿ',
  landingFeatureSourceDesc: 'ಜೇನು ಸಾಕಣೆದಾರರಿಂದ ನಿಮ್ಮ ಮೇಜಿನವರೆಗೆ ಪ್ರತಿ ಹೆಜ್ಜೆಯನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ.',
  landingFeaturePure: 'ಶುದ್ಧ & ಅಧಿಕೃತ',
  landingFeaturePureDesc: 'ಬ್ಲಾಕ್‌ಚೈನ್ ತಂತ್ರಜ್ಞಾನದಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
  landingFeatureSupport: 'ಜೇನು ಸಾಕಣೆದಾರರನ್ನು ಬೆಂಬಲಿಸಿ',
  landingFeatureSupportDesc: 'ಸ್ಥಳೀಯ ಸಮುದಾಯಗಳು ಮತ್ತು ಸುಸ್ಥಿರ ಜೀವನೋಪಾಯಗಳನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು.',
  landingFeatureHealthy: 'ಆರೋಗ್ಯಕರ ನಾಳೆ',
  landingFeatureHealthyDesc: 'ನಿಮಗೆ ಒಳ್ಳೆಯದು. ಭೂಮಿಗೆ ಉತ್ತಮ.',
  landingHowTag: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
  landingHowTitle: 'ಪ್ರತಿ ಹೆಜ್ಜೆಯಲ್ಲೂ ಪಾರದರ್ಶಕತೆ',
  landingHowDesc: 'ನಿಮ್ಮ ಜೇನಿನ ಪ್ರಯಾಣವನ್ನು ಅನುಸರಿಸಿ, ಜೇನುಗೂಡಿನಿಂದ ನಿಮ್ಮ ಮನೆಗೆ.',
  landingStep1Title: 'ಜೇನುಗೂಡಿನಲ್ಲಿ',
  landingStep1Desc: 'ಜೇನುನೊಣಗಳು ಪ್ರಕೃತಿಯ ಅತ್ಯುತ್ತಮದಿಂದ ಮಕರಂದವನ್ನು ಸಂಗ್ರಹಿಸುತ್ತವೆ.',
  landingStep2Title: 'ಜೇನು ಸಾಕಣೆದಾರರೊಂದಿಗೆ',
  landingStep2Desc: 'ಸ್ಥಳೀಯ ಜೇನು ಸಾಕಣೆದಾರರಿಂದ ನೈತಿಕವಾಗಿ ಕೊಯ್ಲು ಮಾಡಲಾಗಿದೆ.',
  landingStep3Title: 'ಸಂಸ್ಕರಣೆ',
  landingStep3Desc: 'ಶುದ್ಧತೆಯನ್ನು ಕಾಪಾಡಲು ಎಚ್ಚರಿಕೆಯಿಂದ ನಿರ್ವಹಿಸಲಾಗಿದೆ.',
  landingStep4Title: 'ನಿಮಗೆ',
  landingStep4Desc: 'ಕೆಲವೇ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ ಪ್ರಯಾಣವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಟ್ರೇಸ್ ಮಾಡಿ.',
  landingMissionTitle: 'ಜೇನಿಗಿಂತ ಹೆಚ್ಚು',
  landingMissionDesc: 'ಹನಿ ಚೈನ್ ಒಂದು ನ್ಯಾಯೋಚಿತ, ಸ್ವಚ್ಛ ಮತ್ತು ಹೆಚ್ಚು ಪಾರದರ್ಶಕ ಆಹಾರ ವ್ಯವಸ್ಥೆಯ ಕಡೆಗೆ ಒಂದು ಹೆಜ್ಜೆ.',
  landingMissionCta: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
  landingTraceTag: 'ನಿಮ್ಮ ಜೇನನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ',
  landingTraceTitle: 'ನಿಮ್ಮ ಜೇನಿನ ಬಗ್ಗೆ ಕುತೂಹಲವಿದೆಯೇ?',
  landingTraceDesc: 'ನಿಮ್ಮ ಜಾಡಿಯ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ ಬ್ಯಾಚ್ ID ನಮೂದಿಸಿ.',
  landingTracePlaceholder: 'ಬ್ಯಾಚ್ ID ನಮೂದಿಸಿ',
  landingTraceBtn: 'ಟ್ರೇಸ್',
  landingTraceNote: 'ನಿಜವಾದ ಜೇನು. ನಿಜವಾದ ಪಾರದರ್ಶಕತೆ.',
  navHome: 'ಮುಖಪುಟ',
  navSignIn: 'ಸೈನ್ ಇನ್',
  navSignOut: 'ಸೈನ್ ಔಟ್',
  navOurHoney: 'ನಮ್ಮ ಜೇನು',
  navTrace: 'ಟ್ರೇಸ್',
  navContact: 'ಸಂಪರ್ಕ',
  footerRights: '© 2026 ಹನಿ ಚೈನ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
  footerTagline: 'ಶುದ್ಧ ಜೇನು. ಉಜ್ವಲ ಭವಿಷ್ಯ.',
  footerPrivacy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
  footerTerms: 'ಬಳಕೆಯ ನಿಯಮಗಳು',
  footerSitemap: 'ಸೈಟ್‌ಮ್ಯಾಪ್',
});

const ml: Translations = createLang({
  ...en,
  appName: 'ഹണി ചെയിൻ',
  tagline: 'ശുദ്ധമായ തേൻ. ശോഭനമായ ഭാവി.',
  landingHeroTag: 'ശുദ്ധമായ തേൻ. യഥാർത്ഥ കഥകൾ.',
  landingHeroTitle: 'തേൻകൂട്ടിൽ നിന്ന് വീട്ടിലേക്ക്,\nപൂർണ വിശ്വാസത്തോടെ',
  landingHeroDesc: 'ഹണി ചെയിൻ ബ്ലോക്ക്ചെയിൻ സാങ്കേതികവിദ്യയിലൂടെ നിങ്ങളുടെ മേശയിലേക്ക് സുതാര്യത കൊണ്ടുവരുന്നു.',
  landingHeroCta: 'നിങ്ങളുടെ തേൻ ട്രേസ് ചെയ്യൂ',
  landingHeroDiscover: 'ഓരോ തുള്ളിയുടെയും പിന്നിലെ യഥാർത്ഥ കഥ കണ്ടെത്തൂ.',
  landingBadgeTraceable: '100% ട്രേസ് ചെയ്യാവുന്ന',
  landingBadgeTraceableSub: 'പ്രകൃതിയിൽ നിന്ന് നിങ്ങളിലേക്ക്',
  landingFeatureSource: 'ഉറവിടം അറിയൂ',
  landingFeatureSourceDesc: 'തേനീച്ച കർഷകരിൽ നിന്ന് നിങ്ങളുടെ മേശ വരെ ഓരോ ചുവടും ട്രേസ് ചെയ്യൂ.',
  landingFeaturePure: 'ശുദ്ധവും ആധികാരികവും',
  landingFeaturePureDesc: 'ബ്ലോക്ക്ചെയിൻ സാങ്കേതികവിദ്യയിലൂടെ പരിശോധിച്ചത്.',
  landingFeatureSupport: 'തേനീച്ച കർഷകരെ പിന്തുണയ്ക്കൂ',
  landingFeatureSupportDesc: 'പ്രാദേശിക സമൂഹങ്ങളെയും സുസ്ഥിര ജീവനോപാധികളെയും ശാക്തീകരിക്കൽ.',
  landingFeatureHealthy: 'ആരോഗ്യകരമായ നാളെ',
  landingFeatureHealthyDesc: 'നിങ്ങൾക്ക് നല്ലത്. ഭൂമിക്ക് കൂടുതൽ നല്ലത്.',
  landingHowTag: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
  landingHowTitle: 'ഓരോ ചുവടിലും സുതാര്യത',
  landingHowDesc: 'നിങ്ങളുടെ തേനിന്റെ യാത്ര പിന്തുടരൂ, തേൻകൂട്ടിൽ നിന്ന് നിങ്ങളുടെ വീട്ടിലേക്ക്.',
  landingStep1Title: 'തേൻകൂട്ടിൽ',
  landingStep1Desc: 'തേനീച്ചകൾ പ്രകൃതിയുടെ ഏറ്റവും മികച്ചതിൽ നിന്ന് തേൻ ശേഖരിക്കുന്നു.',
  landingStep2Title: 'തേനീച്ച കർഷകരോടൊപ്പം',
  landingStep2Desc: 'പ്രാദേശിക തേനീച്ച കർഷകർ ധാർമ്മികമായി വിളവെടുക്കുന്നു.',
  landingStep3Title: 'സംസ്കരണം',
  landingStep3Desc: 'ശുദ്ധത നിലനിർത്താൻ ശ്രദ്ധയോടെ കൈകാര്യം ചെയ്യുന്നു.',
  landingStep4Title: 'നിങ്ങൾക്ക്',
  landingStep4Desc: 'സെക്കൻഡുകൾക്കുള്ളിൽ മുഴുവൻ യാത്രയും സ്കാൻ ചെയ്ത് ട്രേസ് ചെയ്യൂ.',
  landingMissionTitle: 'തേനിനേക്കാൾ കൂടുതൽ',
  landingMissionDesc: 'ഹണി ചെയിൻ ഒരു നീതിയുക്തമായ, ശുദ്ധമായ, കൂടുതൽ സുതാര്യമായ ഭക്ഷ്യ വ്യവസ്ഥയിലേക്കുള്ള ഒരു ചുവടാണ്.',
  landingMissionCta: 'കൂടുതൽ അറിയൂ',
  landingTraceTag: 'നിങ്ങളുടെ തേൻ ട്രേസ് ചെയ്യൂ',
  landingTraceTitle: 'നിങ്ങളുടെ തേനിനെ കുറിച്ച് ജിജ്ഞാസയുണ്ടോ?',
  landingTraceDesc: 'നിങ്ങളുടെ ജാറിലെ QR കോഡ് സ്കാൻ ചെയ്യൂ അല്ലെങ്കിൽ ബാച്ച് ID നൽകൂ.',
  landingTracePlaceholder: 'ബാച്ച് ID നൽകൂ',
  landingTraceBtn: 'ട്രേസ്',
  landingTraceNote: 'യഥാർത്ഥ തേൻ. യഥാർത്ഥ സുതാര്യത.',
  navHome: 'ഹോം',
  navSignIn: 'സൈൻ ഇൻ',
  navSignOut: 'സൈൻ ഔട്ട്',
  navOurHoney: 'ഞങ്ങളുടെ തേൻ',
  navTrace: 'ട്രേസ്',
  navContact: 'ബന്ധപ്പെടൂ',
  footerRights: '© 2026 ഹണി ചെയിൻ. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തമാണ്.',
  footerTagline: 'ശുദ്ധമായ തേൻ. ശോഭനമായ ഭാവി.',
  footerPrivacy: 'സ്വകാര്യതാ നയം',
  footerTerms: 'ഉപയോഗ നിബന്ധനകൾ',
  footerSitemap: 'സൈറ്റ്മാപ്പ്',
});

const bn: Translations = createLang({
  ...en,
  appName: 'হানি চেইন',
  tagline: 'বিশুদ্ধ মধু। উজ্জ্বল ভবিষ্যৎ।',
  landingHeroTag: 'বিশুদ্ধ মধু। সত্যিকারের গল্প।',
  landingHeroTitle: 'মৌচাক থেকে বাড়িতে,\nসম্পূর্ণ বিশ্বাসের সাথে',
  landingHeroDesc: 'হানি চেইন ব্লকচেইন প্রযুক্তির মাধ্যমে আপনার টেবিলে স্বচ্ছতা আনে।',
  landingHeroCta: 'আপনার মধু ট্রেস করুন',
  landingHeroDiscover: 'প্রতিটি ফোঁটার পেছনের আসল গল্প আবিষ্কার করুন।',
  landingBadgeTraceable: '100% ট্রেসযোগ্য',
  landingBadgeTraceableSub: 'প্রকৃতি থেকে আপনার কাছে',
  landingFeatureSource: 'উৎস জানুন',
  landingFeatureSourceDesc: 'মৌমাছি পালনকারী থেকে আপনার টেবিল পর্যন্ত প্রতিটি পদক্ষেপ ট্রেস করুন।',
  landingFeaturePure: 'বিশুদ্ধ ও খাঁটি',
  landingFeaturePureDesc: 'ব্লকচেইন প্রযুক্তি দ্বারা যাচাইকৃত।',
  landingFeatureSupport: 'মৌমাছি পালনকারীদের সমর্থন',
  landingFeatureSupportDesc: 'স্থানীয় সম্প্রদায় এবং টেকসই জীবিকাকে শক্তিশালী করা।',
  landingFeatureHealthy: 'স্বাস্থ্যকর আগামীকাল',
  landingFeatureHealthyDesc: 'আপনার জন্য ভালো। পৃথিবীর জন্য আরও ভালো।',
  landingHowTag: 'এটি কীভাবে কাজ করে',
  landingHowTitle: 'প্রতিটি ধাপে স্বচ্ছতা',
  landingHowDesc: 'আপনার মধুর যাত্রা অনুসরণ করুন, মৌচাক থেকে আপনার বাড়ি পর্যন্ত।',
  landingStep1Title: 'মৌচাকে',
  landingStep1Desc: 'মৌমাছিরা প্রকৃতির সেরা থেকে মকরন্দ সংগ্রহ করে।',
  landingStep2Title: 'মৌমাছি পালনকারীদের সাথে',
  landingStep2Desc: 'স্থানীয় মৌমাছি পালনকারীদের দ্বারা নৈতিকভাবে সংগ্রহ করা হয়।',
  landingStep3Title: 'প্রক্রিয়াকরণ',
  landingStep3Desc: 'বিশুদ্ধতা বজায় রাখতে যত্নের সাথে পরিচালিত।',
  landingStep4Title: 'আপনার কাছে',
  landingStep4Desc: 'কয়েক সেকেন্ডে সম্পূর্ণ যাত্রা স্ক্যান করুন এবং ট্রেস করুন।',
  landingMissionTitle: 'মধুর চেয়ে বেশি',
  landingMissionDesc: 'হানি চেইন একটি ন্যায্য, পরিচ্ছন্ন এবং আরও স্বচ্ছ খাদ্য ব্যবস্থার দিকে একটি পদক্ষেপ।',
  landingMissionCta: 'আরও জানুন',
  landingTraceTag: 'আপনার মধু ট্রেস করুন',
  landingTraceTitle: 'আপনার মধু সম্পর্কে কৌতূহলী?',
  landingTraceDesc: 'আপনার জারে QR কোড স্ক্যান করুন বা ব্যাচ ID লিখুন।',
  landingTracePlaceholder: 'ব্যাচ ID লিখুন',
  landingTraceBtn: 'ট্রেস',
  landingTraceNote: 'আসল মধু। আসল স্বচ্ছতা।',
  navHome: 'হোম',
  navSignIn: 'সাইন ইন',
  navSignOut: 'সাইন আউট',
  navOurHoney: 'আমাদের মধু',
  navTrace: 'ট্রেস',
  navContact: 'যোগাযোগ',
  footerRights: '© 2026 হানি চেইন। সর্বস্বত্ব সংরক্ষিত।',
  footerTagline: 'বিশুদ্ধ মধু। উজ্জ্বল ভবিষ্যৎ।',
  footerPrivacy: 'গোপনীয়তা নীতি',
  footerTerms: 'ব্যবহারের শর্তাবলী',
  footerSitemap: 'সাইটম্যাপ',
});

const mr: Translations = createLang({
  ...en,
  appName: 'हनी चेन',
  tagline: 'शुद्ध मध. उज्ज्वल भविष्य.',
  landingHeroTag: 'शुद्ध मध. खऱ्या कथा.',
  landingHeroTitle: 'पोळ्यापासून घरापर्यंत,\nपूर्ण विश्वासासह',
  landingHeroDesc: 'हनी चेन ब्लॉकचेन तंत्रज्ञानाद्वारे तुमच्या टेबलवर पारदर्शकता आणते.',
  landingHeroCta: 'तुमचा मध ट्रेस करा',
  landingHeroDiscover: 'प्रत्येक थेंबामागची खरी कथा शोधा.',
  landingBadgeTraceable: '100% ट्रेस करण्यायोग्य',
  landingBadgeTraceableSub: 'निसर्गापासून तुमच्यापर्यंत',
  landingFeatureSource: 'स्रोत जाणून घ्या',
  landingFeatureSourceDesc: 'मधमाशी पालकांपासून तुमच्या टेबलापर्यंत प्रत्येक पाऊल ट्रेस करा.',
  landingFeaturePure: 'शुद्ध आणि प्रमाणित',
  landingFeaturePureDesc: 'ब्लॉकचेन तंत्रज्ञानाद्वारे सत्यापित.',
  landingFeatureSupport: 'मधमाशी पालकांना पाठिंबा',
  landingFeatureSupportDesc: 'स्थानिक समुदाय आणि शाश्वत उपजीविका सक्षम करणे.',
  landingFeatureHealthy: 'निरोगी उद्या',
  landingFeatureHealthyDesc: 'तुमच्यासाठी चांगले. ग्रहासाठी अधिक चांगले.',
  landingHowTag: 'हे कसे कार्य करते',
  landingHowTitle: 'प्रत्येक पावलात पारदर्शकता',
  landingHowDesc: 'तुमच्या मधाच्या प्रवासाचे अनुसरण करा, पोळ्यापासून तुमच्या घरापर्यंत.',
  landingStep1Title: 'पोळ्यावर',
  landingStep1Desc: 'मधमाश्या निसर्गाच्या सर्वोत्तम रसापासून मकरंद गोळा करतात.',
  landingStep2Title: 'मधमाशी पालकांसोबत',
  landingStep2Desc: 'स्थानिक मधमाशी पालकांद्वारे नैतिक मार्गाने कापणी केली.',
  landingStep3Title: 'प्रक्रिया',
  landingStep3Desc: 'शुद्धता टिकवण्यासाठी काळजीपूर्वक हाताळले.',
  landingStep4Title: 'तुमच्यापर्यंत',
  landingStep4Desc: 'काही सेकंदात संपूर्ण प्रवास स्कॅन करा आणि ट्रेस करा.',
  landingMissionTitle: 'मधापेक्षा अधिक',
  landingMissionDesc: 'हनी चेन एक न्याय्य, स्वच्छ आणि अधिक पारदर्शक अन्न प्रणालीच्या दिशेने एक पाऊल आहे.',
  landingMissionCta: 'अधिक जाणून घ्या',
  landingTraceTag: 'तुमचा मध ट्रेस करा',
  landingTraceTitle: 'तुमच्या मधाबद्दल उत्सुक आहात?',
  landingTraceDesc: 'तुमच्या बरणीवरील QR कोड स्कॅन करा किंवा बॅच ID प्रविष्ट करा.',
  landingTracePlaceholder: 'बॅच ID प्रविष्ट करा',
  landingTraceBtn: 'ट्रेस',
  landingTraceNote: 'खरा मध. खरी पारदर्शकता.',
  navHome: 'मुख्यपृष्ठ',
  navSignIn: 'साइन इन',
  navSignOut: 'साइन आउट',
  navOurHoney: 'आमचा मध',
  navTrace: 'ट्रेस',
  navContact: 'संपर्क',
  footerRights: '© 2026 हनी चेन. सर्व हक्क राखीव.',
  footerTagline: 'शुद्ध मध. उज्ज्वल भविष्य.',
  footerPrivacy: 'गोपनीयता धोरण',
  footerTerms: 'वापर अटी',
  footerSitemap: 'साइटमॅप',
});

const gu: Translations = createLang({
  ...en,
  appName: 'હની ચેઇન',
  tagline: 'શુદ્ધ મધ. ઉજ્જવળ ભવિષ્ય.',
  landingHeroTag: 'શુદ્ધ મધ. સાચી વાર્તાઓ.',
  landingHeroTitle: 'મધપૂડાથી ઘર સુધી,\nસંપૂર્ણ વિશ્વાસ સાથે',
  landingHeroDesc: 'હની ચેઇન બ્લોકચેઇન ટેકનોલોજી દ્વારા તમારા ટેબલ પર પારદર્શિતા લાવે છે.',
  landingHeroCta: 'તમારું મધ ટ્રેસ કરો',
  landingHeroDiscover: 'દરેક ટીપાં પાછળની સાચી વાર્તા શોધો.',
  landingBadgeTraceable: '100% ટ્રેસ કરી શકાય તેવું',
  landingBadgeTraceableSub: 'પ્રકૃતિથી તમારા સુધી',
  landingFeatureSource: 'સ્ત્રોત જાણો',
  landingFeatureSourceDesc: 'મધમાખી પાલકોથી તમારા ટેબલ સુધી દરેક પગલું ટ્રેસ કરો.',
  landingFeaturePure: 'શુદ્ધ અને પ્રમાણિત',
  landingFeaturePureDesc: 'બ્લોકચેઇન ટેકનોલોજી દ્વારા ચકાસાયેલ.',
  landingFeatureSupport: 'મધમાખી પાલકોને ટેકો',
  landingFeatureSupportDesc: 'સ્થાનિક સમુદાયો અને ટકાઉ આજીવિકાને સશક્ત બનાવવી.',
  landingFeatureHealthy: 'સ્વસ્થ આવતીકાલ',
  landingFeatureHealthyDesc: 'તમારા માટે સારું. પૃથ્વી માટે વધુ સારું.',
  landingHowTag: 'આ કેવી રીતે કામ કરે છે',
  landingHowTitle: 'દરેક પગલામાં પારદર્શિતા',
  landingHowDesc: 'તમારા મધની મુસાફરી અનુસરો, મધપૂડાથી તમારા ઘર સુધી.',
  landingStep1Title: 'મધપૂડા પર',
  landingStep1Desc: 'મધમાખીઓ પ્રકૃતિના શ્રેષ્ઠમાંથી મકરંદ એકત્ર કરે છે.',
  landingStep2Title: 'મધમાખી પાલકો સાથે',
  landingStep2Desc: 'સ્થાનિક મધમાખી પાલકો દ્વારા નૈતિક રીતે લણણી.',
  landingStep3Title: 'પ્રક્રિયા',
  landingStep3Desc: 'શુદ્ધતા જાળવવા કાળજીપૂર્વક સંભાળવામાં આવે છે.',
  landingStep4Title: 'તમારા સુધી',
  landingStep4Desc: 'થોડી સેકન્ડોમાં સંપૂર્ણ મુસાફરી સ્કેન કરો અને ટ્રેસ કરો.',
  landingMissionTitle: 'મધ કરતાં વધુ',
  landingMissionDesc: 'હની ચેઇન ન્યાયી, સ્વચ્છ અને વધુ પારદર્શક ખાદ્ય પ્રણાલી તરફ એક પગલું છે.',
  landingMissionCta: 'વધુ જાણો',
  landingTraceTag: 'તમારું મધ ટ્રેસ કરો',
  landingTraceTitle: 'તમારા મધ વિશે ઉત્સુક છો?',
  landingTraceDesc: 'તમારા બરણી પરનો QR કોડ સ્કેન કરો અથવા બેચ ID દાખલ કરો.',
  landingTracePlaceholder: 'બેચ ID દાખલ કરો',
  landingTraceBtn: 'ટ્રેસ',
  landingTraceNote: 'સાચું મધ. સાચી પારદર્શિતા.',
  navHome: 'હોમ',
  navSignIn: 'સાઇન ઇન',
  navSignOut: 'સાઇન આઉટ',
  navOurHoney: 'અમારું મધ',
  navTrace: 'ટ્રેસ',
  navContact: 'સંપર્ક',
  footerRights: '© 2026 હની ચેઇન. તમામ અધિકારો અનામત.',
  footerTagline: 'શુદ્ધ મધ. ઉજ્જવળ ભવિષ્ય.',
  footerPrivacy: 'ગોપનીયતા નીતિ',
  footerTerms: 'ઉપયોગની શરતો',
  footerSitemap: 'સાઇટમેપ',
});

const pa: Translations = createLang({
  ...en,
  appName: 'ਹਨੀ ਚੇਨ',
  tagline: 'ਸ਼ੁੱਧ ਸ਼ਹਿਦ। ਉੱਜਵਲ ਭਵਿੱਖ।',
  landingHeroTag: 'ਸ਼ੁੱਧ ਸ਼ਹਿਦ। ਅਸਲ ਕਹਾਣੀਆਂ।',
  landingHeroTitle: 'ਛੱਤੇ ਤੋਂ ਘਰ ਤੱਕ,\nਪੂਰੇ ਭਰੋਸੇ ਨਾਲ',
  landingHeroDesc: 'ਹਨੀ ਚੇਨ ਬਲਾਕਚੇਨ ਤਕਨਾਲੋਜੀ ਰਾਹੀਂ ਤੁਹਾਡੀ ਮੇਜ਼ ਤੇ ਪਾਰਦਰਸ਼ਤਾ ਲਿਆਉਂਦੀ ਹੈ।',
  landingHeroCta: 'ਆਪਣਾ ਸ਼ਹਿਦ ਟ੍ਰੇਸ ਕਰੋ',
  landingHeroDiscover: 'ਹਰ ਬੂੰਦ ਦੇ ਪਿੱਛੇ ਦੀ ਅਸਲ ਕਹਾਣੀ ਜਾਣੋ।',
  landingBadgeTraceable: '100% ਟ੍ਰੇਸ ਯੋਗ',
  landingBadgeTraceableSub: 'ਕੁਦਰਤ ਤੋਂ ਤੁਹਾਡੇ ਤੱਕ',
  landingFeatureSource: 'ਸਰੋਤ ਜਾਣੋ',
  landingFeatureSourceDesc: 'ਮਧੂ ਮੱਖੀ ਪਾਲਕਾਂ ਤੋਂ ਤੁਹਾਡੀ ਮੇਜ਼ ਤੱਕ ਹਰ ਕਦਮ ਟ੍ਰੇਸ ਕਰੋ।',
  landingFeaturePure: 'ਸ਼ੁੱਧ ਅਤੇ ਪ੍ਰਮਾਣਿਕ',
  landingFeaturePureDesc: 'ਬਲਾਕਚੇਨ ਤਕਨਾਲੋਜੀ ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ।',
  landingFeatureSupport: 'ਮਧੂ ਮੱਖੀ ਪਾਲਕਾਂ ਦਾ ਸਮਰਥਨ',
  landingFeatureSupportDesc: 'ਸਥਾਨਕ ਭਾਈਚਾਰਿਆਂ ਅਤੇ ਟਿਕਾਊ ਰੋਜ਼ੀ-ਰੋਟੀ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨਾ।',
  landingFeatureHealthy: 'ਸਿਹਤਮੰਦ ਕੱਲ੍ਹ',
  landingFeatureHealthyDesc: 'ਤੁਹਾਡੇ ਲਈ ਚੰਗਾ। ਧਰਤੀ ਲਈ ਹੋਰ ਵੀ ਚੰਗਾ।',
  landingHowTag: 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
  landingHowTitle: 'ਹਰ ਕਦਮ ਵਿੱਚ ਪਾਰਦਰਸ਼ਤਾ',
  landingHowDesc: 'ਆਪਣੇ ਸ਼ਹਿਦ ਦੇ ਸਫ਼ਰ ਦੀ ਪਾਲਣਾ ਕਰੋ, ਛੱਤੇ ਤੋਂ ਤੁਹਾਡੇ ਘਰ ਤੱਕ।',
  landingStep1Title: 'ਛੱਤੇ ਤੇ',
  landingStep1Desc: 'ਮਧੂ ਮੱਖੀਆਂ ਕੁਦਰਤ ਦੇ ਸਭ ਤੋਂ ਵਧੀਆ ਤੋਂ ਰਸ ਇਕੱਠਾ ਕਰਦੀਆਂ ਹਨ।',
  landingStep2Title: 'ਮਧੂ ਮੱਖੀ ਪਾਲਕਾਂ ਨਾਲ',
  landingStep2Desc: 'ਸਥਾਨਕ ਮਧੂ ਮੱਖੀ ਪਾਲਕਾਂ ਦੁਆਰਾ ਨੈਤਿਕ ਤੌਰ ਤੇ ਕਟਾਈ।',
  landingStep3Title: 'ਪ੍ਰੋਸੈਸਿੰਗ',
  landingStep3Desc: 'ਸ਼ੁੱਧਤਾ ਬਣਾਈ ਰੱਖਣ ਲਈ ਧਿਆਨ ਨਾਲ ਸੰਭਾਲਿਆ ਗਿਆ।',
  landingStep4Title: 'ਤੁਹਾਡੇ ਤੱਕ',
  landingStep4Desc: 'ਕੁਝ ਸਕਿੰਟਾਂ ਵਿੱਚ ਪੂਰਾ ਸਫ਼ਰ ਸਕੈਨ ਕਰੋ ਅਤੇ ਟ੍ਰੇਸ ਕਰੋ।',
  landingMissionTitle: 'ਸ਼ਹਿਦ ਤੋਂ ਵੱਧ',
  landingMissionDesc: 'ਹਨੀ ਚੇਨ ਇੱਕ ਨਿਆਂਪੂਰਨ, ਸਾਫ਼ ਅਤੇ ਵਧੇਰੇ ਪਾਰਦਰਸ਼ੀ ਭੋਜਨ ਪ੍ਰਣਾਲੀ ਵੱਲ ਇੱਕ ਕਦਮ ਹੈ।',
  landingMissionCta: 'ਹੋਰ ਜਾਣੋ',
  landingTraceTag: 'ਆਪਣਾ ਸ਼ਹਿਦ ਟ੍ਰੇਸ ਕਰੋ',
  landingTraceTitle: 'ਆਪਣੇ ਸ਼ਹਿਦ ਬਾਰੇ ਉਤਸੁਕ ਹੋ?',
  landingTraceDesc: 'ਆਪਣੀ ਬੋਤਲ ਤੇ QR ਕੋਡ ਸਕੈਨ ਕਰੋ ਜਾਂ ਬੈਚ ID ਦਰਜ ਕਰੋ।',
  landingTracePlaceholder: 'ਬੈਚ ID ਦਰਜ ਕਰੋ',
  landingTraceBtn: 'ਟ੍ਰੇਸ',
  landingTraceNote: 'ਅਸਲ ਸ਼ਹਿਦ। ਅਸਲ ਪਾਰਦਰਸ਼ਤਾ।',
  navHome: 'ਹੋਮ',
  navSignIn: 'ਸਾਈਨ ਇਨ',
  navSignOut: 'ਸਾਈਨ ਆਊਟ',
  navOurHoney: 'ਸਾਡਾ ਸ਼ਹਿਦ',
  navTrace: 'ਟ੍ਰੇਸ',
  navContact: 'ਸੰਪਰਕ',
  footerRights: '© 2026 ਹਨੀ ਚੇਨ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।',
  footerTagline: 'ਸ਼ੁੱਧ ਸ਼ਹਿਦ। ਉੱਜਵਲ ਭਵਿੱਖ।',
  footerPrivacy: 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ',
  footerTerms: 'ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ',
  footerSitemap: 'ਸਾਈਟਮੈਪ',
});

export const translations: Record<Language, Translations> = {
  en,
  hi,
  ta,
  te,
  kn,
  ml,
  bn,
  mr,
  gu,
  pa,
};

export const LANGUAGE_LABELS: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
  ml: { native: 'മലയാളം', english: 'Malayalam' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  mr: { native: 'मराठी', english: 'Marathi' },
  gu: { native: 'ગુજરાતી', english: 'Gujarati' },
  pa: { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
};
