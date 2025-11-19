import os
import json
import shutil

DOCS_DIR = 'd:\\youph\\Wiki\\shikaku-wiki\\docs'

# Group Definitions: (FolderName, JapaneseLabel)
GROUPS = {
    'business': {
        'Management': '経営・戦略',
        'Legal': '法務・知財',
        'Finance': '財務・会計',
        'Marketing': '営業・マーケティング',
        'HR': '人事・労務',
        'Health': '健康・安全',
        'General': 'その他実務'
    },
    'technology': {
        'Development': '開発・プログラミング',
        'Infrastructure': 'インフラ・ネットワーク',
        'Data': 'データ・AI',
        'Security': 'セキュリティ',
        'Management': 'マネジメント・運用',
        'Construction': '建築・設備',
        'General': 'その他技術'
    },
    'lifestyle': {
        'Language': '語学',
        'Culture': '文化・教養',
        'Food': '食・料理',
        'Health': '健康・生活',
        'General': 'その他'
    },
    'industry': {
        'Construction': '建設・土木',
        'Manufacturing': '製造・生産',
        'Safety': '安全・品質',
        'General': 'その他産業'
    },
    'medical-welfare': {
        'Medical': '医療・薬学',
        'Welfare': '福祉・介護',
        'General': 'その他'
    },
    'safety-environment': {
        'Safety': '安全・防災',
        'Environment': '環境・衛生',
        'General': 'その他'
    },
    'legal-accounting': {
        'Legal': '法律・法務',
        'Accounting': '会計・税務',
        'General': 'その他'
    },
    'creative': {
        'Design': 'デザイン・芸術',
        'Media': 'メディア・編集',
        'General': 'その他'
    },
    'etc': {
        'General': 'その他'
    }
}

# Term Translations (Roman -> Japanese)
TRANSLATIONS = {
    # Business
    'keiei': '経営', 'kikaku': '企画', 'jidouka': '自動化', 'risk': 'リスク管理', 'security': 'セキュリティ',
    'choutatsu': '調達', 'houmu': '法務', 'houritsu': '法律', 'chizai': '知的財産', 'roumu': '労務',
    'nenkin': '年金', 'bunseki': '分析', 'kaikei': '会計', 'yoshin': '与信', 'shouken': '証券',
    'toushi': '投資', 'hoken': '保険', 'fudousan': '不動産', 'juutaku': '住宅', 'hanbai': '販売',
    'sekkyaku': '接客', 'koukoku': '広告', 'seo': 'SEO', 'sns': 'SNS', 'crm': 'CRM', 'service': 'サービス',
    'jinji': '人事', 'career': 'キャリア', 'manner': 'マナー', 'setsuguu': '接遇', 'bunshou': '文章',
    'jitsumu': '実務', 'anzen-eisei': '安全衛生', 'kenkou': '健康', 'mental': 'メンタル', 'life': '生活',
    'kaijo': '介助', 'houshoku': '宝飾・ファッション', 'ippan': '一般',
    
    # Technology
    'kaihatsu': '開発', 'web': 'Web', 'web-seisaku': 'Web制作', 'programming': 'プログラミング',
    'ajairu': 'アジャイル', 'devops': 'DevOps', 'infrastructure': 'インフラ', 'network': 'ネットワーク',
    'server': 'サーバー', 'cloud': 'クラウド', 'kasouka': '仮想化', 'kiban': '基盤', 'data': 'データ',
    'database': 'データベース', 'toukei': '統計', 'ml': '機械学習', 'ai': 'AI', 'hoan': '保安',
    'pm': 'PM', 'management': 'マネジメント', 'un-you': '運用', 'kansa': '監査', 'kouji': '工事',
    'setsubi': '設備', 'denki': '電気', 'tsuushin': '通信', 'iot': 'IoT', 'architecture': 'アーキテクチャ',
    'design': 'デザイン', 'ux': 'UX', 'writing': 'ライティング', 'support': 'サポート',
    
    # Lifestyle
    'eigo': '英語', 'chuugoku-go': '中国語', 'kankoku-go': '韓国語', 'france-go': 'フランス語',
    'duits-go': 'ドイツ語', 'spain-go': 'スペイン語', 'italia-go': 'イタリア語', 'gogaku': '語学',
    'bunka': '文化', 'rekishi': '歴史', 'chiri': '地理', 'kokugo': '国語', 'kyouiku': '教育',
    'shoku': '食', 'chouri': '調理', 'washoku': '和食', 'kashi': '菓子', 'inryou': '飲料',
    'seika': '製菓', 'shokuzai': '食材', 'choumi': '調味', 'fukushi': '福祉', 'sumai': '住まい',
    'reform': 'リフォーム', 'seikatsu': '生活', 'kankou': '観光', 'ryokou': '旅行', 'onsen': '温泉',
    
    # Industry
    'kensetsu': '建設', 'doboku': '土木', 'kenki': '建機', 'sokuryou': '測量', 'sekkei': '設計',
    'sekisan': '積算', 'sekou': '施工', 'shikou': '施工', 'kanri': '管理', 'anzen': '安全',
    'hinshitsu': '品質', 'seizou': '製造', 'kikai': '機械', 'yousetsu': '溶接', 'seibi': '整備',
    'unten': '運転', 'soujuu': '操縦', 'butsuryuu': '物流', 'unkou': '運行', 'yusou': '輸送',
    
    # Medical
    'iryou': '医療', 'kango': '看護', 'kaigo': '介護', 'kusuri': '薬学', 'eiyou': '栄養',
    'hoken': '保健', 'koushuu-eisei': '公衆衛生', 'shika': '歯科', 'seishin': '精神',
    'rehabilitation': 'リハビリ', 'kensa': '検査', 'houshasen': '放射線', 'jimu': '事務',
    
    # Safety
    'bousai': '防災', 'shoubou': '消防', 'kankyou': '環境', 'kougai': '公害', 'haikibutsu': '廃棄物',
    'mizu-shori': '水処理', 'kagaku': '化学', 'dokubutsu': '毒物', 'gekimbutsu': '劇物',
    
    # Legal
    'shigyou': '士業', 'gyousei': '行政', 'shihou': '司法', 'zeimu': '税務', 'kaikei': '会計',
    
    # Creative
    'douga': '動画', 'gazou': '画像', 'shikisai': '色彩', 'iro': '色', 'dtp': 'DTP',
    'enshutsu': '演出', 'kousei': '校正'
}

