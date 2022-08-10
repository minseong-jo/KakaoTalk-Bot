java.lang.Runtime.getRuntime().exec(["su","-c","chmod -R 777 /data/data/com.kakao.talk"]).waitFor();

// DB 접근 (수정금지 시작)

const SQLiteDatabase = android.database.sqlite.SQLiteDatabase;

var db_1 = null;
var db_2 = null;

function updateDB() {
  db_1 = SQLiteDatabase.openDatabase("/data/data/com.kakao.talk/databases/KakaoTalk.db", null, SQLiteDatabase.CREATE_IF_NECESSARY);
  db_2 = SQLiteDatabase.openDatabase("/data/data/com.kakao.talk/databases/KakaoTalk2.db", null, SQLiteDatabase.CREATE_IF_NECESSARY);
}

updateDB();

// DB 접근 (수정금지 해제)

var enex_setInterval;

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
 if (msg.indexOf (":메모 ") == 0) {
   var msg = msg.substr(4);
   
   // DB read (시작)
    
  ChatData = db_1.rawQuery("SELECT * FROM chat_logs",null);
  ChatData.moveToLast();
    
  var a_type = ChatData.getString(2);
  var a_roomid = ChatData.getString(3);
  var a_userid = ChatData.getString(4);
  var a_message = ChatData.getString(5);
  var a_v = JSON.parse(ChatData.getString(13));
  var a_v_enc = a_v.enc;
  var a_message_decrypt = decrypt(a_userid,a_v_enc,a_message);
  var a_attachment = ChatData.getString(6);
    
  var USER_data_json = JSON.parse(FileStream.read("/sdcard/DB/USER_DB/" + a_roomid + "," + a_userid + ".json"));
  var ROOM_data_json = JSON.parse(FileStream.read("/sdcard/DB/ROOM_DB/" + a_roomid + ".json"));
    
  if (((ROOM_data_json == null)||(ROOM_data_json.isBan == true)||(USER_data_json == null)) == true) {
     
    return;
  }
    
  var isG_Master = USER_data_json.isG_Master;
  var isR_Master = USER_data_json.isR_Master;
  var isV_Master = USER_data_json.isV_Master;
  var isBan = USER_data_json.isBan;
  var use_count = USER_data_json.use_count;
    
  var DataBases_json = JSON.parse(FileStream.read("/sdcard/DB/PLUS_DB/DataBases.json"));
  var DataBases_Request_1 = DataBases_json.Request[0];
  var DataBases_Request_2 = DataBases_json.Request[1];
    
  // DB read (끝)

   
  var a_attachment_decrypt = decrypt(a_userid,a_v_enc,a_attachment);
  var a_attachment_decrypt_json = JSON.parse(a_attachment_decrypt);
  var a_attachment_decrypt_message = a_attachment_decrypt_json.src_message;
  
  if (a_type = "26") {
     
    if ((isG_Master == true)||(isR_Master == true)||(isV_Master == true) == true) {
    
      var a_attachment_includes_1 = a_attachment_decrypt_message.includes("입니다");
      var a_attachment_includes_2 = a_attachment_decrypt_message.includes("님");
    
      if (a_attachment_includes_1 == true) {
         
        if (a_attachment_includes_2 == true) {
           
          if (msg.length <= 50) {
             
            var read_arr = [];
            var a_attachment_decrypt_message_split = a_attachment_decrypt_message.split("] 님");
            var a_attachment_option = a_attachment_decrypt_message_split[0];       
            var a_attachment_option = a_attachment_option + "]";
            var a_attachment_option = a_attachment_option.replace(/.+\[([A-Za-z]{6})\]/, '$1');
       
            var FS_listfiles = Array.from(new java.io.File("/sdcard/DB/USER_DB/").listFiles());
            
            for (var i = 0; i < FS_listfiles.length; i++) {
              
              var JSON_option = JSON.parse(FileStream.read(FS_listfiles[i])).option_id;
              if (JSON_option == a_attachment_option) {
                
              var a = i;
              }
            }
         
           
            var b_USER_data_json = JSON.parse(FileStream.read(FS_listfiles[a]));
            b_USER_data_json.enex[b_USER_data_json.enex.length-1].memo = msg;
            replier.reply("[SYSTEM]\n메모가 완료되었습니다! 다음 입/퇴장에 표시합니다.");
            FileStream.write(FS_listfiles[a],JSON.stringify(b_USER_data_json));
                       
          } else {
             
            replier.reply("[SYSTEM]\n메모는 최대 50글자까지 입력할 수 있습니다.");
          }
        }
      }
    }
  }
 }
}

