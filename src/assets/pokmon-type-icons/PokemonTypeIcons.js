import colorlessIcon from './colorless.png';
import darknessIcon from './darkness.png';
import dragonIcon from './dragon.png';
import fairyIcon from './fairy.png';
import fightingIcon from './fighting.png';
import fireIcon from './fire.png';
import grassIcon from './grass.png';
import lightningIcon from './lightning.png';
import metalIcon from './metal.png';
import psychicIcon from './psychic.png';
import waterIcon from './water.png';

const typeIconMap = {
  colorless: colorlessIcon,
  darkness: darknessIcon,
  dragon: dragonIcon,
  fairy: fairyIcon,
  fighting: fightingIcon,
  fire: fireIcon,
  grass: grassIcon,
  lightning: lightningIcon,
  metal: metalIcon,
  psychic: psychicIcon,
  water: waterIcon,
};

export const PokemonTypeIconImg = ({ pokemonType }) => {
  const iconSrc = typeIconMap[pokemonType?.toLowerCase()];
  if (!iconSrc) return null;

  return (
    <img
      src={iconSrc}
      alt={pokemonType}
      height="20px"
      width="20px"
      style={{ verticalAlign: 'middle' }}
    />
  );
};
