-- Synchronized lesson content for demo and real students. Idempotent by level, title, and question order.

BEGIN;

INSERT INTO public.contents (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published) SELECT 'Hello, My Name Is…','Listen to a short self-introduction, learn greeting words, then introduce yourself.','listen','Listening and reading','Pre-A1','Greetings & Names',4,'English Loop','Hello! My name is Naila. I am a student. Nice to meet you!

Greetings: hello, hi, good morning.
Ask: What is your name?
Answer: My name is Naila.
Useful words: hello, hi, name, student, morning.',ARRAY['hello','hi','name','student','morning']::text[],'text',true WHERE NOT EXISTS (SELECT 1 FROM public.contents WHERE title='Hello, My Name Is…' AND cefr_level='Pre-A1');

UPDATE public.contents SET description='Listen to a short self-introduction, learn greeting words, then introduce yourself.',content_type='listen',format='Listening and reading',topic='Greetings & Names',duration_minutes=4,source='English Loop',content_body='Hello! My name is Naila. I am a student. Nice to meet you!

Greetings: hello, hi, good morning.
Ask: What is your name?
Answer: My name is Naila.
Useful words: hello, hi, name, student, morning.',vocabulary_focus=ARRAY['hello','hi','name','student','morning']::text[],material_type='text',is_published=true WHERE title='Hello, My Name Is…' AND cefr_level='Pre-A1';

UPDATE public.activities SET title='Day 1 · Greetings & Names',instructions='Listen to the self-introduction, read the transcript, collect greeting words, then introduce yourself.',speaking_prompt='Say hello and introduce yourself. Say your name and one simple fact about yourself.',min_duration_seconds=20,max_duration_seconds=45,pathway_order=1,is_published=true WHERE content_id IN (SELECT id FROM public.contents WHERE title='Hello, My Name Is…' AND cefr_level='Pre-A1') AND title IN ('Day 1 · Greetings & Names','Day 1 · Greetings & Names');

INSERT INTO public.activities (content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,pathway_order,is_published) SELECT c.id,'Day 1 · Greetings & Names','Listen to the self-introduction, read the transcript, collect greeting words, then introduce yourself.','Say hello and introduce yourself. Say your name and one simple fact about yourself.',20,45,1,true FROM public.contents c WHERE c.title='Hello, My Name Is…' AND cefr_level='Pre-A1' AND NOT EXISTS (SELECT 1 FROM public.activities x WHERE x.content_id=c.id AND x.title='Day 1 · Greetings & Names');

UPDATE public.activity_questions SET kind='short_answer',prompt='Listen first: what name did you hear?',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Hello, My Name Is…' AND cefr_level='Pre-A1') AND title='Day 1 · Greetings & Names') AND sort_order=1;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Listen first: what name did you hear?',NULL,1 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Hello, My Name Is…' AND cefr_level='Pre-A1' AND a.title='Day 1 · Greetings & Names' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=1);

UPDATE public.activity_questions SET kind='vocabulary',prompt='Write three greeting or introduction words.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Hello, My Name Is…' AND cefr_level='Pre-A1') AND title='Day 1 · Greetings & Names') AND sort_order=2;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'vocabulary','Write three greeting or introduction words.',NULL,2 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Hello, My Name Is…' AND cefr_level='Pre-A1' AND a.title='Day 1 · Greetings & Names' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=2);

UPDATE public.activity_questions SET kind='reflection',prompt='Which greeting will you use most often?',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Hello, My Name Is…' AND cefr_level='Pre-A1') AND title='Day 1 · Greetings & Names') AND sort_order=3;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'reflection','Which greeting will you use most often?',NULL,3 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Hello, My Name Is…' AND cefr_level='Pre-A1' AND a.title='Day 1 · Greetings & Names' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=3);

INSERT INTO public.contents (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published) SELECT 'The Alphabet & Spelling','Recognize letters and spell your own name aloud.','read','Foundation lesson','Pre-A1','Alphabet & Sounds',5,'English Loop','A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z

What is your name? How do you spell it?
My name is Naila. N-A-I-L-A.