/// decrypt ///

const dream_arr1 = ['adrp.ldrsh.ldnp', 'ldpsw', 'umax', 'stnp.rsubhn', 'sqdmlsl', 'uqrshl.csel', 'sqshlu', 'umin.usubl.umlsl', 'cbnz.adds', 'tbnz', 'usubl2', 'stxr', 'sbfx', 'strh', 'stxrb.adcs', 'stxrh', 'ands.urhadd', 'subs', 'sbcs', 'fnmadd.ldxrb.saddl', 'stur', 'ldrsb', 'strb', 'prfm', 'ubfiz', 'ldrsw.madd.msub.sturb.ldursb', 'ldrb', 'b.eq', 'ldur.sbfiz', 'extr', 'fmadd', 'uqadd', 'sshr.uzp1.sttrb', 'umlsl2', 'rsubhn2.ldrh.uqsub', 'uqshl', 'uabd', 'ursra', 'usubw', 'uaddl2', 'b.gt', 'b.lt', 'sqshl', 'bics', 'smin.ubfx', 'smlsl2', 'uabdl2', 'zip2.ssubw2', 'ccmp', 'sqdmlal', 'b.al', 'smax.ldurh.uhsub', 'fcvtxn2', 'b.pl'],
dream_arr2 = ['saddl', 'urhadd', 'ubfiz.sqdmlsl.tbnz.stnp', 'smin', 'strh', 'ccmp', 'usubl', 'umlsl', 'uzp1', 'sbfx', 'b.eq', 'zip2.prfm.strb', 'msub', 'b.pl', 'csel', 'stxrh.ldxrb', 'uqrshl.ldrh', 'cbnz', 'ursra', 'sshr.ubfx.ldur.ldnp', 'fcvtxn2', 'usubl2', 'uaddl2', 'b.al', 'ssubw2', 'umax', 'b.lt', 'adrp.sturb', 'extr', 'uqshl', 'smax', 'uqsub.sqshlu', 'ands', 'madd', 'umin', 'b.gt', 'uabdl2', 'ldrsb.ldpsw.rsubhn', 'uqadd', 'sttrb', 'stxr', 'adds', 'rsubhn2.umlsl2', 'sbcs.fmadd', 'usubw', 'sqshl', 'stur.ldrsh.smlsl2', 'ldrsw', 'fnmadd', 'stxrb.sbfiz', 'adcs', 'bics.ldrb', 'ldursb', 'subs.uhsub', 'ldurh', 'uabd', 'sqdmlal'];

function dream(param){
    return dream_arr1[param % 54] + '.' + dream_arr2[(param + 31) % 57];
}
/* DREAM END */
function toByteArray(bytes) {
   let res = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, bytes.length);
   for (let i = 0; i < bytes.length; i ++) {
      res[i] = new java.lang.Integer(bytes[i]).byteValue();
   }
   return res;
}
function toCharArray(chars) {
   return String.fromCharCode.apply(null, chars).split('');
}

