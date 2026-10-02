export function shapeForCategory(category) {
  switch (category) {
    case 'moisturiser':
      return 'jar'
    case 'cleanser':
      return 'tube'
    case 'makeup':
      return 'compact'
    case 'mask':
      return 'puff'
    case 'serum':
      return 'dropper'
    default:
      return 'bottle'
  }
}
