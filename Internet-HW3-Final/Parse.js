var fs = require("fs");
// handle of database couch_db
var nano = require('nano')('http://localhost:5984');
var test_db = nano.db.use('aus');
fs.readFile(__dirname+"/hw4Qs.txt", function(error, data) {
    console.log();
    var file = data.toString();
    file=file.split("\r\n");
    // counter to keep track of different questions
    var counter = 0;
    // these will be used to store all data of questions, ex: Qtype[0] has questions[0] --> answers[0] 
    var newlnLoc=[];
    var Qtype=[];
    var questions=[];
    var answers=[];
    // Travers through all the lines in the text file
    for(i = 0; i < file.length; i++)
    {
            // get in if it is a new line to update counter or question number
            if (file[i].match("^\s*$"))
                {
                        newlnLoc[counter]=i;
                        counter +=1;
                }
                // get in if line is for question type and update Qtype[]
                if(file[i].indexOf("// ") > -1)
                {
                        var Qt = file[i].substring(3);
                        Qtype[counter]=Qt;
                }

                // get in if line is for question and update questions[]
                if(file[i].indexOf("::") > -1)
                {
                        // in fill-in-the-blank, the answer is within the question, we need to remove that
                        if (Qtype[counter]=="fill-in-the-blank")
                        {
                                var ind = file[i].lastIndexOf("::");
                                var beg = ind +3;
                                var blank = " _______ ";
                                OpenBr = file[i].indexOf("{");
                                CloseBr = file[i].indexOf("}");

                // get in if the blank is in the beginning of the question
                                if (OpenBr == beg)
                                {
                                        var str = CloseBr + 2;
                                        var Qu = file[i].substring(str);
                                        var Q = blank + Qu;
                                        questions[counter]=Q;
                                }
                // get in if the blank is not in the beginning of the question
                                else
                                {
                                        var str = CloseBr + 2;
                                        var Qu1 = file[i].substring(beg,OpenBr);
                                        var Qu2 = file[i].substring(str);
                                        var Q = Qu1 + blank + Qu2;
                                        questions[counter]=Q;
                                }
                        }
                        else
                        {
                        var ind = file[i].lastIndexOf("::");
                        var beg = ind +3;
                        var Q = file[i].substring(beg);
                        questions[counter]=Q;
                        }
                }

                // get in if line has answer and update answer[]
                if(file[i].indexOf("{") > -1)
                {
                        var OpenBr = file[i].indexOf("{");
                        var CloseBr = file[i].indexOf("}");
                        var start = OpenBr + 1;
                        var A = file[i].substring(start,CloseBr);
                        answers[counter]=A;
                }
    }

    // get the number of questions which is number of empty lines + 1
    Qnum = counter+1;
    var ID=1;
    // handle each question accordingly
    for(i=0;i<Qnum;i++)
    {
            if(Qtype[i]=="true/false")
            {
                    var Questiontype = Qtype[i];
                    var Quest = questions[i];
                    var Ans = answers[i];
            // create the json file for true of false questions
            var data = {
                    QuestionType: Questiontype,
                    Question: Quest,
                    QAnswer: Ans
                };
            // insert json file into database
            test_db.insert(data,'ID:'+ID, function(err, body){
            if(!err)
            {
            console.log("document Added");
            }
            else
            {
                console.log(err);
            }   
            });
            ID +=1;
            }
            if(Qtype[i]=="multiple choice")
            {
                    var Questiontype = Qtype[i];
                    var Quest = questions[i];
            var numWr = (answers[i].match(/~/g) || []).length;
            var equone = answers[i].indexOf("=");
            var eq = equone + 1;
            var hashone = answers[i].indexOf("#");
            var ha1 = hashone - 1;
            var ha2 = hashone + 2;
            var tildeone = answers[i].indexOf("~");
            var ti1 = tildeone - 1;
            var ti2 = tildeone + 1;
            var ansone = answers[i].substring(eq,ha1);
            var ansoneFeed = answers[i].substring(ha2,ti1);
            var wr = answers[i].substring(ti2);
            var res = wr.split("~");
            var Wrong = [];
            var WrongFeed = [];
            for(i=0;i<numWr;i++)
            {
                var hash = res[i].indexOf("#");
                var hashm = hash - 1;
                var hashp = hash + 2;
                Wrong[i] = res[i].substring(0,hashm);
                WrongFeed[i] = res[i].substring(hashp);
            }
            // create the json file for multiple choice questions
            var data = {
                    QuestionType: Questiontype,
                    Question: Quest,
                    QAnswerCorrect: {CAnswer:ansone,CFeed:ansoneFeed},
                    QAnswerWrong: {WAnswer:Wrong, WFeed:WrongFeed}
                };
            // insert json file into database
            test_db.insert(data,'ID:'+ID, function(err, body){
            if(!err)
            {
            console.log("document Added");
            }
            else
            {
                console.log(err);
            }   
            });
            ID +=1;
            }
            if(Qtype[i]=="fill-in-the-blank")
            {
                    var Questiontype = Qtype[i];
                    var Quest = questions[i];
            var numAns = (answers[i].match(/=/g) || []).length;
            var equone = answers[i].indexOf("=");
            var eq = equone + 1;
            var wr = answers[i].substring(eq);
            var res = wr.split(" =");
            var Ans = [];
            for(i=0;i<numAns;i++)
            {
                Ans[i] = res[i];
            };
            // create the json file for fill-in-the-blank questions
            var data = {
                    QuestionType: Questiontype,
                    Question: Quest,
                    QAnswer: Ans
                };
            // insert json file into database
            test_db.insert(data,'ID:'+ID, function(err, body){
            if(!err)
            {
            console.log("document Added");
            }
            else
            {
                console.log(err);
            }   
            });
            ID +=1;
            }
            if(Qtype[i]=="essay")
            {
                    var Questiontype = Qtype[i];
                    var Quest = questions[i];
            var Ans = "";
            // create the json file for essay questions
            var data = {
                    QuestionType: Questiontype,
                    Question: Quest,
                    QAnswer: Ans
                };
            // insert json file into database
            test_db.insert(data,'ID:'+ID, function(err, body){
            if(!err)
            {
            console.log("document Added");
            }
            else
            {
                console.log(err);
            }   
            });
            ID +=1;
            }
    }
});