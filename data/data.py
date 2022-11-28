import sys
import json
import os.path
import mysql.connector

# 連線資料庫
attractions = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "zxcvbnmM12*",
    database = "taipei_day_trip"
)
mycursor = attractions.cursor(buffered=True)

# 讀取json檔案
attractions_path = os.path.dirname(__file__)
filename = os.path.join(attractions_path, "taipei-attractions.json")
attractions_file = open(filename, "r", encoding="UTF-8")
attractions_data = json.loads(attractions_file.read())

# 整理資料
data_tuple = attractions_data["result"]["results"] # 列表
for i in range(len(data_tuple)):
    data = data_tuple[i] # 字典

    # 處理地址: 刪除空格
    data["address"] = data["address"].replace("  ", "")

    # 處理圖片: 
    # 1. 分割成列表 
    data["file"] = data["file"].split("http")
    for n in range(len(data["file"])):
        data["file"][n] = "http" + data["file"][n]
    del data["file"][0]
    # 2. 刪除JPG & PNG以外的item
    word1 = ".mp3"
    word2 = ".flv"
    data["file"] = [ elements for elements in data["file"] if word1 not in elements ]
    data["file"] = [ elements for elements in data["file"] if word2 not in elements ]
    # 3. list to string
    # TODO: 刪除資料庫內容 > 修改下面語法 > 重新置入
    data["file"] = ",".join(data["file"])

    # 存到資料庫中
    attraction_add = "INSERT INTO attractions(id, name, category, description, address, transport, mrt, lat, lng, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    value = (data["_id"], data["name"], data["CAT"], data["description"], data["address"], data["direction"], data["MRT"], data["latitude"], data["longitude"], data["file"])
    mycursor.execute(attraction_add, value)
    attractions.commit()

mycursor.close()
attractions.close()