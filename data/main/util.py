# --------------------------------
# GameFrame utils                -
# Copyright (C) 2018 GameFrame   -
# --------------------------------

import os

from PIL import Image
from tqdm import tqdm

from aws import upload_image
from cache import load_working_set, name_game
from common import CDN_URI
from orm import Genre, Platform
from sources import igdb, newsapi, steam


def append_csv(csv, item):
    """
    Append an item to a CSV string. Duplicates are ignored.
    """
    item = str(item)
    if csv is None:
        return item

    if item not in csv:
        if len(csv) > 0:
            csv += ","

        csv += item

    return csv


def choose_best_cover(header_cd, cover, cover_cd):
    """
    Choose the best game cover.
    """
    if cover is None:
        # The CD version of the IGDB cover won't exist either
        return header_cd
    if header_cd is None:
        # Choose between the normal IGDB cover or the CD version
        if cover_cd is None:
            return cover

        cover_w, cover_h = Image.open(cover).size
        cover_cd_w, cover_cd_h = Image.open(cover_cd).size

        # Return the larger image
        if cover_cd_w * cover_cd_h > cover_w * cover_h:
            return cover_cd
        else:
            return cover

    # TODO Choose between all three
    return header_cd


def merge_covers(db):
    """
    Merge game covers into the working set and flush the database.
    """
    load_working_set()

    print("[MAIN ] Merging covers")

    for name, game in tqdm(name_game.items()):
        if game.cover is not None:
            continue

        cover1 = "%s/%s.png" % (steam.CACHE_CD, game.steam_id)
        cover2 = "%s/%s" % (igdb.CACHE_COVER, game.igdb_id)
        cover3 = "%s/%s.png" % (igdb.CACHE_CD, game.igdb_id)

        cover = choose_best_cover(cover1 if os.path.isfile(cover1) else None,
                                  cover2 if os.path.isfile(cover2) else None,
                                  cover3 if os.path.isfile(cover3) else None)
        if cover is not None:
            if cover == cover2:
                # Just link to someone else's CDN
                game.cover = cover
            else:
                unique = "%d-%d.png" % (0 if game.steam_id is None else game.steam_id,
                                        0 if game.igdb_id is None else game.igdb_id)

                # Upload cover
                upload_image(cover, 'cover/' + unique)

                # Update game
                game.cover = "%s/%s" % (CDN_URI, unique)

    db.session.commit()
    print("[MAIN ] Merge complete")


def trim(db):
    """
    Remove low quality models.
    """
    load_working_set()

    print("[MAIN ] Trimming database")

    # Remove games without covers and screenshots, with short descriptions,
    # or a low number of primary connections
    for name, game in tqdm(name_game.items()):
        if game.cover is None or game.screenshots is None or game.summary is None \
                or len(game.summary) < 10 or len(game.developers) == 0 \
                or len(game.articles) == 0:
            # TODO remove from working set
            # Remove from database
            db.session.delete(game)

    # Remove developers without logos, with short descriptions, or a low number
    # of primary connections
    for name, dev in tqdm(name_developer.items()):
        if dev.logo is None or len(dev.games) == 0 or len(dev.articles) == 0:
            # TODO remove from working set
            # Remove from database
            db.session.delete(dev)

    db.session.commit()
    print("[MAIN ] Trim complete")


def reset(db):
    """
    Reset the database.
    """

    # Delete everything
    db.reflect()
    db.drop_all()

    # Create database schema
    db.create_all()

    # Insert static genres
    for i, n in {1: 'Action', 2: 'Point-and-click', 4: 'Fighting', 5: 'Shooter',
                 6: 'Free to Play', 7: 'Music', 8: 'Platformer', 9: 'Puzzle',
                 10: 'Racing', 11: 'Real Time Strategy', 12: 'RPG', 13: 'Simulation',
                 14: 'Sports', 15: 'Strategy', 16: 'Turn-based strategy', 17: 'Casual',
                 18: 'Early Access', 19: 'Massively Multiplayer', 20: 'Violent',
                 21: 'Nudity', 22: 'Gore', 23: 'Education', 24: 'Tactical', 25: "Hack and slash", 26: 'Trivia',
                 27: 'Sexual Content', 30: 'Pinball', 31: 'Adventure', 32: 'Indie', 33: 'Arcade'}.items():
        db.session.add(Genre(genre_id=i, name=n))

    # Insert static platforms
    for i, n in {3: 'Linux', 4: 'Nintendo 64', 5: 'Wii', 6: 'PC (Microsoft Windows)',
                 7: 'PlayStation', 8: 'PlayStation 2', 9: 'PlayStation 3', 11: 'Xbox', 12: 'Xbox 360',
                 13: 'PC DOS', 14: 'Mac', 15: 'Commodore C64/128', 16: 'Amiga', 18: 'Nintendo Entertainment System (NES)',
                 19: 'Super Nintendo Entertainment System (SNES)', 20: 'Nintendo DS', 21: 'Nintendo GameCube',
                 22: 'Game Boy Color', 23: 'Dreamcast', 24: 'Game Boy Advance', 25: 'Amstrad CPC', 26: 'ZX Spectrum',
                 27: 'MSX', 29: 'Sega Mega Drive/Genesis', 30: 'Sega 32X', 32: 'Sega Saturn', 33: 'Game Boy', 34: 'Android',
                 35: 'Sega Game Gear', 36: 'Xbox Live Arcade', 37: 'Nintendo 3DS', 38: 'PlayStation Portable', 39: 'iOS',
                 41: 'Wii U', 42: 'N-Gage', 44: 'Tapwave Zodiac', 45: 'PlayStation Network', 46: 'PlayStation Vita',
                 47: 'Virtual Console (Nintendo)', 48: 'PlayStation 4', 49: 'Xbox One', 50: '3DO Interactive Multiplayer',
                 51: 'Family Computer Disk System', 52: 'Arcade', 53: 'MSX2', 55: 'Mobile', 56: 'WiiWare', 57: 'WonderSwan',
                 58: 'Super Famicom', 59: 'Atari 2600', 60: 'Atari 7800', 61: 'Atari Lynx', 62: 'Atari Jaguar',
                 63: 'Atari ST/STE', 64: 'Sega Master System', 65: 'Atari 8-bit', 66: 'Atari 5200', 67: 'Intellivision',
                 68: 'ColecoVision', 69: 'BBC Microcomputer System', 70: 'Vectrex', 71: 'Commodore VIC-20', 72: 'Ouya',
                 73: 'BlackBerry OS', 74: 'Windows Phone', 75: 'Apple II', 77: 'Sharp X1', 78: 'Sega CD', 79: 'Neo Geo MVS',
                 80: 'Neo Geo AES', 82: 'Web browser', 84: 'SG-1000', 85: 'Donner Model 30', 86: 'TurboGrafx-16/PC Engine',
                 87: 'Virtual Boy', 88: 'Odyssey', 89: 'Microvision', 90: 'Commodore PET', 91: 'Bally Astrocade',
                 92: 'SteamOS', 93: 'Commodore 16', 94: 'Commodore Plus/4', 95: 'PDP-1', 96: 'PDP-10', 97: 'PDP-8',
                 98: 'DEC GT40', 99: 'Family Computer (FAMICOM)', 100: 'Analogue electronics', 101: 'Ferranti Nimrod Computer',
                 102: 'EDSAC', 103: 'PDP-7', 104: 'HP 2100', 105: 'HP 3000', 106: 'SDS Sigma 7',
                 107: 'Call-A-Computer time-shared mainframe computer system', 108: 'PDP-11', 109: 'CDC Cyber 70',
                 110: 'PLATO', 111: 'Imlac PDS-1', 112: 'Microcomputer', 113: 'OnLive Game System', 114: 'Amiga CD32',
                 115: 'Apple IIGS', 116: 'Acorn Archimedes', 117: 'Philips CD-i', 118: 'FM Towns', 119: 'Neo Geo Pocket',
                 120: 'Neo Geo Pocket Color', 121: 'Sharp X68000', 122: 'Nuon', 123: 'WonderSwan Color', 124: 'SwanCrystal',
                 125: 'PC-8801', 126: 'TRS-80', 127: 'Fairchild Channel F', 128: 'PC Engine SuperGrafx',
                 129: 'Texas Instruments TI-99', 130: 'Nintendo Switch', 131: 'Nintendo PlayStation', 132: 'Amazon Fire TV',
                 133: 'Philips Videopac G7000', 134: 'Acorn Electron', 135: 'Hyper Neo Geo 64', 136: 'Neo Geo CD',
                 137: 'New Nintendo 3DS', 138: 'VC 4000', 139: '1292 Advanced Programmable Video System', 140: 'AY-3-8500',
                 141: 'AY-3-8610', 142: 'PC-50X Family', 143: 'AY-3-8760', 144: 'AY-3-8710', 145: 'AY-3-8603', 146: 'AY-3-8605',
                 147: 'AY-3-8606', 148: 'AY-3-8607', 149: 'PC-98', 150: 'Turbografx-16/PC Engine CD', 151: 'TRS-80 Color Computer',
                 152: 'FM-7', 153: 'Dragon 32/64', 154: 'Amstrad PCW', 155: 'Tatung Einstein', 156: 'Thomson MO5', 157: 'NEC PC-6000 Series',
                 158: 'Commodore CDTV', 159: 'Nintendo DSi', 160: 'Nintendo eShop', 161: 'Windows Mixed Reality', 162: 'Oculus VR',
                 163: 'SteamVR', 164: 'Daydream', 165: 'PlayStation VR'}.items():
        db.session.add(Platform(platform_id=i, name=n))

    db.session.commit()
