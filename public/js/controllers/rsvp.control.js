/*
Name:
    rsvp.control

Description:
    Controls the content of the RSVP view.  The user is prompted to enter a name
    from their invitation.  Once enetered, the RsvpService is used to ensure the
    username is part of an invitation.

    The invitation returned from the service contains all current information about
    the invitiation status.  The invitation can be altered in another form from the view
    and updated via this controller.

Author:
    Tim "KetsuN" Butler
*/

angular
    .module('RsvpCtrl', ['ngRoute'])
    .controller('RsvpController', function($scope, Invitation, Invitee) {

    $scope.invitation = null;
    $scope.error_response = ""
    $scope.success_response = ""
    $scope.user_logged_in = false;
    $scope.rsvp_submitted = false;
    $scope.invitees = [];
    $scope.processing = false;

    $scope.login = function(invite_name, invite_number) {
        $scope.success_response = ""
        if (invite_name == null) {
            $scope.error_response = "You must include an invitation name"
        } else if (invite_number == null) {
            $scope.error_response = "You must include an invitation number"
        } else {
            $scope.processing = true;
            Invitation.query({search: invite_name.trim()},
                function(result) {
                    $scope.invitation = null;
                    results = result.data;
                    for (i = 0; i < results.length; i++) {
                        if (results[i].id == invite_number) {
                            $scope.invitation = results[i];
                        };
                    };
                    if ($scope.invitation != null) {
                        if ($scope.invitation.id == invite_number.trim()) {
                            for (i = 0; i < $scope.invitation.invitees.length; i++) {
                                Invitee.query({id: $scope.invitation.invitees[i]}, function(result) {
                                    $scope.invitees.push(result.data);
                                });
                            };

                            $scope.user_logged_in = true;
                            $scope.error_response = "";
                            $scope.processing = false;
                        } else {
                            $scope.error_response = "Invitation name and number are not part of the same RSVP."
                            $scope.processing = false;
                        };
                    } else {
                        $scope.error_response = "An invitation with that name was not found."
                        $scope.processing = false;
                    };
                },
                function() {
                    $scope.error_response = "Invitation number " + invite_number + " could not be found."
                    $scope.processing = false;
                });
        };
    };

    $scope.update_invitation = function() {
        Invitation.update({id: $scope.invitation.id}, $scope.invitation);

        for (i = 0; i < $scope.invitees.length; i++) {
            if ($scope.invitees[i].attending == null) {
                $scope.invitees[i].attending = false;
            };
            Invitee.update({id: $scope.invitees[i].id}, $scope.invitees[i]);
        };

        $scope.rsvp_submitted = true;
        $scope.success_response = "Get ready to party, your RSVP has been updated!"
    };
});