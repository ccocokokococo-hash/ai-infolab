export const TASKS = {
  basic: [
    {
      id: "b1",
      title: "Тапсырма 1: Жұп/тақ анықтау",
      statement: "Берілген n саны жұп па, тақ па? 'JUP' немесе 'TAK' деп шығарыңыз.",
      starter: `function solve(n){\n  // TODO\n  return "";\n}\n`,
      tests: [
        { input: 8, output: "JUP" },
        { input: 5, output: "TAK" }
      ],
      hint: "n % 2 == 0 шартын қолданыңыз."
    },
    {
      id: "b2",
      title: "Тапсырма 2: 1..n қосынды",
      statement: "Берілген n үшін 1-ден n-ге дейінгі қосындыны қайтарыңыз.",
      starter: `function solve(n){\n  // TODO\n  return 0;\n}\n`,
      tests: [
        { input: 5, output: 15 },
        { input: 1, output: 1 }
      ],
      hint: "Цикл немесе n*(n+1)/2 формуласын қолдануға болады."
    },
    {
      id: "b3",
      title: "Тапсырма 3: Ең үлкен сан",
      statement: "Екі сан берілген (a, b). Үлкенін қайтарыңыз.",
      starter: `function solve(a,b){\n  // TODO\n  return 0;\n}\n`,
      tests: [
        { input: [3, 9], output: 9 },
        { input: [10, 2], output: 10 }
      ],
      hint: "if (a>b) ..."
    },
    {
      id: "b4",
      title: "Тапсырма 4: Тізімдегі элементтер саны",
      statement: "Берілген массивтің (arr) ұзындығын қайтарыңыз.",
      starter: `function solve(arr){\n  // TODO\n  return 0;\n}\n`,
      tests: [
        { input: [1,2,3], output: 3 },
        { input: [], output: 0 }
      ],
      hint: "JavaScript-та arr.length."
    }
  ],
  mid: [
    {
      id: "m1",
      title: "Тапсырма 1: Массивтегі жұп сандар қосындысы",
      statement: "arr массивіндегі жұп элементтердің қосындысын қайтарыңыз.",
      starter: `function solve(arr){\n  // TODO\n  return 0;\n}\n`,
      tests: [
        { input: [1,2,3,4], output: 6 },
        { input: [7,9,11], output: 0 }
      ],
      hint: "for цикл + if (x%2==0)."
    },
    {
      id: "m2",
      title: "Тапсырма 2: Ең жиі кездесетін символ",
      statement: "Берілген мәтінде (s) ең жиі кездесетін символды қайтарыңыз (бірнеше болса — кез келгені).",
      starter: `function solve(s){\n  // TODO\n  return \"\";\n}\n`,
      tests: [
        { input: "aabccc", output: "c" },
        { input: "zzxy", output: "z" }
      ],
      hint: "Санау үшін объект (map) қолданыңыз."
    },
    {
      id: "m3",
      title: "Тапсырма 3: Қате талдау (логикалық)",
      statement: "n>0 болса 'POS', n<0 болса 'NEG', n==0 болса 'ZERO' қайтарыңыз.",
      starter: `function solve(n){\n  // TODO\n  return \"\";\n}\n`,
      tests: [
        { input: 0, output: "ZERO" },
        { input: -3, output: "NEG" }
      ],
      hint: "3 жағдайды жеке тексеріңіз."
    },
    {
      id: "m4",
      title: "Тапсырма 4: Функцияны қолдану",
      statement: "a мен b санының орташа мәнін (арифметикалық) қайтарыңыз.",
      starter: `function solve(a,b){\n  // TODO\n  return 0;\n}\n`,
      tests: [
        { input: [2, 4], output: 3 },
        { input: [10, 6], output: 8 }
      ],
      hint: "(a+b)/2"
    }
  ],
  advanced: [
    {
      id: "a1",
      title: "Тапсырма 1: Палиндром тексеру",
      statement: "Берілген мәтін (s) палиндром болса true, болмаса false қайтарыңыз (бос орынсыз/кіші әріпке айналдырып).",
      starter: `function solve(s){\n  // TODO\n  return false;\n}\n`,
      tests: [
        { input: "Ала", output: true },
        { input: "Hello", output: false }
      ],
      hint: "s.toLowerCase(), reverse салыстыру."
    },
    {
      id: "a2",
      title: "Тапсырма 2: Ең үлкен қосынды (subarray)",
      statement: "arr массивінде қатар тұрған элементтердің ең үлкен қосындысын табыңыз (Kadane).",
      starter: `function solve(arr){\n  // TODO\n  return 0;\n}\n`,
      tests: [
        { input: [-2,1,-3,4,-1,2,1,-5,4], output: 6 },
        { input: [1,2,3], output: 6 }
      ],
      hint: "Ағымдағы қосындыны жаңартып отырыңыз."
    },
    {
      id: "a3",
      title: "Тапсырма 3: Жиілік бойынша сұрыптау",
      statement: "arr массивін элемент жиілігі аздан көпке сұрыптаңыз (тең болса — мәні бойынша).",
      starter: `function solve(arr){\n  // TODO\n  return [];\n}\n`,
      tests: [
        { input: [4,4,1,2,2,2,3], output: [1,3,4,4,2,2,2] }
      ],
      hint: "freq map + sort."
    },
    {
      id: "a4",
      title: "Тапсырма 4: Қате табу (debug)",
      statement: "Берілген n үшін факториалды есептеңіз. n=0 болса 1.",
      starter: `function solve(n){\n  // TODO\n  return 1;\n}\n`,
      tests: [
        { input: 5, output: 120 },
        { input: 0, output: 1 }
      ],
      hint: "for (let i=2; i<=n; i++) res*=i;"
    }
  ]
};
