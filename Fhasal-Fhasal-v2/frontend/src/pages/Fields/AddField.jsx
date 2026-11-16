
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    MapPin,
    Map,
    ArrowRight,
    Sprout,
} from 'lucide-react'

import turfArea from '@turf/area'
import { polygon } from '@turf/helpers'

import FieldBoundaryMap from './FieldBoundaryMap'
import { useFields } from '../../context/FieldContext'
import { useToast } from '../../context/ToastContext'
import { useSettings } from '../../context/SettingsContext'

const AREA_CONVERSIONS = {
    acre: 4046.8564224,
    hectare: 10000,
    guntha: 101.17141056,
    bigha: 2500,
}

const SOIL_OPTIONS = [
    { value: 'Black Soil', key: 'blackSoil' },
    { value: 'Red Soil', key: 'redSoil' },
    { value: 'Alluvial Soil', key: 'alluvialSoil' },
    { value: 'Sandy Soil', key: 'sandySoil' },
    { value: 'Sandy Loam', key: 'sandyLoam' },
    { value: 'Clayey Soil', key: 'clayeySoil' },
    { value: 'Loamy Soil', key: 'loamySoil' },
    { value: 'Laterite Soil', key: 'lateriteSoil' },
    { value: 'Other', key: 'other' },
]

