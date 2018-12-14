// 絶対パス指定のためにpathモジュールを読み込む
const path = require('path');

// プラグインを利用するためにwebpackを読み込んでおく
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    // argv.modeにはwebpackを実行したmodeが格納されている
    // 例えば webpack --mode development と実行すれば
    // argv.mode には 'development' が格納されている
    // そのためdevelopmentモードで実行したかどうかを判定できる
    const IS_DEVELOPMENT = argv.mode === 'development';

    return {
        // watchモードを有効にする
        // watch: true,
        // modeの設定
        // mode: 'development',
        // エントリーポイントの設定(ビルドするファイル)
        entry:__dirname + '/src/test.js',
        // 出力の設定
        output: {
            // 出力先のパス
            // OSによってパスが異なることを防ぐためにpath.join()を用いる
            path: path.join(__dirname + '/dist/js'),
            // 出力するファイル名
             filename: 'bundle.js'
        },
        // ローダーの設定
        module: {
            rules: [
                {
                    // ローダーの処理対象ファイル
                    test: /\.js$/,
                    // ローダーの処理対象から外すディレクトリ
                    exclude: /node_modules/,
                    use: [
                        {
                            // 利用するローダー
                            loader: 'babel-loader',
                            // ローダーのオプション
                            // この場合はbabelのオプション
                            options: {
                                presets: ['es2015', 'stage-0']
                            }
                        }
                    ]
                },
                {
                    test: /\.(sa|sc|c)ss$/, // 対象となるファイルの拡張子
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                        'postcss-loader'
                    ]
                  }
                // {
                //     // enforce: 'pre'を指定するとそれが付いていないローダーより早く処理される
                //     enforce: 'pre',
                //     test: /\.js$/,
                //     exclude: /node_modules/,
                //     loader: 'eslint-loader'
                // }
            ]
        },
        // プラグインの設定
        plugins: [
            new webpack.ProvidePlugin({
              $: 'jquery',
              jQuery: 'jquery'
            }),
            new MiniCssExtractPlugin({
                filename: '../css/style.css'
            })
        ],
        // productionモードで有効になるoptimization.minimizerを上書きする
        optimization: {
            // developmentモードでビルドした場合
            // minimizer: [] となるため、consoleは残されたファイルが出力される
            // puroductionモードでビルドした場合
            // minimizer: [ new UglifyJSPlugin({... となるため、consoleは削除したファイルが出力される
            minimizer: IS_DEVELOPMENT
                ?[]
                :[
                    new UglifyJSPlugin({
                        uglifyOptions: {
                            compress: {
                                drop_console: true
                            }
                        }
                    })
                ]

        }
    };
};