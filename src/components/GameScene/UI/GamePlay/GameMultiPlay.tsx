import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { BrowserView, MobileOnlyView, MobileView } from "react-device-detect";
import styled from "styled-components";
import { SPELLS_INFO } from "../../../../constants/spell";
import { Game } from "../../game";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";
import { PlayerData } from "../../../../constants/gameUI";

export const GradientText = styled.span`
    background: linear-gradient(to top #e56e16, #e9e502);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

interface GameMultiPlayUIProps {
    gameRef: {
        current: Game[];
    };
    upgrades: any;
    setUpgrades: any;
}

const GameMultiPlayUI = ({ gameRef, upgrades, setUpgrades }: GameMultiPlayUIProps) => {
    const [profileSpells, setProfilSpells] = useState([]) as any;

    const [playerShow, setPlayerShow]: [boolean, any] = useState(true);

    const [players, setPlayers]: [PlayerData[], any] = useState([
        {
            name: "Player1",
            room_id: "3",
            avata: "/assets/users/jack.png",
            color: "red",
            level: 80,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player2",
            room_id: "3",
            avata: "/assets/users/2.png",
            color: "blue",
            level: 90,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
        {
            name: "Player3",
            room_id: "3",
            avata: "/assets/users/3.png",
            color: "pink",
            level: 60,
            kills: 5,
            income: 2,
            wins: 0,
            lastStands: 0,
        },
    ]);

    const onClickUpgrade = (item: any, index: number, player_id : any) => {
        const gold_balance = gameRef.current[player_id]._playerState.gold;

        const price = item.cost;

        if (gold_balance < price) return;

        gameRef.current[player_id]._playerState.upgradeSpell(item);

        if (item.spellType === "Weapon") {
            const userSpells = [...profileSpells];

            const index = userSpells.findIndex(
                (spell: any) => spell.name === item.name
            );

            if (index !== -1) {
                userSpells[index].count++;
            } else {
                userSpells.push({
                    ...item,
                    count: 1,
                });
            }

            setProfilSpells(userSpells);
        }

        // Instant upgrades actions
        if (
            item.name === `Philosopher's Stone` ||
            item.name === "Cursed Treasure"
        ) {
            gameRef.current[player_id]._towerManager.sacrificeHealth(
                ((SPELLS_INFO as any)[item.propertyName] as any).sacrifiHealth
            );
            gameRef.current[player_id]._playerState.increaseUpgradeGold(item);
        }

        const newUpgrades = [...upgrades];
        (newUpgrades[index] as any).purchased = true;

        setUpgrades(newUpgrades);
    };

    // const setDetail = () => {
    //     const fieldBounding = document
    //         .querySelector(".field")
    //         ?.getBoundingClientRect() as any;
    //     setDetailPos({ x: fieldBounding.right + 10, y: fieldBounding.top });
    // };

    // useEffect(() => {
    //     setDetail();
    //     window.addEventListener("resize", setDetail);
    // }, []);

    // useEffect(() => {
    //     const detail = document.querySelector(".detail") as any;
    //     detail.style.left = `${detailPos.x}px`;
    //     detail.style.top = `${detailPos.y}px`;
    // }, [detailPos]);

    return (
        <>
            <BrowserView>
                <Desktop
                    upgrades={upgrades}
                    profileSpells={profileSpells}
                    players={players}
                    onClickUpgrade={onClickUpgrade}
                    playerShow={playerShow}
                    setPlayerShow={setPlayerShow}
                />
            </BrowserView>
            <MobileView>
                <Mobile
                    upgrades={upgrades}
                    profileSpells={profileSpells}
                    players={players}
                    onClickUpgrade={onClickUpgrade}
                    playerShow={playerShow}
                    setPlayerShow={setPlayerShow}
                />
            </MobileView>
        </>
    );
};
export default GameMultiPlayUI;