const translations = {
    en: {
        back: 'Back to My Fields',
        registration: 'FIELD REGISTRATION',
        heading: 'Add Your Farm',
        description: 'Register your farmland to get started with Fhasal.',
        basicInfo: 'Basic Information',
        step: 'Step 1 of 3',
        completed: '33% completed',
        fieldName: 'Field Name',
        required: '*',
        fieldPlaceholder: 'e.g. North Farm',
        farmArea: 'Total Farm Area',
        drawBoundary: 'Draw boundary on map',
        autoCalculated: 'Automatically calculated from your map boundary.',
        unit: 'Unit',
        acres: 'Acres',
        hectares: 'Hectares',
        guntha: 'Guntha',
        bigha: 'Bigha',
        location: 'Farm Location',
        locationPlaceholder: 'Village, town or district',
        soilType: 'Soil Type',
        selectSoil: 'Select soil type (optional)',
        blackSoil: 'Black Soil',
        redSoil: 'Red Soil',
        alluvialSoil: 'Alluvial Soil',
        sandySoil: 'Sandy Soil',
        sandyLoam: 'Sandy Loam',
        clayeySoil: 'Clayey Soil',
        loamySoil: 'Loamy Soil',
        lateriteSoil: 'Laterite Soil',
        other: 'Other',
        soilHelp: 'Select the soil type based on your knowledge or soil test report. You can leave this blank if you are unsure.',
        boundary: 'Field Boundary',
        boundaryHelp: 'Zoom in to your actual farmland before marking its edges. Click around the boundary to mark the corners of your field.',
        boundaryPoints: 'Selected boundary points:',
        largeAreaWarning: 'Your selected area is quite large. Please check that you have zoomed in and marked only your farmland.',
        fieldNameRequired: 'Please enter a field name.',
        locationRequired: 'Please enter the farm location.',
        boundaryRequired: 'Please mark at least 3 boundary points on the map.',
        areaInvalid: 'Unable to calculate the farm area. Please redraw your boundary.',
        success: 'Your field has been registered successfully!',
        continue: 'Continue',
        saveFailed: 'Unable to save your field. Please try again.',
        saving: 'Saving...',
    },

    hi: {
        back: 'मेरे खेतों पर वापस जाएं',
        registration: 'खेत पंजीकरण',
        heading: 'अपना खेत जोड़ें',
        description: 'Fhasal शुरू करने के लिए अपनी कृषि भूमि पंजीकृत करें।',
        basicInfo: 'मूल जानकारी',
        step: 'चरण 1 / 3',
        completed: '33% पूरा हुआ',
        fieldName: 'खेत का नाम',
        required: '*',
        fieldPlaceholder: 'जैसे: उत्तरी खेत',
        farmArea: 'कुल खेत का क्षेत्रफल',
        drawBoundary: 'मानचित्र पर सीमा बनाएं',
        autoCalculated: 'मानचित्र की सीमा से क्षेत्रफल अपने आप मापा जाएगा।',
        unit: 'इकाई',
        acres: 'एकड़',
        hectares: 'हेक्टेयर',
        guntha: 'गुंठा',
        bigha: 'बीघा (क्षेत्रीय रूपांतरण उपलब्ध नहीं)',
        location: 'खेत का स्थान',
        locationPlaceholder: 'गाँव, शहर या जिला',
        soilType: 'मिट्टी का प्रकार',
        selectSoil: 'मिट्टी का प्रकार चुनें (वैकल्पिक)',
        blackSoil: 'काली मिट्टी',
        redSoil: 'लाल मिट्टी',
        alluvialSoil: 'जलोढ़ मिट्टी',
        sandySoil: 'रेतीली मिट्टी',
        sandyLoam: 'रेतीली दोमट मिट्टी',
        clayeySoil: 'चिकनी मिट्टी',
        loamySoil: 'दोमट मिट्टी',
        lateriteSoil: 'लैटेराइट मिट्टी',
        other: 'अन्य',
        soilHelp: 'अपने अनुभव या मिट्टी की जाँच रिपोर्ट के आधार पर मिट्टी चुनें। जानकारी न होने पर इसे खाली छोड़ सकते हैं।',
        boundary: 'खेत की सीमा',
        boundaryHelp: 'सीमा चिह्नित करने से पहले अपने वास्तविक खेत पर ज़ूम करें। खेत के कोनों को चिह्नित करने के लिए सीमा पर क्लिक करें।',
        boundaryPoints: 'चुने गए सीमा बिंदु:',
        largeAreaWarning: 'चुना गया क्षेत्र काफी बड़ा है। कृपया ज़ूम करके जाँचें कि केवल आपका खेत ही चिह्नित है।',
        fieldNameRequired: 'कृपया खेत का नाम दर्ज करें।',
        locationRequired: 'कृपया खेत का स्थान दर्ज करें।',
        boundaryRequired: 'कृपया मानचित्र पर कम से कम 3 सीमा बिंदु चिह्नित करें।',
        areaInvalid: 'खेत का क्षेत्रफल नहीं निकाला जा सका। कृपया सीमा दोबारा बनाएं।',
        success: 'आपका खेत सफलतापूर्वक पंजीकृत हो गया है!',
        continue: 'आगे बढ़ें',
        saveFailed: 'खेत सेव नहीं हो सका। कृपया दोबारा कोशिश करें।',
        saving: 'सेव हो रहा है...',
    },

    kn: {
        back: 'ನನ್ನ ಹೊಲಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        registration: 'ಹೊಲದ ನೋಂದಣಿ',
        heading: 'ನಿಮ್ಮ ಹೊಲವನ್ನು ಸೇರಿಸಿ',
        description: 'Fhasal ಬಳಸಲು ನಿಮ್ಮ ಕೃಷಿಭೂಮಿಯನ್ನು ನೋಂದಾಯಿಸಿ.',
        basicInfo: 'ಮೂಲ ಮಾಹಿತಿ',
        step: 'ಹಂತ 1 / 3',
        completed: '33% ಪೂರ್ಣಗೊಂಡಿದೆ',
        fieldName: 'ಹೊಲದ ಹೆಸರು',
        required: '*',
        fieldPlaceholder: 'ಉದಾ: ಉತ್ತರದ ಹೊಲ',
        farmArea: 'ಒಟ್ಟು ಕೃಷಿ ಭೂಮಿ',
        drawBoundary: 'ನಕ್ಷೆಯಲ್ಲಿ ಗಡಿಯನ್ನು ಗುರುತಿಸಿ',
        autoCalculated: 'ನಕ್ಷೆಯ ಗಡಿಯ ಆಧಾರದ ಮೇಲೆ ವಿಸ್ತೀರ್ಣವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.',
        unit: 'ಅಳತೆಯ ಘಟಕ',
        acres: 'ಎಕರೆ',
        hectares: 'ಹೆಕ್ಟೇರ್',
        guntha: 'ಗುಂಟೆ',
        bigha: 'ಬಿಘಾ (ಪ್ರಾದೇಶಿಕ ಪರಿವರ್ತನೆ ಲಭ್ಯವಿಲ್ಲ)',
        location: 'ಹೊಲದ ಸ್ಥಳ',
        locationPlaceholder: 'ಗ್ರಾಮ, ಪಟ್ಟಣ ಅಥವಾ ಜಿಲ್ಲೆ',
        soilType: 'ಮಣ್ಣಿನ ವಿಧ',
        selectSoil: 'ಮಣ್ಣಿನ ವಿಧವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಐಚ್ಛಿಕ)',
        blackSoil: 'ಕಪ್ಪು ಮಣ್ಣು',
        redSoil: 'ಕೆಂಪು ಮಣ್ಣು',
        alluvialSoil: 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
        sandySoil: 'ಮರಳು ಮಣ್ಣು',
        sandyLoam: 'ಮರಳು ಮಿಶ್ರಿತ ಗೋಡು ಮಣ್ಣು',
        clayeySoil: 'ಜೇಡಿ ಮಣ್ಣು',
        loamySoil: 'ಗೋಡು ಮಣ್ಣು',
        lateriteSoil: 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
        other: 'ಇತರೆ',
        soilHelp: 'ನಿಮ್ಮ ಅನುಭವ ಅಥವಾ ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ವರದಿಯ ಆಧಾರದ ಮೇಲೆ ಮಣ್ಣಿನ ವಿಧವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ತಿಳಿದಿಲ್ಲದಿದ್ದರೆ ಖಾಲಿ ಬಿಡಬಹುದು.',
        boundary: 'ಹೊಲದ ಗಡಿ',
        boundaryHelp: 'ಗಡಿಯನ್ನು ಗುರುತಿಸುವ ಮೊದಲು ನಿಮ್ಮ ನಿಜವಾದ ಹೊಲವನ್ನು ಹತ್ತಿರದಿಂದ ನೋಡಿ. ಹೊಲದ ಮೂಲೆಗಳನ್ನು ಗುರುತಿಸಲು ಗಡಿಯ ಸುತ್ತಲೂ ಕ್ಲಿಕ್ ಮಾಡಿ.',
        boundaryPoints: 'ಆಯ್ಕೆ ಮಾಡಿದ ಗಡಿ ಬಿಂದುಗಳು:',
        largeAreaWarning: 'ಆಯ್ಕೆ ಮಾಡಿದ ವಿಸ್ತೀರ್ಣ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. ನಿಮ್ಮ ಹೊಲವನ್ನಷ್ಟೇ ಗುರುತಿಸಿದ್ದೀರಾ ಎಂದು ಪರಿಶೀಲಿಸಿ.',
        fieldNameRequired: 'ದಯವಿಟ್ಟು ಹೊಲದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
        locationRequired: 'ದಯವಿಟ್ಟು ಹೊಲದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ.',
        boundaryRequired: 'ದಯವಿಟ್ಟು ನಕ್ಷೆಯಲ್ಲಿ ಕನಿಷ್ಠ 3 ಗಡಿ ಬಿಂದುಗಳನ್ನು ಗುರುತಿಸಿ.',
        areaInvalid: 'ಹೊಲದ ವಿಸ್ತೀರ್ಣವನ್ನು ಲೆಕ್ಕಹಾಕಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಗಡಿಯನ್ನು ಮತ್ತೆ ಗುರುತಿಸಿ.',
        success: 'ನಿಮ್ಮ ಹೊಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ!',
        continue: 'ಮುಂದುವರಿಸಿ',
        saveFailed: 'ಹೊಲವನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    },

    mr: {
        back: 'माझ्या शेतांकडे परत जा',
        registration: 'शेत नोंदणी',
        heading: 'तुमचे शेत जोडा',
        description: 'Fhasal सुरू करण्यासाठी तुमची शेतजमीन नोंदवा.',
        basicInfo: 'मूलभूत माहिती',
        step: 'टप्पा 1 / 3',
        completed: '33% पूर्ण',
        fieldName: 'शेताचे नाव',
        required: '*',
        fieldPlaceholder: 'उदा. उत्तर शेत',
        farmArea: 'एकूण शेतजमीन',
        drawBoundary: 'नकाशावर सीमा काढा',
        autoCalculated: 'नकाशावरील सीमेनुसार क्षेत्रफळ आपोआप मोजले जाईल.',
        unit: 'एकक',
        acres: 'एकर',
        hectares: 'हेक्टर',
        guntha: 'गुंठा',
        bigha: 'बिघा (प्रादेशिक रूपांतरण उपलब्ध नाही)',
        location: 'शेताचे ठिकाण',
        locationPlaceholder: 'गाव, शहर किंवा जिल्हा',
        soilType: 'मातीचा प्रकार',
        selectSoil: 'मातीचा प्रकार निवडा (ऐच्छिक)',
        blackSoil: 'काळी माती',
        redSoil: 'लाल माती',
        alluvialSoil: 'गाळाची माती',
        sandySoil: 'वालुकामय माती',
        sandyLoam: 'वालुकामय पोयटा माती',
        clayeySoil: 'चिकणमाती',
        loamySoil: 'पोयट्याची माती',
        lateriteSoil: 'जांभी माती',
        other: 'इतर',
        soilHelp: 'तुमच्या माहितीनुसार किंवा माती परीक्षण अहवालानुसार मातीचा प्रकार निवडा. खात्री नसल्यास रिकामे ठेवू शकता.',
        boundary: 'शेताची सीमा',
        boundaryHelp: 'सीमा आखण्यापूर्वी तुमच्या प्रत्यक्ष शेतावर झूम करा. शेताचे कोपरे दाखवण्यासाठी सीमेभोवती क्लिक करा.',
        boundaryPoints: 'निवडलेले सीमा बिंदू:',
        largeAreaWarning: 'निवडलेले क्षेत्र खूप मोठे आहे. फक्त तुमची शेतजमीनच निवडली आहे याची खात्री करा.',
        fieldNameRequired: 'कृपया शेताचे नाव लिहा.',
        locationRequired: 'कृपया शेताचे ठिकाण लिहा.',
        boundaryRequired: 'कृपया नकाशावर किमान 3 सीमा बिंदू निवडा.',
        areaInvalid: 'शेताचे क्षेत्रफळ मोजता आले नाही. कृपया सीमा पुन्हा आखा.',
        success: 'तुमच्या शेताची यशस्वी नोंदणी झाली!',
        continue: 'पुढे जा',
        saveFailed: 'शेत जतन करता आले नाही. पुन्हा प्रयत्न करा.',
        saving: 'जतन होत आहे...',
    },

    te: {
        back: 'నా పొలాలకు తిరిగి వెళ్లండి',
        registration: 'పొలం నమోదు',
        heading: 'మీ పొలాన్ని జోడించండి',
        description: 'Fhasal ప్రారంభించడానికి మీ వ్యవసాయ భూమిని నమోదు చేయండి.',
        basicInfo: 'ప్రాథమిక సమాచారం',
        step: 'దశ 1 / 3',
        completed: '33% పూర్తయింది',
        fieldName: 'పొలం పేరు',
        required: '*',
        fieldPlaceholder: 'ఉదా: ఉత్తరపు పొలం',
        farmArea: 'మొత్తం వ్యవసాయ విస్తీర్ణం',
        drawBoundary: 'మ్యాప్‌లో సరిహద్దు గీయండి',
        autoCalculated: 'మ్యాప్ సరిహద్దు ఆధారంగా విస్తీర్ణం ఆటోమేటిక్‌గా లెక్కించబడుతుంది.',
        unit: 'కొలత ప్రమాణం',
        acres: 'ఎకరాలు',
        hectares: 'హెక్టార్లు',
        guntha: 'గుంటలు',
        bigha: 'బిఘా (ప్రాంతీయ మార్పిడి అందుబాటులో లేదు)',
        location: 'పొలం స్థానం',
        locationPlaceholder: 'గ్రామం, పట్టణం లేదా జిల్లా',
        soilType: 'నేల రకం',
        selectSoil: 'నేల రకాన్ని ఎంచుకోండి (ఐచ్ఛికం)',
        blackSoil: 'నల్ల నేల',
        redSoil: 'ఎర్ర నేల',
        alluvialSoil: 'ఒండ్రు నేల',
        sandySoil: 'ఇసుక నేల',
        sandyLoam: 'ఇసుకతో కూడిన లోమీ నేల',
        clayeySoil: 'బంకమట్టి',
        loamySoil: 'లోమీ నేల',
        lateriteSoil: 'లేటరైట్ నేల',
        other: 'ఇతర',
        soilHelp: 'మీకు తెలిసిన సమాచారం లేదా నేల పరీక్ష నివేదిక ఆధారంగా నేల రకాన్ని ఎంచుకోండి. తెలియకపోతే ఖాళీగా ఉంచవచ్చు.',
        boundary: 'పొలం సరిహద్దు',
        boundaryHelp: 'సరిహద్దును గుర్తించే ముందు మీ అసలు పొలాన్ని జూమ్ చేసి చూడండి. పొలం మూలలను గుర్తించడానికి సరిహద్దు చుట్టూ క్లిక్ చేయండి.',
        boundaryPoints: 'ఎంచుకున్న సరిహద్దు పాయింట్లు:',
        largeAreaWarning: 'మీరు ఎంచుకున్న విస్తీర్ణం చాలా పెద్దదిగా ఉంది. మీ పొలం మాత్రమే గుర్తించబడిందో లేదో తనిఖీ చేయండి.',
        fieldNameRequired: 'దయచేసి పొలం పేరును నమోదు చేయండి.',
        locationRequired: 'దయచేసి పొలం స్థానాన్ని నమోదు చేయండి.',
        boundaryRequired: 'దయచేసి మ్యాప్‌లో కనీసం 3 సరిహద్దు పాయింట్లను గుర్తించండి.',
        areaInvalid: 'పొలం విస్తీర్ణాన్ని లెక్కించలేకపోయాము. దయచేసి సరిహద్దును మళ్లీ గీయండి.',
        success: 'మీ పొలం విజయవంతంగా నమోదు చేయబడింది!',
        continue: 'కొనసాగించండి',
        saveFailed: 'పొలాన్ని సేవ్ చేయలేకపోయాము. మళ్లీ ప్రయత్నించండి.',
        saving: 'సేవ్ అవుతోంది...',
    },

    ta: {
        back: 'எனது வயல்களுக்குத் திரும்பு',
        registration: 'வயல் பதிவு',
        heading: 'உங்கள் பண்ணையைச் சேர்க்கவும்',
        description: 'Fhasal பயன்படுத்த உங்கள் விவசாய நிலத்தைப் பதிவு செய்யவும்.',
        basicInfo: 'அடிப்படைத் தகவல்',
        step: 'படி 1 / 3',
        completed: '33% முடிந்தது',
        fieldName: 'வயலின் பெயர்',
        required: '*',
        fieldPlaceholder: 'எ.கா. வடக்கு வயல்',
        farmArea: 'மொத்த விவசாய நிலப்பரப்பு',
        drawBoundary: 'வரைபடத்தில் எல்லையை வரையவும்',
        autoCalculated: 'வரைபட எல்லையின் அடிப்படையில் பரப்பளவு தானாகக் கணக்கிடப்படும்.',
        unit: 'அலகு',
        acres: 'ஏக்கர்',
        hectares: 'ஹெக்டேர்',
        guntha: 'குண்டா',
        bigha: 'பீகா (பிராந்திய மாற்றம் நிலுவையில் உள்ளது)',
        location: 'பண்ணை அமைவிடம்',
        locationPlaceholder: 'கிராமம், நகரம் அல்லது மாவட்டம்',
        soilType: 'மண் வகை',
        selectSoil: 'மண் வகையைத் தேர்ந்தெடுக்கவும் (விருப்பம்)',
        blackSoil: 'கரிசல் மண்',
        redSoil: 'செம்மண்',
        alluvialSoil: 'வண்டல் மண்',
        sandySoil: 'மணல் மண்',
        sandyLoam: 'மணல் கலந்த வண்டல் மண்',
        clayeySoil: 'களிமண்',
        loamySoil: 'வண்டல் மண்',
        lateriteSoil: 'சரளை மண்',
        other: 'மற்றவை',
        soilHelp: 'உங்கள் அறிவு அல்லது மண் பரிசோதனை அறிக்கையின் அடிப்படையில் மண் வகையைத் தேர்ந்தெடுக்கவும். தெரியாவிட்டால் காலியாக விடலாம்.',
        boundary: 'வயல் எல்லை',
        boundaryHelp: 'எல்லையைக் குறிக்கும் முன் உங்கள் உண்மையான விவசாய நிலத்தை பெரிதாக்கிப் பார்க்கவும். வயலின் மூலைகளைக் குறிக்க எல்லையைச் சுற்றிக் கிளிக் செய்யவும்.',
        boundaryPoints: 'தேர்ந்தெடுக்கப்பட்ட எல்லைப் புள்ளிகள்:',
        largeAreaWarning: 'தேர்ந்தெடுக்கப்பட்ட பரப்பளவு மிகவும் பெரியதாக உள்ளது. உங்கள் விவசாய நிலம் மட்டுமே குறிக்கப்பட்டுள்ளதா எனச் சரிபார்க்கவும்.',
        fieldNameRequired: 'தயவுசெய்து வயலின் பெயரை உள்ளிடவும்.',
        locationRequired: 'தயவுசெய்து பண்ணையின் அமைவிடத்தை உள்ளிடவும்.',
        boundaryRequired: 'வரைபடத்தில் குறைந்தது 3 எல்லைப் புள்ளிகளைக் குறிக்கவும்.',
        areaInvalid: 'வயலின் பரப்பளவைக் கணக்கிட முடியவில்லை. எல்லையை மீண்டும் வரையவும்.',
        success: 'உங்கள் வயல் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!',
        continue: 'தொடரவும்',
        saveFailed: 'வயலைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
        saving: 'சேமிக்கப்படுகிறது...',
    },

    bn: {
        back: 'আমার জমিতে ফিরে যান',
        registration: 'জমি নিবন্ধন',
        heading: 'আপনার খামার যোগ করুন',
        description: 'Fhasal ব্যবহার শুরু করতে আপনার কৃষিজমি নিবন্ধন করুন।',
        basicInfo: 'প্রাথমিক তথ্য',
        step: 'ধাপ ১ / ৩',
        completed: '৩৩% সম্পন্ন',
        fieldName: 'জমির নাম',
        required: '*',
        fieldPlaceholder: 'যেমন: উত্তর দিকের জমি',
        farmArea: 'মোট কৃষিজমির পরিমাণ',
        drawBoundary: 'মানচিত্রে সীমানা আঁকুন',
        autoCalculated: 'মানচিত্রের সীমানা থেকে জমির পরিমাণ স্বয়ংক্রিয়ভাবে গণনা করা হবে।',
        unit: 'একক',
        acres: 'একর',
        hectares: 'হেক্টর',
        guntha: 'গুন্থা',
        bigha: 'বিঘা (আঞ্চলিক রূপান্তর এখনও উপলব্ধ নয়)',
        location: 'খামারের অবস্থান',
        locationPlaceholder: 'গ্রাম, শহর বা জেলা',
        soilType: 'মাটির ধরন',
        selectSoil: 'মাটির ধরন নির্বাচন করুন (ঐচ্ছিক)',
        blackSoil: 'কালো মাটি',
        redSoil: 'লাল মাটি',
        alluvialSoil: 'পলিমাটি',
        sandySoil: 'বেলে মাটি',
        sandyLoam: 'বেলে দোআঁশ মাটি',
        clayeySoil: 'এঁটেল মাটি',
        loamySoil: 'দোআঁশ মাটি',
        lateriteSoil: 'ল্যাটেরাইট মাটি',
        other: 'অন্যান্য',
        soilHelp: 'আপনার অভিজ্ঞতা বা মাটি পরীক্ষার রিপোর্ট অনুযায়ী মাটির ধরন নির্বাচন করুন। নিশ্চিত না হলে খালি রাখতে পারেন।',
        boundary: 'জমির সীমানা',
        boundaryHelp: 'সীমানা চিহ্নিত করার আগে আপনার প্রকৃত জমির কাছাকাছি জুম করুন। জমির কোণগুলি চিহ্নিত করতে সীমানা বরাবর ক্লিক করুন।',
        boundaryPoints: 'নির্বাচিত সীমানার পয়েন্ট:',
        largeAreaWarning: 'আপনার নির্বাচিত জমির পরিমাণ অনেক বড়। অনুগ্রহ করে পরীক্ষা করুন যে শুধু আপনার জমিই চিহ্নিত হয়েছে কি না।',
        fieldNameRequired: 'অনুগ্রহ করে জমির নাম লিখুন।',
        locationRequired: 'অনুগ্রহ করে জমির অবস্থান লিখুন।',
        boundaryRequired: 'মানচিত্রে অন্তত ৩টি সীমানার পয়েন্ট চিহ্নিত করুন।',
        areaInvalid: 'জমির পরিমাণ গণনা করা যায়নি। অনুগ্রহ করে সীমানা আবার আঁকুন।',
        success: 'আপনার জমি সফলভাবে নিবন্ধিত হয়েছে!',
        continue: 'চালিয়ে যান',
        saveFailed: 'জমি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।',
        saving: 'সংরক্ষণ হচ্ছে...',
    },
}

const AddField = () => {
    const { showToast } = useToast()
    const { addField } = useFields()
    const { settings } = useSettings()
    const navigate = useNavigate()

    const languageCode = settings.languageCode || 'en'
    const language = translations[languageCode] || translations.en

    const t = (key) =>
        language[key] || translations.en[key] || key

    const [formData, setFormData] = useState({
        fieldName: '',
        fieldArea: '',
        areaUnit: 'acre',
        fieldLocation: '',
        soilType: '',
        currentCrop: '',
        irrigationType: '',
        boundary: [],
    })

    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        setError('')
    }

    // Calculate field area from map coordinates.
    const calculateFieldArea = (coordinates, unit) => {
        if (!Array.isArray(coordinates) || coordinates.length < 3) {
            return ''
        }

        try {
            const geoJsonCoordinates = coordinates.map((point) => {
                if (!Array.isArray(point) || point.length < 2) {
                    throw new Error('Invalid boundary point')
                }

                const latitude = Number(point[0])
                const longitude = Number(point[1])

                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude) ||
                    latitude < -90 ||
                    latitude > 90 ||
                    longitude < -180 ||
                    longitude > 180
                ) {
                    throw new Error('Invalid map coordinates')
                }

                return [longitude, latitude]
            })

            const uniquePoints = new Set(
                geoJsonCoordinates.map(
                    ([longitude, latitude]) =>
                        `${longitude},${latitude}`
                )
            )

            if (uniquePoints.size < 3) {
                return ''
            }

            const firstPoint = geoJsonCoordinates[0]
            const lastPoint =
                geoJsonCoordinates[geoJsonCoordinates.length - 1]

            if (
                firstPoint[0] !== lastPoint[0] ||
                firstPoint[1] !== lastPoint[1]
            ) {
                geoJsonCoordinates.push([...firstPoint])
            }

            const fieldPolygon = polygon([geoJsonCoordinates])
            const areaInSquareMetres = turfArea(fieldPolygon)
            const conversion = AREA_CONVERSIONS[unit]

            if (
                !conversion ||
                !Number.isFinite(areaInSquareMetres) ||
                areaInSquareMetres <= 0
            ) {
                return ''
            }

            const calculatedArea = areaInSquareMetres / conversion

            if (
                !Number.isFinite(calculatedArea) ||
                calculatedArea <= 0
            ) {
                return ''
            }

            return calculatedArea.toFixed(4)
        } catch (err) {
            console.error('Farm area calculation failed:', err)
            return ''
        }
    }

    // Receive boundary coordinates from the map.
    const handleBoundaryChange = (newBoundary) => {
        const safeBoundary = Array.isArray(newBoundary)
            ? newBoundary
            : []

        const calculatedArea = calculateFieldArea(
            safeBoundary,
            formData.areaUnit
        )

        setFormData((prev) => ({
            ...prev,
            boundary: safeBoundary,
            fieldArea: calculatedArea,
        }))

        setError('')
    }

    // Recalculate area whenever the unit changes.
    const handleUnitChange = (e) => {
        const unit = e.target.value

        setFormData((prev) => ({
            ...prev,
            areaUnit: unit,
            fieldArea: calculateFieldArea(prev.boundary, unit),
        }))

        setError('')
    }

    // Validate and save the field to MongoDB.
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isSubmitting) return

        if (!formData.fieldName.trim()) {
            setError('fieldNameRequired')
            return
        }

        if (!formData.fieldLocation.trim()) {
            setError('locationRequired')
            return
        }

        if (
            !Array.isArray(formData.boundary) ||
            formData.boundary.length < 3
        ) {
            setError('boundaryRequired')
            return
        }

        const verifiedArea = calculateFieldArea(
            formData.boundary,
            formData.areaUnit
        )

        if (!verifiedArea || Number(verifiedArea) <= 0) {
            setError('areaInvalid')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            await addField({
                ...formData,
                fieldName: formData.fieldName.trim(),
                fieldArea: Number(verifiedArea),
                fieldLocation: formData.fieldLocation.trim(),
                soilType: formData.soilType.trim(),
                currentCrop: formData.currentCrop?.trim() || '',
                irrigationType: formData.irrigationType || '',
            })

            showToast(t('success'), 'success')
            navigate('/fields')
        } catch (err) {
            console.error('Field registration failed:', err)

            setError(
                err.response?.data?.message
                    ? 'saveFailed'
                    : 'saveFailed'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const areaInSquareMetres =
        Number(formData.fieldArea) *
        (AREA_CONVERSIONS[formData.areaUnit] || 0)

    const showLargeAreaWarning =
        Number.isFinite(areaInSquareMetres) &&
        areaInSquareMetres > AREA_CONVERSIONS.acre * 100

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8">

            <Link
                to="/fields"
                className="inline-flex items-center gap-2 text-sm text-[#718071] hover:text-[#174B35] mb-6 transition-colors"
            >
                <ArrowLeft size={17} />
                {t('back')}
            </Link>

            <div className="mb-7">
                <p className="text-xs font-semibold tracking-wider text-[#347052] mb-2">
                    {t('registration')}
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#263D30]">
                    {t('heading')}
                </h1>

                <p className="text-sm text-[#829187] mt-2">
                    {t('description')}
                </p>
            </div>

            <div className="w-full bg-white border border-[#E5EAE1] rounded-2xl shadow-sm overflow-hidden">

                <div className="px-5 sm:px-7 py-5 border-b border-[#E5EAE1]">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-base font-semibold text-[#263D30]">
                                {t('basicInfo')}
                            </h2>

                            <p className="text-xs text-[#829187] mt-1">
                                {t('step')}
                            </p>
                        </div>

                        <span className="text-xs font-medium text-[#347052]">
                            {t('completed')}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-[#347052]" />
                        <div className="h-1.5 flex-1 rounded-full bg-[#E5EAE1]" />
                        <div className="h-1.5 flex-1 rounded-full bg-[#E5EAE1]" />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5 sm:p-7 space-y-6">

                        {/* Field Name */}
                        <div className="space-y-2">
                            <label
                                htmlFor="fieldName"
                                className="block text-sm font-medium text-[#344334]"
                            >
                                {t('fieldName')}{' '}
                                <span className="text-red-500">
                                    {t('required')}
                                </span>
                            </label>

                            <input
                                id="fieldName"
                                name="fieldName"
                                type="text"
                                value={formData.fieldName}
                                onChange={handleChange}
                                placeholder={t('fieldPlaceholder')}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] text-sm text-[#344334] placeholder:text-[#A0AAA0] outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10 transition-all"
                            />
                        </div>

                        {/* Farm Area and Unit */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                                <label
                                    htmlFor="fieldArea"
                                    className="block text-sm font-medium text-[#344334]"
                                >
                                    {t('farmArea')}
                                </label>

                                <input
                                    id="fieldArea"
                                    name="fieldArea"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={formData.fieldArea}
                                    readOnly
                                    placeholder={t('drawBoundary')}
                                    className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] bg-[#F7F9F6] text-sm text-[#344334] placeholder:text-[#A0AAA0] outline-none"
                                />

                                <p className="text-xs text-[#829187]">
                                    {t('autoCalculated')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="areaUnit"
                                    className="block text-sm font-medium text-[#344334]"
                                >
                                    {t('unit')}
                                </label>

                                <select
                                    id="areaUnit"
                                    name="areaUnit"
                                    value={formData.areaUnit}
                                    onChange={handleUnitChange}
                                    className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] bg-white text-sm text-[#344334] outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                >
                                    <option value="acre">{t('acres')}</option>
                                    <option value="hectare">{t('hectares')}</option>
                                    <option value="guntha">{t('guntha')}</option>
                                    <option value="bigha">{t('bigha')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Farm Location */}
                        <div className="space-y-2">
                            <label
                                htmlFor="fieldLocation"
                                className="block text-sm font-medium text-[#344334]"
                            >
                                {t('location')}{' '}
                                <span className="text-red-500">
                                    {t('required')}
                                </span>
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829187]"
                                />

                                <input
                                    id="fieldLocation"
                                    name="fieldLocation"
                                    type="text"
                                    value={formData.fieldLocation}
                                    onChange={handleChange}
                                    placeholder={t('locationPlaceholder')}
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE5DA] text-sm text-[#344334] placeholder:text-[#A0AAA0] outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Soil Type */}
                        <div className="space-y-2">
                            <label
                                htmlFor="soilType"
                                className="flex items-center gap-2 text-sm font-medium text-[#344334]"
                            >
                                <Sprout size={17} className="text-[#347052]" />
                                {t('soilType')}
                            </label>

                            <select
                                id="soilType"
                                name="soilType"
                                value={formData.soilType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] bg-white text-sm text-[#344334] outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                            >
                                <option value="">
                                    {t('selectSoil')}
                                </option>

                                {SOIL_OPTIONS.map((soil) => (
                                    <option
                                        key={soil.value}
                                        value={soil.value}
                                    >
                                        {t(soil.key)}
                                    </option>
                                ))}
                            </select>

                            <p className="text-xs text-[#829187] leading-relaxed">
                                {t('soilHelp')}
                            </p>
                        </div>

                        {/* Current Crop & Irrigation (Optional) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="currentCrop"
                                    className="block text-sm font-medium text-[#344334]"
                                >
                                    Current Crop (Optional)
                                </label>
                                <input
                                    id="currentCrop"
                                    name="currentCrop"
                                    type="text"
                                    value={formData.currentCrop}
                                    onChange={handleChange}
                                    placeholder="e.g. Wheat, Cotton, Sugarcane"
                                    className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] text-sm text-[#344334] placeholder:text-[#A0AAA0] outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="irrigationType"
                                    className="block text-sm font-medium text-[#344334]"
                                >
                                    Irrigation Type (Optional)
                                </label>
                                <select
                                    id="irrigationType"
                                    name="irrigationType"
                                    value={formData.irrigationType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-[#DCE5DA] bg-white text-sm text-[#344334] outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10"
                                >
                                    <option value="">Select irrigation (optional)</option>
                                    <option value="Drip">Drip Irrigation</option>
                                    <option value="Sprinkler">Sprinkler</option>
                                    <option value="Canal / Flood">Canal / Flood</option>
                                    <option value="Rainfed">Rainfed</option>
                                </select>
                            </div>
                        </div>

                        {/* Field Boundary */}
                        <div className="pt-5 border-t border-[#E5EAE1]">
                            <div className="flex items-center gap-2 mb-3">
                                <Map size={19} className="text-[#347052]" />

                                <h3 className="text-sm font-semibold text-[#263D30]">
                                    {t('boundary')}
                                </h3>
                            </div>

                            <p className="text-xs text-[#829187] mb-4">
                                {t('boundaryHelp')}
                            </p>

                            <FieldBoundaryMap
                                onBoundaryChange={handleBoundaryChange}
                            />

                            <p className="text-xs text-[#829187] mt-3">
                                {t('boundaryPoints')}{' '}
                                {formData.boundary.length}
                            </p>

                            {showLargeAreaWarning && (
                                <p className="text-xs text-amber-700 mt-2">
                                    {t('largeAreaWarning')}
                                </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p
                                className="text-sm text-red-600"
                                role="alert"
                            >
                                {t(error)}
                            </p>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-[#E5EAE1]">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#347052] text-white text-sm font-medium hover:bg-[#285C42] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting
                                    ? t('saving')
                                    : t('continue')}

                                <ArrowRight size={17} />
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddField
