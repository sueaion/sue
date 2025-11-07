const SHEET_NAME = 'Tasks';

function getSheet(){
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if(!sheet){
    sheet = ss.insertSheet(SHEET_NAME);
  }
  const header = sheet.getRange(1,1,1,5).getValues()[0];
  const wanted = ['id','text','done','createdAt','updatedAt'];
  if(wanted.some((v,i)=>header[i]!==v)){
    sheet.getRange(1,1,1,5).setValues([wanted]);
  }
  return sheet;
}

function listTasks_(){
  const sh = getSheet();
  const lastRow = sh.getLastRow();
  if(lastRow < 2) return [];
  const rows = sh.getRange(2,1,lastRow-1,5).getValues();
  return rows.map(r=>({id: r[0], text: r[1], done: r[2]===true, createdAt: r[3], updatedAt: r[4]}));
}

function addTask_(text){
  const sh = getSheet();
  const id = Date.now().toString();
  const ts = new Date();
  sh.appendRow([id, text, false, ts, ts]);
  return listTasks_();
}

function toggleTask_(id, done){
  const sh = getSheet();
  const lastRow = sh.getLastRow();
  if(lastRow < 2) return listTasks_();
  const ids = sh.getRange(2,1,lastRow-1,1).getValues().map(r=>String(r[0]));
  const idx = ids.indexOf(String(id));
  if(idx >= 0){
    const row = 2 + idx;
    sh.getRange(row,3).setValue(done);
    sh.getRange(row,5).setValue(new Date());
  }
  return listTasks_();
}

function deleteTask_(id){
  const sh = getSheet();
  const lastRow = sh.getLastRow();
  if(lastRow < 2) return listTasks_();
  const ids = sh.getRange(2,1,lastRow-1,1).getValues().map(r=>String(r[0]));
  const idx = ids.indexOf(String(id));
  if(idx >= 0){
    const row = 2 + idx;
    sh.deleteRow(row);
  }
  return listTasks_();
}

function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e){
  const action = (e && e.parameter && e.parameter.action) || 'list';
  if(action === 'list'){
    return json_({ ok: true, tasks: listTasks_() });
  }
  return json_({ ok: false, error: 'unsupported_action' });
}

function doPost(e){
  const lock = LockService.getScriptLock();
  try{
    lock.tryLock(5000);
    const p = (e && e.parameter) || {};
    const action = p.action;
    if(action === 'add'){
      const text = (p.text || '').trim();
      if(!text) return json_({ ok:false, error:'empty_text' });
      return json_({ ok:true, tasks: addTask_(text) });
    }
    if(action === 'toggle'){
      const id = p.id;
      const done = String(p.done) === 'true';
      return json_({ ok:true, tasks: toggleTask_(id, done) });
    }
    if(action === 'delete'){
      const id = p.id;
      return json_({ ok:true, tasks: deleteTask_(id) });
    }
    return json_({ ok:false, error:'unsupported_action' });
  } finally {
    try{ lock.releaseLock(); }catch(err){}
  }
}

