export const TASKS = {
  grade8: {
    basic: [
      {
        id:"8b1",
        title:"8-сынып • Базалық: Жұп/тақ",
        statement:"n саны жұп болса 'JUP', тақ болса 'TAK' қайтарыңыз.",
        starter:`def solve(n):
    # TODO
    return ""`,
        tests:[ { args:[8], output:"JUP" }, { args:[5], output:"TAK" } ],
        hint:"n % 2 == 0"
      },
      {
        id:"8b2",
        title:"8-сынып • Базалық: 1..n қосынды",
        statement:"1-ден n-ге дейінгі қосындыны қайтарыңыз.",
        starter:`def solve(n):
    # TODO
    return 0`,
        tests:[ { args:[5], output:15 }, { args:[1], output:1 } ],
        hint:"n*(n+1)//2 немесе for"
      }
    ],
    mid: [
      {
        id:"8m1",
        title:"8-сынып • Орта: Тізімдегі жұптардың қосындысы",
        statement:"Берілген тізімдегі жұп элементтердің қосындысын қайтарыңыз.",
        starter:`def solve(arr):
    # TODO
    return 0`,
        tests:[ { args:[[1,2,3,4]], output:6 }, { args:[[7,9]], output:0 } ],
        hint:"for x in arr: if x%2==0"
      },
      {
        id:"8m2",
        title:"8-сынып • Орта: POS/NEG/ZERO",
        statement:"n>0 болса 'POS', n<0 болса 'NEG', n==0 болса 'ZERO'.",
        starter:`def solve(n):
    # TODO
    return ""`,
        tests:[ { args:[0], output:"ZERO" }, { args:[-3], output:"NEG" } ],
        hint:"үш жағдай"
      }
    ],
    advanced: [
      {
        id:"8a1",
        title:"8-сынып • Жоғары: Факториал",
        statement:"n санының факториалын есептеңіз (n=0 болса 1).",
        starter:`def solve(n):
    # TODO
    return 1`,
        tests:[ { args:[5], output:120 }, { args:[0], output:1 } ],
        hint:"for i in range(2,n+1)"
      },
      {
        id:"8a2",
        title:"8-сынып • Жоғары: Палиндром",
        statement:"Сөз палиндром болса True, әйтпесе False (кіші әріпке айналдырып).",
        starter:`def solve(s):
    # TODO
    return False`,
        tests:[ { args:["Ала"], output:true }, { args:["hello"], output:false } ],
        hint:"t=s.lower(); t==t[::-1]"
      }
    ]
  },

  grade9: {
    basic: [
      {
        id:"9b1",
        title:"9-сынып • Базалық: Минимум",
        statement:"a және b берілген. Кішісін қайтарыңыз.",
        starter:`def solve(a, b):
    # TODO
    return 0`,
        tests:[ { args:[3,9], output:3 }, { args:[10,2], output:2 } ],
        hint:"min(a,b)"
      },
      {
        id:"9b2",
        title:"9-сынып • Базалық: Санақ (count)",
        statement:"Берілген тізімде x саны неше рет кездеседі?",
        starter:`def solve(arr, x):
    # TODO
    return 0`,
        tests:[ { args:[[1,2,2,3],2], output:2 }, { args:[[5,5,5],5], output:3 } ],
        hint:"arr.count(x) немесе цикл"
      }
    ],
    mid: [
      {
        id:"9m1",
        title:"9-сынып • Орта: Ең жиі символ",
        statement:"Мәтіндегі ең жиі кездесетін символды қайтарыңыз (бірнеше болса — кез келгені).",
        starter:`def solve(s):
    # TODO
    return ""`,
        tests:[ { args:["aabccc"], output:"c" }, { args:["zzxy"], output:"z" } ],
        hint:"freq dict"
      },
      {
        id:"9m2",
        title:"9-сынып • Орта: Орташа мән",
        statement:"a және b санының арифметикалық ортасын қайтарыңыз.",
        starter:`def solve(a, b):
    # TODO
    return 0`,
        tests:[ { args:[2,4], output:3 }, { args:[10,6], output:8 } ],
        hint:"(a+b)/2"
      }
    ],
    advanced: [
      {
        id:"9a1",
        title:"9-сынып • Жоғары: Сүзгілеу (filter)",
        statement:"Тізімнен тек оң сандарды (positive) шығарып, жаңа тізім қайтарыңыз.",
        starter:`def solve(arr):
    # TODO
    return []`,
        tests:[ { args:[[-2,0,3,5,-1]], output:[3,5] } ],
        hint:"list comprehension"
      },
      {
        id:"9a2",
        title:"9-сынып • Жоғары: Ең үлкен қосынды (Kadane)",
        statement:"Тізімдегі қатар тұрған элементтердің ең үлкен қосындысын табыңыз.",
        starter:`def solve(arr):
    # TODO
    return 0`,
        tests:[ { args:[[-2,1,-3,4,-1,2,1,-5,4]], output:6 } ],
        hint:"curr=max(x,curr+x)"
      }
    ]
  }
};
