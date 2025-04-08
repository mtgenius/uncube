import { Banned } from './banned.js';

export default function mapBannedToText(banned: Banned): string {
  switch (banned) {
    case Banned.Agency:
      return "Do not limit players' bodily agency.";
    case Banned.Conjure:
      return 'Tracking conjured cards is burdensome in paper.';
    case Banned.Consume:
      return 'Do not encourage players to consume food or beverage near the uncube.';
    case Banned.Contraption:
      return 'The uncube does not contain enough Contraptions to support this card.';
    case Banned.DamageSleeves:
      return "Do not encourage players to damage the uncube's sleeves.";
    case Banned.DeckSize100:
      return 'There are not enough cards in a sealed environment to build a 100-card deck.';
    case Banned.Dexterity:
      return 'The uncube should not require manual dexterity.';
    case Banned.Host:
      return 'The uncube does not contain enough host cards or cards with augment to support this card.';
    case Banned.KamigawaCost:
      return 'It would be too expensive to open so many Kamigawa booster packs.';
    case Banned.Kidney:
      return 'Do not encourage players to sacrifice a kidney.';
    case Banned.LydariDruid:
      return 'It would be burdensome to track the basic land type for each land.';
    case Banned.OpenMouths:
      return 'Open mouths are too difficult to identify in artwork.';
    case Banned.Outside:
      return 'Playing should not require a person outside the game.';
    case Banned.Perpetual:
      return 'Do not perpetually modify cards in the uncube.';
    case Banned.Racism:
      return 'Physical cards cannot specialize.';
    case Banned.RandomCreature:
      return 'Selecting random creature permanents is burdensome.';
    case Banned.RandomCreatureLibrary:
      return 'Selecting random creature cards from a library is burdensome.';
    case Banned.RandomPermanent:
      return 'Selecting random permanents is burdensome.';
    case Banned.RemoveSleeves:
      return 'Do not encourage players to remove uncube cards from their sleeves.';
    case Banned.Seek:
      return 'Seeking cards is mechanically burdensome in paper.';
    case Banned.Specialize:
      return 'Physical cards cannot specialize.';
    case Banned.Tear:
      return 'Do not tear uncube cards into pieces.';
    case Banned.Time:
      return 'Time mechanics are not equally balanced across impairments.';
    case Banned.Toys:
      return 'Uncube should not require toys.';
    case Banned.VisualAccessibility:
      return 'This card is not accessible to visually-impaired players.';
    case Banned.Unfun:
      return 'This card, by definition, is encouraging players not to enjoy themselves.';
  }
}
