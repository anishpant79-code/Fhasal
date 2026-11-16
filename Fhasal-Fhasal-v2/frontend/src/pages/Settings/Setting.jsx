
import React from 'react'
import {
    Settings as SettingsIcon,
    Globe,
    Ruler,
    Bell,
    CloudRain,
    Droplets,
    Sprout,
    Lightbulb,
    Save,
    RotateCcw,
    User,
    ShieldCheck,
} from 'lucide-react'

import {
    useSettings,
} from '../../context/SettingsContext'

const translations = {
    en: {
        title: 'Settings',
        subtitle: 'Manage your Fhasal application preferences',
        languageTitle: 'Language Preferences',
        languageDescription: 'Select your preferred application language',
        applicationLanguage: 'Application Language',
        languageSaved: 'Your language selection is saved automatically.',
        measurementTitle: 'Measurement Preferences',
        measurementDescription: 'Choose how your agricultural land area is displayed',
        areaUnit: 'Preferred Area Unit',
        currentUnit: 'Your preferred unit is currently',
        notificationTitle: 'Notification Preferences',
        notificationDescription: 'Choose which updates you want to receive',
        generalNotifications: 'General Notifications',
        generalDescription: 'Receive important updates from Fhasal',
        weatherAlerts: 'Weather Alerts',
        weatherDescription: 'Receive weather-related warnings and updates',
        irrigationReminders: 'Irrigation Reminders',
        irrigationDescription: 'Get reminders about irrigation activities',
        cropUpdates: 'Crop Updates',
        cropDescription: 'Receive crop growth and farming updates',
        farmingAdvisories: 'Farming Advisories',
        farmingDescription: 'Receive farming recommendations and guidance',
        accountTitle: 'Account Information',
        accountDescription: 'Your account and privacy settings',
        localTitle: 'Your data is stored locally',
        localDescription: 'Your current preferences and registered field information are stored in this browser.',
        reset: 'Reset Defaults',
        save: 'Save Settings',
        saved: 'Your settings have been saved successfully!',
        resetDone: 'Settings have been reset to defaults.',
        acre: 'Acre',
        hectare: 'Hectare',
        guntha: 'Guntha',
    },
    hi: {
        title: 'सेटिंग्स',
        subtitle: 'अपनी Fhasal ऐप प्राथमिकताएँ प्रबंधित करें',
        languageTitle: 'भाषा प्राथमिकताएँ',
        languageDescription: 'अपनी पसंदीदा ऐप भाषा चुनें',
        applicationLanguage: 'ऐप की भाषा',
        languageSaved: 'आपकी भाषा का चयन अपने आप सहेजा जाता है।',
        measurementTitle: 'मापन प्राथमिकताएँ',
        measurementDescription: 'अपनी कृषि भूमि का क्षेत्रफल दिखाने का तरीका चुनें',
        areaUnit: 'पसंदीदा क्षेत्र इकाई',
        currentUnit: 'आपकी पसंदीदा इकाई वर्तमान में है',
        notificationTitle: 'सूचना प्राथमिकताएँ',
        notificationDescription: 'चुनें कि आप कौन से अपडेट प्राप्त करना चाहते हैं',
        generalNotifications: 'सामान्य सूचनाएँ',
        generalDescription: 'Fhasal से महत्वपूर्ण अपडेट प्राप्त करें',
        weatherAlerts: 'मौसम अलर्ट',
        weatherDescription: 'मौसम संबंधी चेतावनियाँ और अपडेट प्राप्त करें',
        irrigationReminders: 'सिंचाई अनुस्मारक',
        irrigationDescription: 'सिंचाई गतिविधियों के बारे में अनुस्मारक प्राप्त करें',
        cropUpdates: 'फसल अपडेट',
        cropDescription: 'फसल की वृद्धि और खेती के अपडेट प्राप्त करें',
        farmingAdvisories: 'कृषि सलाह',
        farmingDescription: 'खेती संबंधी सुझाव और मार्गदर्शन प्राप्त करें',
        accountTitle: 'खाता जानकारी',
        accountDescription: 'आपकी खाता और गोपनीयता सेटिंग्स',
        localTitle: 'आपका डेटा स्थानीय रूप से संग्रहीत है',
        localDescription: 'आपकी प्राथमिकताएँ और पंजीकृत खेत की जानकारी इस ब्राउज़र में संग्रहीत हैं।',
        reset: 'डिफ़ॉल्ट सेटिंग्स',
        save: 'सेटिंग्स सहेजें',
        saved: 'आपकी सेटिंग्स सफलतापूर्वक सहेजी गई हैं!',
        resetDone: 'सेटिंग्स डिफ़ॉल्ट पर रीसेट कर दी गई हैं।',
        acre: 'एकड़',
        hectare: 'हेक्टेयर',
        guntha: 'गुंठा',
    },
    kn: {
        title: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        subtitle: 'ನಿಮ್ಮ Fhasal ಅಪ್ಲಿಕೇಶನ್ ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
        languageTitle: 'ಭಾಷೆಯ ಆದ್ಯತೆಗಳು',
        languageDescription: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        applicationLanguage: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ',
        languageSaved: 'ನಿಮ್ಮ ಭಾಷೆಯ ಆಯ್ಕೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಉಳಿಸಲಾಗುತ್ತದೆ.',
        measurementTitle: 'ಅಳತೆಯ ಆದ್ಯತೆಗಳು',
        measurementDescription: 'ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣವನ್ನು ಹೇಗೆ ತೋರಿಸಬೇಕು ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        areaUnit: 'ಆದ್ಯತೆಯ ವಿಸ್ತೀರ್ಣ ಘಟಕ',
        currentUnit: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಆದ್ಯತೆಯ ಘಟಕ',
        notificationTitle: 'ಅಧಿಸೂಚನೆಗಳ ಆದ್ಯತೆಗಳು',
        notificationDescription: 'ನೀವು ಯಾವ ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಲು ಬಯಸುತ್ತೀರಿ ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        generalNotifications: 'ಸಾಮಾನ್ಯ ಅಧಿಸೂಚನೆಗಳು',
        generalDescription: 'Fhasal ನಿಂದ ಪ್ರಮುಖ ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಿರಿ',
        weatherAlerts: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
        weatherDescription: 'ಹವಾಮಾನ ಸಂಬಂಧಿತ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಿರಿ',
        irrigationReminders: 'ನೀರಾವರಿ ಜ್ಞಾಪನೆಗಳು',
        irrigationDescription: 'ನೀರಾವರಿ ಚಟುವಟಿಕೆಗಳ ಬಗ್ಗೆ ಜ್ಞಾಪನೆಗಳನ್ನು ಪಡೆಯಿರಿ',
        cropUpdates: 'ಬೆಳೆ ನವೀಕರಣಗಳು',
        cropDescription: 'ಬೆಳೆ ಬೆಳವಣಿಗೆ ಮತ್ತು ಕೃಷಿ ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಿರಿ',
        farmingAdvisories: 'ಕೃಷಿ ಸಲಹೆಗಳು',
        farmingDescription: 'ಕೃಷಿ ಶಿಫಾರಸುಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ',
        accountTitle: 'ಖಾತೆ ಮಾಹಿತಿ',
        accountDescription: 'ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        localTitle: 'ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
        localDescription: 'ನಿಮ್ಮ ಆದ್ಯತೆಗಳು ಮತ್ತು ನೋಂದಾಯಿತ ಹೊಲದ ಮಾಹಿತಿ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.',
        reset: 'ಡೀಫಾಲ್ಟ್ ಮರುಹೊಂದಿಸಿ',
        save: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ',
        saved: 'ನಿಮ್ಮ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!',
        resetDone: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಡೀಫಾಲ್ಟ್‌ಗೆ ಮರುಹೊಂದಿಸಲಾಗಿದೆ.',
        acre: 'ಎಕರೆ',
        hectare: 'ಹೆಕ್ಟೇರ್',
        guntha: 'ಗುಂಟೆ',
    },
    te: {
        title: 'సెట్టింగ్‌లు',
        subtitle: 'మీ Fhasal అప్లికేషన్ ప్రాధాన్యతలను నిర్వహించండి',
        languageTitle: 'భాషా ప్రాధాన్యతలు',
        languageDescription: 'మీకు నచ్చిన అప్లికేషన్ భాషను ఎంచుకోండి',
        applicationLanguage: 'అప్లికేషన్ భాష',
        languageSaved: 'మీ భాష ఎంపిక స్వయంచాలకంగా సేవ్ అవుతుంది.',
        measurementTitle: 'కొలతల ప్రాధాన్యతలు',
        measurementDescription: 'మీ వ్యవసాయ భూమి విస్తీర్ణాన్ని ఎలా చూపించాలో ఎంచుకోండి',
        areaUnit: 'ఇష్టమైన విస్తీర్ణ యూనిట్',
        currentUnit: 'ప్రస్తుతం మీకు ఇష్టమైన యూనిట్',
        notificationTitle: 'నోటిఫికేషన్ ప్రాధాన్యతలు',
        notificationDescription: 'మీరు ఏ నవీకరణలను పొందాలనుకుంటున్నారో ఎంచుకోండి',
        generalNotifications: 'సాధారణ నోటిఫికేషన్లు',
        generalDescription: 'Fhasal నుండి ముఖ్యమైన నవీకరణలను పొందండి',
        weatherAlerts: 'వాతావరణ హెచ్చరికలు',
        weatherDescription: 'వాతావరణ హెచ్చరికలు మరియు నవీకరణలను పొందండి',
        irrigationReminders: 'నీటిపారుదల రిమైండర్లు',
        irrigationDescription: 'నీటిపారుదల కార్యకలాపాల గురించి రిమైండర్లు పొందండి',
        cropUpdates: 'పంట నవీకరణలు',
        cropDescription: 'పంట పెరుగుదల మరియు వ్యవసాయ నవీకరణలను పొందండి',
        farmingAdvisories: 'వ్యవసాయ సలహాలు',
        farmingDescription: 'వ్యవసాయ సిఫార్సులు మరియు మార్గదర్శకత్వం పొందండి',
        accountTitle: 'ఖాతా సమాచారం',
        accountDescription: 'మీ ఖాతా మరియు గోప్యతా సెట్టింగ్‌లు',
        localTitle: 'మీ డేటా స్థానికంగా నిల్వ చేయబడుతుంది',
        localDescription: 'మీ ప్రాధాన్యతలు మరియు నమోదైన పొలం సమాచారం ఈ బ్రౌజర్‌లో నిల్వ చేయబడతాయి.',
        reset: 'డిఫాల్ట్‌లకు రీసెట్ చేయండి',
        save: 'సెట్టింగ్‌లను సేవ్ చేయండి',
        saved: 'మీ సెట్టింగ్‌లు విజయవంతంగా సేవ్ చేయబడ్డాయి!',
        resetDone: 'సెట్టింగ్‌లు డిఫాల్ట్‌లకు రీసెట్ చేయబడ్డాయి.',
        acre: 'ఎకరం',
        hectare: 'హెక్టారు',
        guntha: 'గుంట',
    },
    ta: {
        title: 'அமைப்புகள்',
        subtitle: 'உங்கள் Fhasal பயன்பாட்டு விருப்பங்களை நிர்வகிக்கவும்',
        languageTitle: 'மொழி விருப்பங்கள்',
        languageDescription: 'உங்களுக்கு விருப்பமான பயன்பாட்டு மொழியைத் தேர்ந்தெடுக்கவும்',
        applicationLanguage: 'பயன்பாட்டு மொழி',
        languageSaved: 'உங்கள் மொழித் தேர்வு தானாகவே சேமிக்கப்படும்.',
        measurementTitle: 'அளவீட்டு விருப்பங்கள்',
        measurementDescription: 'உங்கள் விவசாய நிலத்தின் பரப்பளவு எவ்வாறு காட்டப்பட வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்',
        areaUnit: 'விருப்பமான பரப்பளவு அலகு',
        currentUnit: 'தற்போதைய விருப்பமான அலகு',
        notificationTitle: 'அறிவிப்பு விருப்பங்கள்',
        notificationDescription: 'நீங்கள் பெற விரும்பும் புதுப்பிப்புகளைத் தேர்ந்தெடுக்கவும்',
        generalNotifications: 'பொது அறிவிப்புகள்',
        generalDescription: 'Fhasal இலிருந்து முக்கியமான புதுப்பிப்புகளைப் பெறுங்கள்',
        weatherAlerts: 'வானிலை எச்சரிக்கைகள்',
        weatherDescription: 'வானிலை தொடர்பான எச்சரிக்கைகள் மற்றும் புதுப்பிப்புகளைப் பெறுங்கள்',
        irrigationReminders: 'நீர்ப்பாசன நினைவூட்டல்கள்',
        irrigationDescription: 'நீர்ப்பாசன நடவடிக்கைகள் பற்றிய நினைவூட்டல்களைப் பெறுங்கள்',
        cropUpdates: 'பயிர் புதுப்பிப்புகள்',
        cropDescription: 'பயிர் வளர்ச்சி மற்றும் விவசாய புதுப்பிப்புகளைப் பெறுங்கள்',
        farmingAdvisories: 'விவசாய ஆலோசனைகள்',
        farmingDescription: 'விவசாய பரிந்துரைகள் மற்றும் வழிகாட்டுதல்களைப் பெறுங்கள்',
        accountTitle: 'கணக்கு தகவல்',
        accountDescription: 'உங்கள் கணக்கு மற்றும் தனியுரிமை அமைப்புகள்',
        localTitle: 'உங்கள் தரவு உள்நாட்டில் சேமிக்கப்படுகிறது',
        localDescription: 'உங்கள் விருப்பங்களும் பதிவு செய்யப்பட்ட நிலத் தகவல்களும் இந்த உலாவியில் சேமிக்கப்படுகின்றன.',
        reset: 'இயல்புநிலைக்கு மீட்டமை',
        save: 'அமைப்புகளைச் சேமிக்கவும்',
        saved: 'உங்கள் அமைப்புகள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!',
        resetDone: 'அமைப்புகள் இயல்புநிலைக்கு மீட்டமைக்கப்பட்டன.',
        acre: 'ஏக்கர்',
        hectare: 'ஹெக்டேர்',
        guntha: 'குண்டா',
    },
    mr: {
        title: 'सेटिंग्ज',
        subtitle: 'तुमच्या Fhasal ॲपच्या प्राधान्यांचे व्यवस्थापन करा',
        languageTitle: 'भाषा प्राधान्ये',
        languageDescription: 'तुमची आवडती ॲप भाषा निवडा',
        applicationLanguage: 'ॲपची भाषा',
        languageSaved: 'तुमची भाषा निवड आपोआप जतन केली जाते.',
        measurementTitle: 'मापन प्राधान्ये',
        measurementDescription: 'तुमच्या शेतीच्या जमिनीचे क्षेत्रफळ कसे दाखवायचे ते निवडा',
        areaUnit: 'आवडते क्षेत्रफळ एकक',
        currentUnit: 'तुमचे सध्याचे आवडते एकक',
        notificationTitle: 'सूचना प्राधान्ये',
        notificationDescription: 'तुम्हाला कोणत्या सूचना हव्या आहेत ते निवडा',
        generalNotifications: 'सामान्य सूचना',
        generalDescription: 'Fhasal कडून महत्त्वाच्या अपडेट्स मिळवा',
        weatherAlerts: 'हवामान सूचना',
        weatherDescription: 'हवामानविषयक इशारे आणि अपडेट्स मिळवा',
        irrigationReminders: 'सिंचन स्मरणपत्रे',
        irrigationDescription: 'सिंचन कामांची स्मरणपत्रे मिळवा',
        cropUpdates: 'पीक अपडेट्स',
        cropDescription: 'पिकांच्या वाढीबद्दल आणि शेतीविषयक अपडेट्स मिळवा',
        farmingAdvisories: 'शेतीविषयक सल्ला',
        farmingDescription: 'शेतीसाठी शिफारसी आणि मार्गदर्शन मिळवा',
        accountTitle: 'खाते माहिती',
        accountDescription: 'तुमचे खाते आणि गोपनीयता सेटिंग्ज',
        localTitle: 'तुमचा डेटा स्थानिक पातळीवर साठवला जातो',
        localDescription: 'तुमची प्राधान्ये आणि नोंदणीकृत शेताची माहिती या ब्राउझरमध्ये साठवली जाते.',
        reset: 'मूळ सेटिंग्ज',
        save: 'सेटिंग्ज जतन करा',
        saved: 'तुमच्या सेटिंग्ज यशस्वीरित्या जतन झाल्या!',
        resetDone: 'सेटिंग्ज मूळ स्थितीत आणल्या आहेत.',
        acre: 'एकर',
        hectare: 'हेक्टर',
        guntha: 'गुंठा',
    },
    bn: {
        title: 'সেটিংস',
        subtitle: 'আপনার Fhasal অ্যাপের পছন্দগুলি পরিচালনা করুন',
        languageTitle: 'ভাষার পছন্দ',
        languageDescription: 'আপনার পছন্দের অ্যাপের ভাষা নির্বাচন করুন',
        applicationLanguage: 'অ্যাপের ভাষা',
        languageSaved: 'আপনার ভাষা নির্বাচন স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।',
        measurementTitle: 'পরিমাপের পছন্দ',
        measurementDescription: 'আপনার কৃষিজমির ক্ষেত্রফল কীভাবে দেখানো হবে তা নির্বাচন করুন',
        areaUnit: 'পছন্দের ক্ষেত্রফলের একক',
        currentUnit: 'আপনার বর্তমান পছন্দের একক',
        notificationTitle: 'বিজ্ঞপ্তির পছন্দ',
        notificationDescription: 'আপনি কোন আপডেটগুলি পেতে চান তা নির্বাচন করুন',
        generalNotifications: 'সাধারণ বিজ্ঞপ্তি',
        generalDescription: 'Fhasal থেকে গুরুত্বপূর্ণ আপডেট পান',
        weatherAlerts: 'আবহাওয়ার সতর্কতা',
        weatherDescription: 'আবহাওয়া সম্পর্কিত সতর্কতা ও আপডেট পান',
        irrigationReminders: 'সেচের অনুস্মারক',
        irrigationDescription: 'সেচের কাজ সম্পর্কে অনুস্মারক পান',
        cropUpdates: 'ফসলের আপডেট',
        cropDescription: 'ফসলের বৃদ্ধি ও কৃষি সংক্রান্ত আপডেট পান',
        farmingAdvisories: 'কৃষি পরামর্শ',
        farmingDescription: 'কৃষি সংক্রান্ত সুপারিশ ও নির্দেশনা পান',
        accountTitle: 'অ্যাকাউন্টের তথ্য',
        accountDescription: 'আপনার অ্যাকাউন্ট ও গোপনীয়তা সেটিংস',
        localTitle: 'আপনার তথ্য স্থানীয়ভাবে সংরক্ষিত',
        localDescription: 'আপনার পছন্দ এবং নিবন্ধিত জমির তথ্য এই ব্রাউজারে সংরক্ষিত থাকে।',
        reset: 'ডিফল্টে ফিরিয়ে আনুন',
        save: 'সেটিংস সংরক্ষণ করুন',
        saved: 'আপনার সেটিংস সফলভাবে সংরক্ষিত হয়েছে!',
        resetDone: 'সেটিংস ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে।',
        acre: 'একর',
        hectare: 'হেক্টর',
        guntha: 'গুন্থা',
    },
}

