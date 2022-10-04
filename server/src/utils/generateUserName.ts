import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'

export const generateUserName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
    separator: '-',
  })
