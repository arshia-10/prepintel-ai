export const companyNames=['Deloitte','TCS','Infosys','Accenture','Cognizant','Microsoft','Amazon'];
export const roleTitles=['Software Engineer','SDE','Analyst','Graduate Engineer Trainee'];
export const colleges=['Chitkara University','VIT','Thapar','NIT Trichy','IIT Delhi'];
export const demoLabel='DEMO HISTORICAL DATA · Illustrative examples; never a prediction';
export const roundNames=['Online Assessment','Technical Interview','Technical + HR','HR Discussion'];
const examples=[
 ['Given an integer array, find the maximum sum of any contiguous subarray.','Arrays','Maximum Subarray (Kadane’s Algorithm)','Medium','Technical Interview'],
 ['Find the longest substring without repeating characters.','Strings','Sliding Window','Medium','Online Assessment'],
 ['Explain normalization and write a SQL query joining employee and department tables.','SQL / DBMS','SQL Joins & Normalization','Medium','Technical Interview'],
 ['Describe the four pillars of object-oriented programming with examples.','OOP','OOP Fundamentals','Easy','Technical + HR'],
 ['Reverse a linked list and explain the time and space complexity.','Linked Lists','Pointer Reversal','Easy','Technical Interview'],
 ['Walk through a binary-tree traversal and discuss its complexity.','Trees','Tree Traversal','Medium','Technical Interview'],
 ['Design a query to find the second-highest salary in a department.','SQL / DBMS','SQL Ranking & Aggregation','Medium','Online Assessment'],
 ['Find the first non-repeating character in a string.','Strings','Frequency Map','Easy','Online Assessment'],
 ['Detect a cycle in a directed graph and explain your approach.','Graphs','Graph Traversal','Hard','Technical Interview'],
 ['Explain method overloading versus method overriding with examples.','OOP','Polymorphism','Easy','Technical + HR']
] as const;
export const demoExperiences=companyNames.flatMap((company,ci)=>roleTitles.flatMap((role,ri)=>Array.from({length:10},(_,variant)=>{
 const sample=examples[(ci*3+ri+variant)%examples.length];
 return {company,role,college:colleges[(ci+ri+variant)%colleges.length],year:2023+(ci+ri+variant)%4,round:sample[4],description:`DEMO HISTORICAL DATA. Illustrative candidate experience: the ${sample[0]} topic came up during a ${sample[4]} practice scenario. Fabricated for product demonstration; not verified company interview data.`,question:sample[0],topic:sample[1],pattern:sample[2],difficulty:sample[3],frequency:5+(ci*7+ri*3+variant*5)%17,sourceType:'DEMO_HISTORICAL_DATA' as const};
})));
export function fallbackQuestions(){return demoExperiences.map((x,i)=>({id:`demo-${i+1}`,company:x.company,role:x.role,college:x.college,text:x.question,topic:x.topic,pattern:x.pattern,difficulty:x.difficulty,round:x.round,frequency:x.frequency,sourceType:'DEMO_HISTORICAL_DATA'}))}
