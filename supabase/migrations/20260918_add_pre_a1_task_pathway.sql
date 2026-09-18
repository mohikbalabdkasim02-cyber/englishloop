-- English Loop: unified task pathway + Pre-A1 foundations
-- Applied to production Supabase on 2026-09-18.

alter table public.profiles drop constraint if exists profiles_cefr_level_check;
alter table public.profiles add constraint profiles_cefr_level_check
  check (cefr_level = any (array['Pre-A1'::text,'A1'::text,'A2'::text,'B1'::text,'B2'::text]));

alter table public.contents drop constraint if exists contents_cefr_level_check;
alter table public.contents add constraint contents_cefr_level_check
  check (cefr_level = any (array['Pre-A1'::text,'A1'::text,'A2'::text,'B1'::text,'B2'::text]));

alter table public.activities add column if not exists pathway_order integer;
alter table public.activities drop constraint if exists activities_pathway_order_check;
alter table public.activities add constraint activities_pathway_order_check
  check (pathway_order is null or pathway_order > 0);

-- Seed content is intentionally idempotent by title + level.
do $$
declare
  c_id uuid;
  a_id uuid;
begin
  select id into c_id from public.contents where title='Hello, My Name Is…' and cefr_level='Pre-A1' limit 1;
  if c_id is null then
    insert into public.contents
      (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published)
    values
      ('Hello, My Name Is…','Start with greetings, names, and useful first words.','read','Foundation lesson','Pre-A1','Greetings & Names',4,'English Loop',
       E'Hello! Hi! Good morning!\n\nMy name is Naila. What is your name?\nI am Naila. I am a student.\n\nUseful words: hello, hi, name, student, morning.',
       array['hello','hi','name','student','morning'],'text',true)
    returning id into c_id;
  end if;
  select id into a_id from public.activities where title='Day 1 · Greetings & Names' limit 1;
  if a_id is null then
    insert into public.activities(content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,is_published,pathway_order)
    values(c_id,'Day 1 · Greetings & Names','Read the material, collect key words, then introduce yourself.',
      'Say hello and introduce yourself. Say your name and one simple fact about yourself.',20,45,true,1)
    returning id into a_id;
  end if;
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'vocabulary','Write three greeting or introduction words.',1
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=1);
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'short_answer','How do you say your name in English?',2
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=2);
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'reflection','Which greeting will you use most often?',3
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=3);

  select id into c_id from public.contents where title='I, You, We, They' and cefr_level='Pre-A1' limit 1;
  if c_id is null then
    insert into public.contents
      (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published)
    values
      ('I, You, We, They','Build the grammar foundation with subject pronouns before possessive adjectives.','read','Foundation lesson','Pre-A1','Subject Pronouns',5,'English Loop',
       E'I = the speaker\nYou = the person I speak to\nWe = I + another person\nThey = two or more people\nHe = one boy/man\nShe = one girl/woman\nIt = one thing/animal',
       array['I','you','we','they','he','she','it'],'text',true)
    returning id into c_id;
  end if;
  select id into a_id from public.activities where title='Day 2 · Subject Pronouns' limit 1;
  if a_id is null then
    insert into public.activities(content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,is_published,pathway_order)
    values(c_id,'Day 2 · Subject Pronouns','Learn subject pronouns before moving to possessive adjectives.',
      'Make four short sentences using I, you, we, and they.',20,45,true,2)
    returning id into a_id;
  end if;
  insert into public.activity_questions(activity_id,kind,prompt,options,sort_order)
  select a_id,'multiple_choice','Which pronoun means the speaker?','["I","You","They"]'::jsonb,1
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=1);
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'vocabulary','Write four subject pronouns.',2
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=2);
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'short_answer','Write one sentence with we.',3
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=3);

  select id into c_id from public.contents where title='Numbers & Age' and cefr_level='Pre-A1' limit 1;
  if c_id is null then
    insert into public.contents
      (title,description,content_type,format,cefr_level,topic,duration_minutes,source,content_body,vocabulary_focus,material_type,is_published)
    values
      ('Numbers & Age','Learn numbers and use them in a simple self-introduction.','read','Foundation lesson','Pre-A1','Numbers & Age',5,'English Loop',
       E'1 one · 2 two · 3 three · 4 four · 5 five\n6 six · 7 seven · 8 eight · 9 nine · 10 ten\n\nHow old are you?\nI am fifteen years old.',
       array['one','two','three','age','years old'],'text',true)
    returning id into c_id;
  end if;
  select id into a_id from public.activities where title='Day 3 · Numbers & Age' limit 1;
  if a_id is null then
    insert into public.activities(content_id,title,instructions,speaking_prompt,min_duration_seconds,max_duration_seconds,is_published,pathway_order)
    values(c_id,'Day 3 · Numbers & Age','Learn numbers and use them in a short personal introduction.',
      'Say your name, your age, and count from one to ten.',20,45,true,3)
    returning id into a_id;
  end if;
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'short_answer','Write your age in English.',1
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=1);
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'vocabulary','Write three number words.',2
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=2);
  insert into public.activity_questions(activity_id,kind,prompt,sort_order)
  select a_id,'reflection','Which numbers are still difficult to remember?',3
  where not exists(select 1 from public.activity_questions where activity_id=a_id and sort_order=3);
end $$;