Listen to each letter when your teacher says it, then spell your name aloud.',ARRAY['letter','alphabet','spell','name']::text[],'text',true WHERE NOT EXISTS (SELECT 1 FROM public.contents WHERE title='The Alphabet & Spelling' AND cefr_level='Pre-A1');

UPDATE public.contents SET description='Recognize letters and spell your own name aloud.',content_type='read',format='Foundation lesson',topic='Alphabet & Sounds',duration_minutes=5,source='English Loop',content_body='A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z

What is your name? How do you spell it?
My name is Naila. N-A-I-L-A.

Listen to each letter when your teacher says it, then spell your name aloud.',vocabulary_focus=ARRAY['letter','alphabet','spell','name']::text[],material_type='text',is_published=true WHERE title='The Alphabet & Spelling' AND cefr_level='Pre-A1';

UPDATE public.activities SET title='Day 2 · Alphabet & Spelling',instructions='Read the alphabet and practice spelling your name.',speaking_prompt='Say your name and spell it letter by letter.',min_duration_seconds=20,max_duration_seconds=45,pathway_order=2,is_published=true WHERE content_id IN (SELECT id FROM public.contents WHERE title='The Alphabet & Spelling' AND cefr_level='Pre-A1') AND title IN ('Day 2 · Alphabet & Spelling','Day 2 · Alphabet & Spelling');

INSERT INTO public.activities (content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,pathway_order,is_published) SELECT c.id,'Day 2 · Alphabet & Spelling','Read the alphabet and practice spelling your name.','Say your name and spell it letter by letter.',20,45,2,true FROM public.contents c WHERE c.title='The Alphabet & Spelling' AND cefr_level='Pre-A1' AND NOT EXISTS (SELECT 1 FROM public.activities x WHERE x.content_id=c.id AND x.title='Day 2 · Alphabet & Spelling');

UPDATE public.activity_questions SET kind='short_answer',prompt='Write the letters in your name, separated by hyphens.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='The Alphabet & Spelling' AND cefr_level='Pre-A1') AND title='Day 2 · Alphabet & Spelling') AND sort_order=1;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Write the letters in your name, separated by hyphens.',NULL,1 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='The Alphabet & Spelling' AND cefr_level='Pre-A1' AND a.title='Day 2 · Alphabet & Spelling' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=1);

UPDATE public.activity_questions SET kind='vocabulary',prompt='Write two useful words from this lesson.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='The Alphabet & Spelling' AND cefr_level='Pre-A1') AND title='Day 2 · Alphabet & Spelling') AND sort_order=2;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'vocabulary','Write two useful words from this lesson.',NULL,2 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='The Alphabet & Spelling' AND cefr_level='Pre-A1' AND a.title='Day 2 · Alphabet & Spelling' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=2);

UPDATE public.activity_questions SET kind='reflection',prompt='Which letter sounds are difficult for you?',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='The Alphabet & Spelling' AND cefr_level='Pre-A1') AND title='Day 2 · Alphabet & Spelling') AND sort_order=3;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'reflection','Which letter sounds are difficult for you?',NULL,3 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='The Alphabet & Spelling' AND cefr_level='Pre-A1' AND a.title='Day 2 · Alphabet & Spelling' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=3);

INSERT INTO public.contents (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published) SELECT 'I, You, We, They','Build the grammar foundation with subject pronouns before possessive adjectives.','read','Foundation lesson','Pre-A1','Subject Pronouns',5,'English Loop','I = the speaker
You = the person I speak to
We = I + another person
They = two or more people
He = one boy/man
She = one girl/woman
It = one thing/animal

Examples: I am Naila. You are my friend. We are students.',ARRAY['I','you','we','they','he','she','it']::text[],'text',true WHERE NOT EXISTS (SELECT 1 FROM public.contents WHERE title='I, You, We, They' AND cefr_level='Pre-A1');

UPDATE public.contents SET description='Build the grammar foundation with subject pronouns before possessive adjectives.',content_type='read',format='Foundation lesson',topic='Subject Pronouns',duration_minutes=5,source='English Loop',content_body='I = the speaker
You = the person I speak to
We = I + another person
They = two or more people
He = one boy/man
She = one girl/woman
It = one thing/animal

