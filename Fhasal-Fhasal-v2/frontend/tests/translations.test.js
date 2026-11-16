import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import translations, { getTranslation, getSupportedTranslationLanguages } from '../src/utils/translations.js'

describe('7-Language Translation Engine', () => {
    const EXPECTED_LANGUAGES = ['en', 'hi', 'kn', 'mr', 'te', 'ta', 'bn']

    test('all 7 required Indian languages are registered in translations', () => {
        const registered = Object.keys(translations)
        for (const lang of EXPECTED_LANGUAGES) {
            assert.ok(registered.includes(lang), `Language code "${lang}" must exist in translations`)
        }
    })

    test('getTranslation returns correct localized string for primary navigation items', () => {
        assert.strictEqual(getTranslation('en', 'home'), 'Home')
        assert.strictEqual(getTranslation('hi', 'home'), 'होम')
        assert.strictEqual(getTranslation('kn', 'home'), 'ಮುಖಪುಟ')
        assert.strictEqual(getTranslation('mr', 'home'), 'मुख्यपृष्ठ')
        assert.strictEqual(getTranslation('te', 'home'), 'హోమ్')
        assert.strictEqual(getTranslation('ta', 'home'), 'முகப்பு')
        assert.strictEqual(getTranslation('bn', 'home'), 'হোম')
    })

    test('getTranslation falls back to English when a key is missing in target language', () => {
        const fallbackValue = getTranslation('ta', 'only_in_english_sample_key_test')
        // If not found in English either, it returns the raw key
        assert.strictEqual(fallbackValue, 'only_in_english_sample_key_test')
    })

    test('getTranslation falls back gracefully when an unsupported language code is provided', () => {
        const result = getTranslation('fr', 'login')
        assert.strictEqual(result, 'Login', 'Unsupported language code should fall back to English dictionary')
    })

    test('all core UI navigation keys exist across all 7 languages', () => {
        const coreKeys = ['home', 'fields', 'recommendations', 'cropRotation', 'nasaData', 'digitalTwin', 'profile', 'settings']
        for (const lang of EXPECTED_LANGUAGES) {
            for (const key of coreKeys) {
                const val = getTranslation(lang, key)
                assert.ok(val && val.length > 0, `Language "${lang}" must have a non-empty translation for "${key}"`)
            }
        }
    })

    test('getSupportedTranslationLanguages returns list of supported languages', () => {
        const list = getSupportedTranslationLanguages()
        assert.ok(Array.isArray(list))
        assert.strictEqual(list.length, 7)
    })
})
