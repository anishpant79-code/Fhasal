
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    MapPin,
    Ruler,
    Map,
    Save,
    X,
    Sprout,
} from 'lucide-react'

import turfArea from '@turf/area'
import { polygon } from '@turf/helpers'

import { useFields } from '../../context/FieldContext'
import { useToast } from '../../context/ToastContext'
import { useSettings } from '../../context/SettingsContext'
import FieldBoundaryMap from "../Fields/FieldBoundaryMap";

const AREA_CONVERSIONS = {
    acre: 4046.8564224,
    hectare: 10000,
    guntha: 101.17141056,
}

const SOIL_OPTIONS = [
    'Black Soil',
    'Red Soil',
    'Alluvial Soil',
    'Sandy Soil',
    'Sandy Loam',
    'Clayey Soil',
    'Loamy Soil',
    'Laterite Soil',
    'Other',
]

const translations = {
    en: {
        back: 'Back to Field Details',
        backToFields: 'Back to My Fields',
        manage: 'MANAGE YOUR FARM',
        title: 'Edit Field',
        description: 'Update your registered farmland information.',
        farmInformation: 'Farm Information',
        updateDetails: 'Update your field details',
        fieldName: 'Field Name',
        fieldNamePlaceholder: 'Enter field name',
        farmLocation: 'Farm Location',
        locationPlaceholder: 'Enter farm location',
        farmArea: 'Farm Area',
        calculatedBoundary: 'Calculated from boundary',
        areaAuto: 'Area is automatically calculated from your boundary.',
        areaUnit: 'Area Unit',
        acres: 'Acres',
        hectares: 'Hectares',
        gunthas: 'Gunthas',
        soilType: 'Soil Type',
        selectSoil: 'Select soil type (optional)',
        soilHelp: 'Your previously saved soil type is selected automatically. You can change it or leave it blank if unknown.',
        fieldBoundary: 'Field Boundary',
        modifyBoundary: 'Modify your existing farmland boundary',
        points: 'Selected boundary points:',
        largeArea: 'Your selected area is quite large. Please check that you have zoomed in and marked only your farmland.',
        cancel: 'Cancel',
        save: 'Save Changes',
        missingName: 'Please enter a field name.',
        missingLocation: 'Please enter the farm location.',
        missingPoints: 'Please mark at least 3 boundary points.',
        invalidArea: 'Unable to calculate the farm area. Please redraw your boundary.',
        success: 'Your field has been updated successfully!',
        notFound: 'Field Not Found',
        notFoundDescription: 'The field you are trying to edit could not be found.',
        soilOptions: SOIL_OPTIONS,
    },

    hi: {
        back: 'खेत के विवरण पर वापस जाएं',
        backToFields: 'मेरे खेतों पर वापस जाएं',
        manage: 'अपने खेत का प्रबंधन करें',
        title: 'खेत संपादित करें',
        description: 'अपने पंजीकृत खेत की जानकारी अपडेट करें।',
        farmInformation: 'खेत की जानकारी',
        updateDetails: 'अपने खेत का विवरण अपडेट करें',
        fieldName: 'खेत का नाम',
        fieldNamePlaceholder: 'खेत का नाम दर्ज करें',
        farmLocation: 'खेत का स्थान',
        locationPlaceholder: 'खेत का स्थान दर्ज करें',
        farmArea: 'खेत का क्षेत्रफल',
        calculatedBoundary: 'सीमा से गणना की गई',
        areaAuto: 'क्षेत्रफल की गणना आपकी खेत की सीमा से अपने आप होती है।',
        areaUnit: 'क्षेत्रफल की इकाई',
        acres: 'एकड़',
        hectares: 'हेक्टेयर',
        gunthas: 'गुंठा',
        soilType: 'मिट्टी का प्रकार',
        selectSoil: 'मिट्टी का प्रकार चुनें (वैकल्पिक)',
        soilHelp: 'आपकी पहले से सहेजी गई मिट्टी का प्रकार अपने आप चुना जाएगा। आप इसे बदल सकते हैं या खाली छोड़ सकते हैं।',
        fieldBoundary: 'खेत की सीमा',
        modifyBoundary: 'अपने मौजूदा खेत की सीमा बदलें',
        points: 'चुने गए सीमा बिंदु:',
        largeArea: 'आपका चुना गया क्षेत्र काफी बड़ा है। कृपया ज़ूम करके केवल अपने खेत की सीमा चिह्नित करें।',
        cancel: 'रद्द करें',
        save: 'बदलाव सहेजें',
        missingName: 'कृपया खेत का नाम दर्ज करें।',
        missingLocation: 'कृपया खेत का स्थान दर्ज करें।',
        missingPoints: 'कृपया कम से कम 3 सीमा बिंदु चिह्नित करें।',
        invalidArea: 'खेत का क्षेत्रफल नहीं निकाला जा सका। कृपया सीमा दोबारा बनाएं।',
        success: 'आपका खेत सफलतापूर्वक अपडेट हो गया है!',
        notFound: 'खेत नहीं मिला',
        notFoundDescription: 'आप जिस खेत को संपादित करना चाहते हैं, वह नहीं मिला।',
        soilOptions: ['काली मिट्टी', 'लाल मिट्टी', 'जलोढ़ मिट्टी', 'रेतीली मिट्टी', 'रेतीली दोमट मिट्टी', 'चिकनी मिट्टी', 'दोमट मिट्टी', 'लैटेराइट मिट्टी', 'अन्य'],
    },

    kn: {
        back: 'ಹೊಲದ ವಿವರಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        backToFields: 'ನನ್ನ ಹೊಲಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        manage: 'ನಿಮ್ಮ ಹೊಲವನ್ನು ನಿರ್ವಹಿಸಿ',
        title: 'ಹೊಲವನ್ನು ಸಂಪಾದಿಸಿ',
        description: 'ನೋಂದಾಯಿತ ಕೃಷಿಭೂಮಿಯ ಮಾಹಿತಿಯನ್ನು ನವೀಕರಿಸಿ.',
        farmInformation: 'ಹೊಲದ ಮಾಹಿತಿ',
        updateDetails: 'ನಿಮ್ಮ ಹೊಲದ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ',
        fieldName: 'ಹೊಲದ ಹೆಸರು',
        fieldNamePlaceholder: 'ಹೊಲದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
        farmLocation: 'ಹೊಲದ ಸ್ಥಳ',
        locationPlaceholder: 'ಹೊಲದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ',
        farmArea: 'ಹೊಲದ ವಿಸ್ತೀರ್ಣ',
        calculatedBoundary: 'ಗಡಿಯ ಆಧಾರದ ಮೇಲೆ ಲೆಕ್ಕಿಸಲಾಗಿದೆ',
        areaAuto: 'ನಿಮ್ಮ ಹೊಲದ ಗಡಿಯಿಂದ ವಿಸ್ತೀರ್ಣವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೆಕ್ಕಿಸಲಾಗುತ್ತದೆ.',
        areaUnit: 'ವಿಸ್ತೀರ್ಣದ ಘಟಕ',
        acres: 'ಎಕರೆಗಳು',
        hectares: 'ಹೆಕ್ಟೇರ್‌ಗಳು',
        gunthas: 'ಗುಂಟೆಗಳು',
        soilType: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ',
        selectSoil: 'ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಐಚ್ಛಿಕ)',
        soilHelp: 'ನೀವು ಮೊದಲು ಉಳಿಸಿದ ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಆಯ್ಕೆ ಮಾಡಲಾಗುತ್ತದೆ. ಬದಲಾಯಿಸಬಹುದು ಅಥವಾ ಖಾಲಿ ಬಿಡಬಹುದು.',
        fieldBoundary: 'ಹೊಲದ ಗಡಿ',
        modifyBoundary: 'ನಿಮ್ಮ ಹೊಲದ ಪ್ರಸ್ತುತ ಗಡಿಯನ್ನು ಬದಲಾಯಿಸಿ',
        points: 'ಆಯ್ಕೆ ಮಾಡಿದ ಗಡಿ ಬಿಂದುಗಳು:',
        largeArea: 'ಆಯ್ಕೆ ಮಾಡಿದ ವಿಸ್ತೀರ್ಣ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. ಜೂಮ್ ಮಾಡಿ ನಿಮ್ಮ ಹೊಲದ ಗಡಿಯನ್ನು ಮಾತ್ರ ಗುರುತಿಸಿ.',
        cancel: 'ರದ್ದುಮಾಡಿ',
        save: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
        missingName: 'ದಯವಿಟ್ಟು ಹೊಲದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
        missingLocation: 'ದಯವಿಟ್ಟು ಹೊಲದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ.',
        missingPoints: 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ 3 ಗಡಿ ಬಿಂದುಗಳನ್ನು ಗುರುತಿಸಿ.',
        invalidArea: 'ಹೊಲದ ವಿಸ್ತೀರ್ಣವನ್ನು ಲೆಕ್ಕಿಸಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಗಡಿಯನ್ನು ಮತ್ತೆ ಗುರುತಿಸಿ.',
        success: 'ನಿಮ್ಮ ಹೊಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
        notFound: 'ಹೊಲ ಕಂಡುಬಂದಿಲ್ಲ',
        notFoundDescription: 'ನೀವು ಸಂಪಾದಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತಿರುವ ಹೊಲ ಕಂಡುಬಂದಿಲ್ಲ.',
        soilOptions: ['ಕಪ್ಪು ಮಣ್ಣು', 'ಕೆಂಪು ಮಣ್ಣು', 'ಮೆಕ್ಕಲು ಮಣ್ಣು', 'ಮರಳು ಮಣ್ಣು', 'ಮರಳು ಮಿಶ್ರಿತ ಗೋಡು ಮಣ್ಣು', 'ಜೇಡಿ ಮಣ್ಣು', 'ಗೋಡು ಮಣ್ಣು', 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು', 'ಇತರೆ'],
    },

    mr: {
        back: 'शेताच्या तपशीलांकडे परत जा',
        backToFields: 'माझ्या शेतांकडे परत जा',
        manage: 'तुमच्या शेताचे व्यवस्थापन करा',
        title: 'शेत संपादित करा',
        description: 'तुमच्या नोंदणीकृत शेताची माहिती अद्ययावत करा.',
        farmInformation: 'शेताची माहिती',
        updateDetails: 'तुमच्या शेताचा तपशील अद्ययावत करा',
        fieldName: 'शेताचे नाव',
        fieldNamePlaceholder: 'शेताचे नाव लिहा',
        farmLocation: 'शेताचे ठिकाण',
        locationPlaceholder: 'शेताचे ठिकाण लिहा',
        farmArea: 'शेताचे क्षेत्रफळ',
        calculatedBoundary: 'सीमेवरून मोजलेले',
        areaAuto: 'तुमच्या शेताच्या सीमेवरून क्षेत्रफळ आपोआप मोजले जाते.',
        areaUnit: 'क्षेत्रफळाचे एकक',
        acres: 'एकर',
        hectares: 'हेक्टर',
        gunthas: 'गुंठे',
        soilType: 'मातीचा प्रकार',
        selectSoil: 'मातीचा प्रकार निवडा (ऐच्छिक)',
        soilHelp: 'पूर्वी जतन केलेला मातीचा प्रकार आपोआप निवडला जातो. तुम्ही तो बदलू शकता किंवा रिकामा ठेवू शकता.',
        fieldBoundary: 'शेताची सीमा',
        modifyBoundary: 'तुमच्या सध्याच्या शेताची सीमा बदला',
        points: 'निवडलेले सीमा बिंदू:',
        largeArea: 'निवडलेले क्षेत्र खूप मोठे आहे. झूम करून फक्त तुमच्या शेताची सीमा निवडा.',
        cancel: 'रद्द करा',
        save: 'बदल जतन करा',
        missingName: 'कृपया शेताचे नाव लिहा.',
        missingLocation: 'कृपया शेताचे ठिकाण लिहा.',
        missingPoints: 'कृपया किमान 3 सीमा बिंदू निवडा.',
        invalidArea: 'शेताचे क्षेत्रफळ मोजता आले नाही. कृपया सीमा पुन्हा निवडा.',
        success: 'तुमचे शेत यशस्वीरित्या अद्ययावत झाले!',
        notFound: 'शेत सापडले नाही',
        notFoundDescription: 'तुम्ही संपादित करू इच्छित असलेले शेत सापडले नाही.',
        soilOptions: ['काळी माती', 'लाल माती', 'गाळाची माती', 'वाळूमिश्रित माती', 'वाळूमिश्रित पोयटा', 'चिकण माती', 'पोयटा माती', 'जांभी माती', 'इतर'],
    },

    te: {
        back: 'పొలం వివరాలకు తిరిగి వెళ్లండి',
        backToFields: 'నా పొలాలకు తిరిగి వెళ్లండి',
        manage: 'మీ పొలాన్ని నిర్వహించండి',
        title: 'పొలాన్ని సవరించండి',
        description: 'మీ నమోదైన వ్యవసాయ భూమి వివరాలను నవీకరించండి.',
        farmInformation: 'పొలం సమాచారం',
        updateDetails: 'మీ పొలం వివరాలను నవీకరించండి',
        fieldName: 'పొలం పేరు',
        fieldNamePlaceholder: 'పొలం పేరును నమోదు చేయండి',
        farmLocation: 'పొలం స్థానం',
        locationPlaceholder: 'పొలం స్థానాన్ని నమోదు చేయండి',
        farmArea: 'పొలం విస్తీర్ణం',
        calculatedBoundary: 'సరిహద్దు ఆధారంగా లెక్కించబడింది',
        areaAuto: 'మీ పొలం సరిహద్దు ఆధారంగా విస్తీర్ణం స్వయంచాలకంగా లెక్కించబడుతుంది.',
        areaUnit: 'విస్తీర్ణం యూనిట్',
        acres: 'ఎకరాలు',
        hectares: 'హెక్టార్లు',
        gunthas: 'గుంటలు',
        soilType: 'నేల రకం',
        selectSoil: 'నేల రకాన్ని ఎంచుకోండి (ఐచ్ఛికం)',
        soilHelp: 'మీరు గతంలో సేవ్ చేసిన నేల రకం స్వయంచాలకంగా ఎంపిక అవుతుంది. మీరు మార్చవచ్చు లేదా ఖాళీగా ఉంచవచ్చు.',
        fieldBoundary: 'పొలం సరిహద్దు',
        modifyBoundary: 'మీ ప్రస్తుత పొలం సరిహద్దును మార్చండి',
        points: 'ఎంచుకున్న సరిహద్దు బిందువులు:',
        largeArea: 'మీరు ఎంచుకున్న విస్తీర్ణం చాలా పెద్దదిగా ఉంది. జూమ్ చేసి మీ పొలం సరిహద్దును మాత్రమే గుర్తించండి.',
        cancel: 'రద్దు చేయండి',
        save: 'మార్పులను సేవ్ చేయండి',
        missingName: 'దయచేసి పొలం పేరును నమోదు చేయండి.',
        missingLocation: 'దయచేసి పొలం స్థానాన్ని నమోదు చేయండి.',
        missingPoints: 'దయచేసి కనీసం 3 సరిహద్దు బిందువులను గుర్తించండి.',
        invalidArea: 'పొలం విస్తీర్ణాన్ని లెక్కించలేకపోయాము. దయచేసి సరిహద్దును మళ్లీ గుర్తించండి.',
        success: 'మీ పొలం విజయవంతంగా నవీకరించబడింది!',
        notFound: 'పొలం కనుగొనబడలేదు',
        notFoundDescription: 'మీరు సవరించాలనుకుంటున్న పొలం కనుగొనబడలేదు.',
        soilOptions: ['నల్ల నేల', 'ఎర్ర నేల', 'ఒండ్రు నేల', 'ఇసుక నేల', 'ఇసుకతో కూడిన లోమీ నేల', 'బంకమట్టి', 'లోమీ నేల', 'లేటరైట్ నేల', 'ఇతర'],
    },

    ta: {
        back: 'வயல் விவரங்களுக்குத் திரும்பு',
        backToFields: 'எனது வயல்களுக்குத் திரும்பு',
        manage: 'உங்கள் பண்ணையை நிர்வகிக்கவும்',
        title: 'வயலைத் திருத்து',
        description: 'பதிவு செய்யப்பட்ட உங்கள் விவசாய நில விவரங்களைப் புதுப்பிக்கவும்.',
        farmInformation: 'பண்ணைத் தகவல்',
        updateDetails: 'உங்கள் வயல் விவரங்களைப் புதுப்பிக்கவும்',
        fieldName: 'வயல் பெயர்',
        fieldNamePlaceholder: 'வயல் பெயரை உள்ளிடவும்',
        farmLocation: 'பண்ணை அமைவிடம்',
        locationPlaceholder: 'பண்ணை அமைவிடத்தை உள்ளிடவும்',
        farmArea: 'பண்ணை பரப்பளவு',
        calculatedBoundary: 'எல்லையிலிருந்து கணக்கிடப்பட்டது',
        areaAuto: 'உங்கள் வயல் எல்லையிலிருந்து பரப்பளவு தானாகக் கணக்கிடப்படுகிறது.',
        areaUnit: 'பரப்பளவு அலகு',
        acres: 'ஏக்கர்',
        hectares: 'ஹெக்டேர்',
        gunthas: 'குண்டா',
        soilType: 'மண் வகை',
        selectSoil: 'மண் வகையைத் தேர்ந்தெடுக்கவும் (விருப்பம்)',
        soilHelp: 'முன்பு சேமித்த மண் வகை தானாகத் தேர்ந்தெடுக்கப்படும். அதை மாற்றலாம் அல்லது காலியாக விடலாம்.',
        fieldBoundary: 'வயல் எல்லை',
        modifyBoundary: 'உங்கள் தற்போதைய வயல் எல்லையை மாற்றவும்',
        points: 'தேர்ந்தெடுக்கப்பட்ட எல்லைப் புள்ளிகள்:',
        largeArea: 'தேர்ந்தெடுக்கப்பட்ட பரப்பளவு மிகவும் பெரியது. பெரிதாக்கி உங்கள் வயல் எல்லையை மட்டும் குறிக்கவும்.',
        cancel: 'ரத்துசெய்',
        save: 'மாற்றங்களைச் சேமி',
        missingName: 'வயல் பெயரை உள்ளிடவும்.',
        missingLocation: 'பண்ணை அமைவிடத்தை உள்ளிடவும்.',
        missingPoints: 'குறைந்தது 3 எல்லைப் புள்ளிகளைக் குறிக்கவும்.',
        invalidArea: 'பண்ணை பரப்பளவைக் கணக்கிட முடியவில்லை. எல்லையை மீண்டும் வரையவும்.',
        success: 'உங்கள் வயல் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது!',
        notFound: 'வயல் கிடைக்கவில்லை',
        notFoundDescription: 'நீங்கள் திருத்த முயற்சிக்கும் வயலைக் கண்டறிய முடியவில்லை.',
        soilOptions: ['கரிசல் மண்', 'செம்மண்', 'வண்டல் மண்', 'மணல் மண்', 'மணல் கலந்த வண்டல் மண்', 'களிமண்', 'வண்டல் கலந்த மண்', 'லேட்டரைட் மண்', 'மற்றவை'],
    },

    bn: {
        back: 'জমির বিবরণে ফিরে যান',
        backToFields: 'আমার জমিতে ফিরে যান',
        manage: 'আপনার খামার পরিচালনা করুন',
        title: 'জমি সম্পাদনা করুন',
        description: 'আপনার নিবন্ধিত কৃষিজমির তথ্য আপডেট করুন।',
        farmInformation: 'খামারের তথ্য',
        updateDetails: 'আপনার জমির বিবরণ আপডেট করুন',
        fieldName: 'জমির নাম',
        fieldNamePlaceholder: 'জমির নাম লিখুন',
        farmLocation: 'খামারের অবস্থান',
        locationPlaceholder: 'খামারের অবস্থান লিখুন',
        farmArea: 'খামারের আয়তন',
        calculatedBoundary: 'সীমানা থেকে গণনা করা হয়েছে',
        areaAuto: 'আপনার জমির সীমানা থেকে আয়তন স্বয়ংক্রিয়ভাবে গণনা করা হয়।',
        areaUnit: 'আয়তনের একক',
        acres: 'একর',
        hectares: 'হেক্টর',
        gunthas: 'গুণ্ঠা',
        soilType: 'মাটির ধরন',
        selectSoil: 'মাটির ধরন নির্বাচন করুন (ঐচ্ছিক)',
        soilHelp: 'আগে সংরক্ষিত মাটির ধরন স্বয়ংক্রিয়ভাবে নির্বাচন করা হবে। আপনি এটি পরিবর্তন করতে পারেন বা ফাঁকা রাখতে পারেন।',
        fieldBoundary: 'জমির সীমানা',
        modifyBoundary: 'আপনার বর্তমান জমির সীমানা পরিবর্তন করুন',
        points: 'নির্বাচিত সীমানা বিন্দু:',
        largeArea: 'নির্বাচিত জমির আয়তন অনেক বড়। জুম করে শুধুমাত্র আপনার জমির সীমানা চিহ্নিত করুন।',
        cancel: 'বাতিল করুন',
        save: 'পরিবর্তন সংরক্ষণ করুন',
        missingName: 'অনুগ্রহ করে জমির নাম লিখুন।',
        missingLocation: 'অনুগ্রহ করে খামারের অবস্থান লিখুন।',
        missingPoints: 'অনুগ্রহ করে অন্তত ৩টি সীমানা বিন্দু চিহ্নিত করুন।',
        invalidArea: 'খামারের আয়তন গণনা করা যায়নি। অনুগ্রহ করে সীমানা আবার আঁকুন।',
        success: 'আপনার জমি সফলভাবে আপডেট হয়েছে!',
        notFound: 'জমি পাওয়া যায়নি',
        notFoundDescription: 'আপনি যে জমিটি সম্পাদনা করতে চাইছেন সেটি পাওয়া যায়নি।',
        soilOptions: ['কালো মাটি', 'লাল মাটি', 'পলিমাটি', 'বেলে মাটি', 'বেলে দোআঁশ মাটি', 'এঁটেল মাটি', 'দোআঁশ মাটি', 'ল্যাটেরাইট মাটি', 'অন্যান্য'],
    },
}

const EditField = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { fields, updateField } = useFields()
    const { showToast } = useToast()
    const { settings } = useSettings()

    const languageCode = settings.languageCode || 'en'
    const t = translations[languageCode] || translations.en

    const field = fields.find(
        (item) => String(item.id) === String(id)
    )

    const [formData, setFormData] = useState(() => ({
        fieldName: field?.fieldName || '',
        fieldArea: field?.fieldArea ?? field?.area ?? '',
        areaUnit: field?.areaUnit || field?.unit || 'acre',
        fieldLocation: field?.fieldLocation || '',
        soilType: field?.soilType || '',
        boundary: Array.isArray(field?.boundary) ? field.boundary : [],
    }))

    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        setError('')
    }

    const calculateFieldArea = (boundary, unit) => {
        if (!Array.isArray(boundary) || boundary.length < 3) {
            return ''
        }

        try {
            const coordinates = boundary.map((point) => {
                if (!Array.isArray(point) || point.length < 2) {
                    throw new Error('Invalid boundary point')
                }

                const lat = Number(point[0])
                const lng = Number(point[1])

                if (
                    !Number.isFinite(lat) ||
                    !Number.isFinite(lng) ||
                    lat < -90 ||
                    lat > 90 ||
                    lng < -180 ||
                    lng > 180
                ) {
                    throw new Error('Invalid coordinates')
                }

                return [lng, lat]
            })

            const firstPoint = coordinates[0]
            const lastPoint = coordinates[coordinates.length - 1]

            if (
                firstPoint[0] !== lastPoint[0] ||
                firstPoint[1] !== lastPoint[1]
            ) {
                coordinates.push([...firstPoint])
            }

            const fieldPolygon = polygon([coordinates])
            const areaInSquareMetres = turfArea(fieldPolygon)
            const conversion = AREA_CONVERSIONS[unit]

            if (
                !conversion ||
                !Number.isFinite(areaInSquareMetres) ||
                areaInSquareMetres <= 0
            ) {
                return ''
            }

            const convertedArea = areaInSquareMetres / conversion

            if (!Number.isFinite(convertedArea) || convertedArea <= 0) {
                return ''
            }

            return convertedArea.toFixed(4)
        } catch (err) {
            console.error('Area calculation failed:', err)
            return ''
        }
    }

    const handleBoundaryChange = (updatedBoundary) => {
        const calculatedArea = calculateFieldArea(
            updatedBoundary,
            formData.areaUnit
        )

        setFormData((prev) => ({
            ...prev,
            boundary: updatedBoundary,
            fieldArea: calculatedArea,
        }))

        setError('')
    }

    const handleUnitChange = (e) => {
        const newUnit = e.target.value

        const calculatedArea = calculateFieldArea(
            formData.boundary,
            newUnit
        )

        setFormData((prev) => ({
            ...prev,
            areaUnit: newUnit,
            fieldArea: calculatedArea,
        }))

        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.fieldName.trim()) {
            setError(t.missingName)
            return
        }

        if (!formData.fieldLocation.trim()) {
            setError(t.missingLocation)
            return
        }

        if (
            !Array.isArray(formData.boundary) ||
            formData.boundary.length < 3
        ) {
            setError(t.missingPoints)
            return
        }

        const calculatedArea = Number(formData.fieldArea)

        if (
            !formData.fieldArea ||
            !Number.isFinite(calculatedArea) ||
            calculatedArea <= 0
        ) {
            setError(t.invalidArea)
            return
        }

        updateField(id, {
            ...field,
            ...formData,
            fieldName: formData.fieldName.trim(),
            fieldLocation: formData.fieldLocation.trim(),
            soilType: formData.soilType.trim(),
        })

        showToast(t.success, 'success')
        navigate(`/fields/${id}`)
    }

    if (!field) {
        return (
            <div className="p-4 md:p-8">
                <Link
                    to="/fields"
                    className="inline-flex items-center gap-2 text-sm text-[#718071] hover:text-[#174B35] mb-6"
                >
                    <ArrowLeft size={17} />
                    {t.backToFields}
                </Link>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-10 text-center shadow-sm">
                    <h2 className="text-xl font-semibold text-[#344334] mb-2">
                        {t.notFound}
                    </h2>

                    <p className="text-sm text-[#7A8475]">
                        {t.notFoundDescription}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <Link
                to={`/fields/${id}`}
                className="inline-flex items-center gap-2 text-sm text-[#718071] hover:text-[#174B35] mb-6 transition-colors"
            >
                <ArrowLeft size={17} />
                {t.back}
            </Link>

            <div className="mb-8">
                <p className="text-xs font-semibold tracking-wider text-[#347052] mb-2">
                    {t.manage}
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-[#344334]">
                    {t.title}
                </h1>

                <p className="mt-2 text-[#7A8475]">
                    {t.description}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 md:p-7 shadow-sm mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-fhasal-green-light flex items-center justify-center">
                            <Sprout size={25} className="text-fhasal-green" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-[#344334]">
                                {t.farmInformation}
                            </h2>

                            <p className="text-xs text-[#829187]">
                                {t.updateDetails}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label
                                htmlFor="fieldName"
                                className="block text-sm font-medium text-[#344334] mb-2"
                            >
                                {t.fieldName}
                            </label>

                            <input
                                id="fieldName"
                                type="text"
                                name="fieldName"
                                value={formData.fieldName}
                                onChange={handleChange}
                                placeholder={t.fieldNamePlaceholder}
                                className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] text-sm outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="fieldLocation"
                                className="block text-sm font-medium text-[#344334] mb-2"
                            >
                                {t.farmLocation}
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829187]"
                                />

                                <input
                                    id="fieldLocation"
                                    type="text"
                                    name="fieldLocation"
                                    value={formData.fieldLocation}
                                    onChange={handleChange}
                                    placeholder={t.locationPlaceholder}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE5DA] text-sm outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="fieldArea"
                                className="block text-sm font-medium text-[#344334] mb-2"
                            >
                                {t.farmArea}
                            </label>

                            <div className="relative">
                                <Ruler
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829187]"
                                />

                                <input
                                    id="fieldArea"
                                    type="number"
                                    name="fieldArea"
                                    value={formData.fieldArea}
                                    readOnly
                                    placeholder={t.calculatedBoundary}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE5DA] bg-[#F7F9F6] text-sm outline-none"
                                />
                            </div>

                            <p className="text-xs text-[#829187] mt-2">
                                {t.areaAuto}
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="areaUnit"
                                className="block text-sm font-medium text-[#344334] mb-2"
                            >
                                {t.areaUnit}
                            </label>

                            <select
                                id="areaUnit"
                                name="areaUnit"
                                value={formData.areaUnit}
                                onChange={handleUnitChange}
                                className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] bg-white text-sm outline-none focus:border-[#347052]"
                            >
                                <option value="acre">{t.acres}</option>
                                <option value="hectare">{t.hectares}</option>
                                <option value="guntha">{t.gunthas}</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="soilType"
                                className="flex items-center gap-2 text-sm font-medium text-[#344334] mb-2"
                            >
                                <Sprout size={17} className="text-[#347052]" />
                                {t.soilType}
                            </label>

                            <select
                                id="soilType"
                                name="soilType"
                                value={formData.soilType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] bg-white text-sm outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                            >
                                <option value="">
                                    {t.selectSoil}
                                </option>

                                {SOIL_OPTIONS.map((soil, index) => (
                                    <option key={soil} value={soil}>
                                        {t.soilOptions[index]}
                                    </option>
                                ))}
                            </select>

                            <p className="text-xs text-[#829187] mt-2">
                                {t.soilHelp}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 md:p-7 shadow-sm mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-fhasal-green-light flex items-center justify-center">
                            <Map size={21} className="text-fhasal-green" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-[#344334]">
                                {t.fieldBoundary}
                            </h2>

                            <p className="text-xs text-[#829187]">
                                {t.modifyBoundary}
                            </p>
                        </div>
                    </div>

                    <FieldBoundaryMap
                        initialBoundary={formData.boundary}
                        onBoundaryChange={handleBoundaryChange}
                    />

                    <p className="text-xs text-[#829187] mt-3">
                        {t.points} {formData.boundary.length}
                    </p>

                    {Number(formData.fieldArea) > 100 && (
                        <p className="text-xs text-amber-700 mt-2">
                            {t.largeArea}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Link
                        to={`/fields/${id}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#DCE5DA] text-[#526252] text-sm font-medium hover:bg-[#F7F9F6] transition-colors"
                    >
                        <X size={17} />
                        {t.cancel}
                    </Link>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#347052] text-white text-sm font-medium hover:bg-[#285C42] transition-colors"
                    >
                        <Save size={17} />
                        {t.save}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditField
