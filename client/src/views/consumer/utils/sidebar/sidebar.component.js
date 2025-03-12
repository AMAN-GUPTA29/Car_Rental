
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
        controller: function SidebarController() {
            let vm = this;

            vm.toggleSidebar = function () {
                console.log("Toggling sidebar from component...");
                vm.sidebarOpen = !vm.sidebarOpen;
            };

            vm.logout = function () {
                console.log("Logging out...");
                sessionStorage.clear(); 
                $state.go('login'); 
            };
        },
        controllerAs: 'sidebarComponent'
    });
