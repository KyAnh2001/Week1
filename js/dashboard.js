function getRandomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

var data = [];
var myChart;

function createChart() {
    var table = document.getElementById("viewDevice");
    var rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const label = cells[0].innerText;
        const value = parseInt(cells[4].innerText);
        data.push({
            label, value
        });
    }
    var backgroundColors = [];
    for (var i = 0; i < 50; i++) {
        backgroundColors.push(getRandomColor());
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            hoverOffset: 4,

        },
    });
}

createChart();

function updateChart() {
    var table = document.getElementById("viewDevice");
    var rows = table.getElementsByTagName('tr');
    data = [];
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const label = cells[0].innerText;
        const value = parseInt(cells[4].innerText);
        data.push({
            label, value
        });
    }
    myChart.data.labels = data.map(item => item.label);
    myChart.data.datasets[0].data = data.map(item => item.value);
    myChart.update();
}

var columTotal = document.getElementById('total');

function addDevice() {
    var deviceInput = document.getElementById("device").value;
    var ipInput = document.getElementById("ip").value;
    if (deviceInput === "" || ipInput === "") {
        document.getElementById('warning').textContent = 'Nhập đầy đủ thông tin!';
    }
    else {
        document.getElementById('warning').textContent = '';
        var table = document.getElementById("viewDevice");
        var row = table.insertRow(-1);
        var deviceCell = row.insertCell(0);
        var addressCell = row.insertCell(1);
        var ipCell = row.insertCell(2);
        var dateCell = row.insertCell(3);
        var comCell = row.insertCell(4);

        var devices = ['TV', 'Washer', 'Refrigerator', 'Selling Fan'];
        var address = '8c:ec:4b:74:4a:fb';
        var currentDate = new Date();
        var day = String(currentDate.getDate()).padStart(2, '0');
        var month = String(currentDate.getMonth() + 1).padStart(2, '0');
        var year = currentDate.getFullYear();
        var date = year + '-' + month + '-' + day;
        var consumption;
        if (deviceInput == devices[0]) { consumption = 50; }
        else if (deviceInput == devices[1]) { consumption = 60; }
        else if (deviceInput == devices[2]) { consumption = 80; }
        else consumption = 100;

        deviceCell.innerHTML = deviceInput;
        addressCell.innerHTML = address;
        ipCell.innerHTML = ipInput;
        dateCell.innerHTML = date;
        comCell.innerHTML = consumption;

        total = sum();
        columTotal.textContent = total;
        createEditDeleteButtons();
    }
    updateChart();
    saveData();
    location.reload();
}

function saveData() {
    var tableData = [];
    var tableRows = document.querySelectorAll('#viewDevice tbody tr');
    for (var i = 0; i < tableRows.length; i++) {
        var rowData = {
            device: tableRows[i].cells[0].textContent,
            address: tableRows[i].cells[1].textContent,
            ip: tableRows[i].cells[2].textContent,
            date: tableRows[i].cells[3].textContent,
            consumption: tableRows[i].cells[4].textContent
        };
        tableData.push(rowData);
    };
    localStorage.setItem('tableData', JSON.stringify(tableData));
    updateChart();
}

//    localStorage.removeItem('tableData');
//   saveData();  

function loadData() {
    var tableData = JSON.parse(localStorage.getItem('tableData'));
    var tableBody = document.querySelector('#viewDevice tbody');  
    tableBody.innerHTML = '';
    if (tableData) {
        tableData.forEach(function (rowData) {
            var newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = rowData.device;
            newRow.insertCell(1).textContent = rowData.address;
            newRow.insertCell(2).textContent = rowData.ip;
            newRow.insertCell(3).textContent = rowData.date;
            newRow.insertCell(4).textContent = rowData.consumption;

        });
    }
    var total = sum();
    columTotal.textContent = total;
    updateChart();
    createEditDeleteButtons();
}
var isFirstLoad = localStorage.getItem('firstLoad') === null;

if (isFirstLoad) {
    saveData();
    localStorage.setItem('firstLoad', 'true');
}
loadData();

//show Menu
function showMenu() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('mobile-sidebar');
}

//close Menu
function closeMenu() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('mobile-sidebar');
}

// clik outside menu -> close menu
const mainDashboard = document.querySelector('.mainDashboard');

mainDashboard.addEventListener('click', closeMenu)

var hidebar = document.querySelector('.hide-bar')
hidebar.addEventListener('click', function (event) {
    event.stopPropagation()
})

window.addEventListener('resize', function () {
    if (this.window.innerWidth < 415) {
        this.document.getElementsByClassName('rowhome').style.display = 'none';
        this.document.getElementsByClassName('mobile-welcome').style.display = 'block';
    }
});

