import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Game } from "./game";
import { Loader } from "../Loader";
import AssetsManager from "./AssetsManager";
import { GAME_STATES } from "../../constants";
import GameMenuUI from "./UI/GameMenu";
import GamePlayUI from "./UI/GamePlay/GamePlay";
import GameMultiPlayUI from "./UI/GamePlay/GameMultiPlay";
import GameEndUI from "./UI/GameEnd";
import GamePauseUI from "./UI/GamePause";

import { isMobile } from "react-device-detect";
import { generateUpgrades } from "../../helper/game";
import GameSettingUI from "./UI/GameSetting";
import RoomUI from "./UI/Room";
import PlayerUI from "./UI/Player";

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

export const GameScene = () => {
    const firstRef = useRef(false);

    const canEnterGameRef = useRef() as any;

    const [loading, setLoading] = useState(true);
    const [canEnterGame, setCanEnterGame] = useState(false);
    const [currentGameState, setCurrentGameSate] = useState(0);

    // Spells that can be purhcase per round
    const [upgrades, setUpgrades] = useState(generateUpgrades());

    canEnterGameRef.current = canEnterGame;

    const [showGrid, setShowGrid] = useState(false);

    /**
     * Canvas Game Ref
     */
    const canvasDivRef = useRef(null);
    const gameRef = useRef(null) as any;
    const assetsManagerRef = useRef(null) as any;

    const createGame = useCallback(async () => {
        assetsManagerRef.current = new AssetsManager();

        await assetsManagerRef.current.loadModels();

        setCanEnterGame(true);
    }, []);

    const startGame = (flag ?: boolean, player_count : number = 3) => {
        if(flag){
            setGameState(GAME_STATES.MULTI_PLAYING);
        } else {
            playSingleGame();
        }
    };

    const playSingleGame = () => {
        if(gameRef.current) return;
        gameRef.current = new Game({
            canvas: canvasDivRef.current!,
            assetsManager: assetsManagerRef.current,
            setCurrentGameSate: setCurrentGameSate,
            setUpgrades: setUpgrades,
            players: [
                {
                    name: "Player1",
                    avata: "/assets/users/jack.png",
                    color: "red",
                    level: 80,
                    kills: 5,
                    income: 2,
                    wins: 0,
                    lastStands: 0,
                }
            ]
        });
        setGameState(GAME_STATES.SINGLE_PLAYING);
    }

    const playMultiGame = (count : number) => {
        if (Array.isArray(gameRef.current) && gameRef.current.length > 0 ) return;
        gameRef.current = new Game({
            canvas: canvasDivRef.current!,
            assetsManager: assetsManagerRef.current,
            setCurrentGameSate: setCurrentGameSate,
            setUpgrades: setUpgrades,
            players: [
                {
                    name: "Player1",
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
                    avata: "/assets/users/3.png",
                    color: "pink",
                    level: 60,
                    kills: 5,
                    income: 2,
                    wins: 0,
                    lastStands: 0,
                },
            ]
        });
        setGameState(GAME_STATES.MULTI_PLAYING);
    }

    if (isMobile && window.matchMedia("(orientation: portrait)").matches) {
        // alert("change the oriented mode to landscape");
        // let portrait = window.matchMedia("(orientation: portrait)");
        // portrait.addEventListener("change", function (e) {
        //     if (e.matches) {
        //         console.log("portrait mode");
        //     } else {
        //         console.log("landscape mode");
        //     }
        // });
    }

    useEffect(() => {
        if (firstRef.current) return;
        firstRef.current = true;

        createGame();

        /** KeyDown Eventhandler for `Press Any Key` */
        window.addEventListener("keydown", onKeyDown.bind(this));
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            // destroy Game
        };
    }, []);

    const onToggleGrid = (e: any) => {
        const isChecked = e.target.checked;
        setShowGrid(isChecked);

        const game = gameRef.current;
        if (isChecked) {
            game._sceneRenderer.addGrid();
        } else {
            game._sceneRenderer.removeGrid();
        }
    };

    const setGameState = (state: number) => {
        if (gameRef.current) {
            gameRef.current._stateManager.setState(state);
        }

        setCurrentGameSate(state);
    };

    const onKeyDown = (e: any) => {
        if (canEnterGameRef.current) {
            document
                .getElementsByClassName("loader")[0]
                .classList.add("enterGame");

            setTimeout(() => {
                setCanEnterGame(false);
                setLoading(false);

                setGameState(GAME_STATES.GAME_MENU);
            }, 3000);
        }

        if (e.key === "Pause") {
            if (currentGameState === GAME_STATES.SINGLE_PAUSE) {
                gameRef.current._stateManager.setState(GAME_STATES.SINGLE_PLAYING);
            } else if (currentGameState === GAME_STATES.MULTI_PAUSE) {
                gameRef.current._stateManager.setState(GAME_STATES.MULTI_PLAYING);
            } 
            else if (currentGameState === GAME_STATES.SINGLE_PLAYING) {
                gameRef.current._stateManager.setState(GAME_STATES.SINGLE_PAUSE);
            } else if (currentGameState === GAME_STATES.MULTI_PLAYING) {
                gameRef.current._stateManager.setState(GAME_STATES.MULTI_PAUSE);
            }
        }
    };

    const exitGameAction = () => {
        if (gameRef.current) (gameRef.current as Game).dispose();

        gameRef.current = null;

        setGameState(GAME_STATES.GAME_MENU);
    };

    const restartGameAction = () => {
        if (gameRef.current) (gameRef.current as Game).dispose();

        gameRef.current = null;

        startGame();
    };

    return (
        <Wrapper>
            {loading && <Loader canEnterGame={canEnterGame} />}

            <div ref={canvasDivRef}></div>

            {currentGameState === GAME_STATES["GAME_MENU"] ? (
                <GameMenuUI
                    setGameState={setGameState}
                    startGameAction={startGame}
                />
            ) : currentGameState === GAME_STATES.SETTING ? (
                <GameSettingUI setGameState={setGameState} />
            ) : currentGameState === GAME_STATES["SINGLE_PLAYING"] ? (
                <>
                    <GamePlayUI
                        gameRef={gameRef}
                        upgrades={upgrades}
                        setUpgrades={setUpgrades}
                    />

                    {/* <div className="absolute top-2 right-16">
                        <Toggle
                            title={"Show Grid"}
                            checked={showGrid} 
                            onChange={onToggleGrid}
                        />
                    </div> */}
                </>
            ) : currentGameState === GAME_STATES["MULTI_PLAYING"] ? (
                <>
                    <RoomUI ownerId="ski312" setGameState={setGameState} />
                </>
            ) : currentGameState === GAME_STATES["PLAYERS"] ? (
                <>
                    <PlayerUI setGameState={setGameState} />
                </>
            ) : currentGameState === GAME_STATES["SINGLE_PAUSE"] ? (
                <GamePauseUI setGameState={setGameState} />
            ) : currentGameState === GAME_STATES["END"] ? (
                <GameEndUI
                    gameRef={gameRef}
                    exitGameAction={exitGameAction}
                    restartGameAction={restartGameAction}
                />
            ) : null}
        </Wrapper>
    );
};

export default GameScene;
