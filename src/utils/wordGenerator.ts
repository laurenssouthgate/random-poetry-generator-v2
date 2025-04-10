import nouns from '../assets/nouns.json';
import verbs from '../assets/verbs.json';
import adjectives from '../assets/adjectives.json';

export type WordType = 'noun' | 'verb' | 'adjective';

/**
 * Gets a random word of the specified type from the corresponding JSON file
 * @param wordType The type of word to get ('noun', 'verb', or 'adjective')
 * @returns A random word of the specified type
 */
export const getRandomWord = (wordType: WordType): string => {
  try {
    let wordList: string[];
    
    // Select the appropriate word list based on the word type
    switch (wordType) {
      case 'noun':
        wordList = nouns;
        break;
      case 'verb':
        wordList = verbs;
        break;
      case 'adjective':
        wordList = adjectives;
        break;
      default:
        throw new Error('Invalid word type');
    }

    // Return a random word from the selected list
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  } catch (error) {
    console.error('Error getting random word:', error);
    return 'word'; // Return a fallback word if there's an error
  }
}; 