if (this.window.innerWidth < 415) {
    this.document.getElementsByClassName('rowhome').style.display = 'none';
    this.document.getElementsByClassName('mobile-welcome').style.display = 'block';
}

//Tổng devices
function sum() {
    var tableRows = document.querySelectorAll('#viewDevice tbody tr');
    var sum = 0;
    for (var i = 1; i < tableRows.length; i++) {
        var cellValue = parseInt(tableRows[i].cells[4].textContent);
        sum += cellValue;
    }
    return sum;
}

var clickDevice, clickAddress, clickIP, clickDate, clickConsumption;
// Edit và Delete button
function createEditDeleteButtons() {
    var rows = document.querySelectorAll('#viewDevice tbody tr');
    // không lấy dòng tiêu đề
    for(var i = 1; i < rows.length; i++) {
        var editButton = document.createElement("button");
        editButton.innerHTML = "Sửa";
        editButton.classList.add("edit-button");
        editButton.onclick = function() {
            var row = this.closest('tr');
            
            // Lấy dữ liệu từ dòng được chọn
            clickDevice = row.cells[0].textContent;
            clickAddress = row.cells[1].textContent;
            clickIP = row.cells[2].textContent;
            clickDate = row.cells[3].textContent;
            clickConsumption = row.cells[4].textContent;
            
            showEditForm(clickDevice, clickAddress, clickIP, clickDate, clickConsumption);
        };
        rows[i].appendChild(editButton);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Xoá";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = function() {

        };
        rows[i].appendChild(deleteButton);
    }
}


// Xoá
function deleteRow(row) {
    // Check index
    var rowIndex = Array.from(row.parentNode.children).indexOf(row);
    
    row.parentNode.removeChild(row);

    var tableData = JSON.parse(localStorage.getItem('tableData'));

    // Xoá data với dòng đã xoá khỏi mảng
    tableData.splice(rowIndex, 1);

    // Update to localstorage
    localStorage.setItem('tableData', JSON.stringify(tableData));
}

checkTableData();

// event delete
document.querySelectorAll('.delete-button').forEach(function(button) {
    button.addEventListener('click', function() {
        // lấy dòng xoá
        var row = this.closest('tr');
        
        deleteRow(row);
        location.reload();
    });
});

// Show edit form
function showEditForm(device, address, ip, date, consumption) {
    document.getElementById("editDeviceName").value = device;
    document.getElementById("editDeviceAddress").value = address;
    document.getElementById("editDeviceIP").value = ip;
    document.getElementById("editDeviceCons").value = consumption;
    
    document.getElementById("editDevice").style.display = "block";
    document.getElementById("addDevice").style.display = "none";
}

// hàm save dữ liệu Edit bị lỗi không edit được dữ liệu

document.getElementById("saveEdit").addEventListener("click", function() {
    var editedDevice = document.getElementById("editDeviceName").value;
    var editedAddress = document.getElementById("editDeviceAddress").value;
    var editedIP = document.getElementById("editDeviceIP").value;
    var editedConsumption = document.getElementById("editDeviceCons").value;
   
    var currentDate = new Date();
    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();
    var date = year + '-' + month + '-' + day;
   
    var tableData = JSON.parse(localStorage.getItem('tableData'));
    if (tableData) {
        // Tìm index của dòng click Sửa
        var rowIndex = findRowIndex(clickDevice, clickAddress, clickIP, tableData);
        if (rowIndex !== -1) {
            // Ghi đè giá trị mới vào
            tableData[rowIndex].device = editedDevice;
            tableData[rowIndex].address = editedAddress;
            tableData[rowIndex].ip = editedIP;
            tableData[rowIndex].consumption = editedConsumption;
            tableData[rowIndex].date = date;
            
            localStorage.setItem('tableData', JSON.stringify(tableData));
        }
    }
    
    loadData();

    document.getElementById("editDevice").style.display = "none";
    document.getElementById("addDevice").style.display = "block";
});

//tìm dòng được chọn để sửa
function findRowIndex(device, address, ip, tableData) {
    for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].device === device && tableData[i].address === address && tableData[i].ip === ip) {
            return i; 
        }
    }
    return -1; 
}


//check dữ liệu trong bảng
function checkTableData() {
    var tableBody = document.querySelector('#viewDevice tbody');
    if (tableBody.rows.length === 1) {
        document.getElementById('noneChart').textContent = 'Bảng không có bản ghi nào';
        return false; 
    }
    else {
        document.getElementById('noneChart').textContent = '';
    }
    return true;
}

