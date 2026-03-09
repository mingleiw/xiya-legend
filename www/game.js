(function(){
  const STORY = window.STORY
  const ENEMIES = window.ENEMIES

  const SAVE_KEY = 'xiyaLegend.save.v1'

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)) }
  function rollDie(sides){ return 1 + Math.floor(Math.random()*sides) }

  function defaultState(){
    return {
      sceneId: 'start',
      hp: 100,
      exp: 0,
      gold: 0,
      level: 1,
      flags: {},
      log: []
    }
  }

  function loadState(){
    try{
      const raw = localStorage.getItem(SAVE_KEY)
      if(!raw) return defaultState()
      const s = JSON.parse(raw)
      if(!s || typeof s !== 'object') return defaultState()
      if(!s.sceneId) s.sceneId = 'start'
      if(typeof s.hp !== 'number') s.hp = 100
      if(typeof s.exp !== 'number') s.exp = 0
      if(typeof s.gold !== 'number') s.gold = 0
      if(typeof s.level !== 'number') s.level = 1
      if(!s.flags || typeof s.flags !== 'object') s.flags = {}
      if(!Array.isArray(s.log)) s.log = []
      return s
    }catch(e){
      return defaultState()
    }
  }

  function saveState(state){
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  }

  function toast(msg){
    const el = document.getElementById('toast')
    el.textContent = msg
    el.classList.add('show')
    setTimeout(()=> el.classList.remove('show'), 1400)
  }

  function levelFromExp(exp){
    let lvl = 1
    let need = 3
    let e = exp
    while(e >= need){
      e -= need
      lvl += 1
      need += 5
    }
    return lvl
  }

  function applyEffects(state, effects){
    if(!effects) return
    if(typeof effects.hp === 'number') state.hp = clamp(state.hp + effects.hp, 0, 999)
    if(typeof effects.exp === 'number') state.exp = Math.max(0, state.exp + effects.exp)
    if(typeof effects.gold === 'number') state.gold = Math.max(0, state.gold + effects.gold)

    const newLvl = levelFromExp(state.exp)
    if(newLvl > state.level){
      const diff = newLvl - state.level
      state.level = newLvl
      state.hp = clamp(state.hp + diff*10, 0, 999)
      state.log.push(`升级！等级 +${diff}，HP +${diff*10}`)
    }
  }

  function setFlags(state, flags){
    if(!flags) return
    for(const f of flags){ state.flags[f] = true }
  }

  function hasFlags(state, flags){
    if(!flags || flags.length === 0) return true
    return flags.every(f => !!state.flags[f])
  }

  function meetsRequire(state, req){
    if(!req) return true
    if(typeof req.goldAtLeast === 'number' && state.gold < req.goldAtLeast) return false
    return true
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#39;')
  }

  function restart(state){
    const fresh = defaultState()
    Object.assign(state, fresh)
    saveState(state)
    toast('重新开始')
    render(state)
  }

  function choose(state, choice){
    if(choice.action === 'restart') return restart(state)

    applyEffects(state, choice.effects)
    setFlags(state, choice.setFlags)

    if(choice.action === 'skillCheck'){
      return skillCheck(state, choice)
    }
    if(choice.action === 'fight'){
      return fight(state, choice)
    }

    if(choice.to){
      state.sceneId = choice.to
      saveState(state)
      render(state)
    }
  }

  function skillCheck(state, choice){
    const base = rollDie(6) + rollDie(6) // 2d6
    const bonus = state.level >= 3 ? 1 : 0
    const total = base + bonus
    const dc = choice.dc ?? 7
    const pass = total >= dc
    state.log.push(`${choice.skill || '判定'}：掷骰 ${total} vs DC ${dc} → ${pass ? '成功' : '失败'}`)
    state.sceneId = pass ? choice.passTo : choice.failTo
    saveState(state)
    render(state)
  }

  function fight(state, choice){
    const enemy = ENEMIES[choice.enemy]
    if(!enemy){
      state.log.push('战斗系统：敌人不存在（bug）')
      state.sceneId = choice.failTo || 'start'
      saveState(state)
      return render(state)
    }

    let heroHp = state.hp
    let enemyHp = enemy.hp

    const heroAtk = 6 + Math.floor(state.level/2)
    const heroDef = 2 + Math.floor(state.level/3)

    let rounds = 0
    while(heroHp > 0 && enemyHp > 0 && rounds < 20){
      rounds++
      const heroHit = rollDie(6) + Math.floor(heroAtk/2)
      enemyHp -= heroHit
      if(enemyHp <= 0) break
      const enemyHit = Math.max(1, enemy.atk + rollDie(4) - heroDef)
      heroHp -= enemyHit
    }

    const win = heroHp > 0 && enemyHp <= 0
    const hpLoss = state.hp - Math.max(0, heroHp)

    state.hp = clamp(heroHp, 0, 999)
    if(win){
      state.log.push(`战胜 ${enemy.name}（${rounds} 回合，HP -${hpLoss}）`)
      applyEffects(state, { exp: enemy.exp, gold: enemy.gold })
      state.sceneId = choice.passTo
    }else{
      state.log.push(`败给 ${enemy.name}（HP -${hpLoss}）`)
      state.sceneId = choice.failTo
    }

    saveState(state)
    render(state)
  }

  function exportSave(){
    const raw = localStorage.getItem(SAVE_KEY) || ''
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(raw).then(()=> toast('存档已复制')).catch(()=> toast('复制失败'))
    }else{
      prompt('复制这段存档：', raw)
    }
  }

  function importSave(state){
    const raw = prompt('粘贴存档 JSON（会覆盖当前进度）：')
    if(!raw) return
    try{
      const obj = JSON.parse(raw)
      localStorage.setItem(SAVE_KEY, JSON.stringify(obj))
      const loaded = loadState()
      Object.assign(state, loaded)
      toast('已导入存档')
      render(state)
    }catch(e){
      toast('存档格式不对')
    }
  }

  function bindUi(state){
    document.getElementById('btnRestart').onclick = () => restart(state)
    document.getElementById('btnExport').onclick = () => exportSave()
    document.getElementById('btnImport').onclick = () => importSave(state)
  }

  function render(state){
    const scene = STORY.scenes[state.sceneId]
    if(!scene){
      state.sceneId = 'start'
      saveState(state)
      return render(state)
    }

    document.getElementById('title').textContent = STORY.title
    document.getElementById('heroName').textContent = STORY.hero.name
    document.getElementById('heroTitle').textContent = STORY.hero.title
    document.getElementById('heroAvatar').textContent = STORY.hero.avatar

    document.getElementById('statLevel').textContent = String(state.level)
    document.getElementById('statHp').textContent = String(state.hp)
    document.getElementById('statExp').textContent = String(state.exp)
    document.getElementById('statGold').textContent = String(state.gold)

    document.getElementById('story').innerHTML = scene.text

    const choicesEl = document.getElementById('choices')
    choicesEl.innerHTML = ''

    const choices = (scene.choices || []).filter(c => {
      if(!hasFlags(state, c.requireFlags)) return false
      if(!meetsRequire(state, c.require)) return false
      return true
    })

    if(choices.length === 0){
      const btn = document.createElement('button')
      btn.className = 'choice-btn'
      btn.textContent = '🔁 重新开始'
      btn.onclick = () => restart(state)
      choicesEl.appendChild(btn)
      return
    }

    for(const c of choices){
      const btn = document.createElement('button')
      btn.className = 'choice-btn'
      btn.textContent = c.text
      btn.onclick = () => choose(state, c)
      choicesEl.appendChild(btn)
    }

    const logEl = document.getElementById('log')
    if(state.log.length){
      logEl.innerHTML = state.log.slice(-4).map(x => `• ${escapeHtml(x)}`).join('<br>')
      logEl.style.display = 'block'
    }else{
      logEl.style.display = 'none'
    }
  }

  const state = loadState()
  window.__xiya = state
  bindUi(state)
  render(state)
})();
