## Install Steps ##
1. run npm install within the directory
2. run npm start with the 3 parameters

Important to note. This solution only looks for files within testData folder.

Possible Optimizations

1. I would scale this solution by using a more formalized database like mongoldb instead of reading and writing JSON.
2. For very large sets of data I would break the merging data into chunks and resolve the chunks asynchronously to cut down on execution time. 

