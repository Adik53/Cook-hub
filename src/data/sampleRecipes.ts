import { Recipe } from '../types';

export const SAMPLE_RECIPES: Recipe[] = [
    {
        id: '1',
        title: 'Mercimek Çorbası',
        ingredients: ['kırmızı mercimek', 'soğan', 'havuç', 'patates', 'salça', 'zeytinyağı', 'tuz', 'kimyon', 'limon'],
        steps: [
            'Soğan ve havucu zeytinyağında kavurun',
            'Salçayı ekleyip 1 dakika daha kavurun',
            'Yıkanmış mercimek ve doğranmış patatesi ilave edin',
            'Üzerini geçecek kadar su ekleyip 25-30 dakika yumuşayana kadar pişirin',
            'Blender ile pürüzsüz hale getirin',
            'Tuz ve kimyon ile tatlandırın',
            'Servis yaparken yanında limon dilimiyle sunun'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
        cookingHours: 0,
        cookingMinutes: 35,
        difficulty: 'easy',
        tags: ['#çorba', '#türkmutfağı', '#vejetaryen'],
        likes: 68,
        dislikes: 2,
        comments: [],
        authorId: '6957b67c888fc7873ca65e1f',
        createdAt: Date.now() - 86400000
    },
    {
        id: '2',
        title: 'Menemen',
        ingredients: ['yumurta', 'domates', 'yeşil biber', 'soğan', 'zeytinyağı', 'tuz', 'karabiber', 'pul biber'],
        steps: [
            'Domates, biber ve soğanı doğrayın',
            'Zeytinyağında soğan ve biberi yumuşayana kadar kavurun',
            'Doğranmış domatesleri ekleyin, suyunu çekene kadar pişirin',
            'Tuz, karabiber ve pul biber ile tatlandırın',
            'Domatesler yumuşayınca ortasında çukurlar açın',
            'Her çukura bir yumurta kırın',
            'İstediğiniz kıvama gelene kadar kapağı kapalı pişirin'
        ],
        imageUrl: 'https://cdn.ye-mek.net/App_UI/Img/out/650/2023/05/sogansiz-menemen-resimli-yemek-tarifi(12).jpg',
        cookingHours: 0,
        cookingMinutes: 20,
        difficulty: 'easy',
        tags: ['#kahvaltı', '#türkmutfağı', '#yumurta'],
        likes: 55,
        dislikes: 1,
        comments: [],
        authorId: '6957b67c888fc7873ca65e1f',
        createdAt: Date.now() - 172800000
    },
    {
        id: '3',
        title: 'İmam Bayıldı',
        ingredients: ['patlıcan', 'domates', 'soğan', 'sarımsak', 'maydanoz', 'zeytinyağı', 'tuz', 'karabiber'],
        steps: [
            'Patlıcanların kabuklarını alaca soyun ve tuzlu suda 20 dakika bekletin',
            'Soğan ve sarımsağı ince doğrayın, domatesleri küp küp kesin',
            'Zeytinyağında soğan ve sarımsağı pembeleşene kadar kavurun',
            'Domates ve maydanozu ekleyip iç harcı hazırlayın',
            'Patlıcanların ortasını oyun, hazırladığınız harçla doldurun',
            'Tencereye dizin, üzerini geçmeyecek kadar su ekleyin',
            'Kısık ateşte 40-45 dakika pişirin'
        ],
        imageUrl: 'https://d17wu0fn6x6rgz.cloudfront.net/img/w/tarif/pt/imambayildi-6w2a9658-37.webp',
        cookingHours: 1,
        cookingMinutes: 15,
        difficulty: 'medium',
        tags: ['#zeytinyağlı', '#türkmutfağı', '#vejetaryen'],
        likes: 47,
        dislikes: 4,
        comments: [],
        authorId: '6957b67c888fc7873ca65e1f',
        createdAt: Date.now() - 259200000
    },
    {
        id: '4',
        title: 'Adana Kebap',
        ingredients: ['kıyma (dana+kuzu karışık)', 'kuyruk yağı', 'kırmızı biber', 'pul biber', 'tuz', 'soğan', 'maydanoz'],
        steps: [
            'Kıymayı ve kuyruk yağını iyice yoğurun',
            'İnce doğranmış soğan, maydanoz ve baharatları ekleyin',
            'En az 2 saat buzdolabında dinlendirin',
            'Şişlere sıkıca sararak şekil verin',
            'Mangalda veya ızgarada orta ateşte pişirin',
            'Yanında soğan, domates ve lavaş ile servis edin'
        ],
        imageUrl: 'https://www.kevserinmutfagi.com/wp-content/uploads/2022/06/adana_kebap1.jpg',
        cookingHours: 0,
        cookingMinutes: 30,
        difficulty: 'hard',
        tags: ['#kebap', '#türkmutfağı', '#et'],
        likes: 82,
        dislikes: 5,
        comments: [],
        authorId: '6957b67c888fc7873ca65e1f',
        createdAt: Date.now() - 345600000
    }
];