# Mapping Logic (Dir -> Group)
def get_group(top_dir, sub_dir):
    if top_dir == 'business':
        if sub_dir in ['keiei', 'kikaku', 'jidouka', 'risk', 'security', 'choutatsu']: return 'Management'
        if sub_dir in ['houmu', 'houritsu', 'chizai', 'roumu', 'nenkin']: return 'Legal'
        if sub_dir in ['bunseki', 'kaikei', 'yoshin', 'shouken', 'toushi', 'hoken', 'fudousan', 'juutaku']: return 'Finance'
        if sub_dir in ['hanbai', 'sekkyaku', 'koukoku', 'seo', 'sns', 'crm', 'service']: return 'Marketing'
        if sub_dir in ['jinji', 'career', 'manner', 'setsuguu', 'bunshou', 'jitsumu']: return 'HR'
        if sub_dir in ['anzen-eisei', 'kenkou', 'mental', 'life', 'kaijo']: return 'Health'
        return 'General'
    
    if top_dir == 'technology':
        if sub_dir in ['kaihatsu', 'web', 'web-seisaku', 'programming', 'ajairu', 'devops', 'writing', 'ux', 'design']: return 'Development'
        if sub_dir in ['infrastructure', 'network', 'server', 'cloud', 'kasouka', 'kiban', 'tsuushin', 'iot']: return 'Infrastructure'
        if sub_dir in ['data', 'database', 'toukei', 'ml', 'ai', 'bunseki']: return 'Data'
        if sub_dir in ['security', 'hoan']: return 'Security'
        if sub_dir in ['pm', 'management', 'un-you', 'kansa', 'support']: return 'Management'
        if sub_dir in ['kouji', 'setsubi', 'denki', 'reitou', 'reitou-kuuchou', 'kankyou', 'bousai', 'building-men']: return 'Construction'
        return 'General'

    if top_dir == 'lifestyle':
        if sub_dir in ['eigo', 'chuugoku-go', 'kankoku-go', 'france-go', 'duits-go', 'spain-go', 'italia-go', 'gogaku', 'hon-yaku']: return 'Language'
        if sub_dir in ['bunka', 'rekishi', 'chiri', 'kokugo', 'kyouiku', 'bijutsu']: return 'Culture'
        if sub_dir in ['shoku', 'chouri', 'washoku', 'kashi', 'inryou', 'seika', 'shokuzai', 'choumi', 'nyuuseihin']: return 'Food'
        if sub_dir in ['kenkou', 'fukushi', 'sumai', 'reform', 'seikatsu', 'kankou', 'ryokou', 'onsen', 'leisure']: return 'Health'
        return 'General'
        
    if top_dir == 'industry':
        if sub_dir in ['kensetsu', 'doboku', 'kenki', 'sokuryou', 'sekkei', 'sekisan', 'shikou', 'kouzou', 'jiban', 'kasetsu', 'katawaku', 'shiage', 'naisou', 'gaisou', 'gaikou', 'zouen']: return 'Construction'
        if sub_dir in ['seizou', 'kikai', 'yousetsu', 'seibi', 'unten', 'soujuu', 'kanagata', 'seikei', 'zairyou']: return 'Manufacturing'
        if sub_dir in ['anzen', 'hinshitsu', 'kanri', 'hozen', 'tenken', 'kensa', 'hyouka']: return 'Safety'
        return 'General'

    if top_dir == 'medical-welfare':
        if sub_dir in ['iryou', 'kango', 'kusuri', 'eiyou', 'hoken', 'koushuu-eisei', 'shika', 'seishin', 'kensa', 'houshasen', 'kyuukyuu']: return 'Medical'
        if sub_dir in ['kaigo', 'fukushi', 'soudan-shien', 'rehabilitation', 'yougu', 'boshi', 'kodomo', 'kosodate']: return 'Welfare'
        return 'General'

    if top_dir == 'safety-environment':
        if sub_dir in ['anzen', 'bousai', 'shoubou', 'security', 'bcp']: return 'Safety'
        if sub_dir in ['kankyou', 'kougai', 'haikibutsu', 'mizu-shori', 'kagaku', 'roudou-eisei', 'sasutena', 'ryokka', 'seitai']: return 'Environment'
        return 'General'

    if top_dir == 'legal-accounting':
        if sub_dir in ['houmu', 'houritsu', 'chizai', 'shigyou', 'gyousei', 'shihou', 'kokusai']: return 'Legal'
        if sub_dir in ['kaikei', 'zeimu', 'kansa', 'bunseki']: return 'Accounting'
        return 'General'

    if top_dir == 'creative':
        if sub_dir in ['design', 'douga', 'gazou', 'shikisai', 'iro', 'dtp', 'flower', 'hair', 'nail']: return 'Design'
        if sub_dir in ['media', 'enshutsu', 'kousei', 'gijutsu']: return 'Media'
        return 'General'

    return 'General'

