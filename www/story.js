// story.js — 剧情数据（你以后主要改这个文件加内容）
// 这个文件不依赖任何构建工具：直接用 <script> 引入即可。

window.STORY = {
  title: '夕雅传说',
  hero: {
    name: '汪夕雅',
    title: '命运之子 · 光之继承者',
    avatar: '👩🦰'
  },
  scenes: {
    start: {
      id: 'start',
      text: `在遥远的艾尔德拉大陆，一位名叫<strong>汪夕雅</strong>的少女从沉睡中醒来。<br><br>
她失去了所有记忆，只记得自己的名字。身边只有一把生锈的短剑和一枚神秘的水晶。<br><br>
远处，古老的钟声响起，像是在召唤着她……<br><br>
<span class="system">（提示：你做的选择会影响属性与走向。系统会自动存档。）</span>`,
      choices: [
        { text: '🗡️ 拿起短剑，探索森林', to: 'forest_1', effects: { exp: 1 }, setFlags: ['hasSword'] },
        { text: '💎 研究神秘水晶', to: 'crystal_1', effects: { exp: 1 }, setFlags: ['hasCrystal'] },
        { text: '🔔 跟随钟声前往城镇', to: 'town_1', effects: { exp: 1 } }
      ]
    },

    forest_1: {
      id: 'forest_1',
      text: `森林的空气潮湿，树影像一群沉默的旁观者。你握紧短剑——它不锋利，但至少让你心里踏实一点。<br><br>
不远处传来窸窣声，一只“看起来很凶、但其实有点蠢”的野狼正盯着你。`,
      choices: [
        { text: '⚔️ 先下手为强（战斗）', action: 'fight', enemy: 'wolf', passTo: 'forest_win', failTo: 'forest_lose' },
        { text: '🪵 捡根木棍丢过去，转身就跑', action: 'skillCheck', skill: '敏捷', dc: 6, passTo: 'forest_escape', failTo: 'forest_bite' },
        { text: '🔙 还是先回去想想', to: 'start' }
      ]
    },
    forest_win: {
      id: 'forest_win',
      text: `你一个漂亮的侧身，短剑虽然生锈，但你手法不锈。野狼嗷呜一声，夹着尾巴跑了。<br><br>
你在地上发现一枚刻着奇怪纹路的木牌。`,
      choices: [
        { text: '🪵 拾起木牌（感觉会有用）', to: 'forest_token', setFlags: ['forestToken'], effects: { exp: 2, gold: 1 } },
        { text: '🚶 继续深入森林', to: 'forest_2', effects: { exp: 1 } },
        { text: '🏘️ 先去城镇看看', to: 'town_1' }
      ]
    },
    forest_lose: {
      id: 'forest_lose',
      text: `你冲上去的气势很足，结果脚下绊到树根——森林：1，你：0。<br><br>
野狼咬了你一口，你勉强挣脱。<br><br>
<span class="system">（HP -15）</span>`,
      choices: [
        { text: '🏃 逃回空地（保命要紧）', to: 'start', effects: { hp: -15 } },
        { text: '😤 不服！再来一次（再战）', to: 'forest_1', effects: { hp: -5 } }
      ]
    },
    forest_escape: {
      id: 'forest_escape',
      text: `木棍精准命中狼的脑门，它愣住的那一秒，你已经跑出去三条街那么远（夸张了，但确实很快）。`,
      choices: [
        { text: '😮 缓口气，看看周围', to: 'forest_2', effects: { exp: 1 } },
        { text: '🏘️ 直接去城镇', to: 'town_1' }
      ]
    },
    forest_bite: {
      id: 'forest_bite',
      text: `你刚转身就跑，狼表示：这就是我的工作时间。它追上来狠狠来了一口。<br><br>
<span class="system">（HP -10）</span>`,
      choices: [
        { text: '🏃 继续跑！（这次认真）', to: 'forest_escape', effects: { hp: -10 } },
        { text: '🔙 退回空地', to: 'start', effects: { hp: -10 } }
      ]
    },
    forest_token: {
      id: 'forest_token',
      text: `木牌温热，像是刚被谁握过。纹路隐约像一座塔，还有一个被涂抹过的名字。<br><br>
你突然有种感觉：有人在远处……等你。`,
      choices: [
        { text: '🏘️ 去城镇找线索', to: 'town_1', effects: { exp: 1 } },
        { text: '🌲 再往森林深处走走', to: 'forest_2' }
      ]
    },
    forest_2: {
      id: 'forest_2',
      text: `你穿过一片低矮灌木，发现一处倒塌的石碑。碑文几乎磨平，但仍能辨出“光”“继承者”几个字。<br><br>
这不是巧合。你喉咙发紧。`,
      choices: [
        { text: '💎 用水晶照照石碑', to: 'forest_crystal', requireFlags: ['hasCrystal'], effects: { exp: 2 } },
        { text: '🗡️ 用短剑撬开石碑缝隙', to: 'forest_pry', requireFlags: ['hasSword'], effects: { exp: 1 } },
        { text: '🏘️ 先去城镇（信息比勇气更重要）', to: 'town_1' }
      ]
    },
    forest_crystal: {
      id: 'forest_crystal',
      text: `水晶在你手心里亮起，光线顺着碑文的凹槽流动，像血管一样。<br><br>
一道微弱的声音在你脑海里响起：<br><em>“去钟声处。去塔。”</em>`,
      choices: [
        { text: '🔔 去城镇的钟楼', to: 'town_bell' },
        { text: '🏘️ 先去镇上找人问问', to: 'town_1' }
      ]
    },
    forest_pry: {
      id: 'forest_pry',
      text: `你用短剑撬开缝隙，里面掉出一枚旧银币和一张破碎的纸条：<br><br>
<em>“……别相信穿白袍的人。”</em>`,
      choices: [
        { text: '🪙 收好银币与纸条', to: 'town_1', setFlags: ['noteWhiteRobe'], effects: { gold: 3, exp: 1 } },
        { text: '🔔 去钟楼看看', to: 'town_bell' }
      ]
    },

    crystal_1: {
      id: 'crystal_1',
      text: `你捧起水晶。它像一只安静的心脏，在你的掌心缓慢跳动。<br><br>
当你凝视它时，世界的颜色微微偏离，像被人调过饱和度。`,
      choices: [
        { text: '🧠 深呼吸，继续凝视', action: 'skillCheck', skill: '精神', dc: 6, passTo: 'crystal_vision', failTo: 'crystal_headache' },
        { text: '🔔 水晶指向钟声方向，去城镇', to: 'town_1' },
        { text: '🌲 带着水晶去森林', to: 'forest_1' }
      ]
    },
    crystal_vision: {
      id: 'crystal_vision',
      text: `你的视线被拉进一段破碎的记忆：<br><br>
高塔之上，白袍人举起同样的水晶，光芒像潮水淹没城市。<br><br>
你听见有人喊你的名字：<strong>“夕雅！”</strong>`,
      choices: [
        { text: '😶 记住这个名字（夕雅）', to: 'town_1', setFlags: ['nameXiya'], effects: { exp: 2 } },
        { text: '🔔 直接去钟楼', to: 'town_bell', effects: { exp: 1 } }
      ]
    },
    crystal_headache: {
      id: 'crystal_headache',
      text: `你盯着水晶看太久，脑袋像被人轻轻敲了一下——不痛，但很烦。<br><br>
<span class="system">（HP -5）</span>`,
      choices: [
        { text: '🔔 不研究了，去城镇', to: 'town_1', effects: { hp: -5 } },
        { text: '🌲 去森林透透气', to: 'forest_1', effects: { hp: -5 } }
      ]
    },

    town_1: {
      id: 'town_1',
      text: `城镇不大，但钟楼很高。人群在广场上来来往往，像一条不停流动的河。<br><br>
一个卖面包的大叔冲你眨眼：<br><em>“小姑娘，第一次来？你这眼神……像在找回自己。”</em>`,
      choices: [
        { text: '🥖 买个面包（回血）', to: 'town_bread', effects: { gold: -1, hp: +10 }, require: { goldAtLeast: 1 } },
        { text: '🗣️ 问问钟楼和高塔的事', to: 'town_info' },
        { text: '🔔 直接去钟楼', to: 'town_bell' },
        { text: '🌲 离开城镇回森林', to: 'forest_1' }
      ]
    },
    town_bread: {
      id: 'town_bread',
      text: `你买了个热面包。第一口下去，你感觉自己又活过来了。<br><br>
大叔笑得像知道很多事，但他选择先卖面包。`,
      choices: [
        { text: '🗣️ 再问问钟楼的事', to: 'town_info' },
        { text: '🔔 去钟楼', to: 'town_bell' }
      ]
    },
    town_info: {
      id: 'town_info',
      text: `大叔压低声音：<br><br>
“钟楼里最近总有人祈祷。说什么‘光之继承者会回来’。你别怕，城镇欢迎任何……会付钱的人。”<br><br>
他又补了一句：<em>“对了，别招惹穿白袍的巡礼者。”</em>`,
      choices: [
        { text: '😐 白袍？（记一下）', to: 'town_bell', setFlags: ['warnWhiteRobe'], effects: { exp: 1 } },
        { text: '🔔 去钟楼', to: 'town_bell' }
      ]
    },
    town_bell: {
      id: 'town_bell',
      text: `你走进钟楼。钟声在木梁间回荡，像在你的骨头里敲。<br><br>
台阶尽头，一个白袍人背对着你。他转身，露出温和得过分的笑：<br><br>
<em>“终于等到你了，光之继承者。”</em>`,
      choices: [
        { text: '🧊 先装不认识（套话）', action: 'skillCheck', skill: '精神', dc: 7, passTo: 'ending_good', failTo: 'ending_bad' },
        { text: '⚔️ 不管了先打（我怕麻烦）', action: 'fight', enemy: 'acolyte', passTo: 'ending_good', failTo: 'ending_bad' },
        { text: '🏃 掉头就跑（这人笑得不对劲）', to: 'start' }
      ]
    },

    ending_good: {
      id: 'ending_good',
      text: `你稳住心神，视线扫过他袖口的纹章——和森林木牌上的塔纹一模一样。<br><br>
你没有被他的笑带走节奏。你知道：这是“故事真正开始”的地方。<br><br>
<span class="system">第一章结束（可玩版 MVP）✅<br>下一章：高塔与被涂抹的名字。</span>`,
      choices: [
        { text: '🔁 重新开始（保留你对世界的怀疑）', action: 'restart' }
      ]
    },
    ending_bad: {
      id: 'ending_bad',
      text: `你刚开口，那白袍人的水晶突然亮起。你眼前一黑，世界像被人按了静音键。<br><br>
最后一个念头是：<em>“啊……原来他笑这么假是有原因的。”</em><br><br>
<span class="system">第一章失败结局（但你获得了经验：下次别轻信笑容）</span>`,
      choices: [
        { text: '🔁 重新开始（这次更警惕）', action: 'restart' }
      ]
    }
  }
}

window.ENEMIES = {
  wolf: { name: '野狼', hp: 12, atk: 5, exp: 2, gold: 1 },
  acolyte: { name: '白袍侍者', hp: 14, atk: 6, exp: 3, gold: 2 }
}
