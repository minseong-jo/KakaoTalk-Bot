///* Resent Update 220807 *///
const update = "2022-08-07";

//*   Script Starting   *//

// 전역변수 선언 //

var Ko_Stock;
var Us_Stock;
var Exchange;
var After_Stock;
var All_fixed;
var ChatId;
var close;
var delay = 1000;
var timer;
var Json;
var repeat = "\u200b".repeat(500);

var room_id;
var user_id;
var type;
var message;
var USER_data_json;
var ROOM_data_json;
var isG_Master;
var isR_Master;
var isV_Master;
var option_id;
var isBan;
var isChange;
var log_number;
var Request_Auth;
var room;
    
// 전역변수 선언 //

// DB 접근 //

importClass(android.content.Context);
importClass(android.database.sqlite.SQLiteDatabase);
importClass(android.database.DatabaseUtils);
importClass(android.os.PowerManager);
importClass(java.lang.ProcessBuilder);
importClass(java.lang.Process);
importClass(java.io.BufferedReader);
importClass(java.util.ArrayList);
importClass(java.io.File);
importClass(org.json.JSONObject);
const _Array = java.lang.reflect.Array;
const _Byte = java.lang.Byte;
const _Integer = java.lang.Integer;
const _String = java.lang.String;
const KTPackage = 'com.kakao.talk';
const MY_KEY = '386691007';
const SdcardPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
let db = null;
let db2 = null;
let Cursor = {
   'FIELD_TYPE_BLOB': 4,
   'FIELD_TYPE_STRING': 3,
   'FIELD_TYPE_FLOAT': 2,
   'FIELD_TYPE_INTEGER': 1,
   'FIELD_TYPE_NULL': 0
};
function onStartCompile() {
  // 컴파일시 초기화
  if (timer != null) {
    
    timer.cancel();
    timer = null;
  }
  
}

function isDirectoryExists(path){
   let f = new File(path);
   return f.exists() && f.isDirectory()
}
function copyDB() {
   try {
      if(!isDirectoryExists(SdcardPath + '/KakaoTalkDB')){
         let f = new File(SdcardPath + '/KakaoTalkDB');
         f.mkdir();
      }
      var cmd = new ArrayList();
      cmd.add('su');
      cmd.add('-c');
      cmd.add('cp -R /data/data/' + KTPackage + '/databases/* ' + SdcardPath + '/KakaoTalkDB/');
      var ps = new ProcessBuilder(cmd);
      var pr = ps.start();
      pr.waitFor();
      return true;
   } catch (e) {
      Log.error(e.lineNumber + ': ' + e);
      return false;
   }
}
function connectDB() {
   copyDB();
   try {
      var kakao1 = SdcardPath + '/KakaoTalkDB/KakaoTalk.db', kakao2 = SdcardPath + '/KakaoTalkDB/KakaoTalk2.db';
      if(db != null) db.close();
      if(db2 != null) db2.close();
      db = SQLiteDatabase.openDatabase(kakao1, null, SQLiteDatabase.ENABLE_WRITE_AHEAD_LOGGING);
      db2 = SQLiteDatabase.openDatabase(kakao2, null, SQLiteDatabase.ENABLE_WRITE_AHEAD_LOGGING);
      return true;
   } catch (e) {
      Log.error(e.lineNumber + ': ' + e);
      return false;
   }
}
function sqlQuery(con, query, selectionArgs){
   if(typeof selectionArgs !== 'object') selectionArgs = [];
   let cursor = con.rawQuery(query, selectionArgs);
   let columns = cursor.getColumnNames();
   let result = [];
   if(!cursor.moveToFirst()){
      cursor.close();
      return [];
   }
   do {
      let obj = new JSONObject('{}');
      for (let i = 0; i < columns.length; i ++) {
         obj.put(columns[i], cursor.getString(i));
      }
      result.push(obj);
   }while (cursor.moveToNext());
   cursor.close();
   return result;
}

// DB 접근 //

// kakao link setting //

const kalingModule = require('kaling').Kakao();
const Kakao = new kalingModule();
Kakao.init('958048e9ffa65aa40e2e89fb353af39d','https://finance.daum.net');
Kakao.login('minseong43750@gmail.com','jominseong1!K');

// kakao link setting // 

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

  if (msg == ":처리시작") {
    
    var Ko_Stock = false;
    var Us_Stock = false;
    var All_fixed = false;
    var close = false;
    var Exchange = false;
    var After_Stock = false;
    
    if (confirm() == true) {
      
      Api.replyRoom('너굴 봇 관리방','[SYSTEM]\n메시지 처리가 시작되었습니다!');
      
      ChatData = db.rawQuery("SELECT * FROM chat_logs",null);
      ChatData.moveToLast();
      var ChatId = ChatData.getString(0);
      
      while (true) {
        
        java.lang.Thread.sleep(500);
        connectDB();
        EarthQuake();
        
        var ChatData = db.rawQuery("SELECT * FROM chat_logs",null);
        stack = getChatStack(ChatId,ChatData);  

        var ChatId = stack[0];
        var ChatJson = stack[1];
          
        for (var i = 0; i < ChatJson.length; i++) {
         
          var close = run(ChatJson[i],ChatData);
        }
        
        if (close == true) {
          
          Api.replyRoom('너굴 봇 관리방','[SYSTEM]\n메시지 처리가 종료되었습니다!');
          break;
        }
      }
    }
  }
}

//*   Script Closing   *//

//* Function Starting *//

