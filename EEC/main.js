var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var led1 = 0;
var led2 = 0;
var led3 = 0;
var aircon = 0;
var tv = 0;
var blind = 0;
var aircononoff = '꺼짐';
var ledonoff = new Array('꺼짐', '꺼짐', '꺼짐');
var tvonoff = '꺼짐';
var blindonoff = '내림';
var useelec = 0;
var temp = '';
var humi = '';
var accoutObj;
var light = '';
var splitstr;

function ledon1() {
    useelec += 6;
    led1 = 1;
    console.log("엘이디온1 펑션");
}

function ledon2() {
    useelec += 6;
    led2 = 1;
    console.log("엘이디온2 펑션");
}
function ledon3() {
    useelec += 6;
    led3 = 1;
    console.log("엘이디온3 펑션");
}

function ledoff1() {
    useelec -= 6;
    led1 = 0;
    console.log("엘이디옾1 펑션");
}

function ledoff2() {
    useelec -= 6;
    led2 = 0;
    console.log("엘이디옾3 펑션");
}

function ledoff3() {
    useelec -= 6;
    led3 = 0;
    console.log("엘이디옾3 펑션");
}

function airconon() {
    useelec += 1800;
    aircon = 1;
    console.log("에어콘온 펑션");
}

function airconoff() {
    useelec -= 1800;
    aircon = 0;
    console.log("에어콘옾 펑션");
}

function tvon() {
    useelec += 150;
    tv = 1;
    console.log("티비온 펑션");
}

function tvoff() {
    useelec -= 150;
    tv = 0;
    console.log("티비옾 펑션");
}


app.use(bodyParser.json());

app.get('/arduino', function (req, res) {
    accountObj = {
        led1,
        led2,
        led3,
        aircon,
        tv,
        blind
    };
    var accountStr = JSON.stringify(accountObj);

    res.json(accountObj);
    console.log(accountObj);
});

app.post('/json', function (req, res) {
    var data = req.body;
    var ip = req.ip;
    console.log(data);
    temp = data.Temperature;
    humi = data.Humidity;
    light = data.light;
});

app.get('/keyboard', function (req, res) {
    let answer = {
        "type": "buttons",
        "buttons": ["안내", "점검", "제어", "직접명령"]
    };
    res.send(answer);
});

