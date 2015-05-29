import traceback
import json
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
from textblob.classifiers import NaiveBayesClassifier
from pymongo import MongoClient
import string
import time
import uuid
from threading import Thread
# from api.models import Train
# import pymongo

def getreport(req, param):
    print  "Requiest came"
    
    sentimentDtls = []
#     client = MongoClient('mongodb://localhost:27017/')
#     td = client['traindata']
#     td.insert_one({"phrase" : 'test title', "polarity" : 'pos'})
#     article = Train(phase = 'test title', polarity = 'pos')  
#     article.save() 
    
    with open('c:/FeedbackSampleData.txt', 'r') as f:
        for line in f:
            try:
                print line
                blob = TextBlob(line)
                polarity = blob.sentiment.polarity
                sentimentDtls.append({
                                      'polarity' : polarity,
                                      "result" : "Positive" if polarity > 0 else "Negative"
                                     })
            except Exception:
                print(traceback.format_exc())
    return {
        'code' : 200,
        'data' : json.dumps(sentimentDtls)
    }


def processfile(req, param):
    print  "Requiest came"

    analyzeReport = []
    
    try:
        for key, file in req.FILES.items():
            path = "c:/" + uuid.uuid4().hex + file.name
            print path
            dest = open(path, 'w')
            if file.multiple_chunks:
                for c in file.chunks():
                    dest.write(c)
            else:
                dest.write(file.read())
            dest.close()
            
            analyzeReport = getanlysisreport(path, "pattern")
            
            print ("getting report - " + json.dumps(analyzeReport))
            
    except Exception:
        print(traceback.format_exc())
    return {
        'code' : 200,
        'data' : json.dumps(analyzeReport)
    }

def processfilenaive(req, param):
    print  "Requiest came"
    
    analyzeReport = []
    try:
        for key, file in req.FILES.items():
            path = "c:/" + uuid.uuid4().hex + file.name
            print path
            dest = open(path, 'w')
            if file.multiple_chunks:
                for c in file.chunks():
                    dest.write(c)
            else:
                dest.write(file.read())
            dest.close()
            
            analyzeReport = getanlysisreport(path, "naive")
            
            print ("getting report - " + json.dumps(analyzeReport))
            
    except Exception:
        print(traceback.format_exc())
    return {
        'code' : 200,
        'data' : json.dumps(analyzeReport)
    }


def processfiletrain(req, param):
    print  "Requiest came"
    
    analyzeReport = []
    
    try:
        for key, file in req.FILES.items():
            path = "c:/" + uuid.uuid4().hex + file.name
            print path
            dest = open(path, 'w')
            if file.multiple_chunks:
                for c in file.chunks():
                    dest.write(c)
            else:
                dest.write(file.read())
            dest.close()
            
            analyzeReport = getanlysisreport(path, "train")
            
            print ("getting report - " + json.dumps(analyzeReport))
            
    except Exception:
        print(traceback.format_exc())
    return {
        'code' : 200,
        'data' : json.dumps(analyzeReport)
    }

def addtraindata(req, param):
    print  "Requiest came"
    
    analyzeReport = []
    
    try:
        for key, file in req.FILES.items():
            path = "c:/" + uuid.uuid4().hex + file.name
            print path
            dest = open(path, 'w')
            if file.multiple_chunks:
                for c in file.chunks():
                    dest.write(c)
            else:
                dest.write(file.read())
            dest.close()
            
            addTrainDataList(path, "jsonfile");
            
    except Exception:
        print(traceback.format_exc())
    return {
        'code' : 200,
        'data' : json.dumps(analyzeReport)
    }

def wipetraindata(req, param):
    print  "Requiest came"
    
    try:
        removeAllTrainData()
            
    except Exception:
        print(traceback.format_exc())
    return {
        'code' : 200,
        'data' : json.dumps({"message" : "success"})
    }


def getanlysisreport(fileFullPath, algorithm_name):
    print  "Request came"
    print int(time.time())
    sentimentDtls = []
    patternCountMap = {
                       "Negative" : 0,
                       "Positive" : 0,
                       "Neutral" : 0,
                       "Total" : 0,
                       }
    
    if algorithm_name == "train":
        cl = NaiveBayesClassifier(getTrainData())
    print "train data got"
    with open(fileFullPath, 'r') as f:
        with open("c:/Darts_Out.txt", 'w') as wr:
            for line in f:
                try:
                    print line
                    if line and len(line.strip()) > 0:
                        if algorithm_name == "pattern":
                            patternBlob = TextBlob(line)
                            patternPolarity = patternBlob.sentiment.polarity
                            patternResult = "Negative"
                        
                            if patternPolarity == 0:
                                patternResult = "Neutral"
                            elif patternPolarity > 0:
                                patternResult = "Positive"
                            sentimentDtls.append({
                                            'polarity' : patternPolarity,
                                            "sentiment" : patternResult,
                                            "feedback" : line
                                             })
                            patternCountMap[patternResult] = patternCountMap[patternResult] + 1
                            patternCountMap["Total"] = patternCountMap["Total"] + 1
                            wr.write(patternResult + "\n")
                            
                        elif algorithm_name == "train":
                            trainedResult = cl.classify(line)
                            trainOut = "Negative"
                        
                            if "pos" == trainedResult:
                                trainOut = "Positive"
                            
                            sentimentDtls.append({
                                            "sentiment" : trainOut,
                                            "feedback" : line
                                             })
                            
                            patternCountMap[trainOut] = patternCountMap[trainOut] + 1
                            patternCountMap["Total"] = patternCountMap["Total"] + 1
                            wr.write(trainOut + "\n")
                            
                        elif algorithm_name == "naive":
                            naiveBlob = TextBlob(line, analyzer=NaiveBayesAnalyzer()).sentiment
                            naiveResult = "Negative"
                        
                            if "pos" == naiveBlob.classification:
                                naiveResult = "Positive"
                            
                            sentimentDtls.append({
                                            'polarity' : "Positive Score : " +  str(naiveBlob.p_pos) + " and Negative Score : "  + str(naiveBlob.p_neg),
                                            "sentiment" : naiveResult,
                                            "feedback" : line
                                             })
                            patternCountMap[naiveResult] = patternCountMap[naiveResult] + 1
                            patternCountMap["Total"] = patternCountMap["Total"] + 1
                            wr.write(naiveResult + "\n")
                        
                        
                except Exception:
                    print(traceback.format_exc())
                    print(line)
    
    returnDtls = {
                       "patternCountMap" : patternCountMap,
                       "patternDtls" : sentimentDtls,
                       }
    
    print (json.dumps(returnDtls))
