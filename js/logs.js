var rowsPerPage = 10;
var table = document.getElementById('viewLogs');
var tbody = table.querySelector('tbody');
var originalRows = Array.from(tbody.querySelectorAll('tr'));
var currentRows = originalRows.slice();
var totalRows = originalRows.length;
var totalPages = Math.ceil(totalRows / rowsPerPage);

document.getElementById('total').textContent = totalRows;
function showPage(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = Math.min(startIndex + rowsPerPage, currentRows.length);
    for (var i = 0; i < currentRows.length; i++) {
        if (i >= startIndex && i < endIndex) {
            currentRows[i].style.display = '';
        } else {
            currentRows[i].style.display = 'none';
        }
    }
}

function createPagination(totalPages) {
    var pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (var i = 1; i <= totalPages; i++) {
        var button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', function () {
            var pageNumber = parseInt(this.textContent);
            showPage(pageNumber);
        });
        pagination.appendChild(button);
    }
}

function search() {
    var input, filter, table, tr, td, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.trim().toUpperCase();
    table = document.getElementById("viewLogs");
    tr = table.getElementsByTagName("tr");
    var totalRowSearch = 0;
    var newCurrentRows = [];
    for (var i = 0; i < tr.length - 1; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                newCurrentRows.push(tr[i]);
                totalRowSearch += 1;
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    currentRows = newCurrentRows;
    var totalPagesSearch = Math.ceil(totalRowSearch / rowsPerPage);
    createPagination(totalPagesSearch);
    showPage(1);
    document.getElementById('total').textContent = totalRowSearch;
}

showPage(1);
createPagination(totalPages);