Examples: I am Naila. You are my friend. We are students.',vocabulary_focus=ARRAY['I','you','we','they','he','she','it']::text[],material_type='text',is_published=true WHERE title='I, You, We, They' AND cefr_level='Pre-A1';

UPDATE public.activities SET title='Day 4 · Subject Pronouns',instructions='Learn I, you, we, they, he, she, and it before moving to possessive adjectives.',speaking_prompt='Make four short sentences using I, you, we, and they.',min_duration_seconds=20,max_duration_seconds=45,pathway_order=4,is_published=true WHERE content_id IN (SELECT id FROM public.contents WHERE title='I, You, We, They' AND cefr_level='Pre-A1') AND title IN ('Day 4 · Subject Pronouns','Day 2 · Subject Pronouns');

INSERT INTO public.activities (content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,pathway_order,is_published) SELECT c.id,'Day 4 · Subject Pronouns','Learn I, you, we, they, he, she, and it before moving to possessive adjectives.','Make four short sentences using I, you, we, and they.',20,45,4,true FROM public.contents c WHERE c.title='I, You, We, They' AND cefr_level='Pre-A1' AND NOT EXISTS (SELECT 1 FROM public.activities x WHERE x.content_id=c.id AND x.title='Day 4 · Subject Pronouns');

UPDATE public.activity_questions SET kind='multiple_choice',prompt='Which pronoun means the speaker?',options='["I","You","They"]'::jsonb WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='I, You, We, They' AND cefr_level='Pre-A1') AND title='Day 4 · Subject Pronouns') AND sort_order=1;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'multiple_choice','Which pronoun means the speaker?','["I","You","They"]'::jsonb,1 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='I, You, We, They' AND cefr_level='Pre-A1' AND a.title='Day 4 · Subject Pronouns' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=1);

UPDATE public.activity_questions SET kind='vocabulary',prompt='Write four subject pronouns.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='I, You, We, They' AND cefr_level='Pre-A1') AND title='Day 4 · Subject Pronouns') AND sort_order=2;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'vocabulary','Write four subject pronouns.',NULL,2 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='I, You, We, They' AND cefr_level='Pre-A1' AND a.title='Day 4 · Subject Pronouns' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=2);

UPDATE public.activity_questions SET kind='short_answer',prompt='Write one sentence with ''we''.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='I, You, We, They' AND cefr_level='Pre-A1') AND title='Day 4 · Subject Pronouns') AND sort_order=3;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Write one sentence with ''we''.',NULL,3 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='I, You, We, They' AND cefr_level='Pre-A1' AND a.title='Day 4 · Subject Pronouns' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=3);

INSERT INTO public.contents (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published) SELECT 'Numbers & Age','Learn numbers and use them in a simple self-introduction.','read','Foundation lesson','Pre-A1','Numbers & Age',5,'English Loop','1 one · 2 two · 3 three · 4 four · 5 five
6 six · 7 seven · 8 eight · 9 nine · 10 ten

How old are you?
I am fifteen years old.',ARRAY['one','two','three','age','years old']::text[],'text',true WHERE NOT EXISTS (SELECT 1 FROM public.contents WHERE title='Numbers & Age' AND cefr_level='Pre-A1');

UPDATE public.contents SET description='Learn numbers and use them in a simple self-introduction.',content_type='read',format='Foundation lesson',topic='Numbers & Age',duration_minutes=5,source='English Loop',content_body='1 one · 2 two · 3 three · 4 four · 5 five
6 six · 7 seven · 8 eight · 9 nine · 10 ten

How old are you?
I am fifteen years old.',vocabulary_focus=ARRAY['one','two','three','age','years old']::text[],material_type='text',is_published=true WHERE title='Numbers & Age' AND cefr_level='Pre-A1';

UPDATE public.activities SET title='Day 3 · Numbers & Age',instructions='Learn numbers and use them in a short personal introduction.',speaking_prompt='Say your name, your age, and count from one to ten.',min_duration_seconds=20,max_duration_seconds=45,pathway_order=3,is_published=true WHERE content_id IN (SELECT id FROM public.contents WHERE title='Numbers & Age' AND cefr_level='Pre-A1') AND title IN ('Day 3 · Numbers & Age','Day 3 · Numbers & Age');

