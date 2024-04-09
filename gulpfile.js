const gulp = require('gulp'); // Chamada da biblioteca do GULP
const sass = require('gulp-sass')(require('sass')); // Chamada da biblioteca do SASS
const autoprefixer = require('gulp-autoprefixer'); // Chamada da biblioteca do Autoprefixer(Funções usadas para automatizar as expreções do webkit, para funcionar em browsers antigos)
const browserSync = require('browser-sync').create(); // Chamada da biblioteca de visualização do projeto, abrindo uma server de visualização do browser do projeto .HTML
const concat = require('gulp-concat'); // Chamada da biblioteca para concatenar arquivos de mesma extensões
const babel = require('gulp-babel'); // Chamada da biblioteca do babel para versionar o javascript para versões antigas dos navegadores automaticamente
const uglify = require('gulp-uglify'); // Chamada da biblioteca Uglify para minificar o código javascript, igualmente o sass que tem essas função nativa para o CSS

// Compilando o sass, adicionando autoprefixer e dando refresh na página
function compilaSass() {
    return gulp.src('scss/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

// Tarefa do sass
gulp.task('sass', compilaSass);

function pluginsCSS() {
    return gulp.src('css/lib/*.css')
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream())
  }
  
gulp.task('plugincss', pluginsCSS);

// Função para contatenar os arquivos javascripts
function gulpJs() {
    return gulp.src('js/scripts/*.js')
    .pipe(concat('all.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

// Tarefa do concat
gulp.task('alljs', gulpJs);

function pluginsJs() {
    return gulp
    .src(['./js/lib/axios.min.js', './js/lib/swiper.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

gulp.task('pluginjs', pluginsJs);

// Função do browsersync
function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
}

// Tarefa do browserSync
gulp.task('browser-sync', browser);

// função do watch para alterações em scss e html
function watch() {
    gulp.watch('scss/*.scss', compilaSass);
    gulp.watch('css/lib/*.css', pluginsCSS);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('js/scripts/*.js', gulpJs);
    gulp.watch('js/lib/*.js', pluginsJs);
}

// Tarefa do watch
gulp.task('watch', watch);   

// Tarefas default que executa o wacth e o browserSynyc
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'plugincss', 'alljs', 'pluginjs'));