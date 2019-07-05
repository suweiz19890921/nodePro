module.exports  = {
'testPgconfig'  :  {
        'user': 'suwei',
        'database': 'wade_tide',
        'password': '123456',
        'host': '127.0.0.1',
        'port': '5432',
        'poolSize': 5,
        'poolIdleTimeout': 30000,
        'reapIntervalMillis': 10000
    },
'productConfig' : {
        'user': 'suweisuper',
        'database': 'wade_tide',
        'password': '120173',
        'host': '127.0.0.1',
        'port': '5432',
        'poolSize': 5,
        'poolIdleTimeout': 30000,
        'reapIntervalMillis': 10000
    },

        'test_nginx_image_path' : {
                "image_url":"http://192.168.3.18/",
                "image_dir":"/Users/suwei/Downloads/images",
                "tmp_dir":"/Users/suwei/Downloads/temp"
        },

        'product_nginx_image_path' : {
                "image_url":"http://192.168.3.18/",
                "image_dir":"/Users/suwei/Downloads/images",
                "tmp_dir":"/Users/suwei/Downloads/temp"
        }

}