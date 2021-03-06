
/**
 * A file containing selectors for
 * the GridSort
 */

function getCurrentAttribute(state, props) {
  return state[props.model].currentSortAttribute;
}

function getAttributeList(state, props) {
  if (props.model === 'games') {
    return [
      { label: 'Name', value: 'name' },
      { label: 'Price', value: 'price' },
      { label: 'Release', value: 'release' },
      { label: 'Metacritic', value: 'metacritic' },
      { label: 'Visibility Index', value: 'vindex' },
    ].sort((first, next) => { return Number(first.label > next.label) - Number(first.label < next.label); });
  } else if (props.model === 'developers') {
    return [
      { label: 'Name', value: 'name' },
      { label: 'Established', value: 'foundation' },
      { label: 'Games made', value: 'game_count' },
    ].sort((first, next) => { return Number(first.label > next.label) - Number(first.label < next.label); });
  } else if (props.model === 'articles') {
    return [
      { label: 'Developers Referenced', value: 'developer_count' },
      { label: 'Games Referenced', value: 'game_count' },
      { label: 'Published', value: 'timestamp' },
    ].sort((first, next) => { return Number(first.label > next.label) - Number(first.label < next.label); });
  }
  return [
    { label: 'An error has occurred', value: 'Could not retrieve attributes' },
  ];
}

function getSortType(state, props) {
  return state[props.model].sortType;
}

export {
  getCurrentAttribute,
  getAttributeList,
  getSortType,
};
