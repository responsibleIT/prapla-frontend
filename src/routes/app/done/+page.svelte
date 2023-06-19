<script>
    import wordmark from "$lib/images/wordmark.svg";
    import Particles from "svelte-particles";
    import {loadFull} from "tsparticles";
    import applause from "$lib/sounds/applause.mp3";

    let particlesConfig = {
        "fullScreen": {
            "zIndex": 0
        },
        "emitters": {
            "position": {
                "x": 50,
                "y": 100
            },
            "rate": {
                "quantity": 10,
                "delay": 0.15
            }
        },
        "particles": {
            "color": {
                "value": [
                    "#1E00FF",
                    "#FF0061",
                    "#E1FF00",
                    "#00FF9E"
                ]
            },
            "move": {
                "decay": 0.05,
                "direction": "top",
                "enable": true,
                "gravity": {
                    "enable": true
                },
                "outModes": {
                    "top": "none",
                    "default": "destroy"
                },
                "speed": {
                    "min": 50,
                    "max": 100
                }
            },
            "number": {
                "value": 0
            },
            "opacity": {
                "value": 1
            },
            "rotate": {
                "value": {
                    "min": 0,
                    "max": 360
                },
                "direction": "random",
                "animation": {
                    "enable": true,
                    "speed": 30
                }
            },
            "tilt": {
                "direction": "random",
                "enable": true,
                "value": {
                    "min": 0,
                    "max": 360
                },
                "animation": {
                    "enable": true,
                    "speed": 30
                }
            },
            "size": {
                "value": 5,
                "animation": {
                    "enable": true,
                    "startValue": "min",
                    "count": 1,
                    "speed": 16,
                    "sync": true
                }
            },
            "roll": {
                "darken": {
                    "enable": true,
                    "value": 25
                },
                "enlighten": {
                    "enable": true,
                    "value": 25
                },
                "enable": true,
                "speed": {
                    "min": 5,
                    "max": 15
                }
            },
            "wobble": {
                "distance": 30,
                "enable": true,
                "speed": {
                    "min": -7,
                    "max": 7
                }
            },
            "shape": {
                "type": [
                    "circle",
                    "square"
                ],
                "options": {}
            }
        },
        "responsive": [
            {
                "maxWidth": 0,
                "options": {
                    "particles": {
                        "move": {
                            "speed": {
                                "min": 33,
                                "max": 66
                            }
                        }
                    }
                }
            }
        ]
    };

    let particlesInit = async engine => {
        await loadFull(engine);
        new Audio(applause).play();
    };
</script>

<div class="flex flex-col items-center h-screen">
    <div class="flex flex-col h-screen justify-center items-center">
        <h1 class="text-6xl text-center">Je bent klaar</h1>
        <h1 class="text-6xl text-transparent text-center bg-clip-text bg-gradient-to-r from-red-500 via-emerald-500 to-purple-500">
            Goed zo!</h1>
    </div>
    <div class="grow"></div>
    <a href="/"
       class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"/>
        </svg>

    </a>

    <Particles
            options="{particlesConfig}"
            particlesInit="{particlesInit}"
    />
    <footer class="flex align-top justify-start w-full m-8 pl-8">
        <img src={wordmark} class="w-36" alt="wordmark">
    </footer>
</div>
