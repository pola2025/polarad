/**
 * 이미지 베리에이션 시스템
 * - 중복 이미지 방지를 위한 프롬프트 베리에이션
 * - 기존 이미지와의 유사도 검사
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// 사용된 조합 추적용 인터페이스
export interface VariationCombo {
  people: string;
  location: string;
  activity: string;
  angle: string;
  mood: string;
  props: string;
}

// 장면 세트 방식 베리에이션 풀 (100개)
// 각 세트가 장소+인물+활동+소품을 일관되게 묶어 자연스러운 장면 보장
// 주 6회 발행 기준 약 17주(4개월) 중복 없이 사용 가능
export const SCENE_SETS: readonly VariationCombo[] = [
  // ════════════════════════════════════
  // ── 카페/음료 (1~10) ──
  // ════════════════════════════════════
  {
    people: 'a young woman in her 20s in a beige knit sweater',
    location: 'a cozy cafe window seat with warm afternoon sunlight',
    activity: 'browsing a smartphone while sipping an iced latte',
    angle: 'shot from a slight side angle (45 degrees)',
    mood: 'warm and cozy atmosphere',
    props: 'iced latte, smartphone, and a small dessert plate',
  },
  {
    people: 'a man in his early 30s wearing a denim jacket',
    location: 'a bright rooftop cafe with potted plants and city skyline',
    activity: 'working on a laptop with earbuds in',
    angle: 'wide shot capturing the full scene with skyline',
    mood: 'fresh morning atmosphere with soft sunlight',
    props: 'laptop, wireless earbuds, and a cup of americano',
  },
  {
    people: 'two female friends in their 20s in casual outfits',
    location: 'a trendy Korean dessert cafe with pastel walls',
    activity: 'laughing and chatting over desserts',
    angle: 'shot from the front capturing both faces',
    mood: 'bright and cheerful atmosphere',
    props: 'colorful dessert plates, iced drinks, and smartphones on table',
  },
  {
    people: 'a woman in her late 20s in a linen blouse',
    location: 'a minimalist white cafe with a single flower vase on the table',
    activity: 'writing in a planner while drinking drip coffee',
    angle: 'slightly elevated angle looking down at the table',
    mood: 'calm and productive atmosphere',
    props: 'a planner, pen, drip coffee, and a small succulent plant',
  },
  {
    people: 'a man in his mid-30s in a navy polo shirt',
    location: 'an outdoor terrace cafe with string lights and greenery',
    activity: 'reading news on a tablet while enjoying a croissant',
    angle: 'medium shot from a slight side angle',
    mood: 'relaxed weekend morning atmosphere',
    props: 'tablet, croissant plate, and a glass of orange juice',
  },
  {
    people: 'a woman in her 30s in a turtleneck sweater',
    location: 'a vintage-style cafe with exposed brick walls and Edison bulbs',
    activity: 'holding a warm latte cup with both hands and gazing outside',
    angle: 'close-up portrait with blurred cafe background',
    mood: 'contemplative and warm atmosphere',
    props: 'a ceramic latte cup, a scarf on the chair, and a book',
  },
  {
    people: 'two male friends in their late 20s in casual wear',
    location: 'a modern specialty coffee shop with a long wooden bar',
    activity: 'watching a barista prepare pour-over coffee',
    angle: 'wide shot from behind showing the bar and barista',
    mood: 'hip and aromatic cafe atmosphere',
    props: 'pour-over equipment, coffee cups, and a menu board',
  },
  {
    people: 'a young woman in her early 20s in a beret and coat',
    location: 'a French-style bakery cafe with glass display of pastries',
    activity: 'choosing pastries from the display case',
    angle: 'medium shot from a slight side angle showing the display',
    mood: 'charming and inviting atmosphere',
    props: 'glass pastry case, tongs, and a small tray',
  },
  {
    people: 'a couple in their late 20s sitting close together',
    location: 'a quiet corner booth of a dimly lit jazz cafe',
    activity: 'sharing a slice of cake and smiling at each other',
    angle: 'medium shot from the front',
    mood: 'romantic and intimate atmosphere',
    props: 'a slice of cake, two forks, and candle light',
  },
  {
    people: 'a freelancer woman in her 30s with glasses',
    location: 'a large open cafe with floor-to-ceiling windows and lots of natural light',
    activity: 'deeply focused typing on a laptop',
    angle: 'over-the-shoulder shot showing the laptop screen (blank)',
    mood: 'focused and productive atmosphere',
    props: 'MacBook, noise-canceling headphones, and an iced tea',
  },
  // ════════════════════════════════════
  // ── 공원/야외 (11~22) ──
  // ════════════════════════════════════
  {
    people: 'a woman in her 30s in a white blouse and sunglasses',
    location: 'a park bench under a large tree with dappled sunlight',
    activity: 'reading a book while sitting on the bench',
    angle: 'medium shot from a slight side angle',
    mood: 'calm and serene atmosphere',
    props: 'a paperback book, tote bag, and a tumbler',
  },
  {
    people: 'a man in his late 20s in athletic casual wear',
    location: 'a riverside walking path with green grass and trees',
    activity: 'walking while checking a smartphone',
    angle: 'wide shot from the front showing the path',
    mood: 'refreshing outdoor atmosphere',
    props: 'smartphone, wireless earbuds, and a cap',
  },
  {
    people: 'a couple in their 30s in neat casual outfits',
    location: 'a spring flower garden with blooming cherry blossoms',
    activity: 'walking together along a flower-lined path',
    angle: 'wide shot capturing the full garden scene',
    mood: 'bright and romantic spring atmosphere',
    props: 'a small camera and matching outfits',
  },
  {
    people: 'a woman in her 20s in a yellow sundress',
    location: 'a field of cosmos flowers on a sunny autumn day',
    activity: 'standing among the flowers with eyes closed enjoying the breeze',
    angle: 'wide shot with flowers filling the foreground',
    mood: 'dreamy and peaceful autumn atmosphere',
    props: 'a straw hat held in one hand',
  },
  {
    people: 'a man in his 30s in a lightweight jacket',
    location: 'a mountain trail with green trees and a distant view',
    activity: 'pausing on the trail looking at the distant mountain view',
    angle: 'wide shot from behind showing the vista',
    mood: 'adventurous and refreshing atmosphere',
    props: 'a small backpack and a hiking pole',
  },
  {
    people: 'a young woman in her 20s in running gear',
    location: 'a lakeside jogging path at golden hour',
    activity: 'jogging along the path with the lake reflecting sunset',
    angle: 'wide shot from the side capturing her and the lake',
    mood: 'energetic golden hour atmosphere',
    props: 'running shoes, a smartwatch, and wireless earbuds',
  },
  {
    people: 'a family of three (parents in 30s and a small child)',
    location: 'a wide green lawn in a city park',
    activity: 'the child running toward the parents with arms open',
    angle: 'low angle shot from behind the child',
    mood: 'joyful and heartwarming family atmosphere',
    props: 'a picnic blanket and a small ball in the background',
  },
  {
    people: 'two women in their 20s in sporty casual outfits',
    location: 'an outdoor basketball court on a bright day',
    activity: 'taking a selfie together after playing',
    angle: 'medium shot from a slight angle',
    mood: 'fun and energetic atmosphere',
    props: 'a basketball, water bottles, and a smartphone',
  },
  {
    people: 'a man in his early 30s in a trench coat',
    location: 'a tree-lined autumn street with fallen golden leaves',
    activity: 'walking slowly with hands in pockets',
    angle: 'wide shot from the front with leaf-covered path',
    mood: 'melancholic and beautiful autumn atmosphere',
    props: 'fallen leaves, a leather bag, and warm-toned lighting',
  },
  {
    people: 'a woman in her 30s wearing a wide-brim hat',
    location: 'a rooftop garden with city buildings in the background',
    activity: 'watering plants in the garden',
    angle: 'medium shot from a slight side angle',
    mood: 'peaceful urban gardening atmosphere',
    props: 'a watering can, potted herbs, and gardening gloves',
  },
  {
    people: 'a young man in his 20s in a windbreaker',
    location: 'a seaside promenade with ocean waves in the background',
    activity: 'leaning on the railing looking out at the ocean',
    angle: 'medium shot from the side showing the ocean',
    mood: 'contemplative seaside atmosphere',
    props: 'the ocean railing, a backpack on the ground, and windswept hair',
  },
  {
    people: 'a woman in her late 20s in a padded vest',
    location: 'a camping site with a small tent and trees',
    activity: 'sitting on a camp chair sipping coffee from a thermos',
    angle: 'medium shot capturing the tent and campsite',
    mood: 'cozy outdoor camping atmosphere',
    props: 'a camp chair, thermos, and a small campfire ring',
  },
  // ════════════════════════════════════
  // ── 실내 생활/홈 (23~32) ──
  // ════════════════════════════════════
  {
    people: 'a woman in her late 20s in a comfortable hoodie',
    location: 'a sunlit apartment living room with indoor plants and a sofa',
    activity: 'sitting on the sofa scrolling through a tablet',
    angle: 'slightly elevated angle looking down at the sofa area',
    mood: 'relaxed weekend morning atmosphere',
    props: 'tablet, a blanket, and a mug of tea on a side table',
  },
  {
    people: 'a man in his 30s in a plain T-shirt',
    location: 'a modern kitchen with a breakfast bar and natural light',
    activity: 'preparing breakfast while looking at a smartphone recipe',
    angle: 'shot from a slight side angle showing the counter',
    mood: 'warm and cozy morning atmosphere',
    props: 'cutting board, fresh vegetables, and a smartphone on a stand',
  },
  {
    people: 'a woman in her 30s in pajamas',
    location: 'a bedroom with white sheets and morning sunlight streaming in',
    activity: 'sitting up in bed stretching with a smile',
    angle: 'medium shot from the front',
    mood: 'fresh and peaceful morning atmosphere',
    props: 'white bedding, a glass of water on the nightstand, and curtains',
  },
  {
    people: 'a man in his late 20s in a gray sweatshirt',
    location: 'a home office nook with a desk by the window',
    activity: 'working on a desktop computer with headphones on',
    angle: 'over-the-shoulder shot showing the desk setup',
    mood: 'focused work-from-home atmosphere',
    props: 'monitor, keyboard, headphones, and a small desk plant',
  },
  {
    people: 'a couple in their 30s in casual home clothes',
    location: 'an apartment balcony with city view at sunset',
    activity: 'standing together watching the sunset with wine glasses',
    angle: 'shot from behind showing their silhouettes and the sunset',
    mood: 'romantic golden hour atmosphere',
    props: 'wine glasses, a small balcony table, and potted flowers',
  },
  {
    people: 'a woman in her 20s in a cozy cardigan',
    location: 'a reading corner with a floor lamp and a bookshelf',
    activity: 'curled up in an armchair reading a novel',
    angle: 'medium shot from a slight side angle',
    mood: 'quiet and immersive reading atmosphere',
    props: 'an armchair, floor lamp, book, and a cup of herbal tea',
  },
  {
    people: 'a man in his 30s in an apron',
    location: 'a bright modern kitchen with marble countertops',
    activity: 'plating a dish carefully with focused expression',
    angle: 'close-up shot of hands plating food',
    mood: 'creative and culinary atmosphere',
    props: 'a white plate, fresh herbs, and cooking utensils',
  },
  {
    people: 'a woman in her late 20s in loungewear',
    location: 'a bathroom with a large bathtub and candles',
    activity: 'lighting a candle beside the bathtub',
    angle: 'medium shot capturing the bath area',
    mood: 'relaxing self-care spa atmosphere',
    props: 'candles, bath salts, and a fluffy robe',
  },
  {
    people: 'a young woman in her 20s in a crop top',
    location: 'a bright living room with a yoga mat on the floor',
    activity: 'doing a yoga pose in front of a tablet propped up',
    angle: 'wide shot from the side showing the full pose',
    mood: 'energetic home workout atmosphere',
    props: 'yoga mat, tablet with workout video, and a water bottle',
  },
  {
    people: 'a man in his early 30s in a henley shirt',
    location: 'a cozy living room with a record player and warm lighting',
    activity: 'placing a vinyl record on a turntable',
    angle: 'close-up shot of hands and the turntable',
    mood: 'nostalgic and warm evening atmosphere',
    props: 'a turntable, vinyl records, and a glass of whiskey',
  },
  // ════════════════════════════════════
  // ── 서점/도서관/학습 (33~40) ──
  // ════════════════════════════════════
  {
    people: 'a young man in his 20s wearing glasses and a cardigan',
    location: 'a bookstore cafe with tall wooden bookshelves',
    activity: 'reading a book at a small wooden table',
    angle: 'medium shot with bookshelves in background (blurred)',
    mood: 'quiet and focused atmosphere',
    props: 'an open book, a cup of drip coffee, and reading glasses',
  },
  {
    people: 'a woman in her 30s in a neat blouse',
    location: 'a quiet library reading area with soft desk lamp',
    activity: 'writing notes in a journal while referencing a book',
    angle: 'over-the-shoulder shot showing the journal',
    mood: 'calm and studious atmosphere',
    props: 'a journal, pen, open reference book, and a laptop nearby',
  },
  {
    people: 'a female college student in her early 20s in a hoodie',
    location: 'a university study room with whiteboards and desks',
    activity: 'studying with a laptop and textbooks spread out',
    angle: 'slightly elevated angle showing the study setup',
    mood: 'dedicated and studious atmosphere',
    props: 'laptop, thick textbooks, highlighters, and sticky notes',
  },
  {
    people: 'a man in his late 20s in a casual blazer',
    location: 'a large bookstore with rows of bookshelves stretching back',
    activity: 'browsing book spines in the business section',
    angle: 'medium shot from the end of the aisle',
    mood: 'thoughtful and curious atmosphere',
    props: 'bookshelves, a book in hand, and a tote bag',
  },
  {
    people: 'two students in their early 20s (one male, one female)',
    location: 'a bright campus library with large windows',
    activity: 'studying together and sharing notes',
    angle: 'shot from a slight side angle',
    mood: 'collaborative study atmosphere',
    props: 'notebooks, laptops, coffee cups, and earbuds',
  },
  {
    people: 'a woman in her 30s wearing a scarf',
    location: 'an independent bookshop with stacks of curated books',
    activity: 'sitting on the floor reading a book she pulled from a low shelf',
    angle: 'low angle shot from floor level',
    mood: 'intimate and cozy bookshop atmosphere',
    props: 'stacked books, a canvas bag, and warm lighting',
  },
  {
    people: 'a man in his early 30s in a V-neck sweater',
    location: 'a home study with dark wooden desk and bookshelves',
    activity: 'writing with a fountain pen in a leather notebook',
    angle: 'close-up of the hands and notebook',
    mood: 'classic and refined study atmosphere',
    props: 'fountain pen, leather notebook, desk lamp, and a mug',
  },
  {
    people: 'a young woman in her 20s in a denim shirt',
    location: 'a creative co-working library with colorful furniture',
    activity: 'sketching ideas on a large notepad',
    angle: 'slightly elevated angle showing the notepad',
    mood: 'creative and inspired atmosphere',
    props: 'colored markers, a large notepad, and a laptop nearby',
  },
  // ════════════════════════════════════
  // ── 사무실/업무 (41~52) ──
  // ════════════════════════════════════
  {
    people: 'a female professional in her 30s in smart casual',
    location: 'a minimalist co-working space with white desks',
    activity: 'focusing on a laptop screen with a coffee cup nearby',
    angle: 'close-up portrait with blurred background',
    mood: 'focused and determined atmosphere',
    props: 'MacBook, airpods, and a paper cup of coffee',
  },
  {
    people: 'a team of 3 young professionals in business casual',
    location: 'a conference room with a large screen showing a colorful chart',
    activity: 'discussing together while pointing at the screen',
    angle: 'wide shot from the side showing all three people and screen',
    mood: 'collaborative and dynamic atmosphere',
    props: 'large display screen, laptops, and notebooks',
  },
  {
    people: 'a male developer in his late 20s in a hoodie',
    location: 'a startup office with exposed concrete and neon sign decor',
    activity: 'coding on a dual monitor setup',
    angle: 'over-the-shoulder shot showing the code on screens',
    mood: 'focused late-night coding atmosphere',
    props: 'dual monitors, mechanical keyboard, and energy drink',
  },
  {
    people: 'a woman in her 30s in a blazer',
    location: 'a glass-walled meeting room in a high-rise building',
    activity: 'presenting to colleagues with a tablet in hand',
    angle: 'medium shot from the audience perspective',
    mood: 'confident and professional atmosphere',
    props: 'a tablet, a projection screen, and notepads on the table',
  },
  {
    people: 'a man in his 40s in a crisp white shirt',
    location: 'a CEO-style private office with a city view',
    activity: 'looking thoughtfully out the floor-to-ceiling window',
    angle: 'shot from behind showing the city view',
    mood: 'contemplative leadership atmosphere',
    props: 'a leather chair, a clean desk, and a coffee cup',
  },
  {
    people: 'two colleagues in their 30s (one male, one female)',
    location: 'a creative agency office with colorful post-it walls',
    activity: 'brainstorming and arranging post-it notes on the wall',
    angle: 'medium shot from a slight side angle',
    mood: 'creative and collaborative atmosphere',
    props: 'colorful post-it notes, markers, and a whiteboard',
  },
  {
    people: 'a young woman in her 20s in a casual shirt',
    location: 'a co-working lounge area with bean bags and low tables',
    activity: 'having an informal meeting on a video call on laptop',
    angle: 'medium shot showing the relaxed setup',
    mood: 'modern and flexible work atmosphere',
    props: 'laptop, bean bag, and a notepad',
  },
  {
    people: 'a man in his early 30s in smart casual',
    location: 'a standing desk area in a modern open-plan office',
    activity: 'working at a standing desk with good posture',
    angle: 'wide shot from the side showing the standing desk',
    mood: 'healthy and productive work atmosphere',
    props: 'standing desk, monitor, and a water bottle',
  },
  {
    people: 'a team of 4 people in their 20s-30s in casual wear',
    location: 'a bright workshop room with a large table',
    activity: 'gathered around a table looking at printed materials',
    angle: 'slightly elevated angle showing the whole group',
    mood: 'engaged team workshop atmosphere',
    props: 'printed materials, markers, and coffee cups',
  },
  {
    people: 'a woman in her late 30s in a tailored dress',
    location: 'a modern reception area with marble floors and fresh flowers',
    activity: 'walking confidently through the reception holding a folder',
    angle: 'medium shot from the front',
    mood: 'polished and professional atmosphere',
    props: 'a folder, heels, and a fresh flower arrangement in background',
  },
  {
    people: 'a male professional in his 30s in a vest',
    location: 'a warehouse-converted office with high ceilings and industrial pipes',
    activity: 'sketching a wireframe on a large whiteboard',
    angle: 'medium shot showing the whiteboard drawing',
    mood: 'creative industrial workspace atmosphere',
    props: 'whiteboard markers, a tablet on the desk, and coffee',
  },
  {
    people: 'a female designer in her 20s with colorful accessories',
    location: 'a design studio with large iMac screens and mood boards',
    activity: 'reviewing design work on a large screen',
    angle: 'over-the-shoulder shot showing the design on screen',
    mood: 'artistic and creative atmosphere',
    props: 'iMac, color swatches, and a sketchbook',
  },
  // ════════════════════════════════════
  // ── 음식/맛집/요리 (53~62) ──
  // ════════════════════════════════════
  {
    people: 'a woman in her 20s in a striped shirt',
    location: 'a modern Korean restaurant with a minimalist wooden interior',
    activity: 'taking a photo of a beautifully plated dish with a smartphone',
    angle: 'slightly elevated angle looking down at the table',
    mood: 'bright and appetizing atmosphere',
    props: 'a colorful Korean dish, smartphone, and wooden chopsticks',
  },
  {
    people: 'two friends in their 20s-30s in casual attire',
    location: 'a traditional Korean market food stall with warm lighting',
    activity: 'sharing street food and smiling',
    angle: 'medium shot from the front',
    mood: 'lively and fun atmosphere',
    props: 'street food skewers, paper cups, and a busy market backdrop',
  },
  {
    people: 'a man in his 30s in a casual shirt',
    location: 'a Korean BBQ restaurant with tabletop grill',
    activity: 'grilling meat on the tabletop grill with tongs',
    angle: 'slightly elevated angle showing the grill and side dishes',
    mood: 'warm and social dining atmosphere',
    props: 'tabletop grill, meat, side dishes (banchan), and soju glasses',
  },
  {
    people: 'a woman in her late 20s in an apron',
    location: 'a bright cooking studio with professional equipment',
    activity: 'decorating a cake with focused expression',
    angle: 'close-up shot of hands decorating the cake',
    mood: 'creative and meticulous baking atmosphere',
    props: 'a cake on a turntable, piping bag, and sprinkles',
  },
  {
    people: 'a group of 4 friends in their 20s in casual outfits',
    location: 'an outdoor beer garden with string lights at dusk',
    activity: 'toasting beer glasses together and laughing',
    angle: 'medium shot from a slight side angle',
    mood: 'festive and joyful evening atmosphere',
    props: 'beer glasses, fried chicken, and string lights',
  },
  {
    people: 'a couple in their 30s in neat casual clothes',
    location: 'a fine dining restaurant with dim elegant lighting',
    activity: 'enjoying a course meal and talking quietly',
    angle: 'medium shot from a slight side angle',
    mood: 'elegant and intimate dining atmosphere',
    props: 'wine glasses, a multi-course plate, and candlelight',
  },
  {
    people: 'a young man in his 20s in a bucket hat',
    location: 'a busy Myeongdong street food alley',
    activity: 'eating a large corn dog while walking',
    angle: 'medium shot from the front with street backdrop',
    mood: 'energetic street food adventure atmosphere',
    props: 'a corn dog, a drink cup, and neon-lit food stalls behind',
  },
  {
    people: 'a woman in her 30s in a clean white chef coat',
    location: 'a modern open kitchen visible from the dining area',
    activity: 'seasoning a dish with careful precision',
    angle: 'medium shot showing the open kitchen setup',
    mood: 'professional culinary atmosphere',
    props: 'chef knife, cutting board, and fresh ingredients',
  },
  {
    people: 'two women in their 20s in cozy sweaters',
    location: 'a Korean pojangmacha (tent bar) with plastic stools',
    activity: 'clinking soju glasses together and laughing',
    angle: 'close-up medium shot capturing their expressions',
    mood: 'nostalgic and fun nighttime atmosphere',
    props: 'soju bottle, glasses, tteokbokki, and tent bar interior',
  },
  {
    people: 'a man in his early 30s in a polo shirt',
    location: 'a brunch restaurant with bright white interior',
    activity: 'cutting into a stack of pancakes with a fork',
    angle: 'slightly elevated angle showing the plate',
    mood: 'leisurely weekend brunch atmosphere',
    props: 'pancakes, berries, maple syrup, and orange juice',
  },
  // ════════════════════════════════════
  // ── 교통/도시 이동 (63~68) ──
  // ════════════════════════════════════
  {
    people: 'a man in his early 30s in a long coat',
    location: 'a subway platform with clean modern design',
    activity: 'standing and looking at a smartphone while waiting',
    angle: 'medium shot from a slight side angle',
    mood: 'calm urban commuter atmosphere',
    props: 'smartphone, crossbody bag, and wireless earbuds',
  },
  {
    people: 'a woman in her 20s in a trench coat',
    location: 'a crosswalk on a busy Seoul street with buildings around',
    activity: 'crossing the street with confident stride',
    angle: 'wide shot from the front showing the street',
    mood: 'dynamic urban life atmosphere',
    props: 'a leather bag, heeled boots, and crosswalk markings',
  },
  {
    people: 'a man in his late 20s in a bomber jacket',
    location: 'inside a modern bus with window light',
    activity: 'sitting by the bus window looking out at passing scenery',
    angle: 'shot from the aisle side showing the window view',
    mood: 'reflective commuter atmosphere',
    props: 'wireless earbuds, a backpack on lap, and window reflections',
  },
  {
    people: 'a woman in her 30s in athleisure wear',
    location: 'a bike lane along the Han River',
    activity: 'riding a bicycle along the river path',
    angle: 'wide shot from the side capturing the river and path',
    mood: 'freeing and active atmosphere',
    props: 'a bicycle, helmet, and the river in the background',
  },
  {
    people: 'a young man in his 20s in a lightweight puffer jacket',
    location: 'a KTX train interior with wide seats',
    activity: 'looking out the window with a coffee cup in hand',
    angle: 'shot from a slight side angle showing the window',
    mood: 'calm and relaxed travel atmosphere',
    props: 'a paper coffee cup, a small bag, and passing countryside',
  },
  {
    people: 'a couple in their 30s in matching casual outfits',
    location: 'a taxi back seat at night with city lights through the window',
    activity: 'looking at a smartphone screen together and smiling',
    angle: 'shot from the front seat showing their faces lit by phone',
    mood: 'intimate nighttime city atmosphere',
    props: 'smartphone, city neon lights through window, and seatbelts',
  },
  // ════════════════════════════════════
  // ── 운동/건강/웰빙 (69~76) ──
  // ════════════════════════════════════
  {
    people: 'a woman in her late 20s in yoga wear',
    location: 'a bright yoga studio with wooden floor and large mirrors',
    activity: 'stretching on a yoga mat',
    angle: 'wide shot capturing the full studio space',
    mood: 'peaceful and healthy atmosphere',
    props: 'yoga mat, water bottle, and a towel',
  },
  {
    people: 'a man in his early 30s in running gear',
    activity: 'stretching his legs before a run',
    location: 'a running track at a city park at dawn',
    angle: 'wide shot from a low angle',
    mood: 'fresh and determined early morning atmosphere',
    props: 'running shoes, a smartwatch, and a water bottle',
  },
  {
    people: 'a woman in her 20s in gym attire',
    location: 'a modern gym with weight machines and mirrors',
    activity: 'lifting light dumbbells with proper form',
    angle: 'medium shot from a slight side angle',
    mood: 'energetic and empowering gym atmosphere',
    props: 'dumbbells, gym mirror, and a towel on shoulder',
  },
  {
    people: 'a man in his 30s in a swim cap and goggles',
    location: 'an indoor swimming pool with clear blue water',
    activity: 'standing at the edge of the pool about to dive',
    angle: 'medium shot from a slight side angle',
    mood: 'focused and athletic atmosphere',
    props: 'swimming goggles, towel on a bench, and lane markers',
  },
  {
    people: 'two women in their late 20s in pilates wear',
    location: 'a bright pilates studio with reformer machines',
    activity: 'doing pilates on reformer machines side by side',
    angle: 'wide shot capturing both and the studio',
    mood: 'graceful and controlled workout atmosphere',
    props: 'pilates reformers, straps, and water bottles',
  },
  {
    people: 'a man in his late 20s in a cycling jersey',
    location: 'a scenic mountain road with lush green surroundings',
    activity: 'cycling uphill with a focused expression',
    angle: 'wide shot from the side showing the road and scenery',
    mood: 'challenging and exhilarating cycling atmosphere',
    props: 'road bicycle, cycling helmet, and water bottle on frame',
  },
  {
    people: 'a woman in her 30s in comfortable athleisure',
    location: 'a meditation room with cushions and soft lighting',
    activity: 'sitting cross-legged meditating with eyes closed',
    angle: 'medium shot from the front',
    mood: 'peaceful and mindful atmosphere',
    props: 'meditation cushion, incense, and a small singing bowl',
  },
  {
    people: 'a group of 3 friends in their 20s in hiking gear',
    location: 'a mountain summit with a panoramic view',
    activity: 'standing at the peak with arms raised in celebration',
    angle: 'wide shot from behind showing the view',
    mood: 'triumphant and adventurous atmosphere',
    props: 'hiking backpacks, trekking poles, and the mountain panorama',
  },
  // ════════════════════════════════════
  // ── 쇼핑/패션 (77~82) ──
  // ════════════════════════════════════
  {
    people: 'a woman in her 20s in a trendy oversized jacket',
    location: 'a bright fashion boutique with neatly arranged clothes',
    activity: 'browsing through a clothing rack',
    angle: 'medium shot from a slight side angle',
    mood: 'stylish and modern atmosphere',
    props: 'clothing rack, a small shopping bag, and a mirror',
  },
  {
    people: 'a man in his 30s in a tailored coat',
    location: 'a luxury department store menswear section',
    activity: 'examining the fabric of a jacket on display',
    angle: 'medium shot from a slight side angle',
    mood: 'refined and sophisticated shopping atmosphere',
    props: 'jackets on display, a shopping bag, and polished floors',
  },
  {
    people: 'two female friends in their 20s in trendy outfits',
    location: 'Hongdae street shopping district with colorful storefronts',
    activity: 'walking together carrying shopping bags and laughing',
    angle: 'wide shot from the front showing the street',
    mood: 'fun and vibrant shopping atmosphere',
    props: 'multiple shopping bags, trendy outfits, and colorful shops behind',
  },
  {
    people: 'a woman in her late 20s in a simple dress',
    location: 'a cosmetics store with neatly arranged beauty products',
    activity: 'testing a lipstick shade on the back of her hand',
    angle: 'close-up shot of hands and products',
    mood: 'curious and playful beauty shopping atmosphere',
    props: 'lipstick testers, mirror, and beauty products on shelves',
  },
  {
    people: 'a young man in his 20s in streetwear',
    location: 'a sneaker shop with shoes displayed on illuminated shelves',
    activity: 'holding up a pair of sneakers to examine them',
    angle: 'medium shot showing the sneaker wall',
    mood: 'trendy sneaker culture atmosphere',
    props: 'sneakers on shelves, shoe box, and backlit display',
  },
  {
    people: 'a woman in her 30s in an elegant outfit',
    location: 'a jewelry store with glass display cases',
    activity: 'trying on a delicate necklace while looking in a mirror',
    angle: 'medium shot showing her reflection in the mirror',
    mood: 'elegant and luxurious atmosphere',
    props: 'glass display case, jewelry, and a small mirror',
  },
  // ════════════════════════════════════
  // ── 반려동물 (83~87) ──
  // ════════════════════════════════════
  {
    people: 'a man in his late 20s in a casual fleece jacket',
    location: 'a grassy dog park on a sunny day',
    activity: 'kneeling down and playing with a small white dog',
    angle: 'low angle shot capturing both person and dog',
    mood: 'joyful and heartwarming atmosphere',
    props: 'a small dog, leash, and a tennis ball',
  },
  {
    people: 'a woman in her 20s in a striped T-shirt',
    location: 'a pet-friendly cafe with a small dog on her lap',
    activity: 'petting the dog while drinking coffee',
    angle: 'medium shot from a slight side angle',
    mood: 'cute and relaxing atmosphere',
    props: 'a small fluffy dog, a coffee cup, and a dog treat',
  },
  {
    people: 'a man in his 30s in a rain jacket',
    location: 'a rainy street with a dog on a leash',
    activity: 'walking the dog under a transparent umbrella',
    angle: 'medium shot from the front with rain visible',
    mood: 'moody and charming rainy day atmosphere',
    props: 'a transparent umbrella, a golden retriever, and rain puddles',
  },
  {
    people: 'a woman in her late 20s in a cozy knit sweater',
    location: 'a living room couch with soft blankets',
    activity: 'cuddling a sleeping cat on her lap',
    angle: 'slightly elevated angle showing both person and cat',
    mood: 'warm and peaceful home atmosphere',
    props: 'a sleeping cat, a soft blanket, and a mug of cocoa',
  },
  {
    people: 'a young couple in their 20s in matching puffer jackets',
    location: 'a wide grassy field on a bright autumn day',
    activity: 'running together with a corgi puppy',
    angle: 'wide shot capturing the open field and movement',
    mood: 'playful and energetic outdoor atmosphere',
    props: 'a corgi puppy, a frisbee, and autumn-colored grass',
  },
  // ════════════════════════════════════
  // ── 문화/취미/창작 (88~95) ──
  // ════════════════════════════════════
  {
    people: 'a woman in her 30s in a paint-stained smock',
    location: 'a sunlit art studio with canvases and easels',
    activity: 'painting on a large canvas with a palette in hand',
    angle: 'medium shot from a slight side angle showing the canvas',
    mood: 'creative and inspired artistic atmosphere',
    props: 'canvas, paint palette, brushes, and paint tubes',
  },
  {
    people: 'a man in his 20s in a casual T-shirt',
    location: 'a music practice room with acoustic panels',
    activity: 'playing an acoustic guitar sitting on a stool',
    angle: 'medium shot from a slight side angle',
    mood: 'soulful and musical atmosphere',
    props: 'acoustic guitar, a microphone stand, and a music notebook',
  },
  {
    people: 'a woman in her 20s wearing a pottery apron',
    location: 'a pottery studio with a spinning wheel and clay works',
    activity: 'shaping a clay bowl on the pottery wheel',
    angle: 'close-up shot of hands on the spinning wheel',
    mood: 'meditative and tactile crafting atmosphere',
    props: 'pottery wheel, wet clay, and finished pots on shelves',
  },
  {
    people: 'a man in his 30s in a flannel shirt',
    location: 'a home workshop with woodworking tools',
    activity: 'sanding a handmade wooden cutting board',
    angle: 'medium shot showing the workbench',
    mood: 'focused and handcrafted atmosphere',
    props: 'sandpaper, a wooden board, chisels, and sawdust',
  },
  {
    people: 'a young woman in her 20s in an oversized shirt',
    location: 'a photography studio with a white backdrop and lighting',
    activity: 'adjusting a camera on a tripod',
    angle: 'wide shot showing the studio setup',
    mood: 'professional creative studio atmosphere',
    props: 'DSLR camera, tripod, studio lights, and a reflector',
  },
  {
    people: 'a man in his late 20s with headphones around neck',
    location: 'a home music production setup with monitors and synthesizer',
    activity: 'adjusting knobs on a synthesizer',
    angle: 'close-up of hands on synthesizer with monitors behind',
    mood: 'immersive music production atmosphere',
    props: 'synthesizer, studio monitors, MIDI keyboard, and headphones',
  },
  {
    people: 'a woman in her 30s in casual clothes with flour on her hands',
    location: 'a home baking corner with a marble countertop',
    activity: 'kneading dough for bread',
    angle: 'slightly elevated angle showing the countertop',
    mood: 'homey and therapeutic baking atmosphere',
    props: 'flour, dough, a rolling pin, and baking trays',
  },
  {
    people: 'a couple in their 30s in aprons',
    location: 'a flower arranging workshop with fresh flowers everywhere',
    activity: 'creating a flower bouquet together',
    angle: 'medium shot from the front showing both',
    mood: 'romantic and creative workshop atmosphere',
    props: 'fresh flowers, scissors, wrapping paper, and ribbons',
  },
  // ════════════════════════════════════
  // ── 야간/저녁 장면 (96~100) ──
  // ════════════════════════════════════
  {
    people: 'a woman in her 20s in a leather jacket',
    location: 'a neon-lit Gangnam street at night',
    activity: 'walking along the street looking at her smartphone',
    angle: 'medium shot from the front with neon glow',
    mood: 'vibrant urban nightlife atmosphere',
    props: 'smartphone, a crossbody bag, and colorful neon lights behind',
  },
  {
    people: 'a man in his 30s in a dark turtleneck',
    location: 'a rooftop bar with city night skyline behind',
    activity: 'leaning on the railing holding a cocktail glass',
    angle: 'medium shot from a slight side angle with city lights',
    mood: 'sophisticated urban night atmosphere',
    props: 'cocktail glass, city skyline, and ambient lighting',
  },
  {
    people: 'two friends in their 20s in stylish evening outfits',
    location: 'a busy Hongdae street at night with buskers and lights',
    activity: 'walking and enjoying the night street atmosphere',
    angle: 'wide shot from the front showing the street scene',
    mood: 'exciting and youthful nightlife atmosphere',
    props: 'street lights, busker crowd in background, and shopping bags',
  },
  {
    people: 'a woman in her late 20s in a cozy sweater',
    location: 'a night view cafe on a hilltop overlooking city lights',
    activity: 'sitting by the window gazing at the city night view',
    angle: 'medium shot showing her profile and the view',
    mood: 'contemplative and beautiful night atmosphere',
    props: 'a warm drink, city night lights through the window, and candles',
  },
  {
    people: 'a man in his early 30s in a hoodie',
    location: 'a convenience store entrance at night with fluorescent light',
    activity: 'standing outside eating ramyeon from a cup',
    angle: 'medium shot from a slight angle',
    mood: 'casual and nostalgic late-night atmosphere',
    props: 'cup ramyeon, chopsticks, and convenience store glow',
  },
] as const;

// ════════════════════════════════════════════════════
// 한국 지명 풀 — 씬 타입별 실제 지역명 + 시각적 특징
// 100 씬 × 지명 풀 = 수천 개 유니크 조합
// ════════════════════════════════════════════════════

type SceneType = 'cafe' | 'outdoor' | 'home' | 'study' | 'office' | 'food' | 'transport' | 'fitness' | 'shopping' | 'pet' | 'hobby' | 'nightlife';

// 씬 인덱스 → 타입 매핑 (SCENE_SETS 순서와 동기화)
function getSceneType(index: number): SceneType {
  if (index <= 9) return 'cafe';
  if (index <= 21) return 'outdoor';
  if (index <= 31) return 'home';
  if (index <= 39) return 'study';
  if (index <= 51) return 'office';
  if (index <= 61) return 'food';
  if (index <= 67) return 'transport';
  if (index <= 75) return 'fitness';
  if (index <= 81) return 'shopping';
  if (index <= 86) return 'pet';
  if (index <= 94) return 'hobby';
  return 'nightlife';
}

export const KOREAN_LOCATIONS: Record<SceneType, readonly string[]> = {
  cafe: [
    // 서울
    'in Seongsu-dong, Seoul, known for its industrial red brick cafe district',
    'on Garosu-gil in Sinsa-dong, Seoul, a tree-lined boutique street',
    'in Yeonnam-dong, Seoul, near Gyeongui Line Forest Park',
    'in Ikseon-dong, Seoul, a renovated hanok (traditional house) alley',
    'in Hannam-dong, Seoul, an upscale neighborhood with design cafes',
    'in Samcheong-dong, Seoul, near Bukchon Hanok Village',
    'in Hapjeong-dong, Seoul, with artistic murals on the walls',
    'in Seochon, Seoul, a quiet alley near Gyeongbokgung Palace',
    'on Gyeongnidan-gil in Itaewon, Seoul, with a multicultural vibe',
    'in Euljiro, Seoul, a retro underground alley with vintage atmosphere',
    'in Mangwon-dong, Seoul, a local hipster neighborhood',
    // 수도권
    'in Bundang, Seongnam, a modern planned city cafe street',
    'in Paju Book City, Gyeonggi-do, surrounded by publishers and bookshops',
    // 지방
    'in Gamcheon Culture Village, Busan, with colorful hillside buildings',
    'in Haeundae, Busan, with ocean view through the window',
    'in Jeonju Hanok Village, with a traditional Korean courtyard visible',
    'in Jeju Island, with black volcanic stone walls and ocean breeze',
    'on Woljeongri Beach, Jeju, with turquoise sea visible outside',
    'in Gyeongpo, Gangneung, a seaside cafe town',
    'in Damyang, Jeollanam-do, near a famous bamboo forest',
  ],

  outdoor: [
    // 서울 공원/산/강
    'along the Han River at Yeouido, Seoul, with wide riverside paths',
    'on Namsan Mountain trail, Seoul, with Seoul Tower visible above',
    'on Bukhansan Mountain ridge, Seoul, with rocky peaks and pine trees',
    'in Olympic Park, Seoul, with wide green lawns and modern sculptures',
    'along the cherry blossom road in Yeouido, Seoul, in full bloom',
    'in Seonyudo Park, Seoul, a repurposed water treatment plant on the river',
    'at Ttukseom Hangang Park, Seoul, with reed fields and the river',
    'along Cheonggyecheon Stream, Seoul, a restored urban waterway',
    'in Seoul Forest, Seongdong-gu, with tall trees and deer park',
    'along Inwangsan Mountain trail, Seoul, with old fortress walls',
    'along Deoksugung Stone Wall Road, Seoul, a famous autumn walkway',
    'in Bukchon Hanok Village alleys, Seoul, with traditional rooftops',
    'at Nodeul Island, Seoul, a cultural island in the middle of Han River',
    // 수도권
    'in Nami Island, Chuncheon, with a lane of towering Metasequoia trees',
    'at Suwon Hwaseong Fortress, a UNESCO heritage site with stone walls',
    // 지방
    'on Jeju Olle Trail, with coastal cliffs and blue ocean',
    'at Haeundae Beach, Busan, with wide sandy shore and waves',
    'on Gyeongpo Beach, Gangneung, with pine trees along the coast',
    'at Seoraksan National Park, with dramatic autumn foliage',
    'in Boseong Green Tea Fields, Jeollanam-do, with rolling green hills',
    'at Taejongdae, Busan, with dramatic coastal cliffs',
    'along Nakdong River estuary, Busan, with migratory birds and wetlands',
  ],

  home: [
    'in a modern high-rise apartment in Gangnam, Seoul',
    'in a cozy studio apartment near Hongdae, Seoul',
    'in a renovated hanok-style house in Bukchon, Seoul',
    'in a new apartment complex in Yongsan, Seoul, with Han River view',
    'in a loft-style apartment in Seongsu-dong, Seoul',
    'in a villa in Mapo-gu, Seoul, with a small terrace',
    'in a modern officetel in Pangyo, Seongnam',
    'in a detached house in Jeju Island with a garden',
    'in a hillside villa in Haeundae, Busan, with ocean glimpse',
    'in a townhouse in Sejong City with a shared garden',
  ],

  study: [
    'in the National Library of Korea in Seocho-gu, Seoul',
    'at Kyobo Bookstore in Gwanghwamun, Seoul, a famous large bookstore',
    'at Youngpoong Bookstore in Jongno, Seoul',
    'at Arc N Book in Itaewon, Seoul, an architecturally stunning bookshop',
    'at a campus library in Yonsei University, Seoul',
    'at a campus library in Korea University, Seoul',
    'at a study cafe in Noryangjin, Seoul, known as the exam district',
    'at Starfield Library in COEX, Seoul, with towering bookshelves',
    'at a quiet independent bookshop in Mangwon-dong, Seoul',
    'at a reading room in Paju Book City, Gyeonggi-do',
    'at a community library in Jeju Island with ocean-view reading room',
  ],

  office: [
    'on Teheran-ro in Gangnam, Seoul, the startup and tech corridor',
    'in the Yeouido financial district, Seoul, with skyscrapers',
    'in Gwanghwamun/Jongno, Seoul, the traditional business center',
    'in Pangyo Techno Valley, Seongnam, Korea\'s Silicon Valley',
    'in Gasan Digital Complex, Seoul, a tech industrial zone',
    'near Yeoksam Station, Seoul, a startup hub area',
    'in Seongsu Social Venture Valley, Seoul, with creative startups',
    'in Mapo-gu, Seoul, a media and creative industry hub',
    'in a renovated office in Euljiro, Seoul, with retro-modern contrast',
    'near Seoul Station, Seoul, a newly developed business district',
    'in Songdo International Business District, Incheon',
    'in Daejeon Daedeok Research Complex, Korea\'s science hub',
  ],

  food: [
    'at Gwangjang Market, Seoul, the oldest traditional market',
    'in Myeongdong food alley, Seoul, famous for street food',
    'on Gyeongnidan-gil in Itaewon, Seoul, a multicultural food street',
    'in Jongno Pimatgol, Seoul, a historic back-alley food district',
    'in Hongdae food alley, Seoul, popular with young people',
    'in Sinsa-dong, Gangnam, Seoul, with upscale Korean restaurants',
    'at Jagalchi Fish Market, Busan, the largest seafood market',
    'in Jeonju Hanok Village, famous for Korean bibimbap',
    'at Dongmun Market, Jeju, with fresh seafood and local cuisine',
    'at Sokcho Jungang Market, famous for dakgangjeong fried chicken',
    'in Ikseon-dong, Seoul, with renovated hanok restaurants',
    'at Tongin Market, Seoul, near Gyeongbokgung with dosirak lunch boxes',
    'at Noryangjin Fish Market, Seoul, with fresh raw fish stalls',
    'in Euljiro Nogari Alley, Seoul, a retro street food spot',
    'at Haeundae Halmae Gukbap Alley, Busan, a local soup restaurant row',
  ],

  transport: [
    'at Gangnam Station, Seoul, one of the busiest subway hubs',
    'at Seoul Station, Seoul, a grand historic train terminal',
    'at Hongdae-ipgu Station, Seoul, with youthful murals and buskers',
    'at Yeouido Station, Seoul, near the financial district',
    'at Pangyo Station, Seongnam, used by tech workers',
    'on a KTX bullet train traveling the Seoul-Busan line',
    'at Incheon International Airport departure terminal',
    'on the Gyeongui-Jungang Line, passing through Mangwon and Hapjeong',
    'at Express Bus Terminal Station, Seoul, the largest transit hub',
    'crossing Gwanghwamun Square, Seoul, with Gyeongbokgung in the distance',
  ],

  fitness: [
    'along the Han River bicycle path near Banpo Bridge, Seoul',
    'on Namsan Circular Trail, Seoul, a popular urban hiking path',
    'on Bukhansan Baegundae trail, Seoul, a challenging mountain hike',
    'at Olympic Park jogging trail, Seoul, with a lake and green space',
    'along Yangjae Stream walking path, Seoul, a peaceful urban trail',
    'along Gyeongpo Beach boardwalk, Gangneung, with ocean waves',
    'on Hallasan Mountain trail, Jeju, Korea\'s highest peak',
    'at Jamsil Sports Complex area, Seoul, with the Olympic stadium',
    'on Jeju Olle Trail coastal path, with dramatic sea cliffs',
    'at Bukhansan Ui-dong trail entrance, Seoul, with autumn maple trees',
    'along Nakdonggang Bike Path, the longest riverside cycling route',
    'at Seoraksan Mountain base camp area, with fresh mountain air',
  ],

  shopping: [
    'at Starfield COEX Mall in Gangnam, Seoul, a massive underground mall',
    'at Times Square in Yeongdeungpo, Seoul, with its huge glass atrium',
    'at IFC Mall in Yeouido, Seoul, a premium shopping complex',
    'on Garosu-gil in Sinsa-dong, Seoul, lined with fashion boutiques',
    'on Hongdae shopping street, Seoul, with indie fashion stores',
    'in Myeongdong, Seoul, Korea\'s most famous shopping district',
    'at Dongdaemun Design Plaza (DDP), Seoul, a futuristic shopping hub',
    'on Apgujeong Rodeo Street, Seoul, a luxury fashion district',
    'at The Hyundai Seoul in Yeouido, a trendy department store',
    'at Lotte World Mall in Jamsil, Seoul, next to Lotte Tower',
    'at Starfield Hanam, Gyeonggi-do, Korea\'s largest shopping mall',
    'in Insadong, Seoul, with traditional craft and souvenir shops',
    'at Shinsegae Centum City, Busan, the world\'s largest department store',
  ],

  pet: [
    'at Seoul Forest pet-friendly zone, Seongdong-gu, Seoul',
    'at Ttukseom Hangang Park dog area, Seoul, near the river',
    'in Olympic Park wide lawn, Seoul, with autumn trees',
    'at Boramae Park pet playground, Seoul',
    'along Yangjae Citizens\' Forest walking path, Seoul',
    'at Haneul Park (Sky Park), Seoul, with tall silver grass fields',
    'on a beach in Jeju Island, with black sand and waves',
    'at Gyeongpo Lake walking trail, Gangneung, with willow trees',
    'at World Cup Park, Seoul, with wide grassy meadows',
    'in Ilsan Lake Park, Goyang, with a large fountain and walking paths',
  ],

  hobby: [
    'in a Seongsu-dong workshop studio, Seoul, the craft district',
    'in a Hongdae art studio, Seoul, surrounded by street art',
    'in an Itaewon creative space, Seoul, with multicultural influence',
    'in a Bukchon hanok craft workshop, Seoul, with traditional roof tiles',
    'in a Mullae-dong metal art studio, Seoul, an industrial art zone',
    'at a pottery workshop in Icheon, Gyeonggi-do, Korea\'s ceramics capital',
    'in a Yeonnam-dong creative studio, Seoul, near the park',
    'at a cultural center workshop in Insadong, Seoul',
    'in a Mangwon-dong shared studio, Seoul, a local artist neighborhood',
    'at an art residency in Ganghwa Island, with rural inspiration',
  ],

  nightlife: [
    'on a neon-lit Gangnam street, Seoul, with bright signage everywhere',
    'on Hongdae street, Seoul, with live buskers and colorful lights',
    'in Itaewon, Seoul, with international bars and diverse crowd',
    'on Apgujeong Rodeo Street, Seoul, with luxury boutiques lit up',
    'in Seongsu-dong at night, Seoul, with trendy warehouse bars',
    'in Euljiro at night, Seoul, with retro neon and hidden hip bars',
    'along Haeundae Beach at night, Busan, with ocean-reflecting lights',
    'at Gwanganli Beach, Busan, with the illuminated Diamond Bridge',
    'in Jeonpo Cafe Street, Busan, with warm evening cafe glow',
    'at Nampo-dong BIFF Square, Busan, a vibrant night market area',
  ],
};

// 하위 호환용: 기존 VARIATION_POOL 인터페이스 유지
export const VARIATION_POOL = {
  people: SCENE_SETS.map(s => s.people),
  location: SCENE_SETS.map(s => s.location),
  activity: SCENE_SETS.map(s => s.activity),
  angle: SCENE_SETS.map(s => s.angle),
  mood: SCENE_SETS.map(s => s.mood),
  props: SCENE_SETS.map(s => s.props),
} as const;

// 기존 이미지들의 조합 기록 파일 경로
// Vercel 서버리스 환경에서는 /tmp만 쓰기 가능
const isVercel = process.env.VERCEL === '1';
const USED_COMBOS_PATH = isVercel
  ? '/tmp/used-image-combos.json'
  : path.join(process.cwd(), 'src', 'lib', 'used-image-combos.json');

// 사용된 조합 로드
export async function loadUsedCombos(): Promise<VariationCombo[]> {
  try {
    const data = await fs.readFile(USED_COMBOS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 사용된 조합 저장
export async function saveUsedCombo(combo: VariationCombo): Promise<void> {
  const combos = await loadUsedCombos();
  combos.push(combo);

  // 최근 500개만 유지 (씬100 × 지명 = 1500+ 조합 중 일부 기억)
  const recentCombos = combos.slice(-500);
  await fs.writeFile(USED_COMBOS_PATH, JSON.stringify(recentCombos, null, 2));
}

// 랜덤 선택 함수
function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 조합의 해시 생성 (유사도 비교용)
function getComboHash(combo: VariationCombo): string {
  const str = `${combo.people}|${combo.location}|${combo.activity}`;
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 8);
}

// 씬 세트에 한국 지명을 합성하여 유니크 조합 생성
// 100 씬 × 10~22 지명/타입 = 약 1,500+ 조합
export async function generateUniqueVariation(): Promise<VariationCombo> {
  const usedCombos = await loadUsedCombos();
  const usedHashes = new Set(usedCombos.map(getComboHash));

  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    // 1. 랜덤 씬 세트 선택
    const sceneIndex = Math.floor(Math.random() * SCENE_SETS.length);
    const scene = SCENE_SETS[sceneIndex];

    // 2. 씬 타입에 맞는 한국 지명 랜덤 선택
    const sceneType = getSceneType(sceneIndex);
    const locationFlavors = KOREAN_LOCATIONS[sceneType];
    const flavor = pickRandom(locationFlavors);

    // 3. 지명을 location에 합성
    const combo: VariationCombo = {
      ...scene,
      location: `${scene.location}, ${flavor}`,
    };

    const hash = getComboHash(combo);
    if (!usedHashes.has(hash)) {
      return combo;
    }

    attempts++;
  }

  // fallback: 랜덤 조합 반환 (사실상 도달 불가 — 조합 수 1500+)
  const fallbackIndex = Math.floor(Math.random() * SCENE_SETS.length);
  const fallbackScene = SCENE_SETS[fallbackIndex];
  const fallbackType = getSceneType(fallbackIndex);
  const fallbackFlavor = pickRandom(KOREAN_LOCATIONS[fallbackType]);
  return {
    ...fallbackScene,
    location: `${fallbackScene.location}, ${fallbackFlavor}`,
  };
}

// 하이브리드 이미지 프롬프트 생성 (영어 프롬프트)
export function buildImagePrompt(title: string, variation: VariationCombo): string {
  return `Create a photorealistic 1200x630 stock photo of a Korean person's daily scene.

Subject: ${variation.people}
Setting: ${variation.location}
Action: ${variation.activity}
Camera: ${variation.angle}
Mood: ${variation.mood}
Props: ${variation.props}

Style requirements:
- Korean person(s) in a natural, everyday setting
- Modern, clean, bright environment
- Natural lighting, high quality photography
- Photorealistic stock photo style
- Landscape orientation (1200x630)

IMPORTANT — SNS content creation context (must include naturally):
- The scene should suggest social media / SNS content creation
- Include ONE of these naturally: someone filming with a smartphone on a tripod, a friend recording on their phone, a person taking a selfie, a phone propped up recording a video, or someone checking social media on their phone
- The smartphone or filming setup should feel like a natural part of the moment, as if the person is creating or consuming SNS content in their daily life

STRICTLY FORBIDDEN (do NOT include any of these):
- NO text, letters, numbers, watermarks, logos, captions
- NO flags, national symbols, emblems, banners
- NO abstract shapes or geometric patterns
- NO signs, posters, or written content visible in the scene`;
}

// 특정 슬러그용 시드 기반 프롬프트 (재생성 시 일관성 + 지명 합성)
export function buildSeededImagePrompt(slug: string): string {
  const hash = crypto.createHash('md5').update(slug).digest('hex');
  const sceneIndex = parseInt(hash.slice(0, 4), 16) % SCENE_SETS.length;
  const scene = SCENE_SETS[sceneIndex];

  // 지명도 시드 기반으로 선택 (동일 slug → 동일 지명)
  const sceneType = getSceneType(sceneIndex);
  const locationFlavors = KOREAN_LOCATIONS[sceneType];
  const flavorIndex = parseInt(hash.slice(4, 8), 16) % locationFlavors.length;
  const flavor = locationFlavors[flavorIndex];

  const variation: VariationCombo = {
    ...scene,
    location: `${scene.location}, ${flavor}`,
  };

  return buildImagePrompt('', variation);
}

// 기존 이미지 해시 계산 (간단한 perceptual hash 대용)
export async function getImageFingerprint(imagePath: string): Promise<string | null> {
  try {
    const buffer = await fs.readFile(imagePath);
    // 파일 크기 + 처음/중간/끝 바이트 조합으로 간단한 fingerprint
    const size = buffer.length;
    const sample = Buffer.concat([
      buffer.slice(0, 100),
      buffer.slice(Math.floor(size / 2), Math.floor(size / 2) + 100),
      buffer.slice(-100)
    ]);
    return crypto.createHash('md5').update(sample).digest('hex');
  } catch {
    return null;
  }
}

// 이미지 중복 검사
export async function checkImageDuplicate(
  newImageBuffer: Buffer,
  existingImagesDir: string
): Promise<{ isDuplicate: boolean; matchedFile?: string }> {
  try {
    const files = await fs.readdir(existingImagesDir);
    const imageFiles = files.filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));

    // 새 이미지의 fingerprint
    const size = newImageBuffer.length;
    const newSample = Buffer.concat([
      newImageBuffer.slice(0, 100),
      newImageBuffer.slice(Math.floor(size / 2), Math.floor(size / 2) + 100),
      newImageBuffer.slice(-100)
    ]);
    const newHash = crypto.createHash('md5').update(newSample).digest('hex');

    for (const file of imageFiles) {
      const filePath = path.join(existingImagesDir, file);
      const existingHash = await getImageFingerprint(filePath);

      if (existingHash === newHash) {
        return { isDuplicate: true, matchedFile: file };
      }
    }

    return { isDuplicate: false };
  } catch {
    return { isDuplicate: false };
  }
}
