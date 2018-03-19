var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3004);
var nano = require('nano')('http://localhost:5984');
var testdb = nano.db.use('aus');
var data = "";
var TFtype;
var TFQuest;
var TFAns;
var MCcorrectAns;
var MCQuest;
var MCcorrectAns;
var MCcorrectAnsFeed;
var MCWrongAns1;
var MCWrongAns2;
var MCWrongAns1Feed;
var MCWrongAns2Feed;
var Filltype;
var FillQuest;
var FillAns1;
var FillAns2;
var FillAns3;
var ESStype;
var ESSQuest;
var ESSAns;
function wait(){var y=0;}
app.get ( '/' , function ( req , res ){
res.type ( 'text/html' );
testdb.view('quiz', 'foo', function(err, body){
if(!err){
TFtype = body.rows[0].value.QuestionType;
TFQuest = body.rows[0].value.Question;
TFAns = body.rows[0].value.QAnswer;
MCtype = body.rows[1].value.QuestionType;
MCQuest = body.rows[1].value.Question;
MCcorrectAns = body.rows[1].value.QAnswerCorrect.CAnswer;
    console.log(MCcorrectAns);
    var dummy = ""+MCcorrectAns;
    console.log(dummy);
MCcorrectAnsFeed = body.rows[1].value.QAnswerCorrect.CFeed;
MCWrongAns1 = body.rows[1].value.QAnswerWrong.WAnswer[0];
MCWrongAns2 = body.rows[1].value.QAnswerWrong.WAnswer[1];
MCWrongAns1Feed = body.rows[1].value.QAnswerWrong.WFeed[0];
MCWrongAns2Feed = body.rows[1].value.QAnswerWrong.WFeed[1];

Filltype = body.rows[2].value.QuestionType;
FillQuest = body.rows[2].value.Question;
FillAns1 = body.rows[2].value.QAnswer[0];
FillAns2 = body.rows[2].value.QAnswer[1];
FillAns3 = body.rows[2].value.QAnswer[2];
    
ESStype = body.rows[3].value.QuestionType;
ESSQuest = body.rows[3].value.Question;
ESSAns = body.rows[3].value.QAnswer; 
    data="<!DOCTYPE html><html><body><form id='multi'>"+
        MCQuest+"<br><input type='radio' name='rad' id='A' value='"+MCcorrectAns+"'>"+ MCcorrectAns +"<br><input type='radio' name='rad' id='B' value='"+MCWrongAns1+"'>"+MCWrongAns1+"<br><input type='radio' name='rad' id='C' value='"+MCWrongAns2+"'>"+MCWrongAns2+"<br></form><form id='tf'>"+TFQuest+"<br><input type='radio' name='rad1' id='A1' value='T'>True<br><input type='radio' name='rad1' id='B2' value='F'>False<br></form><form method='fill'>"+FillQuest+"<br><input type='text' id='A3' name='fill'><br></form><form id='user'>"+ESSQuest+"<br></form><textarea name='essay' form='user'>Enter text here...</textarea><br><input type='button' value='Submit' onclick='getresults();'><script type='text/javascript'>"+
+"function getresults(){var grade=1;var mcform=document.getElementById('multi');var mcuserans = mcform.elements['rad'].value;var tfform=document.getElementById'tf');var tfuserans = mcform.elements['rad1'].value;var filluserans=document.getElementById('A3');if ("+MCcorrectAns+"==mcuserans){grade=grade+1;}if ("+TFAns+"==tfuserans){grade=grade+1;}if ("+FillAns1+" == filluserans || "+FillAns2+" == filluserans || "+FillAns3+" == filluserans){grade=grade+1;} window.alert(grade+'!');}</script></body></html>";
}
else console.log("Error!");
    });
    setTimeout(wait, 5000);
    console.log (MCcorrectAns);
res.send (data);
});
    
app.listen (app.get( 'port' ), function (){
});