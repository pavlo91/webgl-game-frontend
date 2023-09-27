import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "../../../theme/slider.scss";
import { useAlert } from '../../../utils/context/alert'
import { GAME_STATES } from "../../../constants";

const Room = styled.div`
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

interface RoomUIProps {
    setGameState: (state: number) => void;
    ownerId: string;
}

const RoomUI = ({ setGameState, ownerId }: RoomUIProps) => {
    const RoomRef = useRef<HTMLDivElement>(null);
    const menuDownAnim = gsap.timeline();
    const [ playerCount, setPlayerCount ] = useState(3) as any;
    const [ roomName, setRoomName ] = useState("");
    
    const { pushAlert } = useAlert()

    useEffect(() => {
        if (RoomRef.current) {
            const setting = RoomRef.current.childNodes[0];

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

    const players = () => {
        if(roomName === ""){
            pushAlert({
                type: 'alert',
                title: 'Room Name',
                message: 'Please enter room name.',
              })
            return false;
        } 
        menuDownAnim.reverse();

        gsap.delayedCall(1, () => {
            setGameState(GAME_STATES.PLAYERS);
        });
    };

    return (
        <Room
            className="absolute top-0 left-0 w-full h-full flex justify-center"
            ref={RoomRef}
        >
            <div className="setting relative top-[50%] translate-y-[-50%] flex flex-col items-center">
                <div className="panel relative w-[80%] h-[64%] top-[17%]  flex flex-col">
                    <div className="navbar relative w-[100%] h-[8%] flex">
                    </div>
                    <div className="value relative w-[100%] h-[92%] border-[2px] border-[#ad794a] bg-[#0004] flex justify-center items-center">
                        <div className="relative h-[80%] w-[80%] flex flex-col">
                            <div className="h-[20%] w-full flex justify-between items-center  ff-round fs-md">
                                <p className="text-white">Player Count</p>
                                <div className="w-[35%] h-[80%] shadow-[2px_3px_rgba(0,0,0,0.3)]">
                                    <select
                                        name="Player Count"
                                        className="resolutions"
                                        onChange={(e) => setPlayerCount(e.target.value)}
                                    >
                                        <option value="3">
                                            3
                                        </option>
                                        <option value="5">
                                            5
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="h-[20%] w-full flex justify-between items-center  ff-round fs-md">
                                <p className="text-white">Room Name</p>
                                <div className="w-[35%] h-[80%] shadow-[2px_3px_rgba(0,0,0,0.3)]">
                                    <input
                                        name="name"
                                        className="resolutions"
                                        onChange={(e) => setRoomName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttons relative w-[50%] h-[7%] top-[20%] flex justify-between">
                    <button className="imageButton apply" onClick={players} />
                    <button className="imageButton exit" onClick={exit} />
                </div>
            </div>
        </Room>
    );
};

export default RoomUI;
