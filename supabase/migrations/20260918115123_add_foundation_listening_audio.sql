-- Attach stable audio assets to the two Pre-A1 listening lessons.
UPDATE public.contents SET content_url='/audio/greetings-self-introduction.mp3'
WHERE title='Hello, My Name Is…' AND cefr_level='Pre-A1';

UPDATE public.contents SET content_url='/audio/full-self-introduction.mp3'
WHERE title='Introduce Yourself' AND cefr_level='Pre-A1';
