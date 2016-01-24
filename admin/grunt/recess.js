module.exports = {
    less: {
        files: {
            'src/css/app.css': [
                'src/css/less/app.less'
            ]
        },
        options: {
            compile: true
        }
    },
    angular: {
        files: {
            'angular/css/app.min.css': [
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/animate.css/animate.css',
                'bower_components/font-awesome/css/font-awesome.css',
                'bower_components/simple-line-icons/css/simple-line-icons.css',
                'bower_components/umeditor/themes/default/css/button.css',
                'bower_components/umeditor/themes/default/css/buttonicon.css',
                'bower_components/umeditor/themes/default/css/colorpicker.css',
                'bower_components/umeditor/themes/default/css/combobox.css',
                'bower_components/umeditor/themes/default/css/comboboxmenu.css',
                'bower_components/umeditor/themes/default/css/dialog.css',
                'bower_components/umeditor/themes/default/css/dialogsize.css',
                'bower_components/umeditor/themes/default/css/editor.css',
                'bower_components/umeditor/themes/default/css/popup.css',
                'bower_components/umeditor/themes/default/css/separator.css',
                'bower_components/umeditor/themes/default/css/splitbutton.css',
                'bower_components/umeditor/themes/default/css/tab.css',
                'bower_components/umeditor/themes/default/css/tooltip.css',
                'src/js/vendor/layer/skin/layer.css',
                'src/js/vendor/nice-validator/jquery.validator.css',
                'src/css/*.css'
            ]
        },
        options: {
            compress: true
        }
    },
    html: {
        files: {
            'html/css/app.min.css': [
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/animate.css/animate.css',
                'bower_components/font-awesome/css/font-awesome.css',
                'bower_components/simple-line-icons/css/simple-line-icons.css',
                'bower_components/umeditor/themes/default/css/button.css',
                'bower_components/umeditor/themes/default/css/buttonicon.css',
                'bower_components/umeditor/themes/default/css/colorpicker.css',
                'bower_components/umeditor/themes/default/css/combobox.css',
                'bower_components/umeditor/themes/default/css/comboboxmenu.css',
                'bower_components/umeditor/themes/default/css/dialog.css',
                'bower_components/umeditor/themes/default/css/dialogsize.css',
                'bower_components/umeditor/themes/default/css/editor.css',
                'bower_components/umeditor/themes/default/css/popup.css',
                'bower_components/umeditor/themes/default/css/separator.css',
                'bower_components/umeditor/themes/default/css/splitbutton.css',
                'bower_components/umeditor/themes/default/css/tab.css',
                'bower_components/umeditor/themes/default/css/tooltip.css',
                'src/js/vendor/layer/skin/layer.css',
                'src/js/vendor/nice-validator/jquery.validator.css',
                'src/css/*.css'

            ]
        },
        options: {
            compress: true
        }
    }
}