INSERT INTO public.activities (content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,pathway_order,is_published) SELECT c.id,'Day 3 · Numbers & Age','Learn numbers and use them in a short personal introduction.','Say your name, your age, and count from one to ten.',20,45,3,true FROM public.contents c WHERE c.title='Numbers & Age' AND cefr_level='Pre-A1' AND NOT EXISTS (SELECT 1 FROM public.activities x WHERE x.content_id=c.id AND x.title='Day 3 · Numbers & Age');

UPDATE public.activity_questions SET kind='short_answer',prompt='Write your age in English.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Numbers & Age' AND cefr_level='Pre-A1') AND title='Day 3 · Numbers & Age') AND sort_order=1;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Write your age in English.',NULL,1 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Numbers & Age' AND cefr_level='Pre-A1' AND a.title='Day 3 · Numbers & Age' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=1);

UPDATE public.activity_questions SET kind='vocabulary',prompt='Write three number words.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Numbers & Age' AND cefr_level='Pre-A1') AND title='Day 3 · Numbers & Age') AND sort_order=2;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'vocabulary','Write three number words.',NULL,2 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Numbers & Age' AND cefr_level='Pre-A1' AND a.title='Day 3 · Numbers & Age' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=2);

UPDATE public.activity_questions SET kind='reflection',prompt='Which numbers are still difficult to remember?',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Numbers & Age' AND cefr_level='Pre-A1') AND title='Day 3 · Numbers & Age') AND sort_order=3;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'reflection','Which numbers are still difficult to remember?',NULL,3 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Numbers & Age' AND cefr_level='Pre-A1' AND a.title='Day 3 · Numbers & Age' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=3);

INSERT INTO public.contents (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published) SELECT 'Introduce Yourself','Put greetings, spelling, numbers, and subject pronouns together.','listen','Listening and reading','Pre-A1','Self-Introduction',6,'English Loop','Hello! My name is Naila. I am fifteen years old. I am a student. I like music. Nice to meet you!

Reading pattern:
Hello! My name is ...
I am ... years old.
I am a student.
I like ...
Nice to meet you!',ARRAY['my name is','years old','student','I like','nice to meet you']::text[],'text',true WHERE NOT EXISTS (SELECT 1 FROM public.contents WHERE title='Introduce Yourself' AND cefr_level='Pre-A1');

UPDATE public.contents SET description='Put greetings, spelling, numbers, and subject pronouns together.',content_type='listen',format='Listening and reading',topic='Self-Introduction',duration_minutes=6,source='English Loop',content_body='Hello! My name is Naila. I am fifteen years old. I am a student. I like music. Nice to meet you!

Reading pattern:
Hello! My name is ...
I am ... years old.
I am a student.
I like ...
Nice to meet you!',vocabulary_focus=ARRAY['my name is','years old','student','I like','nice to meet you']::text[],material_type='text',is_published=true WHERE title='Introduce Yourself' AND cefr_level='Pre-A1';

UPDATE public.activities SET title='Day 5 · Introduce Yourself',instructions='Listen, read the model, answer simple questions, then record your own introduction.',speaking_prompt='Introduce yourself: say hello, your name, your age, and one thing you like.',min_duration_seconds=30,max_duration_seconds=60,pathway_order=5,is_published=true WHERE content_id IN (SELECT id FROM public.contents WHERE title='Introduce Yourself' AND cefr_level='Pre-A1') AND title IN ('Day 5 · Introduce Yourself','Day 5 · Introduce Yourself');

INSERT INTO public.activities (content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,pathway_order,is_published) SELECT c.id,'Day 5 · Introduce Yourself','Listen, read the model, answer simple questions, then record your own introduction.','Introduce yourself: say hello, your name, your age, and one thing you like.',30,60,5,true FROM public.contents c WHERE c.title='Introduce Yourself' AND cefr_level='Pre-A1' AND NOT EXISTS (SELECT 1 FROM public.activities x WHERE x.content_id=c.id AND x.title='Day 5 · Introduce Yourself');