app.post('/message', function (req, res) {
    var content = req.body.content;
    var reservation = parseInt(content);
    var half = 0;
    var time = 0;
    var hmcheck = 0;
    var hcheck = 0;
    var mcheck = 0;
    var sigan;
    if (!isNaN(reservation)) {
        if ((content.indexOf("시간") != -1 && content.indexOf("분") != -1) && (content.indexOf("후") != -1 || content.indexOf("뒤") != -1)) {
            splitstr = content.split("시간");

            time = (parseInt(splitstr[0]) * 3600000 + parseInt(splitstr[1]) * 60000);
            console.log("시간 분" + time);
            sigan = parseInt(splitstr[0]) + "시간" + parseInt(splitstr[1]) + "분 후에";
            hmcheck = 1;
        }
        else if (content.indexOf("분") != -1 && (content.indexOf("후") != -1 || content.indexOf("뒤") != -1)) {
            time = reservation * 60000;
            sigan = reservation + "분 후에 ";
            hcheck = 1;
        }
        else if (content.indexOf("시간") != -1 && (content.indexOf("후") != -1 || content.indexOf("제어") != -1)) {
            ban = 0;
            mcheck = 1;
            if (content.includes("반")) {
                half = 30 * 60000;
                ban = 1;
            }
            time = reservation * 3600000 + half;
            if (ban == 1)
                sigan = reservation + "시간 반 후에 ";
            else
                sigan = reservation + "시간 후에 ";
        }
    }
    let answer = {};

    if (content.indexOf("안내") != -1 || content.indexOf("누구") != -1 || content.indexOf("설명") != -1 || content.indexOf("안녕") != -1 || content.indexOf("도움") != -1) {
        answer = {
            "message": {
                "text": "반가워요, Energy Efficiency Chat-Bot입니다.\n당신의 집에서 사용되는 전기사용량을 알려드리고, 에너지 낭비를 막기위해 당신의 집에 있는 전기기구들을 제어해 드려요.\n다음 명령을 선택해 주세요.",
                "photo": {
                    "url": "http://www.meister.go.kr/jsp/common/w_imgView.jsp?imgPath=LNcPk%2FX66Firrzbu25F5uN7CAznj80iXHXYI21FzBJ8M0RQdUWS9vXU3fHP6dc48&fileNm=",
                    "width": 640,
                    "height": 480
                },
            },
            "keyboard": {
                "type": "buttons",
                "buttons": ["안내", "점검", "제어", "직접명령"]
            }
        };
    } else if (content.indexOf("점검") != -1) {
        if (led1 === 0) {
            ledonoff[0] = '꺼짐';
        }
        else if (led1 === 1) {
            ledonoff[0] = '켜짐';
        }
        if (led2 === 0) {
            ledonoff[1] = '꺼짐';
        }
        else if (led2 === 1) {
            ledonoff[1] = '켜짐';
        }
        if (led3 === 0) {
            ledonoff[2] = '꺼짐';
        }
        else if (led3 === 1) {
            ledonoff[2] = '켜짐';
        }
        if (aircon === 0) {
            aircononoff = '꺼짐';
        }
        else if (aircon === 1) {
            aircononoff = '켜짐';
        }
        if (tv === 0) {
            tvonoff = '꺼짐';
        }
        else if (tv === 1) {
            tvonoff = '켜짐';
        }
        if (blind === 0) {
            blindonoff = '내림';
        }
        else if (blind === 1) {
            blindonoff = '올림';
        }

        answer = {
            "message": {
                "text": "현재 집 온도는 " + temp + "도 이며 습도는 " + humi + "입니다.\n거실 전등 : " + ledonoff[0] + "\n안방1 전등 : " + ledonoff[1] + "\n안방2 전등 : " + ledonoff[2] + "\n에어컨 : " + aircononoff + "\nTV : " + tvonoff + "\n블라인드 : " + blindonoff + "\n예상 시간당 전력사용량 : " + useelec + "W" + "\n조도 : " + light,
                "photo": {
                    "url": "https://t1.daumcdn.net/cfile/tistory/277AD5335641F4253D",
                    "width": 640,
                    "height": 480
                },
                "message_button": {
                    "label": "전기요금계산",
                    "url": "http://cyber.kepco.co.kr/ckepco/front/jsp/CY/J/A/CYJAPP000.jsp"
                }
            },
            "keyboard": {
                "type": "buttons",
                "buttons": ["안내", "점검", "제어", "직접명령"]
            }
        };
    } else if (content.indexOf("제어") != -1 || content.indexOf("관리") != -1) {
        answer = {
            "message": {
                "text": "어떤 항목을 제어 하시겠습니까?",
            },
            "keyboard": {
                "type": "buttons",
                "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
            }
        };
    } else if (content.indexOf("직접명령") != -1) {
        answer = {
            "message": {
                "text": "명령해주세요. 예약은 1분 이상만 가능합니다. 예)에어컨 켜줘, 10분 뒤에 거실 불 켜줘",
            },
            "keyboard": {
                "type": "text"
            }
        };
    } else if (content.indexOf("전등") != -1 || content.indexOf("불") != -1 || content.indexOf("등") != -1) {

        if (content.indexOf("거실") != -1) {

            if (content.indexOf("켜") != -1 || content.indexOf("ON") != -1) {
                if (led1 === 1) {
                    answer = {
                        "message": {
                            "text": "이미 켜져있습니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
                else {
                    if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                        answer = {
                            "message": {
                                "text": sigan + " 전등을 ON합니다."
                            }
                        };
                        setTimeout(ledon1, time);
                    } else {
                        useelec += 6;
                        led1 = 1;
                        answer = {
                            "message": {
                                "text": "전등을 ON합니다.",
                            },
                            "keyboard": {
                                "type": "buttons",
                                "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                            }
                        };
                    }
                }
            }

            else if (content.indexOf("꺼") != -1) {
                if (led1 === 0) {
                    answer = {
                        "message": {
                            "text": "이미 꺼져있습니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
                else {
                if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                    answer = {
                        "message": {
                            "text": sigan + " 전등을 OFF합니다."
                        }
                    };
                    setTimeout(ledoff1, time);
                } else {
                    useelec -= 6;
                    led1 = 0;
                    answer = {
                        "message": {
                            "text": "전등을 OFF합니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
                }

            }
            else {
                     answer = {
                    "message": {
                        "text": "켤까요 끌까요?"
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["거실 전등 켜", "거실 전등 꺼", "직접명령", "취소"]
                    }
                };
            }
        }

        else if (content.indexOf("안방1") != -1) {

            if (content.indexOf("켜") != -1) {
                if (led2 === 1) {
                    answer = {
                        "message": {
                            "text": "이미 켜져있습니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
                else {
                    if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                        answer = {
                            "message": {
                                "text": sigan + " 전등을 ON합니다."
                            }
                        };
                        setTimeout(ledon2, time);
                    } else {
                        useelec += 6;
                        led2 = 1;
                        answer = {
                            "message": {
                                "text": "전등을 ON합니다.",
                            },
                            "keyboard": {
                                "type": "buttons",
                                "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                            }
                        };
                    }
                }
            }

            else if (content.indexOf("꺼") != -1) {
                if (led2 === 0) {
                    answer = {
                        "message": {
                            "text": "이미 꺼져있습니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
                else {
                    if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                        answer = {
                            "message": {
                                "text": sigan + " 전등을 OFF합니다."
                            }
                        };
                        setTimeout(ledoff2, time);
                    } else {
                        useelec -= 6;
                        led1 = 1;
                        answer = {
                            "message": {
                                "text": "전등을 OFF합니다.",
                            },
                            "keyboard": {
                                "type": "buttons",
                                "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                            }
                        };
                    }
                }
            }
            else {
                answer = {
                    "message": {
                        "text": "켤까요 끌까요?"
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["안방1 전등 켜", "안방1 전등 꺼", "직접명령", "취소"]
                    }
                };
            }
        }

        else if (content.indexOf("안방2") != -1) {

            if (content.indexOf("켜") != -1 || content.indexOf("ON") != -1) {
                if (led3 === 1) {
                    answer = {
                        "message": {
                            "text": "이미 켜져있습니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
                else {
                    if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                        answer = {
                            "message": {
                                "text": sigan + " 전등을 ON합니다."
                            }
                        };
                        setTimeout(ledon3, time);
                    } else {
                        useelec += 6;
                        led3 = 1;
                        answer = {
                            "message": {
                                "text": "전등을 ON합니다.",
                            },
                            "keyboard": {
                                "type": "buttons",
                                "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                            }
                        };
                    }
                }
            }

            else if (content.indexOf("꺼") != -1 || content.indexOf("OFF") != -1) {
                if (led3 === 0) {
                    answer = {
                        "message": {
                            "text": "이미 꺼져있습니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
                else {
                    if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                        answer = {
                            "message": {
                                "text": sigan + " 전등을 OFF합니다."
                            }
                        };
                        setTimeout(ledoff3, time);
                    } else {
                        useelec -= 6;
                        led3 = 0;
                        answer = {
                            "message": {
                                "text": "전등을 OFF합니다.",
                            },
                            "keyboard": {
                                "type": "buttons",
                                "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                            }
                        };
                    }
                }
            }
            else {
                answer = {
                    "message": {
                        "text": "켤까요 끌까요?"
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["안방2 전등 켜", "안방2 전등 꺼", "직접명령", "취소"]
                    }
                };
            }
        }
        else {
            answer = {
                "message": {
                    "text": "어느곳의 전등을 제어할까요?",
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["거실 전등", "안방1 전등", "안방2 전등", "직접명령", "취소"]
                }
            };
        }

    } else if (content.indexOf("에어컨") != -1) {
        if (content.indexOf("켜") != -1 || content.indexOf("ON") != -1) {
            if (aircon === 1) {
                answer = {
                    "message": {
                        "text": "이미 켜져있습니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }
            else {
                if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                    answer = {
                        "message": {
                            "text": sigan + " 에어컨을 ON합니다."
                        }
                    };
                    setTimeout(airconon, time);
                } else {
                    useelec += 1800;
                    aircon = 1;
                    answer = {
                        "message": {
                            "text": "에어컨을 ON합니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
            }
        }
        else if (content.indexOf("꺼") != -1 || content.indexOf("OFF") != -1) {
            if (aircon === 0) {
                answer = {
                    "message": {
                        "text": "이미 꺼져있습니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }
            else {
                if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                    answer = {
                        "message": {
                            "text": sigan + " 에어컨을 OFF합니다."
                        }
                    };
                    setTimeout(airconoff, time);
                } else {
                    useelec -= 1800;
                    aircon = 0;
                    answer = {
                        "message": {
                            "text": "에어컨을 OFF합니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
            }

        }
        else {
            answer = {
                "message": {
                    "text": "켤까요 끌까요?"
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["에어컨 켜", "에어컨 꺼", "직접명령", "취소"]
                }
            };
        }

    } else if (content.indexOf("TV") != -1 || content.indexOf("tv") != -1 || content.indexOf("텔레비전") != -1 || content.indexOf("티비") != -1 || content.indexOf("테레비") != -1) {
        if (content.indexOf("켜") != -1 || content.indexOf("ON") != -1) {
            if (tv === 1) {
                answer = {
                    "message": {
                        "text": "이미 켜져있습니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }
            else {
                if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                    answer = {
                        "message": {
                            "text": sigan + " TV를 ON합니다."
                        }
                    };
                    setTimeout(tvon, time);
                } else {
                    useelec += 150;
                    tv = 1;
                    answer = {
                        "message": {
                            "text": "TV를 ON합니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
            }
        }
        else if (content.indexOf("꺼") != -1) {
            if (tv === 0) {
                answer = {
                    "message": {
                        "text": "이미 꺼져있습니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }
            else {
                if (hmcheck == 1 || mcheck == 1 || hcheck == 1) {
                    answer = {
                        "message": {
                            "text": sigan + " TV를 OFF합니다."
                        }
                    };
                    setTimeout(tvoff, time);
                } else {
                    useelec -= 150;
                    tv = 0;
                    answer = {
                        "message": {
                            "text": "TV를 OFF합니다.",
                        },
                        "keyboard": {
                            "type": "buttons",
                            "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                        }
                    };
                }
            }

        }

    } else if (content.indexOf("블라인드") != -1 || content.indexOf("커튼") != -1) {
        if (content.indexOf("올") != -1) {
            if (blind === 1) {
                answer = {
                    "message": {
                        "text": "블라인드를 올립니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }
            else {
                blind = 1;
                answer = {
                    "message": {
                        "text": "블라인드를 올립니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }
        }
        else if (content.indexOf("내") != -1) {
            if (blind === 0) {
                answer = {
                    "message": {
                        "text": "블라인드를 내립니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }
            else {
                blind = 0;
                answer = {
                    "message": {
                        "text": "블라인드를 내립니다.",
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["전등", "에어컨", "TV", "블라인드", "직접명령", "취소"]
                    }
                };
            }

        }
        else {
            answer = {
                "message": {
                    "text": "내릴까요 올릴까요?"
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["블라인드 내려", "블라인드 올려", "직접명령", "취소"]
                }
            };
        }
    } else if (content.indexOf("취소") != -1) {
        answer = {
            "message": {
                "text": "명령이 취소되었습니다.",
            },
            "keyboard": {
                "type": "buttons",
                "buttons": ["안내", "점검", "제어", "직접명령"]
            }
        };
    }
    else {
        answer = {
            "message": {
                "text": "잘못된 입력입니다.",
            },
            "keyboard": {
                "type": "buttons",
                "buttons": ["안내", "점검", "제어", "직접명령"]
            }
        };
    }

    res.send(answer);
});


app.listen(3000, function () {
    console.log(`Connect 3000 port!`);
});