const Settings = () => {
    const {
        settings,
        updateLanguage,
        updateSettings,
        updatePreference,
        resetSettings,
        supportedLanguages,
    } = useSettings()

    const languageCode = settings.languageCode || 'en'
    const t = translations[languageCode] || translations.en

    const areaUnit = settings.areaUnit || 'Acre'
    const preferences = settings.preferences || {}

    const preferenceOptions = [
        {
            key: 'notifications',
            label: t.generalNotifications,
            description: t.generalDescription,
            icon: Bell,
        },
        {
            key: 'weatherAlerts',
            label: t.weatherAlerts,
            description: t.weatherDescription,
            icon: CloudRain,
        },
        {
            key: 'irrigationReminder',
            label: t.irrigationReminders,
            description: t.irrigationDescription,
            icon: Droplets,
        },
        {
            key: 'cropUpdate',
            label: t.cropUpdates,
            description: t.cropDescription,
            icon: Sprout,
        },
        {
            key: 'farmingAdvisories',
            label: t.farmingAdvisories,
            description: t.farmingDescription,
            icon: Lightbulb,
        },
    ]

    const handleSave = () => {
        alert(t.saved)
    }

    const handleReset = () => {
        resetSettings()
        alert(t.resetDone)
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Page Heading */}
            <div>
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-fhasal-green-light p-3">
                        <SettingsIcon
                            size={25}
                            className="text-fhasal-green"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {t.title}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {t.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Language Settings */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <Globe className="text-fhasal-green" size={22} />

                    <div>
                        <h2 className="font-semibold text-gray-800">
                            {t.languageTitle}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {t.languageDescription}
                        </p>
                    </div>
                </div>

                <label
                    htmlFor="application-language"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    {t.applicationLanguage}
                </label>

                <select
                    id="application-language"
                    value={languageCode}
                    onChange={(event) =>
                        updateLanguage(event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-fhasal-green md:w-1/2"
                >
                    {supportedLanguages.map((language) => (
                        <option
                            key={language.code}
                            value={language.code}
                        >
                            {language.nativeName}
                        </option>
                    ))}
                </select>

                <p className="mt-2 text-xs text-gray-400">
                    {t.languageSaved}
                </p>
            </section>

            {/* Area Unit Settings */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <Ruler className="text-fhasal-green" size={22} />

                    <div>
                        <h2 className="font-semibold text-gray-800">
                            {t.measurementTitle}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {t.measurementDescription}
                        </p>
                    </div>
                </div>

                <label
                    htmlFor="area-unit"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    {t.areaUnit}
                </label>

                <select
                    id="area-unit"
                    value={areaUnit}
                    onChange={(event) =>
                        updateSettings('areaUnit', event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-fhasal-green md:w-1/2"
                >
                    <option value="Acre">{t.acre}</option>
                    <option value="Hectare">{t.hectare}</option>
                    <option value="Guntha">{t.guntha}</option>
                </select>

                <div className="mt-4 rounded-xl bg-fhasal-green-light p-4">
                    <p className="text-sm text-fhasal-green">
                        {t.currentUnit}{' '}
                        <strong>{t[areaUnit.toLowerCase()] || areaUnit}</strong>.
                    </p>
                </div>
            </section>

            {/* Notification Settings */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <Bell className="text-fhasal-green" size={22} />

                    <div>
                        <h2 className="font-semibold text-gray-800">
                            {t.notificationTitle}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {t.notificationDescription}
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {preferenceOptions.map((option) => {
                        const Icon = option.icon
                        const enabled = Boolean(preferences[option.key])

                        return (
                            <div
                                key={option.key}
                                className="flex items-center justify-between gap-4 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <Icon
                                            size={20}
                                            className="text-fhasal-green"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-800">
                                            {option.label}
                                        </h3>

                                        <p className="text-xs text-gray-500">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        updatePreference(
                                            option.key,
                                            !enabled
                                        )
                                    }
                                    aria-label={option.label}
                                    aria-pressed={enabled}
                                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                        enabled
                                            ? 'bg-fhasal-green'
                                            : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                            enabled ? 'left-6' : 'left-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Account Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <User className="text-fhasal-green" size={22} />

                    <div>
                        <h2 className="font-semibold text-gray-800">
                            {t.accountTitle}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {t.accountDescription}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <ShieldCheck
                        size={22}
                        className="mt-1 text-fhasal-green"
                    />

                    <div>
                        <h3 className="text-sm font-medium text-gray-800">
                            {t.localTitle}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            {t.localDescription}
                        </p>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    <RotateCcw size={17} />
                    {t.reset}
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl bg-fhasal-green px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
                >
                    <Save size={17} />
                    {t.save}
                </button>
            </div>
        </div>
    )
}

export default Settings