def main():
    for top in os.listdir(DOCS_DIR):
        top_path = os.path.join(DOCS_DIR, top)
        if not os.path.isdir(top_path):
            continue
            
        if top not in GROUPS:
            continue
            
        print(f"Processing {top}...")
        
        # Create Group Folders
        for group_name, group_label in GROUPS[top].items():
            group_path = os.path.join(top_path, group_name)
            if not os.path.exists(group_path):
                os.makedirs(group_path)
                
            # Create _category_.json for Group
            cat_json = {
                "label": group_label,
                "collapsible": True,
                "collapsed": True
            }
            with open(os.path.join(group_path, '_category_.json'), 'w', encoding='utf-8') as f:
                json.dump(cat_json, f, ensure_ascii=False, indent=2)

        # Move Subdirectories
        # We iterate over a list first to avoid issues while modifying the directory
        subdirs = [d for d in os.listdir(top_path) if os.path.isdir(os.path.join(top_path, d)) and d not in GROUPS[top]]
        
        for sub in subdirs:
            sub_path = os.path.join(top_path, sub)
            
            if not os.path.exists(sub_path):
                continue

            # Determine Group
            group_name = get_group(top, sub)
            dest_path = os.path.join(top_path, group_name, sub)
            
            if os.path.exists(dest_path):
                print(f"  Skipping {sub} -> {dest_path} (already exists)")
                continue

            # Move
            print(f"  Moving {sub} -> {group_name}/{sub}")
            try:
                shutil.move(sub_path, dest_path)
            except Exception as e:
                print(f"  Error moving {sub}: {e}")
                import traceback
                traceback.print_exc()
                continue

            # Create _category_.json for Subdirectory
            # Determine Label
            label = TRANSLATIONS.get(sub, sub) # Default to roman if no translation
            
            cat_json = {
                "label": label
            }
            try:
                with open(os.path.join(dest_path, '_category_.json'), 'w', encoding='utf-8') as f:
                    json.dump(cat_json, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"  Error creating json for {sub}: {e}")
                import traceback
                traceback.print_exc()

if __name__ == '__main__':
    main()