function run (param,param_2) {
  
  try {
    
    var room_id = param.chat_id;
    var user_id = param.user_id;
    var type = param.type;
    var message = param.message;
    var attachment = param.attachment;
    
    if (attachment != null) {
      
      var attachment_json = JSON.parse(attachment);
    } else {
      
      var attachment_json = {};
    }
    
    if (type == "20") return;
    if (message == '아휴') return;
    if (message == "Wa") return;
    if (message == "wa") return;
    if (message == "포트") return;
    if (message == "제트") return;
    if (message == null) return;
    if (message == undefined) return;
    
    var room = getRoomName(room_id);
    
    if ((user_id != MY_KEY)&&(message.includes("http") == false) == true) {
      
      var USER_data_json = JSON.parse(FileStream.read("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json"));
      var ROOM_data_json = JSON.parse(FileStream.read("/sdcard/DB/ROOM_DB/" + room_id + ".json"));
    
      ////* 도움말 *////
    
      if ((message == "도움말")||(message == ":도움말")||(message == "도움")||(message == "사용법")||(message == "너굴 봇")||(message == "봇")||(message == "너굴") == true){
  
        var result = "[ 너굴 봇 도움말 ]\n\n※ 명령어를 채팅창에 입력해주세요!\n※ 최근 업데이트 : " + update + repeat + "\n\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n\n_일반 명령어_____________________\n\n┏ [종목명]\n┃ ► 국내주식 시세 정보\n┃\n┃ ㅂ[종목명]\n┃ ► 해외주식 시세 정보 \n┃\n┃ [코인]\n┃ ► 코인 시세 정보 (지원예정)\n┃\n┃\n┃\n┃ [종목명] 시간외\n┃ ► 종목별 시간외 정보 (지원예정)\n┃\n┃ :시외\n┃ ► 시간외 단일가 정보\n┃\n┃\n┃\n┃ :AI [종목명]\n┃ ► AI가 종목분석 정보를 제공합니다. (지원예정)\n┃\n┃\n┃\n┃ :지수\n┃ ► 국내지수 정보 (지원 예정)\n┃\n┃ :선물\n┃ ► 선물 정보 (지원 예정)\n┃\n┃ :환율\n┃ ► 환율 정보\n┃\n┃ :특징주\n┃ ► 장중 특징주 정보\n┃\n┃\n┃\n┃ :코드\n┃ ► 고유 식별코드 정보\n┃\n┃ :코드 [식별코드]\n┃ ► 식별코드는 1회만 변경할 수 있으며,\n┃    식별코드는 알파벳 6자리로 구성되어야합니다.\n┃\n┃\n┃\n┃ :등록\n┃ ► 기능 사용을 하려면, 등록을 꼭 하셔야합니다!\n┃\n┃\n┃\n┃ :실검\n┗ ► 실시간검색어 순위를 제공합니다 (beta)\n\n* 국내주식과 해외주식 시세정보는 실시간입니다.\n* 해외주식 프리장, 애프터장 시세는 지연시세입니다.\n* 해외주식 기능 사용 시, 종목명으로 응답하지 않으면 티커로 다시 입력해주세요!\n* 코인은 업비트에 상장된 코인만 출력됩니다.\n\n________________________________\n\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n\n_관리자 명령어_____________________\n\n┏ :방등록\n┃ ► 해당 방을 봇에 등록합니다.\n┃\n┃ :일괄등록\n┃ ► 해당 방에 있는 멤버를 모두 등록시킵니다.\n┃\n┃ :관리자등록\n┃ ► 일회용 인증키를 이용하여 관리자를 등록합니다.\n┃\n┃\n┃\n┃ :복원 user_id@enc@message\n┃ ► DB의 암호화 된 메시지를 복호화합니다.\n┃\n┃\n┃\n┃ :메모 내용\n┃ ► 입퇴장 유저에 대한 메모를 기록하고, 다음 입퇴장 시에\n┃    출력합니다.\n┃\n┃ ► 입퇴장 처리가 된 메시지를 답장 상태로 두고\n┃    입력하세요.\n┃\n┃\n┃\n┃ :처리시작\n┃ ► 메시지 처리를 시작합니다.\n┃ \n┃ :처리종료 \n┃ ► 메시지 처리를 종료합니다.\n┃\n┃\n┃\n┃ :기기정보\n┃ ► 현재 기기정보를 출력합니다.\n┃\n┃\n┃\n┃ :ev [코드]\n┗ ► eval()를 작동 시킵니다.\n________________________________\n\n▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n\n* 제공되는 모든 정보는 너굴 봇의 지적재산권입니다.\n* 너굴 봇 분양은 상단에 너굴 봇 사용방에서 문의해주세요!";
    
        Api.replyRoom(room,result);
        
        return;
      }
      
      ////* 도움말 *////
      
      ////* 입퇴장 감지 *////
      
      if (type == "0") {
        
        if (ROOM_data_json != null) {
          
          var onEnex = ROOM_data_json.onEnex;
          var message_json = JSON.parse(message);
          var message_feedtype = message_json.feedType;
          var time_now = time();
        
          if (type == 13) return;
          
          if (onEnex == true) {
            
            if (USER_data_json == null) {
              
              if (message_feedtype != "6") {
                
                var option_id = getOption();
                var obj = {
                           "name":"unknown",
                           "user_id":user_id,
                           "room_id":room_id,
                           "option_id":option_id,
                           "isSignEmail":[false,'',''],
                           "isChange":false,
                           "isG_Master":false,
                           "isR_Master":false,
                           "isV_Master":false,
                           "isBan":false,
                           "log_number":0,
                           "log_history":[],
                           "Sign_Date":time(),
                           "enex":[],
                           "Request_Auth":0
                           }
          
                FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(obj));
              } else if (message_feedtype == "6") {

                var userid_data = message.split(":");
                var userid_split_1 = userid_data[3];
                var userid_split_2 = userid_split_1.split(",");
                var user_id_6 = userid_split_2[0];
                
                var USER_data_json_6 = JSON.parse(FileStream.read("/sdcard/DB/USER_DB/" + room_id + "," + user_id_6 + ".json"));
                
                if (USER_data_json_6 == null) {
                
                  var option_id = getOption();
                  var obj = {
                             "name":"unknown",
                             "user_id":user_id_6,
                             "room_id":room_id,
                             "option_id":option_id,
                             "isSignEmail":[false,'',''],
                             "isChange":false,
                             "isG_Master":false,
                             "isR_Master":false,
                             "isV_Master":false,
                             "isBan":false,
                             "log_number":0,
                             "log_history":[],
                             "Sign_Date":time(),
                             "enex":[],
                             "Request_Auth":0
                             }
          
                  FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id_6 + ".json",JSON.stringify(obj));
                }
              }
            } 
            
            if (message_feedtype != "6") {
              
              var USER_data_json_2 = JSON.parse(FileStream.read("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json"));
              var enex = USER_data_json_2.enex;
              var option = USER_data_json_2.option_id;
              var enex_last = getEnexLast(enex);
              
              if (enex.length == 0) {
                
                if (message_feedtype == "4") {
                  
                  var nickname = message_json.members[0].nickName;
                  Api.replyRoom(room, nickname + " [" + option + "] 님\n첫 입장입니다!" + enex_last);
                    
                  var obj = {"nickname" : nickname,
                             "type" : "entrance",
                             "time" : time_now,
                             "memo" : "",
                            }
                  USER_data_json_2.enex.push(obj);
                  USER_data_json_2.name = nickname;
                  FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(USER_data_json_2));
                
                  return;
                }
                
                if (message_feedtype == "2") {
                  
                  var nickname = message_json.member.nickName;
                  Api.replyRoom(room, nickname + " [" + option + "] 님\n첫 퇴장입니다!" + enex_last);
                  
                  var obj = {"nickname" : nickname,
                             "type" : "exit",
                             "time" : time_now,
                             "memo" : "",
                            }
                  USER_data_json_2.enex.push(obj);
                  USER_data_json_2.name = nickname;
                  FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(USER_data_json_2));
                
                  return;
                }
              } else {
                
                if (message_feedtype == "4") {
                  
                  var enex_data = getEnexData(enex,"entrance");
                  var enex_join_1 = enex_data[0];
                  var enex_join_2 = enex_join_1.join("\n\n");
                  var enex_rate = enex_data[1];
            
                  var nickname = message_json.members[0].nickName;
                  Api.replyRoom(room,nickname + " [" + option + "] 님\n" + enex_rate + "번째 입장입니다!" + enex_last + repeat + "\n\n" + enex_join_2);
            
                  var obj = {"nickname" : nickname,
                             "type" : "entrance",
                             "time" : time_now,
                             "memo" : "",
                             }    
            
                  USER_data_json_2.enex.push(obj);
                  USER_data_json_2.name = nickname;
                  FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(USER_data_json_2));
                
                  return;
                }
                
                if (message_feedtype == "2") {
                  
                  var enex_data = getEnexData(enex,"exit");
                  var enex_join_1 = enex_data[0];
                  var enex_join_2 = enex_join_1.join("\n\n");
                  var enex_rate = enex_data[1];
            
                  var nickname = message_json.member.nickName;
                  Api.replyRoom(room,nickname + " [" + option + "] 님\n" + enex_rate + "번째 퇴장입니다!" + enex_last + repeat + "\n\n" + enex_join_2);
            
                  var obj = {"nickname" : nickname,
                             "type" : "exit",
                             "time" : time_now,
                             "memo" : "",
                             }    
            
                  USER_data_json_2.enex.push(obj);
                  USER_data_json_2.name = nickname;
                  FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(USER_data_json_2));
                
                  return;
                }
              }
            } else if (message_feedtype == "6") {
              
              var userid_data = message.split(":");
              var userid_split_1 = userid_data[3];
              
                 
              var userid_split_2 = userid_split_1.split(",");
              var user_id_6 = userid_split_2[0];
              
              var USER_data_json_3 = JSON.parse(FileStream.read("/sdcard/DB/USER_DB/" + room_id + "," + user_id_6 + ".json"));
          
              var option = USER_data_json_3.option_id;
              var enex = USER_data_json_3.enex;
              var enex_last = getEnexLast(enex);
              var nickname = message_json.member.nickName;
              
              if (enex.length == 0) {
                
                Api.replyRoom(room,nickname + " [" + option + "] 님\n첫 퇴장입니다!" + enex_last);
                
                var obj = {"nickname" : nickname,
                            "type" : "forced",
                            "time" : time_now,
                            "memo" : "",
                           }
                USER_data_json_3.enex.push(obj);
                USER_data_json_3.name = nickname;
                FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id_6 + ".json",JSON.stringify(USER_data_json_3));
                
                return;
              } else {
                
                var enex_data = getEnexData(enex,"forced");
                var enex_join_1 = enex_data[0];
                var enex_join_2 = enex_join_1.join("\n\n");
                var enex_rate = enex_data[1];
               
                Api.replyRoom(room,nickname + " [" + option + "] 님\n" + enex_rate +"번째 퇴장입니다!" + enex_last + repeat + "\n\n" + enex_join_2);
            
                var obj = {"nickname" : nickname,
                           "type" : "forced",
                           "time" : time_now,
                           "memo" : "",
                           }    
                USER_data_json_3.enex.push(obj);
                USER_data_json_3.name = nickname;
                FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id_6 + ".json",JSON.stringify(USER_data_json_3));
                
                return;
              }
            }
          }
        }
      }
      ////* 입퇴장 감지 *////
      
      ////* 회원관리 *////
      
      if (message == ":등록") {
      
        if (USER_data_json == null) {
        
          var option_id = getOption();
          var obj = {"name":"unknown",
                     "user_id":user_id,
                     "room_id":room_id,
                     "option_id":option_id,
                     "isSignEmail":[false,'',''],
                     "isChange":false,
                     "isG_Master":false,
                     "isR_Master":false,
                     "isV_Master":false,
                     "isBan":false,
                     "log_number":0,
                     "log_history":[],
                     "Sign_Date":time(),
                     "enex":[],
                     "Request_Auth":0
                     }
          Api.replyRoom(room,"[SYSTEM]\n등록이 완료되었습니다! [" + option_id + "]");
          FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(obj));
          
          return;
        
        } else {
          
          Api.replyRoom(room,"[SYSTEM]\n이미 등록이 되어있습니다!");
          
          return;
        }
      }
      
      ////* 회원관리 *////
      
      if (USER_data_json == null) {
        
        return;
      }
      
      var isG_Master = USER_data_json.isG_Master;
      var isR_Master = USER_data_json.isR_Master;
      var isV_Master = USER_data_json.isV_Master;
      var option_id = USER_data_json.option_id;
      var isBan = USER_data_json.isBan;
      var isChange = USER_data_json.isChange;
      var log_number = USER_data_json.log_number;
      var Request_Auth = USER_data_json.Request_Auth;
      
      ////* 관리자등록 *////
      
      if (message == ":관리자등록") {
        
        if (isG_Master != true) {
          
          var AUTH_data_json = FileStream.read("/sdcard/DB/AUTH_DB/" + user_id + ".txt");
          
          if (AUTH_data_json == null) {
            
            if (Request_Auth < 3) {
            
              var cheak = Admin_process(user_id,room_id,room,USER_data_json,Request_Auth);
              
              if (cheak != null) {
                
                setTimeout(() => {timeout_admin(cheak[0],cheak[1])},1000);
              } else {
                
                return;
              }
            } else {
            
              Api.replyRoom(room,"[SYSTEM]\n일일 인증키 전송량을 초과하였습니다!");
              
              return;
            }
          } else {
            
            Api.replyRoom(room,"[SYSTEM]\n처리되지 않은 인증키가 있습니다!\n잠시 후 다시 시도해주세요!");
            
            return;
          }
        } else {
          
          Api.replyRoom(room,"[SYSTEM]\n이미 관리자 권한이 부여되어있습니다!");
          
          return;
        }
      }
      
      if (message.indexOf (":인증") == 0) {
        
        var message_edi = message.substr(3);
        var message_edi = message_edi.replace(" ","");
        
        var AUTH_data_json = FileStream.read("/sdcard/DB/AUTH_DB/" + user_id + ".txt");
        
        if (AUTH_data_json != null) {
          
          if (AUTH_data_json == message_edi) {
            
            Api.replyRoom(room,"[SYSTEM]\n관리자로 정상등록되셨습니다!");
            Api.replyRoom("너굴 봇 관리방","[SYSTEM]\n새 관리자가 정상적으로 추가되었습니다!");

            USER_data_json["isG_Master"] = true;
            USER_data_json["Request_Auth"] = 0;
            FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(USER_data_json));
            FileStream.remove("/sdcard/DB/AUTH_DB/" + user_id + ".txt");
            return;
          } else {
            
            Api.replyRoom(room,"[SYSTEM]\n인증키가 일치하지 않습니다.");
            return;
          }
        } else {
          
          return;
        }
        return;
      }
      
      ////* 관리자등록 *////
      
      ////* 방관리 *////
      
      if (message == ":방등록") {
        
        if (ROOM_data_json == null) {
          
          if (isG_Master == true) {
            
            var option_id = option3();
            
            var obj = {"name":room,
                       "room_id":room_id,
                       "option_id":option_id,
                       "isBan":false,
                       "onInfo":false,
                       "onReply":true,
                       "onEnex":true,
                       "enex_History":[],
                       "onEQ":true,
                       "onChatLog":false,
                       "sign_date":time()
                      }
                      
            Api.replyRoom(room,"[SYSTEM]\n등록이 완료되었습니다! [" + option_id + "]");
            FileStream.write("/sdcard/DB/ROOM_DB/" + room_id + ".json",JSON.stringify(obj));
            
            return;
          } else {
           
            Api.replyRoom(room,"[SYSTEM]\n관리자 전용기능입니다!\n도움말을 참고해주세요!");
            
            return;
          }
        } else {
          
          Api.replyRoom(room,"[SYSTEM]\n이미 등록이 되어있습니다!");
          
          return;
        }
        return;
      }
      
       if (ROOM_data_json == null) {
      
        return;
      }
      
      if ((ROOM_data_json.isBan == true)||(ROOM_data_json.onReply == false)||(USER_data_json == null) == true) {
          
        return;
      }
      
      ////* 방관리 *////
      
      ////* 환율 *////
      
      if (message == ":환율") {
        
        var arr = [];
        var data_1 = org.jsoup.Jsoup.connect("https://finance.daum.net/api/exchanges/summaries")
                                        .header("referer", "https://finance.daum.net/exchanges")
                                        .ignoreContentType(true)
                                        .ignoreHttpErrors(true)
                                        .get().text();
      
        var data_1_json = JSON.parse(data_1);
      
        for (var i = 0; i < 15; i++) {
        
          var name = data_1_json.data[i].name;
          var price = data_1_json.data[i].basePrice;
          var change_1 = data_1_json.data[i].change.replace("RISE","▲").replace("FALL","▽").replace("EVEN","").replace("UPPER_LIMIT","⬆").replace("LOWER_LIMIT","⬇️");
          var change_2 = data_1_json.data[i].change.replace("RISE","+").replace("FALL","-").replace("EVEN","").replace("UPPER_LIMIT","+").replace("LOWER_LIMIT","️-");
          var changeprice = data_1_json.data[i].changePrice;
          var changerate = data_1_json.data[i].changeRate;
          var changerate = changerate * 100;
          var changerate = changerate.toFixed(2)
          var result = "\n\n" + name + "\n" + price + "원 | " + change_1 + " " + changeprice + " (" + change_2 + changerate +"%)";
          arr.push(result);
        }
        arr[4] = repeat;
      
        var arr_join = arr.join("");
        var result = "[ 환율 정보 ]" + arr_join;
        
        Api.replyRoom(room,result);
        
        return;
      }
      
      ////* 환율 *////
      
      ////* 특징주 *////
      
      if ((message == ":특징주")||(message == "특징주") == true) {
        
        var arr = [];
        
        var data = org.jsoup.Jsoup.connect("https://api.thinkpool.com/analysis/sise/issueCodeHome")
                                  .header("Content-Type", "application/json;charset=utf-8")
                                  .header("Referer", "https://www.thinkpool.com/")
                                  .ignoreContentType(true)
                                  .ignoreHttpErrors(true)
                                  .get().text();

        var data_2 = org.jsoup.Jsoup.connect("https://api.thinkpool.com//analysis/sise/issueCodeList?pno=2")
                                    .header("Content-Type", "application/json;charset=utf-8")
                                    .header("Referer", "https://www.thinkpool.com/")
                                    .ignoreContentType(true)
                                    .ignoreHttpErrors(true)
                                    .get().text();
        
        var data_3 = org.jsoup.Jsoup.connect("https://api.thinkpool.com//analysis/sise/issueCodeList?pno=3")
                                    .header("Content-Type", "application/json;charset=utf-8")
                                    .header("Referer", "https://www.thinkpool.com/")
                                    .ignoreContentType(true)
                                    .ignoreHttpErrors(true)
                                    .get().text();
        
        var data_json = JSON.parse(data);
        var data_2_json = JSON.parse(data_2);
        var data_3_json = JSON.parse(data_3);
        
        for (var i = 0; i < data_json.list.length; i++) {
          
          var date = data_json.list[i].date;

          if (i == 0) {

            if (date.includes("/") == true) {

              var date_split = date.split(" ");
              var cheaking_date = date_split[0];
            } else {

              var cheaking_date = "너굴 봇 관리방";
            }
            
          }

          var name = data_json.list[i].stockName;
          var issue = data_json.list[i].cont;
          var issue = issue.replace(/&apos;/g,"'");
          var changerate = String(String(data_json.list[i].ratio));
          
          if ((date.includes(cheaking_date) == true)||(date.includes("/") == false) == true) {
            
            if (changerate.includes("-") == true) {
              
              var emoji = "";
            } else {
              
              var emoji = "+";
            }
            
            var text = "■ " + name + " (" + emoji + changerate + "%)\n┗  " + issue;
            arr.push(text);
          }
        }
        
        for (var i = 0; i < data_2_json.list.length; i++) {
          
          var date = data_2_json.list[i].date;
          var name = data_2_json.list[i].stockName;
          var issue = data_2_json.list[i].cont;
          var issue = issue.replace(/&apos;/g,"'");
          var changerate = String(String(data_2_json.list[i].ratio));
          
          if ((date.includes(cheaking_date) == true)||(date.includes("/") == false) == true) {
            
            if (changerate.includes("-") == true) {
              
              var emoji = "";
            } else {
              
              var emoji = "+";
            }
            
            var text = "■ " + name + " (" + emoji + changerate + "%)\n┗  " + issue;
            arr.push(text);
          }
        }
        
        for (var i = 0; i < data_3_json.list.length; i++) {
          
          var date = data_3_json.list[i].date;
          var name = data_3_json.list[i].stockName;
          var issue = data_3_json.list[i].cont;
          var issue = issue.replace(/&apos;/g,"'");
          var changerate = String(String(data_3_json.list[i].ratio));
          
          if ((date.includes(cheaking_date) == true)||(date.includes("/") == false) == true) {
            
            if (changerate.includes("-") == true) {
              
              var emoji = "";
            } else {
              
              var emoji = "+";
            }
            
            var text = "■ " + name + " (" + emoji + changerate + "%)\n┗  " + issue;
            arr.push(text);
          }
        }
        
        var result = "📈 장중 특징주" + repeat + "\n\n￣￣￣￣￣￣￣￣￣￣￣￣￣￣\n\n" + arr.join("\n\n");
        Api.replyRoom(room,result);
        
        return;
      }
      
      ////* 특징주 *////

      ////* 시간외단일가 *////
    
      if ((message == ":시간외")||(message == ":시외")) {
        
        var number = ["01. ","02. ","03. ","04. ","05. ","06. ","07. ","08. ","09. ","10. ","11. ","12. ","13. ","14. ","15. ","16. ","17. ","18. ","19. ","20. "];
        var kp_up = [];
        var kp_down = [];
        var kd_up = [];
        var kd_down = [];
        
        var kp_up_data = org.jsoup.Jsoup.connect("https://finance.daum.net/api/trend/after_hours_spac?page=1&perPage=30&fieldName=changeRate&order=desc&market=KOSPI&type=CHANGE_RISE&pagination=true")
                                        .header("Content-Type", "application/json; charset=utf-8")
                                        .header("Referer", "https://finance.daum.net/domestic/after_hours")
                                        .ignoreContentType(true)
                                        .ignoreHttpErrors(true)
                                        .get().text();
        
        var kp_down_data = org.jsoup.Jsoup.connect("https://finance.daum.net/api/trend/after_hours_spac?page=1&perPage=30&fieldName=changeRate&order=asc&market=KOSPI&type=CHANGE_FALL&pagination=true")
                                           .header("Content-Type", "application/json; charset=utf-8")
                                          .header("Referer", "https://finance.daum.net/domestic/after_hours")
                                          .ignoreContentType(true)
                                          .ignoreHttpErrors(true)
                                          .get().text();
        
        var kd_up_data = org.jsoup.Jsoup.connect("https://finance.daum.net/api/trend/after_hours_spac?page=1&perPage=30&fieldName=changeRate&order=desc&market=KOSDAQ&type=CHANGE_RISE&pagination=true")
                                        .header("Content-Type", "application/json; charset=utf-8")
                                        .header("Referer", "https://finance.daum.net/domestic/after_hours")
                                        .ignoreContentType(true)
                                        .ignoreHttpErrors(true)
                                        .get().text();
        
        var kd_down_data = org.jsoup.Jsoup.connect("https://finance.daum.net/api/trend/after_hours_spac?page=1&perPage=30&fieldName=changeRate&order=asc&market=KOSDAQ&type=CHANGE_FALL&pagination=true")
                                          .header("Content-Type", "application/json; charset=utf-8")
                                          .header("Referer", "https://finance.daum.net/domestic/after_hours")
                                          .ignoreContentType(true)
                                          .ignoreHttpErrors(true)
                                          .get().text();
        
        var kp_up_json = JSON.parse(kp_up_data);
        var kp_down_json = JSON.parse(kp_down_data);
        var kd_up_json = JSON.parse(kd_up_data);
        var kd_down_json = JSON.parse(kd_down_data);
          
        for (var a = 0; a < 20; a++){
          
          var number_1 = number[a];
          var kpup_name = kp_up_json.data[a].name;
          var kpup_updown = kp_up_json.data[a].changeRate + 0;
          var kpup_updown = kpup_updown * 100;
          var kpup_updown = kpup_updown.toFixed(2);
          var kpup_voloume = kp_up_json.data[a].accTradeVolume + "";
          var kpup_voloume = kpup_voloume.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
 
          if (kpup_name.length > 7 ){
          
            var kpup_name = kpup_name.slice(0,7)
          }
          
          if (kpup_name.length < 7){
            
            var kpup_name_leng = 7 - kpup_name.length;
            var kpup_name_leng = kpup_name_leng * 3;
            
            for (var b = 0; b < kpup_name_leng; b++){
              
              var kpup_name = " " + kpup_name;    
            }
          }
          
          var kpup_info = number_1 + kpup_name + " | " +  kpup_updown + " | " + kpup_voloume;
          var kp_up_test = kp_up.push(kpup_info);
        }
        var kp_up_join = kp_up.join("\n");
        
        for (var a = 0; a < 20; a++){
      
          var number_1 = number[a];
          var kpdown_name = kp_down_json.data[a].name;
          var kpdown_updown = kp_down_json.data[a].changeRate + 0;
          var kpdown_updown = kpdown_updown * 100;
          var kpdown_updown = kpdown_updown.toFixed(2);
          var kpdown_voloume = kp_down_json.data[a].accTradeVolume + "";
          var kpdown_voloume = kpdown_voloume.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
 
          if (kpdown_name.length > 7 ){
          
            var kpdown_name = kpdown_name.slice(0,7);
          }
        
          if (kpdown_name.length < 7){
          
            var kpdown_name_leng = 7 - kpdown_name.length;
            var kpdown_name_leng = kpdown_name_leng * 3;
          
            for (var b = 0; b < kpdown_name_leng; b++){
            
              var kpdown_name = " " + kpdown_name;
              
            }
          }
        
          var kpdown_info = number_1 + kpdown_name + " | " +  kpdown_updown + " | " + kpdown_voloume;
          var kp_down_test = kp_down.push(kpdown_info);
        }
        var kp_down_join = kp_down.join("\n");
      
        for (var a = 0; a < 20; a++){
        
          var number_1 = number[a];
          var kdup_name = kd_up_json.data[a].name;
          var kdup_updown = kd_up_json.data[a].changeRate + 0;
          var kdup_updown = kdup_updown * 100;
          var kdup_updown = kdup_updown.toFixed(2);
          var kdup_voloume = kd_up_json.data[a].accTradeVolume + "";
          var kdup_voloume = kdup_voloume.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
   
          if (kdup_name.length > 7 ){
            
            var kdup_name = kdup_name.slice(0,7)
          }
          
          if (kdup_name.length < 7){
            
            var kdup_name_leng = 7 - kdup_name.length;
            var kdup_name_leng = kdup_name_leng * 3;
           
            for (var b = 0; b < kdup_name_leng; b++){
              
              var kdup_name = " " + kdup_name;
            }
          }
        
          var kdup_info = number_1 + kdup_name + " | " +  kdup_updown + " | " + kdup_voloume;
          var kd_up_test = kd_up.push(kdup_info);
        }
        var kd_up_join = kd_up.join("\n");
      
        for (var a = 0; a < 20; a++){
        
          var number_1 = number[a];
          var kddown_name = kd_down_json.data[a].name;
          var kddown_updown = kd_down_json.data[a].changeRate + 0;
          var kddown_updown = kddown_updown * 100;
          var kddown_updown = kddown_updown.toFixed(2);
          var kddown_voloume = kd_down_json.data[a].accTradeVolume + "";
          var kddown_voloume = kddown_voloume.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
   
          if (kddown_name.length > 7 ){
            
            var kddown_name = kddown_name.slice(0,7)
          }
          
          if (kddown_name.length < 7){
              
            var kddown_name_leng = 7 - kddown_name.length;
            var kddown_name_leng = kddown_name_leng * 3;
              
            for (var b = 0; b < kddown_name_leng; b++){
              
              var kddown_name = " " + kddown_name;
            }
          }
        
          var kddown_info = number_1 + kddown_name + " | " +  kddown_updown + " | " + kddown_voloume;
          var kd_down_test = kd_down.push(kddown_info);
        }
      
        var kd_down_join = kd_down.join("\n");
    
        var result = "📈 시간외단일가 정보" + repeat + "\n\n\n🔴 코스피 시간외단일가 상승률 순위\n\n" + kp_up_join + "\n\n━━━━━━━━━━━━━━━\n                       너굴\n━━━━━━━━━━━━━━━\n\n🔵 코스피 시간외단일가 하락률 순위\n\n" + kp_down_join + "\n\n━━━━━━━━━━━━━━━\n                       너굴\n━━━━━━━━━━━━━━━\n\n🔴 코스닥 시간외단일가 상승률 순위\n\n" + kd_up_join + "\n\n━━━━━━━━━━━━━━━\n                       너굴\n━━━━━━━━━━━━━━━\n\n🔵 코스닥 시간외단일가 하락률 순위\n\n" + kd_down_join;
      
        Api.replyRoom(room,result);
        
        return;
      }
      ////* 시간외단일가 *////
      
      ////* 식별코드 *////
    
      if (message.indexOf (":코드") == 0) {
      
        var message_edi = message.substr(4);
        var message_edi = message_edi.toUpperCase();
        var message_edi = message_edi.replace(" ","");
        
        if (message_edi == '') {
          
          Api.replyRoom(room,"[SYSTEM]\n식별코드는 [" + option_id + "] 입니다!");
        } else {
          
          if (option2() != false) {
            
            if (isChange != true) {
            
              var USER_data_edi = USER_data_json;
              USER_data_edi["isChange"] = false;
              USER_data_edi["option_id"] = message_edi;
             
              FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + user_id + ".json",JSON.stringify(USER_data_edi));
            } else {
              
              Api.replyRoom(room,"[SYSTEM]\n식별코드 변경불가!\n변경은 1회까지 가능합니다!");
              
              return;
            }
          } else {
            
            Api.replyRoom(room,"[SYSTEM]\n형식에 맞지 않거나, 중복되는 코드입니다!");
            
            return;
          }
        }
      }
      ////* 식별코드 *////
      
      ////* 기기정보 *////
      
      if (message == ":기기정보") {
  
        if (isG_Master == true) {
    
          var result = "[ 기기정보 ]" + repeat + "\n\n모델 : " + "Galaxy S8" + "\n안드로이드 버전 : " + Device.getAndroidVersionName() + "\n배터리 잔량 : " + Device.getBatteryLevel() + "%\n배터리 충전 : " + Device.getPlugType() + "\n배터리 온도 : " + Device.getBatteryTemperature()/10 + "\n와이파이 속도 : " + Api.getContext().getSystemService(Context.WIFI_SERVICE).getConnectionInfo().getLinkSpeed() + "Mbps\n코어 : " + java.lang.Runtime.getRuntime().availableProcessors() + "개\n총 메모리 : " + java.lang.Runtime.getRuntime().maxMemory() + "(bytes)\n여유 메모리 : " + java.lang.Runtime.getRuntime().freeMemory() + "(bytes)\n사용 메모리 : " + java.lang.Runtime.getRuntime().totalMemory() + "(bytes)\n총 저장공간 : " + java.io.File.listRoots()[0].getTotalSpace() + "(bytes)\n여유 저장공간 : " + java.io.File.listRoots()[0].getUsableSpace() + "(bytes)";
    
          Api.replyRoom(room,result);
          
          return;
        } else {
    
          Api.replyRoom(room,"[SYSTEM]\n관리자 전용기능입니다!\n도움말을 참고해주세요!");
          
          return;
        }
      }
      
      ////* 기기정보 *////
      
      ////* eval  *////
      
      if (message.indexOf (":ev") == 0) {
        
        var message_edi = message.replace(" ","");
        var message_edi = message_edi.substr(3);
          
        if (message_edi == '') {
          
          return;
        }
        
        if (isG_Master == true) {
          
          try {
            
            var result = eval(message_edi);
            Api.replyRoom(room,result);
          } catch (e) {
            
            Api.replyRoom(room,e);
          }
        } else if (isR_Master == true) {
          
          Api.replyRoom(room,"[SYSTEM]\n방장 전용 eval 기능은 수정중입니다!");
          
          return;
        } else {
          
          Api.replyRoom(room,"[SYSTEM]\n관리자 전용기능입니다!\n도움말을 참고해주세요!");
          
          return;
        }
      }
      ////* eval  *////
      
      ////* 일괄등록 *////
    
      if (message == ":일괄등록") {
         
        if (isG_Master == true) {
          
          var cheak = getRoomMembers(room_id);
          if (cheak != false) {
            
            if (String(cheak).includes(",") == true) {
              
              var members_split = String(cheak).split(",");
        
            } else {
              
              var members_split = Array(cheak);
              
            }
            for (var i = 0; i < members_split.length; i++) {
              
              var USER_data_s = JSON.parse(FileStream.read("/sdcard/DB/USER_DB/" + room_id + "," + members_split[i] + ".json"));
              if (USER_data_s == null) {
                
                var option_id = getOption();
                var obj = {"name":"unknown",
                           "user_id":user_id,
                           "room_id":room_id,
                           "option_id":option_id,
                           "isSignEmail":[false,'',''],
                           "isChange":false,
                           "isG_Master":false,
                           "isR_Master":false,
                           "isV_Master":false,
                           "isBan":false,
                           "log_number":0,
                           "log_history":[],
                           "Sign_Date":time(),
                           "enex":[]
                           }
                         
                FileStream.write("/sdcard/DB/USER_DB/" + room_id + "," + members_split[i] + ".json",JSON.stringify(obj));
                
              }
            }
            Api.replyRoom(room,"[SYSTEM]\n일괄등록이 완료되었습니다!");
            
            return;
         } else {
            
            Api.replyRoom(room,"[SYSTEM]\n등록 불가한 방이거나, 방을 찾을 수 없습니다.");
            Api.replyRoom("너굴 봇 관리방","[SYSTEM]\n에러 발생\n방" + room + "\n내용 : DB 내에 등록하려는 방이 있는지 확인하세요.");
           
            return;
          }
        } else {
          
          Api.replyRoom(room,"[SYSTEM]\n관리자 전용기능입니다!\n도움말을 참고해주세요!");
          
          return;
        }
      } 
      
      ////* 일괄등록 *////
      
      ////* 해외주식 *////
      
      if (message.indexOf ("ㅂ") == 0) {
      
        if (Us_Stock == false) {
                 
          Api.replyRoom(room,"[SYSTEM]\n 해당 기능은 점검중입니다. 🛠");
        } else {
          
          const regex = /^[0-9]+$/;
          
          var message_edi = message.substr(1);
          var message_edi = message_edi.replace(' ','');
          var message_edi = message_edi.toUpperCase();
         
          var data = org.jsoup.Jsoup.connect("https://www.google.co.kr/search?q=" + message_edi + " +주가").get().select("div");
    
          var symbol = data.select("g-card-section > div.wGt0Bc > div.zYxiUd > div.HfMth.PZPZlf > span.WuDkNe").text();
          var title = data.select("g-card-section > div.OiIFo > div > div > span").text();
          var price = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > span:nth-child(1) > span > span.IsqQVc.NprOob.wT3VGc").text();
          var change = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > span.WlRRw.IsqQVc.fw-price-up > span:nth-child(1)").text();
          var changerate = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > span.WlRRw.IsqQVc.fw-price-up > span.jBBUv").text().replace("(","");
          var high = data.select("g-card-section:nth-child(2) > div > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td.iyjjgb > div").text().replace("(","");
          var low = data.select("g-card-section:nth-child(2) > div > div > div:nth-child(1) > table > tbody > tr:nth-child(3) > td.iyjjgb > div").text().replace("(","");
          var high_52 = data.select("g-card-section:nth-child(2) > div > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td.iyjjgb > div").text().replace("(","");
          var low_52 = data.select("g-card-section:nth-child(2) > div > div > div:nth-child(3) > table > tbody > tr:nth-child(3) > td.iyjjgb > div").text().replace("(","");
          var market_price = data.select("g-card-section:nth-child(2) > div > div > div:nth-child(2) > table > tbody > tr:nth-child(1) > td.iyjjgb > div").text().replace("(","");
          var cheaking = data.select("div > div.MjUjnf.VM6qJ > div.hHq9Z > div > div:nth-child(2) > div > div > div > div.EGmpye > div.wx62f.PZPZlf.x7XAkb").text();
          var cheaking = cheaking.split(": ");
          var cheaking = cheaking[1];
          
          if (low_52 == '') {
            
            var high_52 = data.select("g-card-section:nth-child(2) > div > div > div:nth-child(3) > table > tbody > tr:nth-child(1) > td.iyjjgb > div").text().replace("(","");
            var low_52 = data.select("g-card-section:nth-child(2) > div > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td.iyjjgb > div").text().replace("(","");
          }
          // after market //
          
          var price_af = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span:nth-child(3)").text();
          var change_af = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span.IsqQVc.fw-price-dn > span:nth-child(1)").text();
          var changerate_af = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span.IsqQVc.fw-price-dn > span:nth-child(2)").text().replace("(","");
          var position_1 = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span:nth-child(1)")
          var position_2 = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span:nth-child(2)")
          
          if (String(position_1).includes("class") == true) {
            
            var position = position_2.text().replace("개장 전 거래"," Pre-Market ").replace("폐장 후"," After-Market ");;
          } else {
            
            var position = position_1.text().replace("개장 전 거래"," Pre-Market ").replace("폐장 후"," After-Market ");;
          }
          
          if (price_af != '') {
           
            if (change_af == '') {
            
              var change_af = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span.IsqQVc.fw-price-nc > span:nth-child(1)").text();
              var changerate_af = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span.IsqQVc.fw-price-nc > span:nth-child(2)").text().replace("(","");
            }
          
            if (change_af == '') {
            
              var change_af = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span.IsqQVc.fw-price-up > span:nth-child(1)").text();
              var changerate_af = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > div.qFiidc > span.IsqQVc.fw-price-up > span:nth-child(2)").text().replace("(","");
            }
          
            if (change_af.includes("+") == true) {
            
              var emoji_af = "+";
            } else {
            
              var emoji_af = "-";
            }
          
            var result_af = "\n\n[" + position + "]" + "\n➥ " + price_af + " | " + change_af + " " + "(" + emoji_af + changerate_af;
          } else {
          
            var result_af = '';
          }
          
          var result_af = result_af.replace(/<[^>]+>/g, "").replace("| -","| ▽ ").replace(".("," (").replace("n(","n (").replace("| +","| ▲ ").replace("주식 시장 요약 > ","").replace("웹텍","왑텍");
          
          // after market //
          
          if (change.includes("+") == true) {
          
            var emoji = "+";
          } else {
            
            var emoji = "-";
          }
          
          if (regex.test(cheaking) != true) {
          
            if (change == '') {
            
              var change = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > span.WlRRw.IsqQVc.fw-price-dn > span:nth-child(1)").text();
              var changerate = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > span.WlRRw.IsqQVc.fw-price-dn > span.jBBUv").text().replace("(","");
            }
          
            if (change == '') {
          
              var change = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > span.WlRRw.IsqQVc.fw-price-nc > span:nth-child(1)").text();
              var changerate = data.select("g-card-section > div.wGt0Bc > div.PZPZlf > span.WlRRw.IsqQVc.fw-price-nc > span.jBBUv").text().replace("(","");
            }
          
            if (price != '') {
          
              var result = ("📈 【 " + title + " 】 시세\n➥ " + price + " | " + change + " " + "(" + emoji + changerate + result_af + repeat + "\n\n시가총액 : " + market_price + "\n\n고가 : " + high + "\n저가 : " + low + "\n\n52주 고가 : " + high_52 + "\n52주 저가 : " + low_52);
          
              var result = result.replace(/<[^>]+>/g, "").replace("| -","| ▽ ").replace(".("," (").replace("n(","n (").replace("| +","| ▲ ").replace("주식 시장 요약 > ","").replace("웹텍","왑텍");
            
              Api.replyRoom(room,result);
            }    
          }
        }
      }
      
      ////* 해외주식 *////
     
      ////* 실시간 검색어 *////
      
      if ((message == ":실검")||(message == ":실시간검색어")||(message == "실검")||(message == "실시간검색어") == true) {
        
        var arr = [];
        var data_1 = org.jsoup.Jsoup.connect("https://api.signal.bz/news/realtime")
                                    .header("referer", "https://signal.bz/")
                                    .ignoreContentType(true)
                                    .ignoreHttpErrors(true)
                                    .get().text();
        
        var data_1_json = JSON.parse(data_1);
        var data_arr = data_1_json["top10"];
        
        for (var i = 0; i < data_arr.length; i++) {
          
          var data = data_arr[i];
          var rank = data.rank;
          var keyword = data.keyword;
          
          var text = rank + ". " + keyword;
          
          arr.push(text);
        }
        
        var result = "[ 실시간검색어 ]" + repeat + "\n\n" + arr.join("\n") + "\n\n* 해당 정보는 signal.bz의 데이터를 이용했습니다.";
        
        Api.replyRoom(room,result);
        
        return;
      }
      
      ////* 실시간 검색어 *////
      
      ////* 복원 *////
      
      if (message.indexOf(":복원") == 0) {
       
        var message_edi = message.substr(3);
        var message_edi = message_edi.replace(" ","");
        
        if (isG_Master == true) {
          
          var message_split = message_edi.split("@");
          var split_1 = message_split[0];
          var split_2 = message_split[1];
          var split_3 = message_split[2];
          
          var result = "[SYSTEM]\n복원이 완료되었습니다!" + repeat + "\n\n" + decrypt(split_1,split_2,split_3);
          
          if (result != null) {
            
            Api.replyRoom(room,result);
            return;
          } else {
            
            Api.replyRoom(room,"[SYSTEM]\n예기치 못한 오류가 발생했습니다!\n도움말을 확인해주세요!");
            return;
          }
        } else {
          
          Api.replyRoom(room,"[SYSTEM]\n접근권한이 없습니다!\n도움말을 확인해주세요!");
          return;
        }   
        return;
      }
      
      ////* 복원 *////
      
      ////* 메모 *////
      
      if (message.indexOf (":메모") == 0) {

        if ((isG_Master == true)||(isR_Master == true)||(isV_Master == true) == true) {
          
          if (type == "26") {
            
            if (String(attachment_json.src_userId) == String(MY_KEY)) {
              
              if ((String(attachment_json.src_message).includes("입니다") == true)&&(String(attachment_json.src_message).includes("님") == true) == true) {
                
                var message_edi = message.substr(3);
                var message_edi = message_edi.replace(" ","");
                
                if (message_edi.length <= 50) {
                  
                  var arr = [];
                  var attachment_split = String(attachment_json.src_message).split("] 님");
                  var attachment_option = attachment_split[0];       
                  var attachment_option = attachment_option + "]";
                  var attachment_option = attachment_option.replace(/.+\[([A-Za-z]{6})\]/, '$1');
       
                  var FS_listfiles = Array.from(new java.io.File("/sdcard/DB/USER_DB/").listFiles());
                  
                  for (var i = 0; i < FS_listfiles.length; i++) {
              
                    var JSON_option = JSON.parse(FileStream.read(FS_listfiles[i])).option_id;
                    if (JSON_option == attachment_option) {
                
                      var memo_num = i;
                    }
                  }

                  var USER_data_json_1 = JSON.parse(FileStream.read(FS_listfiles[memo_num]));
                  USER_data_json_1.enex[USER_data_json_1.enex.length-1].memo = message_edi;
                  Api.replyRoom(room,"[SYSTEM]\n메모가 완료되었습니다! 다음 입/퇴장에 표시합니다.");
                  FileStream.write(FS_listfiles[memo_num],JSON.stringify(USER_data_json_1));
                  
                  return;
                } else {
                  
                  Api.replyRoom(room,"[SYSTEM]\n메모 가능한 글자 수 50개를 초과하였습니다!");
                  return;
                }
                
              } else {
                
                Api.replyRoom(room,"[SYSTEM]\n답장하신 메시지는 입퇴장 메시지가 아닙니다!");
                return;
              }
            } else {
              
              Api.replyRoom(room,"[SYSTEM]\n답장하신 메시지는 너굴 봇이 보낸 메시지가 아닙니다!");
              return;
            }
          } else {
            
            Api.replyRoom(room,"[SYSTEM]\n메모하고자 하는 메시지를 답장하여 사용해야합니다!");
            return;
          }
          return;
        } else {
          
          Api.replyRoom(room,"[SYSTEM]\n접근권한이 없습니다!\n도움말을 확인해주세요!");
          return;
        }
      }
      
      ////* 메모 *////
      
      ////* 암호화폐 *////
      
      ////* 암호화폐 *////
      
      ////* 국내주식 *////
      
      if (message.indexOf ("") == 0) {
        
        var message_edi = message.toUpperCase();
          
        var data_1 = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" + message_edi + " 주가").get().select("div");
        var symbol = data_1.select("h3 > a > em");
        var mcp = data_1.select("ul.lst > li.mc > dl > dd");
        var symbol = symbol.text().replace(/[^0-9]/gi,"");
        var mcp = mcp.text().replace(/[^0-9]/gi,"");
        
        if (symbol != "") {
        
          var data_2 = org.jsoup.Jsoup.connect("https://finance.daum.net/api/quotes/A" + symbol + "?summary=false&changeStatistics=true")
                                      .header("referer", "https://finance.daum.net/quotes/A" + symbol)
                                      .ignoreContentType(true)
                                      .ignoreHttpErrors(true)
                                      .get().text();
        
          var data_3 = JSON.parse(data_2);
          var name = data_3["name"];
          var price = data_3["tradePrice"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          var volumn = data_3["accTradeVolume"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          var change = data_3["change"];
          var change_price = data_3["changePrice"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          var change_rate = data_3["changeRate"] * 100;
          var change_rate = change_rate.toFixed(2);
  
          var per = data_3["per"];
          var pbr = data_3["pbr"];
     
          var today_high = data_3["highPrice"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
          var today_low = data_3["lowPrice"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
          
          if (week_high != null) {
            
            var week_high = data_3["high52wPrice"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
            var week_low = data_3["low52wPrice"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            
            var week_high = "";
            var week_low = "";
          }
          
          if (price.includes (",") == true) {
             
            var price_mat = price.match(/,/g).length;
            for (var i = 0; i < price_mat; i++) {
                   
              var price_rep = price.replace(",","");  
            } 
          } else {
                
            var price_rep = String(price);
          }
            
          var change_data = change.replace("RISE","▲ ").replace("FALL","▽ ").replace("EVEN","").replace("UPPER_LIMIT","⬆️").replace("LOWER_LIMIT","⬇️");
          var change_sign = change.replace("RISE","+").replace("FALL","-").replace("EVEN","").replace("UPPER_LIMIT","+").replace("LOWER_LIMIT","-");
          var change_all = change_data + " " + change_price + " (" + change_sign + change_rate + "%)";
           
          var OCM = OCMarket();  
          var timestamp = new Date().getTime();
          if (OCM == true) {
              
            var k_img = 'https://t1.daumcdn.net/finance/chart/kr/stock/d/A' + symbol + '.png?query4375=4375&_=' + timestamp;
            var k_link = 'quotes/A' + symbol + '';
          } else {
                  
            var k_img = 'https://t1.daumcdn.net/finance/chart/kr/candle/d/A' + symbol + '.png?query4375=4375&_=' + timestamp;
            var k_link = 'quotes/A' + symbol + '';
          } 
             
          var result = ("📈 【 " + name + " 】 시세\n➥ " + price + "원 | " + "" + change_all + repeat + "\n\n거래량    : " + volumn + "\n시가총액 (억원) : " + mcp);
            
          if ((String(name) == message_edi)||(String(name).replace(/ /gi,"") == message_edi)||(String(message_edi).replace(/ /gi,"") == String(name)) == true) {
                
            if (Ko_Stock == false) {
                 
              Api.replyRoom(room,"[SYSTEM]\n 해당 기능은 점검중입니다. 🛠");
            } else {
              
              Api.replyRoom(room,result);
                
              Kakao.send(room, {
                                "link_ver": "4.0", 
                                "template_id": (80160), 
                                "template_args": {
                                      
                                                 'IMG' : k_img,
                                                 'LINK' : k_link,
                                                 'SC' : "1:2"
                                                 }
              }, "custom");
            }
          }
        }
      }
      ////* 국내주식 *////
      ////* 처리종료 *////
    
      if (message == ":처리종료") {

        if (isG_Master == true) {
        
          return true;
        }
      }
    
      ////* 처리종료 *////
      
      Update_USERDATA(user_id,room_id,USER_data_json);
    }
  } catch(e) {
    
    java.lang.Thread.sleep(1000);
    Api.replyRoom("너굴 봇 관리방","[SYSTEM]\n오류 발생함!\n\n" + e + "\n\nline : " + e.stack + "\n\n[" + room + "]" );
    Api.replyRoom("너굴 봇 관리방","[SYSTEM]\n오류를 일으킨 메시지!" + repeat + "\n\n" + message);
  }
}
function Admin_process (user_id_1,room_id_1,room_1,USER_data_json_1,Request_Auth_1) {
  
  try {
    
    var AuthCode = getAuthCode();
    var result = "[SYSTEM]\n요청하신 인증키입니다!" + repeat + "\n\n:인증 " + AuthCode + "\n\n* 발급된 키를 요청하신 채팅방에 입력해주세요!\n* 인증키의 유효시간은 3분입니다.";
    Api.replyRoom("너굴 봇 관리방",result);
    Api.replyRoom(room_1,"[SYSTEM]\n관리방에 인증키가 전송되었습니다!");
              
    FileStream.write("/sdcard/DB/AUTH_DB/" + user_id_1 + ".txt",AuthCode);
              
    var A = USER_data_json_1;
    A["Request_Auth"] = Request_Auth_1 + 1;
    FileStream.write("/sdcard/DB/USER_DB/" + room_id_1 + "," + user_id_1 + ".json",JSON.stringify(A));
  
    return [user_id_1,room_1];
  } catch (e) {
    
    Api.replyRoom("너굴 봇 관리방","[SYSTEM]\n오류 발생함!\n\n" + e + "\n\nline : " + e.stack + "\n\n* 해당 오류는 Admin_process에서 발생함.");
    return null;
  }
}

function timeout_admin (user_id_f,room_f) {
  
  for (var i = 0; i < 179; i++) {
    
    java.lang.Thread.sleep(1000);
  }
  
  var AUTH_data_json = FileStream.read("/sdcard/DB/AUTH_DB/" + user_id_f + ".txt");
        
  if (AUTH_data_json != null) {
          
    Api.replyRoom(room_f,"[SYSTEM]\n인증키의 유효시간이 지났습니다!");
    FileStream.remove("/sdcard/DB/AUTH_DB/" + user_id_f + ".txt");
    
    return;
  } else {
          
    return;
  }
}

function getAuthCode () {

  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 12; i++) {

    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
   
  return result;  
}

function Update_USERDATA (user_id_1,room_id_1,USER_data_json_1) {
  
  var USERData = getUserData(user_id_1);
  var type = USERData.type;
  
  // 미완성 // 수정할것
}

function getUserData (user_id) {
  
  try {
    
    let userdata = db2.rawQuery("SELECT * FROM friends WHERE id=" + user_id, null);
    userdata.moveToNext();

    let keys = ["_id", "contact_id", "id", "type", "uuid", "phone_number", "raw_phone_number", "name", "phonetic_name", "profile_image_url", "full_profile_image_url", "original_profile_image_url", "status_message", "chat_id", "brand_new", "blocked", "favorite", "position", "v", "board_v", "ext", "nick_name", "user_type", "story_user_id", "account_id", "linked_services", "hidden", "purged", "suspended", "member_type", "involved_chat_ids", "contact_name", "enc", "created_at", "new_badge_updated_at", "new_badge_seen_at", "status_action_token"];

    let data = {};

    for (i in keys) data[keys[i]] = userdata.getString(i);
    
    data.name = decrypt(MY_KEY, data.enc, data.name);
    data.profile_image_url = decrypt(MY_KEY, data.enc, data.profile_image_url);
    data.full_profile_image_url = decrypt(MY_KEY, data.enc, data.full_profile_image_url);
    data.original_profile_image_url = decrypt(MY_KEY, data.enc, data.original_profile_image_url);
    data.v = decrypt(MY_KEY, data.enc, data.v);
    data.board_v = decrypt(MY_KEY, data.enc, data.board_v);

    userdata.close();
    return data;
  } catch (e) {
      
      return e;
  }
}

function getChatStack (param,param_2) {
   
  try {
    var ChatData = param_2;
    ChatData.moveToLast();
  
    var ChatId_in = ChatData.getString(0);
   
    if (Number(param) < Number(ChatId_in)) {
    
      var ChatJson = getChatJson((Number(ChatId_in) - Number(param)),param_2);
      
      return [ChatId_in,ChatJson,param_2];
    } else {
    
      return [Number(param),[],param_2];
    }
  } catch (e) {
    
    return [Number(param),[],param_2];
  }
}

function delete_message(before_num,DB,attachment) {
  
  try {
   
    //미완
  } catch (e) {
    
    Api.replyRoom("너굴 봇 관리방","[SYSTEM]\n오류 발생함!\n\n" + e + "\n\nline : " + e.stack + "\n\n* 해당 오류는 delete_message에서 발생함.");
  }
}

function getChatJson (count,param_2) {
  
  var ChatData = param_2;
  ChatData.moveToLast();
  
  var result = [];
  
  for (var index = 0; index < count; index++) {  
    
    var json = {};
    
    json["enc"] = JSON.parse(ChatData.getString(13)).enc;
    json["_id"] = ChatData.getString(0);
    json["id"] = ChatData.getString(1);
    json["type"] = ChatData.getString(2);
    json["chat_id"] = ChatData.getString(3);
    json["user_id"] = ChatData.getString(4);
    json["attachment"] = decrypt(json.user_id,json.enc,ChatData.getString(6));
    json["created_at"] = ChatData.getString(7);
    json["devared_at"] = ChatData.getString(8);
    json["client_message_id"] = ChatData.getString(9);
    json["prev_id"] = ChatData.getString(10);
    json["referer"] = ChatData.getString(11);
    json["supplement"] = ChatData.getString(12);
    json["message"] = decrypt(json.user_id,json.enc,ChatData.getString(5));
    
    if (ChatData.getString(4) != MY_KEY) {
      
      result.push(json);
    }
    ChatData.moveToPrevious();
  }
    return result;
}

function getRoomName(chat_id) {
  
   try {
    
      let room = '';
      let cursor = db.rawQuery('SELECT link_id FROM chat_rooms WHERE id=' + chat_id, null);
      cursor.moveToNext();
      let link_id = cursor.getString(0);
      if (link_id != null) {
      
         let cursor2 = db2.rawQuery('SELECT name FROM open_link WHERE id=?', [link_id]);
         cursor2.moveToNext();
         room = cursor2.getString(0);
         cursor2.close();
         cursor.close();
      } else {
        
         let a = JSON.parse(cursor.getString(16));
         cursor.close();
         return a[a.length - 1].content;
      }
      return room;
   } catch (e) {
    
      Log.error(e.lineNumber + ': ' + e);
      return null;
   }
}

function confirm () {
  
  connectDB();
  ChatData = db.rawQuery("SELECT * FROM chat_logs",null);
  ChatData.moveToLast();
    
  var a_roomid = ChatData.getString(3);
  var a_userid = ChatData.getString(4);
  var a_message = ChatData.getString(5);
  var a_v = JSON.parse(ChatData.getString(13));
  var a_v_enc = a_v.enc;
  var a_message_decrypt = decrypt(a_userid,a_v_enc,a_message);
    
  var USER_data_json = JSON.parse(FileStream.read("/sdcard/DB/USER_DB/" + a_roomid + "," + a_userid + ".json"));
  
  if ((USER_data_json == null)||(USER_data_json.isG_Master != true)||(a_message_decrypt != ":처리시작") == true) {

    return false;
  }
   
  return true;
 
}

function OCMarket() {
   
  var date = new Date();
  var hour = date.getHours();
  var week = [new Date().getDay()];
  
  if ((week == "1")||(week == "2")||(week == "3")||(week == "4")||(week == "5") == true) {
    
    if ((hour >= 9)&&(hour <= 15) == true) {
 
      return true;
    } else {
      
      return false;
    }
  } else {
    
    return false;
  }
}

function getOption() {
  
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

function option2(param) {
  
  const data = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  var pattern1 = /[0-9]/; //숫자
  var pattern2 = /[a-zA-Z]/; //영어
  var pattern3 = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
  var pattern4 = /[~!@#\#$%<>^&*]/; //특수문자
  var option = "";
  var param = param.toUpperCase();
  
  if ((param.length != 6)||(pattern1.test(param) == true)||(pattern2.test(param) == false)||(pattern3.test(param) == true)||(pattern4.test(param) == true) == true) {
    
    return false;
  }
  
  var FS_listFiles = Array.from(new java.io.File("/sdcard/DB/USER_DB/").listFiles());
  
  for (var i = 0; i < FS_listFiles.length; i++) {
    
    var FS_cource_json = JSON.parse(FileStream.read(FS_listFiles[i]));
    var FS_cource = FS_cource_json.option_id;
    
    if (FS_cource == param) {
      
      return false;
    } else {
      
      return true
    }
  }
  
  return option;
}

function option3() {
  
  const data = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  var option = "";
  
  var FS_listFiles = Array.from(new java.io.File("/sdcard/DB/ROOM_DB/").listFiles());
  
  for (var i = 0; i < 4; i++) {
    
    var num = Math.floor(Math.random()*26);
    var eng = data[num];
    var option = option + eng;
  }
  
  for (var i = 0; i < FS_listFiles.length; i++) {
    
    var FS_cource_json = JSON.parse(FileStream.read(FS_listFiles[i]));
    var FS_cource = FS_cource_json.option_id;
    
    if (FS_cource == option) {
      
      for (var i = 0; i < 4; i++) {
    
        var num = Math.floor(Math.random()*26);
        var eng = data[num];
        var option = option + eng;
      }
    }
  }
  
  return option;
}

function EarthQuake() {
  
  try {
      
    var date = new Date();
    var data = JSON.parse(org.jsoup.Jsoup.connect("https://api.hibot.tk/api3/earthquake/latest").ignoreContentType(true).get().text());
    var notice = data.notice;
    var domestic = data.domestic;
    var magnitude = data.magnitude;
    var depth = data.depth;
    var description = data.description;
    var location = data.location;
    var occurred_at = data.occurred_at;
    var noticed_at = data.noticed_at;
    var max_intensity = data.max_intensity;
    var local_max_intensity = data.local_max_intensity;
    
    var split = occurred_at.split(" ");
    var split = split[0];
    var split = split.split("-");
    var year = split[0];
    var month = split[1];
    var day = split[2];
  
    if ((notice == "지진조기경보")&&(String(year) == String(date.getFullYear()))&&(String(month) == String(date.getMonth() + 1))&&(String(day) == String(date.getDate())) == true) {
    
      var data_2 = FileStream.read("/sdcard/DB/EarthQuake.txt");
    
      if (String(data_2) != String(noticed_at)) {
      
        var result = "⚠ 새로운 지진 발생!\n\n" + location + "\n\n추정규모     예상최대진도\nM" + magnitude + "          " + max_intensity + repeat + "\n\n지역별 최대진도\n"+ max_intensity_text(local_max_intensity) + "발생시각\n" + occurred_at + "\n\n발표시각\n" + noticed_at + "\n\n" + description; 
        var room_path = Array.from(new java.io.File("/sdcard/DB/ROOM_DB/").listFiles());
      
        for (var i = 0; i < room_path.length; i++) {
        
          java.lang.Thread.sleep(500);
          var data_3 = JSON.parse(FileStream.read(room_path[i]));
          var room_id_r = data_3.room_id;
          var room_r = getRoomName(room_id_r);
        
          var isBan_r = data_3.isBan;
          var onEQ_r = data_3.onEQ;
        
          if ((isBan_r == false)&&(onEQ_r == true) == true) {
          
            Api.replyRoom(room_r,result);
          }
        }
        Api.replyRoom("너굴 봇 관리방","[SYSTEM]\n지진 감지 후 지진정보 전송하였습니다!");
      
        FileStream.write("/sdcard/DB/EarthQuake.txt",String(noticed_at));
      } else {
      
        return false;
      }
      return false;
    } else {
    
      return false;
    }
  } catch(e) {
   
  }
}

function max_intensity_text(param) {
  
  var string = '\n';
  var key = Object.keys(param);
  
  if (Object.keys(param).length == 0) { 
    
    return "\n정보없음"; 
  }

  for (var i = 0; i < key.length; i++) {
    
    var text = key[i] +" (" + param[key[i]] + ")\n";
    var string = string + text;
  }
  
  return string;
}

function getEnexData(param,param_2) {
  
  var arr = [];
  var arr_2 = [];
  
  if (param.lenth != 0) {
    
    for (var i = 0; i < param.length; i++) {
      
      var name = param[i].nickname;
      var type = String(param[i].type).replace("entrance","입장").replace("exit","퇴장").replace("forced","추방");
      var type_2 = String(param[i].type);
      var type_3 = String(param[i].type).replace("entrance","입장").replace("exit","퇴장").replace("forced","퇴장");
      var time = param[i].time;
      var memo = param[i].memo;
      
      if (memo == "") {
        
        var memo = ""
      } else {
        
        var memo = "\n메모 : " + memo;
      }
      
      if (param_2 == "entrance") {
        
        if (type == "입장") {
          
          arr.push('entrance');
        }
      }
      
      if (param_2 == "exit") {
        
        if (type == "퇴장") {
          
          arr.push("exit");
        }
      }
      
      if (param_2 == "forced") {
        
        if (type == 'exit') {
          
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
}

function getEnexLast (param) {
  
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

function getTimeInfo(param_1) {
  
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
  
  for (v = 0,t = 0; v < 3 && t < 6; t++) {
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


function getRoomMembers(param) {
  
  ChatData = db.rawQuery("SELECT * FROM chat_rooms",null);
  var count = ChatData.getCount();
  
  ChatData.moveToLast();

  for (var i = 0; i < count - 1; i++) {
    
    var room_id = ChatData.getString(1);
    var type = ChatData.getString(2);
    var members = ChatData.getString(3);
    
    if ((room_id == param)&&(type == "OM") == true) {
      
      var members = String(members).replace(/\'/g,"").replace("[","").replace("]","");
      return members;
    }
    
    ChatData.moveToPrevious();
  }
  return false;
}

function time() {
  
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

/// decrypt /// dream_arr2 = ['saddl', 'urhadd', 'ubfiz.sqdmlsl.tbnz.stnp', 'smin', 'strh', 'ccmp', 'usubl', 'umlsl', 'uzp1', 'sbfx', 'b.eq', 'zip2.prfm.strb', 'msub', 'b.pl', 'csel', 'stxrh.ldxrb', 'uqrshl.ldrh', 'cbnz', 'ursra', 'sshr.ubfx.ldur.ldnp', 'fcvtxn2', 'usubl2', 'uaddl2', 'b.al', 'ssubw2', 'umax', 'b.lt', 'adrp.sturb', 'extr', 'uqshl', 'smax', 'uqsub.sqshlu', 'ands', 'madd', 'umin', 'b.gt', 'uabdl2', 'ldrsb.ldpsw.rsubhn', 'uqadd', 'sttrb', 'stxr', 'adds', 'rsubhn2.umlsl2', 'sbcs.fmadd', 'usubw', 'sqshl', 'stur.ldrsh.smlsl2', 'ldrsw', 'fnmadd', 'stxrb.sbfiz', 'adcs', 'bics.ldrb', 'ldursb', 'subs.uhsub', 'ldurh', 'uabd', 'sqdmlal'];

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
   if(text == []) return null;
   try {
      decrypt.cipher.init(2, new javax.crypto.spec.SecretKeySpec(javax.crypto.SecretKeyFactory.getInstance('PBEWITHSHAAND256BITAES-CBC-BC').generateSecret(new javax.crypto.spec.PBEKeySpec(decrypt.password, new java.lang.String((decrypt.prefixes[enc] + userId).slice(0, 16).padEnd(16, '\0')).getBytes('UTF-8'), 2, 256)).getEncoded(), 'AES'), new javax.crypto.spec.IvParameterSpec(decrypt.iv));
      return '' + new java.lang.String(decrypt.cipher.doFinal(java.util.Base64.getDecoder().decode(text)), 'UTF-8');
   } catch (e) { 
     return null;
   }
}
decrypt.iv = toByteArray([15, 8, 1, 0, 25, 71, 37, -36, 21, -11, 23, -32, -31, 21, 12, 53]); 
decrypt.password = toCharArray([22, 8, 9, 111, 2, 23, 43, 8, 33, 33, 10, 16, 3, 3, 7, 6]);
decrypt.prefixes = ['', '', '12', '24', '18', '30', '36', '12', '48', '7', '35', '40', '17', '23', '29', 'isabel', 'kale', 'sulli', 'van', 'merry', 'kyle', 'james', 'maddux', 'tony', 'hayden', 'paul', 'elijah', 'dorothy', 'sally', 'bran', dream(0xcad63)];
decrypt.cipher = javax.crypto.Cipher.getInstance('AES/CBC/PKCS5Padding');

//* Function Closing *//