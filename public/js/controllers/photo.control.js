/*
Name:
    home.control

Description:
    Controls the content of the photo view.

Author:
    Tim "KetsuN" Butler
*/

angular
    .module('PhotoCtrl', [])
    .controller('PhotoController', function($scope, Photo) {
        $scope.popup_window = new PopupHandler();
        $scope.current_photo = null;
        $scope.max_index = 0;

        Photo.query().$promise.then(function(result) {
            $scope.photo_list = result.data;

            //  Add an index value to each photo
            for (var i = 0; i < $scope.photo_list.length; i++) {
                $scope.photo_list[i].index = i;
            }

            $scope.max_index = $scope.photo_list.length - 1;
        });

        $scope.setCurrentPhoto = function(photo) {
            $scope.current_photo = photo;
            $scope.popup_window.openPopup();
        };

        $scope.closePhoto = function() {
            $scope.popup_window.closePopup();
        };

        $scope.getNextPhoto = function() {
            if ($scope.current_photo.index + 1 > $scope.max_index) {
                $scope.current_photo = $scope.photo_list[0]
            } else {
                $scope.current_photo = $scope.photo_list[$scope.current_photo.index + 1]
            }
        };

        $scope.getPreviousPhoto = function() {
            if ($scope.current_photo.index - 1 < 0) {
                $scope.current_photo = $scope.photo_list[$scope.max_index]
            } else {
                $scope.current_photo = $scope.photo_list[$scope.current_photo.index - 1]
            }
        };
});


function PopupHandler () {
    this.show = false;
    this.background_style = {};

    this.openPopup = function () {
        this.backgroundStyle = {'opacity': '0.2', 'filter': 'alpha(opacity=20)'};
        this.show = true;
    };

    this.closePopup = function () {
        this.backgroundStyle = {};
        this.show = false;
    };
}
