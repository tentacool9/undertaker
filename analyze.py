import pandas as pd
import datetime
import os


def converttime(weirdtime):
    timestamp = datetime.datetime.fromtimestamp(weirdtime)
    return(timestamp.strftime('%Y-%m-%d %H:%M:%S'))

directory = "/home/david/Documents/fastStorage/2013-8/"
data = pd.read_csv ('/home/david/Documents/fastStorage/2013-8/1.csv', sep=";\t")
df = pd.DataFrame(data, columns=['Timestamp [ms]','CPU usage [%]'])
print(df)

for i, filename in enumerate(os.listdir(directory)): # or pd.read_excel(filename) for xls file
    data2 = pd.read_csv (directory + filename, sep=";\t")
    df2 = pd.DataFrame(data2, columns=['CPU usage [%]'])
    df2 = df2.dropna(subset=['CPU usage [%]'])
    df2 = df2.loc[~(df2==0.0).all(axis=1)]
    df =pd.concat([df,df2],axis=1)
    if i > 50:
        break

df = df.dropna(subset=['Timestamp [ms]'])
df['Average'] = df.drop('Timestamp [ms]', axis=1).mean(numeric_only=True, axis=1)
dfAve = df[['Timestamp [ms]', 'Average']]
dfAve['Timestamp [ms]'] = dfAve['Timestamp [ms]'].apply(converttime)
mask = (dfAve['Timestamp [ms]'] > '2013-08-14') & (dfAve['Timestamp [ms]'] <= '2013-09-12')
print(dfAve.loc[mask])
