/**
 * @description for going on same and prev page
 */
carRentalApp.factory("PaginationService", function () {
    return {
        nextPage: function (scope) {
            if (scope.currentPage * scope.rowsPerPage < scope.filteredBids.length) {
                scope.currentPage++;
                scope.renderTable();
            }
        },
        prevPage: function (scope) {
            if (scope.currentPage > 1) {
                scope.currentPage--;
                scope.renderTable();
            }
        }
    };
});
