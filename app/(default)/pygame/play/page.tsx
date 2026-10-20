import ShooterGame from "../../../components/shooter-game";
import {gameMetadata} from "../../../game/metadata";
export const metadata = gameMetadata("zh");
export default function Page() { return <ShooterGame initialLang="zh"/>; }