function decrypt(userId, enc, text) {
   if(text == null) return null;
   try {
      decrypt.cipher.init(2, new javax.crypto.spec.SecretKeySpec(javax.crypto.SecretKeyFactory.getInstance('PBEWITHSHAAND256BITAES-CBC-BC').generateSecret(new javax.crypto.spec.PBEKeySpec(decrypt.password, new java.lang.String((decrypt.prefixes[enc] + userId).slice(0, 16).padEnd(16, '\0')).getBytes('UTF-8'), 2, 256)).getEncoded(), 'AES'), new javax.crypto.spec.IvParameterSpec(decrypt.iv));
      return '' + new java.lang.String(decrypt.cipher.doFinal(java.util.Base64.getDecoder().decode(text)), 'UTF-8');
   } catch (e) {
      Log.error(e.lineNumber + ': ' + e);
      return null;
   }
}
decrypt.iv = toByteArray([15, 8, 1, 0, 25, 71, 37, -36, 21, -11, 23, -32, -31, 21, 12, 53]);
decrypt.password = toCharArray([22, 8, 9, 111, 2, 23, 43, 8, 33, 33, 10, 16, 3, 3, 7, 6]);
decrypt.prefixes = ['', '', '12', '24', '18', '30', '36', '12', '48', '7', '35', '40', '17', '23', '29', 'isabel', 'kale', 'sulli', 'van', 'merry', 'kyle', 'james', 'maddux', 'tony', 'hayden', 'paul', 'elijah', 'dorothy', 'sally', 'bran', dream(0xcad63)];
decrypt.cipher = javax.crypto.Cipher.getInstance('AES/CBC/PKCS5Padding');

/// decrypt /// 

/// getTimeInfo ///

function getTimeInfo(param_1) {
  /* param_1 = old time */
  
  const timeStamps = [31536000,2592000,86400,3600,60,1];
  const timeString = ['년 ','개월 ','일 ','시간 ','분 ','초 '];
  
  let timeValue = [];
  
  var date = new Date().getTime();
  var data_split = param_1.split(" ");
  var data_1 = String(data_split[0]).replace("[","");
  var data_2 = String(data_split[1]).replace("]","");;
  
  var data_1_split = data_1.split("-");
  var data_1_year = Number(data_1_split[0]);
  var data_1_month = Number(data_1_split[1]);
  var data_1_day = Number(data_1_split[2]);
  
  var data_2_split = data_2.split(":");
  var data_2_hour = Number(data_2_split[0]);
  var data_2_min = Number(data_2_split[1]);
  var data_2_sec = Number(data_2_split[2]);
  
  var data_millisecond = new Date(Number(data_1_year),Number(Number(data_1_month) - 1),Number(data_1_day),Number(data_2_hour),Number(data_2_min),Number(data_2_sec)).getTime();

  var data_sec = Math.round(Number(date - data_millisecond) / 1000);

  if (data_sec == 0 ) { return '0초 전'; }
  
  for (v = 0, t = 0; v < 3 && t < 6; t++) {
    if (data_sec >= timeStamps[t]) {
     timeValue[v] = Math.floor(data_sec / timeStamps[t]) + timeString[t];
     var data_sec = data_sec%timeStamps[t];
     
     v++;
   } else if (v){ 
     v++;
   }
  
  }
  var result = timeValue.join('') + '전';
  return result;
  
}

/// getTimeInfo ///

/// getUserData ///

function getUserData(user_id) {

    try {
        var MY_KEY = '370514506';
        let cursor = db_2.rawQuery("SELECT * FROM friends WHERE id=" + user_id, null);
        cursor.moveToNext();
        let data = {};
        let columns = ["_id", "contact_id", "id", "type", "uuid", "phone_number", "raw_phone_number", "name", "phonetic_name", "profle_image_url", "full_profile_image_url", "original_profile_image_url", "status_message", "chat_id", "brand_new", "blocked", "favorite", "position", "v", "board_v", "ext", "nick_name", "user_type", "story_user_id", "accout_id", "linked_services", "hidden", "purged", "suspended", "member_type", "involved_chat_ids", "contact_name", "enc", "created_at", "new_badge_updated_at", "new_badge_seen_at", "status_action_token"];
        for (let i = 0; i < columns.length; i++) {
            data[columns[i]] = cursor.getString(i);
        }
        let enc = data["enc"];
        data["name"] = decrypt(MY_KEY, enc, data["name"]);
        data["profle_image_url"] = decrypt(MY_KEY, enc, data["profle_image_url"]);
        data["full_profile_image_url"] = decrypt(MY_KEY, enc, data["full_profile_image_url"]);
        data["original_profile_image_url"] = decrypt(MY_KEY, enc, data["original_profile_image_url"]);
        data["board_v"] = decrypt(MY_KEY, enc, data["board_v"]);
        data["nick_name"] = decrypt(MY_KEY, enc, data["nick_name"]);
        data["status_message"] = decrypt(MY_KEY, enc, data["status_message"]);
        data["v"] = decrypt(MY_KEY, enc, data["v"]);
        cursor.close();

        return data;

    } catch (e) {

        return null;

    }

}