#     print (len(sentimentDtls))
    print int(time.time())
    return returnDtls


def preparenayebayesreport(req, param):
    print  "Request came"
    print int(time.time())
    
    thread = Thread(target = nayebayesreport, args=("""c:/FeedbackSampleData.txt""",))
    thread.start()
    
    return {
        'code' : 200,
        'data' : json.dumps({"message" : "success"})
    }
    
def fetchbayesreport(req, param):
    print  "Request came"
    bayescol = getBayesClassifierCollection()
    
    bayesResult = []
    
    for singleTrain in bayescol.find():
        bayesResult.append({"feedback" : singleTrain["feedback"],
                            "sentiment" : singleTrain["sentiment"]})
    
    return {
        'code' : 200,
        'data' : json.dumps(bayesResult)
    }

def nayebayesreport(fileFullPath):
    print  "nayebayesreport came"
    print (fileFullPath)
    sentimentDtls = []
    patternCountMap = {
                       "Negative" : 0,
                       "Positive" : 0,
                       "Neutral" : 0,
                       "Total" : 0,
                       }
    
    
    cl = NaiveBayesClassifier(getTrainData())

    print "train data loaded"
    with open(fileFullPath, 'r') as f:
        for line in f:
            try:
                print line
                if line and len(line.strip()) > 0:
                    trainedResult = cl.classify(line)
                        
                    patternResult = "Negative"
                    if "pos" == trainedResult:
                        patternResult = "Positive"
                    
                    patternCountMap[patternResult] = patternCountMap[patternResult] + 1
                    patternCountMap["Total"] = patternCountMap["Total"] + 1
                    
                    sentimentDtls.append({
                                          "sentiment" : patternResult,
                                          "feedback" : line
                                         })
            except Exception:
                print(traceback.format_exc())
                print(line)
    
    addBayesClassifierResult(sentimentDtls)
    return
    
def addTrainDataList(data,type="json"):
    client = MongoClient('mongodb://localhost:27017/')
    td = client['test']
    
    if type == "jsonfile":
#         with open(data, 'r') as f:
#             for s in f.read():
#                 if not s in string.printable:
#                     print s
        with open(data, 'r') as f:
            td.traindata.insert_many(json.load(f))
    else:        
        td.traindata.insert_many(json.loads(data))
    
    for singleTrain in td.traindata.find():
        print (singleTrain)
        
def addBayesClassifierResult(data,type="json"):
    
    bayescol = getBayesClassifierCollection()
    bayescol.remove()
    if type == "jsonfile":
#         with open(data, 'r') as f:
#             for s in f.read():
#                 if not s in string.printable:
#                     print s
        with open(data, 'r') as f:
            bayescol.insert_many(json.load(f))
    else:        
        bayescol.insert_many(data)
    
    for singleTrain in bayescol.find():
        print (singleTrain)

def getTrainData():
#     return getTrainCollection().find()
    testData = []
    for singleItem in getTrainCollection().find():
        print singleItem['text']
#         testData.append({"text": singleItem['text'], "label" : singleItem['label']})
        testData.append((singleItem['text'], singleItem['label'],))
#     return [{"text": singleItem['text'], "label" : singleItem['label']} for singleItem in getTrainCollection().find()]
    return testData

def addTrainData(data,type="json"):
    getTrainCollection().insert_one(json.loads(data))
    

def removeTrainData(data,type="json"):
    traindata = getTrainCollection()
    traindata.remove(json.loads(data))
    for singleTrain in traindata.find():
        print (singleTrain)

def removeAllTrainData():
    traindata = getTrainCollection()
    traindata.remove()

def updateTrainData(phrase, newPolarity,type="json"):
    client = MongoClient('mongodb://localhost:27017/')
    td = client['test']
    
    presentList = td.traindata.find({"phrase":phrase}) 
    for singleData in presentList:
        singleData['polarity'] = newPolarity
        td.traindata.save(singleData)
    
    for singleTrain in td.traindata.find():
        print (singleTrain)

def getTrainCollection():
    client = MongoClient('mongodb://localhost:27017/')
    return client['test'].traindata

def getBayesClassifierCollection():
    client = MongoClient('mongodb://localhost:27017/')
    return client['test'].bayesclassifier
