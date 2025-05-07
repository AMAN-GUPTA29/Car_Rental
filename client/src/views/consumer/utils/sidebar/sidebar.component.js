/**
 * Sidebar component
 * @component sidebarComponent
 * @description This component is used to display the sidebar of the consumer.
 * @description2 way binding is used to toggle the sidebar.
 */
carRentalApp
    .component('sidebarComponent', {
        templateUrl: '/src/views/consumer/utils/sidebar/sidebar.component.html',
        bindings: {
            sidebarOpen: '='
        },
        controller: ['$state', function SidebarController($state) {
            this.toggleSidebar = function () {
                console.log("Toggling sidebar from component...");
                this.sidebarOpen = !this.sidebarOpen;
            };

            this.logout = function () {
                console.log("Logging out...");
                sessionStorage.clear(); 
                $state.go('login'); 
            };
        }],
        controllerAs: 'sidebarComponent'
    });