UPDATE public.activity_questions SET kind='short_answer',prompt='Listen: how old is Naila?',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Introduce Yourself' AND cefr_level='Pre-A1') AND title='Day 5 · Introduce Yourself') AND sort_order=1;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Listen: how old is Naila?',NULL,1 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Introduce Yourself' AND cefr_level='Pre-A1' AND a.title='Day 5 · Introduce Yourself' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=1);

UPDATE public.activity_questions SET kind='vocabulary',prompt='Write three useful words or phrases for your introduction.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Introduce Yourself' AND cefr_level='Pre-A1') AND title='Day 5 · Introduce Yourself') AND sort_order=2;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'vocabulary','Write three useful words or phrases for your introduction.',NULL,2 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Introduce Yourself' AND cefr_level='Pre-A1' AND a.title='Day 5 · Introduce Yourself' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=2);

UPDATE public.activity_questions SET kind='short_answer',prompt='Write one sentence about something you like.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='Introduce Yourself' AND cefr_level='Pre-A1') AND title='Day 5 · Introduce Yourself') AND sort_order=3;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Write one sentence about something you like.',NULL,3 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='Introduce Yourself' AND cefr_level='Pre-A1' AND a.title='Day 5 · Introduce Yourself' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=3);

INSERT INTO public.contents (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published) SELECT 'A Day in My Life','Move from introductions to simple daily routine sentences.','read','A1 lesson','A1','Daily Routines',7,'English Loop','I wake up at six. I eat breakfast and go to school. I study English. In the evening, I read a book.

Useful verbs: wake up, eat, go, study, read.
Use I + verb: I study. I read.',ARRAY['wake up','eat','go','study','read']::text[],'text',true WHERE NOT EXISTS (SELECT 1 FROM public.contents WHERE title='A Day in My Life' AND cefr_level='A1');

UPDATE public.contents SET description='Move from introductions to simple daily routine sentences.',content_type='read',format='A1 lesson',topic='Daily Routines',duration_minutes=7,source='English Loop',content_body='I wake up at six. I eat breakfast and go to school. I study English. In the evening, I read a book.

Useful verbs: wake up, eat, go, study, read.
Use I + verb: I study. I read.',vocabulary_focus=ARRAY['wake up','eat','go','study','read']::text[],material_type='text',is_published=true WHERE title='A Day in My Life' AND cefr_level='A1';

UPDATE public.activities SET title='Day 1 · My Daily Routine',instructions='Read the short model, check the verbs, write about your day, then speak.',speaking_prompt='Describe three things you do every day.',min_duration_seconds=30,max_duration_seconds=60,pathway_order=1,is_published=true WHERE content_id IN (SELECT id FROM public.contents WHERE title='A Day in My Life' AND cefr_level='A1') AND title IN ('Day 1 · My Daily Routine','Day 1 · My Daily Routine');

INSERT INTO public.activities (content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,pathway_order,is_published) SELECT c.id,'Day 1 · My Daily Routine','Read the short model, check the verbs, write about your day, then speak.','Describe three things you do every day.',30,60,1,true FROM public.contents c WHERE c.title='A Day in My Life' AND cefr_level='A1' AND NOT EXISTS (SELECT 1 FROM public.activities x WHERE x.content_id=c.id AND x.title='Day 1 · My Daily Routine');

UPDATE public.activity_questions SET kind='short_answer',prompt='What does the learner do in the evening?',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='A Day in My Life' AND cefr_level='A1') AND title='Day 1 · My Daily Routine') AND sort_order=1;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','What does the learner do in the evening?',NULL,1 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='A Day in My Life' AND cefr_level='A1' AND a.title='Day 1 · My Daily Routine' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=1);

UPDATE public.activity_questions SET kind='vocabulary',prompt='Write three useful daily routine verbs.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='A Day in My Life' AND cefr_level='A1') AND title='Day 1 · My Daily Routine') AND sort_order=2;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'vocabulary','Write three useful daily routine verbs.',NULL,2 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='A Day in My Life' AND cefr_level='A1' AND a.title='Day 1 · My Daily Routine' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=2);