/// getUserData /// 

/// getUserType /// 

function getUserType(param) {
  /* param = userid */  

  return JSON.parse(getUserdata(param)['v'])['openlink']['mt'];
}

/// getUserType ///

/// getOptionId /// 

function getOptionId() {
  
  const data = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  var option = "";
  
  var FS_listFiles = Array.from(new java.io.File("/sdcard/DB/USER_DB/").listFiles());
  
  for (var i = 0; i < 6; i++) {
    
    var num = Math.floor(Math.random()*26);
    var eng = data[num];
    var option = option + eng;
  }
  
  for (var i = 0; i < FS_listFiles.length; i++) {
    
    var FS_cource_json = JSON.parse(FileStream.read(FS_listFiles[i]));
    var FS_cource = FS_cource_json.option_id;
    
    if (FS_cource == option) {
      
      for (var i = 0; i < 6; i++) {
    
        var num = Math.floor(Math.random()*26);
        var eng = data[num];
        var option = option + eng;
      }
    }
  }
  
  return option;
}

/// getOptionId ///

/// getTime /// 

function getTime() {
  
  var date = new Date();
  var year = date.getYear() + 1900;
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  
  var result = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  
  return (result);
}

/// getTime ///

/// getEnexData ///

function getEnexData(param,param_2) {
  /* param = 입퇴장기록 json, param_2 = entrance,exit,forced */
  
  var arr = [];
  var arr_2 = [];
  
  if (param.length != 0) {
    
    for (var i = 0; i < param.length; i++) {
    
      var name = param[i].nickname;
      var type = String(param[i].type).replace("entrance","입장").replace("exit","퇴장").replace("forced","추방");
      var type_2 = String(param[i].type);
      var type_3 = String(param[i].type).replace("entrance","입장").replace("exit","퇴장").replace("forced","퇴장");
      var time = param[i].time;
      var memo = param[i].memo;
    
      if (memo == "") {
     
        var memo = "";
      } else {
      
        var memo = "메모 : " + memo;
      }
      
      if (param_2 == 'entrance') {
         
        if (type == '입장') {
      
          arr.push('entrance');
        }
      }
     
     if (param_2 == 'exit'){
     
       if (type == '퇴장') {
      
          arr.push('exit');
        }
     }
     
     if (param_2 == 'forced'){
     
       if (type == '퇴장') {
        
          arr.push('exit');
        }
      
        if (type == '추방') {
        
          arr.push('exit');
        }
     }
  
      arr_2.push("[" + type + "] " + "[" + time + "]" + "\n" + type + " 시의 닉네임 : " + name + memo);
   
    }
      var count = arr.length + 1;
    
      return [arr_2,count];
  } else {

    return ["",1];
  }
  
  /* return [a,b] // a = 입퇴장기록, b = param_2의 횟수*/
}

/// getEnexData ///

/// getEnexLast ///

function getEnexLast (param) {
  /* param = 입퇴장기록 json */
  
  if (param.length >= 1) {
    
    var reply_length = param.length - 1;
    var reply_memo = param[reply_length].memo;
    var reply_name = param[reply_length].nickname;
    var reply_date = getTimeInfo(param[reply_length].time);
                     
    if (reply_memo != "") {
      
      var reply_data = "\n\n✅ 최근기록\n𝐍𝐀𝐌𝐄 : "+ reply_name + "\n𝐌𝐄𝐌𝐎 : " + reply_memo + "\n𝐓𝐈𝐌𝐄 : " + reply_date;
      return reply_data;
    } else {
      
      var reply_data = "\n\n✅ 최근기록\n𝐍𝐀𝐌𝐄 : "+ reply_name + "\n𝐓𝐈𝐌𝐄 : " + reply_date;
      return reply_data;
    }
  } else {
    
    var reply_data = "";
    return reply_data;
  }
  
}