# --------------------------------
# IGN API scraper                -
# Copyright (C) 2018 GameFrame   -
# --------------------------------

import json
import os
import re
from codecs import open
from datetime import datetime

from newsapi import NewsApiClient
from ratelimit import rate_limited
from tqdm import tqdm

from cache import WS, Cache, load_working_set
from orm import Article, Developer, Game

from .util import condition, condition_developer, condition_heavy, keywordize, xappend

"""
The NEWS API keyfile
"""
API_KEYS = os.environ['KEYS_NEWSAPI']
assert os.path.isfile(API_KEYS)

"""
The API key iterator
"""
with open(API_KEYS) as h:
    KEY_ITER = iter([s.strip() for s in h.readlines()])

"""
The global NEWSAPI client
"""
API = NewsApiClient(api_key=next(KEY_ITER))

"""
The article cache
"""
CACHE_ARTICLE = Cache("/newsapi/articles")

"""
The maximum number of article pages to request
"""
MAX_PAGES = 10

"""
Only allow sources from this whitelist
"""
WHITELIST = ['Nintendolife.com', 'Gonintendo.com', 'Playstation.com', 'IGN',
             'Starwars.com', 'Mmorpg.com', 'Rockpapershotgun.com', 'Kotaku.com',
             'Kotaku.com.au', 'Gameinformer.com', '1up.com', 'Mactrast.com',
             'Techtimes.com', 'Pcworld.com', 'Techdirt.com', 'Ongamers.com',
             'Playstationlifestyle.net',  'Mynintendonews.com', 'Gamespot.com',
             'Multiplayer.it', 'Toucharcade.com', 'Shacknews.com', 'Kinja.com',
             'Wccftech.com',  'Gamesasylum.com', 'Pcgamer.com', 'Vrfocus.com',
             'Ars Technica', 'Blizzardwatch.com', 'Gamasutra.com', 'Gamespy.com',
             'Gamesradar.com', 'Gametyrant.com', 'Gamingbolt.com', 'Phoronix.com',
             'Gamingonlinux.com', 'Tweaktown.com',  'Gameplanet.co.nz',
             'Gamezebo.com', 'Gamezombie.tv', 'Giantbomb.com', 'Gamespark.jp',
             'Stratics.com', 'Escapistmagazine.com', 'Linuxtoday.com',
             'Omgubuntu.co.uk', 'Idownloadblog.com']

"""
Keywords that should have very few relevant games
"""
BLACKLIST_KEYWORDS = ['amazon', 'trump', 'morgage', 'chuckit!', 'walmart']
BLACKLIST = re.compile(
    "\W+" + "\W.*$|\W+".join(BLACKLIST_KEYWORDS) + '\W.*$', re.IGNORECASE)


def rq_articles(model):
    """
    Request articles from NewsAPI
    """

    global API
    articles = []
    p = 1

    while True:
        rq = API.get_everything(language='en', sort_by='relevancy', page_size=100,
                                page=p, q=keywordize(model))

        if rq['status'] == 'error':
            API = NewsApiClient(api_key=next(KEY_ITER))
            continue

        # Basic filtering
        for article_json in rq['articles']:

            # Filter Outlet
            if article_json.get('source', {}).get('name', '') not in WHITELIST:
                continue

            # Filter title
            if not article_json.get('title'):
                continue

            # Filter Introduction
            if not article_json.get('description'):
                continue

            # Filter Author
            if not article_json.get('author'):
                continue

            # Filter Timestamp
            if not article_json.get('publishedAt'):
                continue

            # Filter Image
            if not article_json.get('urlToImage'):
                continue

            # Filter Article link
            if not article_json.get('url'):
                continue

            articles.append(article_json)

        if rq['totalResults'] > p * 100 and p < MAX_PAGES:
            # Move to the next page
            p += 1
            continue
        else:
            break

    return articles


def build_article(model, article_json):
    """
    Build a new Article object from the raw data
    """
    c_title = condition(article_json['title'])

    # Consider duplicate titles to be the same article
    if c_title in WS.articles:
        return WS.articles[c_title]

    # Filter blacklist
    if BLACKLIST.search(c_title) is not None:
        return None

    # Filter relevancy
    name = condition_heavy(model.name)
    if name not in condition_heavy(article_json['title']) and \
            name not in condition_heavy(article_json['description']):
        return None

    article = Article()
    article.title = article_json['title']
    article.c_title = c_title
    article.outlet = article_json['source']['name']
    article.introduction = article_json['description']
    article.author = article_json['author']
    article.timestamp = datetime.strptime(
        article_json['publishedAt'], "%Y-%m-%dT%H:%M:%SZ")
    article.cover = article_json['urlToImage']
    article.article_link = article_json['url']

    # Adjust URLs if needed
    if article.cover.startswith('//'):
        article.cover = 'http:' + article.cover

    if article.cover.startswith('/'):
        return None

    if article.article_link.startswith('//'):
        article.article_link = 'http:' + article.article_link

    return article


def gather_articles():
    """
    Search for articles related to games and download them to the cache
    """
    load_working_set()

    print("[NWAPI] Gathering articles by game")
    for game in tqdm(WS.game_name.values()):
        if not CACHE_ARTICLE.exists(game.name):
            articles = rq_articles(game)
            # Write to the cache
            CACHE_ARTICLE.write_json(
                game.name.replace("/", "\\"), articles)

    print("[NWAPI] Gather Complete")


def merge_articles():
    """
    Merge cached articles into the working set and link
    """
    load_working_set()

    print("[NWAPI] Merging/Linking articles")
    for filename in tqdm(CACHE_ARTICLE.list_dir()):

        if not filename.replace("\\", "/") in WS.game_name:
            continue
        game = WS.game_name[filename.replace("\\", "/")]

        for article_json in CACHE_ARTICLE.read_json(filename):

            # Build Article
            article = build_article(game, article_json)
            if article is None:
                continue

            # Setup a relationship between the article and game
            game.articles.append(article)

            # Setup a relationship between the article and any developers
            for developer in game.developers:
                if article not in developer.articles:
                    developer.articles.append(article)

            # Add to working set
            WS.add_article(article)

    print("[NWAPI] Merge/Link Complete")
