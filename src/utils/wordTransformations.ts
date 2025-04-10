/**
 * Transforms a word based on its type and context
 * @param word The word to transform
 * @param _type The type of word (noun, verb, adjective)
 * @param context Optional context for transformation (e.g., 'plural' for nouns)
 * @returns The transformed word
 */
export const transformWord = (word: string, _type: string, context?: string): string => {
  if (context === 'plural') {
    return pluralize(word);
  }
  return word;
};

/**
 * Handles pluralization of nouns
 * @param word The word to pluralize
 * @returns The pluralized word
 */
const pluralize = (word: string): string => {
  const lowerWord = word.toLowerCase();
  
  // Words ending in 'y' after a consonant
  if (/[^aeiou]y$/i.test(lowerWord)) {
    return word.slice(0, -1) + 'ies';
  }
  
  // Words ending in 's', 'ss', 'sh', 'ch', 'x', or 'z'
  if (/[sxz]$|(sh|ch)$/i.test(lowerWord)) {
    return word + 'es';
  }
  
  // Words ending in 'f' or 'fe'
  if (/f$|fe$/i.test(lowerWord)) {
    return word.replace(/f$|fe$/, 'ves');
  }
  
  // Default case: add 's'
  return word + 's';
};

/**
 * Handles verb conjugation for third person singular
 * @param verb The verb to conjugate
 * @returns The conjugated verb
 */
export const conjugateVerb = (verb: string): string => {
  const lowerVerb = verb.toLowerCase();
  
  // Verbs ending in 'y' after a consonant
  if (/[^aeiou]y$/i.test(lowerVerb)) {
    return verb.slice(0, -1) + 'ies';
  }
  
  // Verbs ending in 's', 'ss', 'sh', 'ch', 'x', or 'z'
  if (/[sxz]$|(sh|ch)$/i.test(lowerVerb)) {
    return verb + 'es';
  }
  
  // Default case: add 's'
  return verb + 's';
}; 