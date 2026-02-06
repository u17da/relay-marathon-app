const fs = require('fs');

const csvData = `周回,太田ヨットスクールチーム,徳永ぶちｱｹﾞ♂Surfing☆スクール
1,村上 ,大橋 
2,ばっしー ,塩入 
3,稲田 ,のりぴ 
4,太田校長 ,あずあず 
5,吉永 ,山本ゆり 
6,みなみ ,三井
7,ごっちゃん ,若杉 
8,大竹 ,田湯 
9,稲田 ,のりぴ 
10,けいちゃん,山木さん
11,楢橋 ,西村 
12,高頭,あかりたん
13,村上 ,大橋 
14,稲田 ,のりぴ 
15,前田,小針
16,太田校長 ,あずあず 
17,ばっしー ,塩入 
18,ごっちゃん ,若杉 
19,稲田 ,のりぴ 
20,みなみ ,三井
21,大竹 ,田湯 
22,吉永 ,山本ゆり 
23,村上 ,大橋 
24,稲田 ,のりぴ 
25,けいちゃん,あかりたん
26,ばっしー,山木さん 
27,ごっちゃん ,若杉 
28,みなみ ,三井
29,稲田 ,のりぴ 
30,太田校長 ,あずあず`;

const lines = csvData.trim().split('\n').slice(1);

const team1Rows = [];
const team2Rows = [];

lines.forEach(line => {
    const [lap, name1, name2] = line.split(',').map(s => s.trim());
    team1Rows.push(name1);
    team2Rows.push(name2);
});

function processTeam(names) {
    const members = Array.from(new Set(names));
    const assignments = names.map(name => members.indexOf(name));
    return { members, assignments };
}

const team1 = processTeam(team1Rows);
const team2 = processTeam(team2Rows);

const runnerList = [
    {
        id: "ota",
        teamName: "太田ヨットスクールチーム",
        members: team1.members,
        assignments: team1.assignments
    },
    {
        id: "surfing",
        teamName: "徳永ぶちｱｹﾞ♂Surfing☆スクール",
        members: team2.members,
        assignments: team2.assignments
    }
];

console.log(JSON.stringify(runnerList, null, 4));
