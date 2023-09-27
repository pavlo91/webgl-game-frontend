import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "../../../theme/slider.scss";
import { useAlert } from '../../../utils/context/alert'
import { GAME_STATES } from "../../../constants";
import { PlayerData } from "../../../constants/gameUI";

const Player = styled.div`
    z-index: 20;
    background-image: url("/assets/images/loading-back.png");
    background-size: cover;
    background-position: center;
    user-select: none;

    .setting {
        background-image: url("/assets/images/setting-back.png");
        background-size: 100% 100%;

        width: 60vw;
        height: 37vw;

        @media only screen and (min-width: 1920px) {
            width: 1152px;
            height: 710px;
        }

        .panel {
            .navbar {
                button {
                    aspect-ratio: 385/88;
                    background-size: 100% 100%;
                }
            }
            .value {
                border-radius: 3%/7%;
                border-top-left-radius: 0px;

                .resolutions {
                    width: 100%;
                    height: 100%;
                    background: #0d0e10;
                    color: yellow;
                    border-width: 2px;
                    border-color: #2c322f;
                }
            }
        }

        .buttons {
            button {
                aspect-ratio: 385/106;
                background-size: 100% 100%;
            }
            .apply {
                background-image: url("/assets/images/buttons/apply-inactive.png");
            }
            .default {
                background-image: url("/assets/images/buttons/default-inactive.png");
            }
            .exit {
                background-image: url("/assets/images/buttons/exit-inactive.png");
            }
        }
    }
`;

const roomInfo = [
    {
        name: "Player4",
        avata: "/assets/users/jack.png",
        color: "red",
        level: 80,
        kills: 5,
        income: 2,
        wins: 0,
        lastStands: 0,
    },
    {
        name: "Player5",
        avata: "/assets/users/jack.png",
        color: "red",
        level: 80,
        kills: 5,
        income: 2,
        wins: 0,
        lastStands: 0,
    },
];

const RoomScrollDiv = styled.div`
    height: calc(100vh - 430px);
    .scroll {
        overflow-y: scroll;

        ::-webkit-scrollbar {
            width: 7px;
            background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #000;
            border: 1px solid #ddaf41;
            border-radius: 10px;
        }
    }
`;
interface PlayerUIProps {
    setGameState: (state: number) => void;
}

const PlayerUI = ({ setGameState }: PlayerUIProps) => {
    const PlayerRef = useRef<HTMLDivElement>(null);
    const menuDownAnim = gsap.timeline();
    const [ playerName, setPlayerName ] = useState("");
    const [rooms, setRooms]: [PlayerData[], any] = useState(roomInfo);

    const { pushAlert } = useAlert()

    useEffect(() => {
        if (PlayerRef.current) {
            const setting = PlayerRef.current.childNodes[0];

            menuDownAnim.add("start").from(
                setting,
                {
                    top: "-50vw",
                    duration: 1,
                    ease: CustomEase.create(
                        "custom",
                        "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
                    ),
                },
                "start"
            );
        }
        return () => {
            menuDownAnim.kill();
        };
    }, []);

    const exit = () => {
        menuDownAnim.reverse();

        gsap.delayedCall(1, () => {
            setGameState(GAME_STATES.GAME_MENU);
        });
    };

    const startMultiPlay = () => {
        
        if(playerName === ""){
            pushAlert({
                type: 'alert',
                title: 'Player Name',
                message: 'Please enter player name.',
                })
            return false;
        } 
        
        menuDownAnim.reverse();

        gsap.delayedCall(1, () => {
            setGameState(GAME_STATES.GAME_MENU);
        });
    };

    return (
        <Player
            className="absolute top-0 left-0 w-full h-full flex justify-center"
            ref={PlayerRef}
        >
            <div className="setting relative top-[50%] translate-y-[-50%] flex flex-col items-center">
                <div className="panel relative w-[80%] h-[64%] top-[17%]  flex flex-col">
                    <div className="navbar relative w-[100%] h-[8%] flex">
                    </div>
                    <div className="value relative w-[100%] h-[92%] border-[2px] border-[#ad794a] bg-[#0004] flex justify-center items-center">
                        <div className="relative h-[80%] w-[80%] flex flex-col">
                            <RoomScrollDiv className="players relative ff-round">
                                <div className="w-full h-full text-center border-separate border-spacing-y-[15px] flex flex-col gap-[5px]">
                                    <div className="head text-[#ecea8c] text-[17.4px] flex">
                                        <div className="w-[50%]">Room Name</div>
                                        <div className="w-[25%]">Capacity</div>
                                        <div className="w-[25%]">Current</div>
                                    </div>
                                    <div className="scroll">
                                        {rooms.map(
                                            (player: PlayerData, index: number) => (
                                                <div
                                                    style={{
                                                        color: "white",
                                                        borderRadius: "5px",
                                                        borderWidth: "2px",
                                                        borderColor: "#2c322f",
                                                    }}
                                                    key={`player${index}`}
                                                    className="text-[17.4px] bg-[#0007] flex p-1 my-2"
                                                >
                                                    <div className="w-[50%] flex items-center gap-[20%]">
                                                        <img
                                                            width={40}
                                                            src={player.avata}
                                                        />
                                                        <span>{player.name}</span>
                                                    </div>
                                                    <div className="w-[25%] flex justify-center items-center">
                                                        <span>10</span>
                                                    </div>
                                                    <div className="w-[25%] flex justify-center items-center">
                                                        <span>10</span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </RoomScrollDiv>
                            <div className="h-[20%] w-full flex justify-between items-center  ff-round fs-md">
                                <p className="text-white">Player Name</p>
                                <div className="w-[35%] h-[80%] shadow-[2px_3px_rgba(0,0,0,0.3)]">
                                    <input
                                        name="name"
                                        className="resolutions"
                                        onChange={(e) => setPlayerName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttons relative w-[50%] h-[7%] top-[20%] flex justify-between">
                    <button className="imageButton apply" onClick={startMultiPlay} />
                    <button className="imageButton exit" onClick={exit} />
                </div>
            </div>
        </Player>
    );
};

export default PlayerUI;