UPDATE public.activity_questions SET kind='short_answer',prompt='Write one sentence about your daily routine.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='A Day in My Life' AND cefr_level='A1') AND title='Day 1 · My Daily Routine') AND sort_order=3;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Write one sentence about your daily routine.',NULL,3 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='A Day in My Life' AND cefr_level='A1' AND a.title='Day 1 · My Daily Routine' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=3);

INSERT INTO public.contents (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published) SELECT 'People in My Family','Describe familiar people in short sentences after learning subject pronouns.','read','A1 lesson','A1','Family & Simple Descriptions',7,'English Loop','This is my sister. She is kind. This is my brother. He is funny. We are a family.

Remember: I, you, he, she, we, they are subject pronouns.
Now try my and your when you talk about people: my sister, your brother.',ARRAY['family','sister','brother','kind','funny']::text[],'text',true WHERE NOT EXISTS (SELECT 1 FROM public.contents WHERE title='People in My Family' AND cefr_level='A1');

UPDATE public.contents SET description='Describe familiar people in short sentences after learning subject pronouns.',content_type='read',format='A1 lesson',topic='Family & Simple Descriptions',duration_minutes=7,source='English Loop',content_body='This is my sister. She is kind. This is my brother. He is funny. We are a family.

Remember: I, you, he, she, we, they are subject pronouns.
Now try my and your when you talk about people: my sister, your brother.',vocabulary_focus=ARRAY['family','sister','brother','kind','funny']::text[],material_type='text',is_published=true WHERE title='People in My Family' AND cefr_level='A1';

UPDATE public.activities SET title='Day 2 · My Family',instructions='Read the model, remember subject pronouns, then introduce family members.',speaking_prompt='Introduce two people in your family using he, she, my, or your.',min_duration_seconds=30,max_duration_seconds=60,pathway_order=2,is_published=true WHERE content_id IN (SELECT id FROM public.contents WHERE title='People in My Family' AND cefr_level='A1') AND title IN ('Day 2 · My Family','Day 2 · My Family');

INSERT INTO public.activities (content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,pathway_order,is_published) SELECT c.id,'Day 2 · My Family','Read the model, remember subject pronouns, then introduce family members.','Introduce two people in your family using he, she, my, or your.',30,60,2,true FROM public.contents c WHERE c.title='People in My Family' AND cefr_level='A1' AND NOT EXISTS (SELECT 1 FROM public.activities x WHERE x.content_id=c.id AND x.title='Day 2 · My Family');

UPDATE public.activity_questions SET kind='multiple_choice',prompt='Which pronoun describes a sister?',options='["He","She","They"]'::jsonb WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='People in My Family' AND cefr_level='A1') AND title='Day 2 · My Family') AND sort_order=1;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'multiple_choice','Which pronoun describes a sister?','["He","She","They"]'::jsonb,1 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='People in My Family' AND cefr_level='A1' AND a.title='Day 2 · My Family' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=1);

UPDATE public.activity_questions SET kind='vocabulary',prompt='Write three words that describe your family.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='People in My Family' AND cefr_level='A1') AND title='Day 2 · My Family') AND sort_order=2;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'vocabulary','Write three words that describe your family.',NULL,2 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='People in My Family' AND cefr_level='A1' AND a.title='Day 2 · My Family' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=2);

UPDATE public.activity_questions SET kind='short_answer',prompt='Write one sentence about a family member.',options=NULL WHERE activity_id IN (SELECT id FROM public.activities WHERE content_id IN (SELECT id FROM public.contents WHERE title='People in My Family' AND cefr_level='A1') AND title='Day 2 · My Family') AND sort_order=3;

INSERT INTO public.activity_questions (activity_id,kind,prompt,options,sort_order) SELECT a.id,'short_answer','Write one sentence about a family member.',NULL,3 FROM public.activities a JOIN public.contents c ON c.id=a.content_id WHERE c.title='People in My Family' AND cefr_level='A1' AND a.title='Day 2 · My Family' AND NOT EXISTS (SELECT 1 FROM public.activity_questions x WHERE x.activity_id=a.id AND x.sort_order=3);

COMMIT;
