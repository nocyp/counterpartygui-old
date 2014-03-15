var currentAction = 'send';
if (typeof MODE == "undefined") {
    MODE = "gui";
}
console.log("MODE: "+MODE);

var counterpartyParams = {
    'send': ['source', 'destination', 'quantity', 'asset'],
    'order': ['source', 'give_quantity', 'give_asset', 'get_quantity', 'get_asset', 'expiration', 'fee_fraction_required', 'fee_fraction_provided'],
    'btcpay': ['order_match_id'],
    'cancel': ['offer_hash'],
    'issuance': ['source', 'transfer_destination', 'asset_name', 'quantity', 'divisible', 'callable', 'call_date', 'call_price', 'description'],
    'dividend': ['source', 'asset', 'quantity_per_share'],
    'callback': ['source', 'asset', 'fraction_per_share'],
    'broadcast': ['source', 'text', 'value', 'fee_fraction'],
    'bet': ['source', 'feed_address', 'bet_type', 'deadline', 'wager', 'counterwager', 'target_value', 'leverage', 'expiration']
}

function counterpartyAction(action) {
    if (confirm('hey, wait, have you thought about this?')) {
        var params = {'action': action};
        for (var p in counterpartyParams[action]) {
            var name = counterpartyParams[action][p];
            var input = $('div.form-group.'+name+'.'+action+'-tab .form-control');
            params[name] = input.val();
        }
        if (MODE=="gui") {
            params["unsigned"] = $('input[name=unsigned]')[0].checked ? "1" : "0";
            params["passphrase"] = $('input[name=passphrase]').val();
        } else {
            params["pubkey"] = $('input[name=pubkey]').val();
        }
        $('#walletLoading').modal('show');
        jQuery.ajax({
            url:"/action",
            method: "POST",
            data: params,
            success: function(data) {
                $('#walletLoading').modal('hide');
                if (MODE=="gui") {
                    $('#walletDialog #messageDialog').html(data['message']);
                    $('#walletDialog').modal('show');
                    $('input[name=passphrase]').val('');
                } else {
                    $('#unsigned_hex').val(data['message']);
                }
            }
        });
    }
    return false;
}

function genAssetRow(assetName, data) {
    value = 0;
    if (assetName in data) {
        value = data[assetName];
    }
    return '<tr><td class="asset-name">'+assetName+'</td><td class="amount">'+value+'</td></tr>';
}

function genAssetsLists(data) {
    var select = $('<select></select>').addClass('form-control').attr('name', 'asset');
    var walletTable = $('<table></table>').addClass('table').addClass('table-striped').addClass('assets-list');
    var tableBody = $('<tbody></tbody>');

    tableBody.append(genAssetRow('XCP', data['totals']));
    tableBody.append(genAssetRow('BTC', data['totals']));

    select.append('<option value="XCP">XCP</option>');
    select.append('<option value="BTC">BTC</option>');

    for (var assetName in data['totals']) {
        if (assetName!='BTC' &&  assetName!='XCP') {
            tableBody.append(genAssetRow(assetName, data['totals']));
            select.append('<option value="'+assetName+'">'+assetName+'</option>');
        }
    }

    walletTable.append(tableBody);
    $('#assets-tab').append(walletTable);

    $('div.asset-select').append(select);
}

function genAddressesLists(data) {

    var select = $('<select></select>').addClass('form-control').attr('name', 'source');
    var walletTable = $('<table></table>').addClass('table').addClass('table-striped').addClass('assets-list');
    var tableBody = $('<tbody></tbody>');

    for (var address in data['addresses']) {
        var option = $('<option></option>').attr('value', address);
        tableBody.append('<tr><td colspan="2" class="address">'+address+'</td></tr>');
        var label = address;
        var balance = [];
        for (assetName in data['addresses'][address]) {
            balance.push(data['addresses'][address][assetName]+' '+assetName)
            tableBody.append(genAssetRow(assetName, data['addresses'][address]));
        }
        label += ' ('+balance.join(', ')+')';
        option.text(label);
        select.append(option);
    }

    walletTable.append(tableBody);
    $('#addresses-tab').append(walletTable);

    $('div.source-select').append(select);
}

function genLists(data) {
    genAssetsLists(data);
    genAddressesLists(data);
}

function initWallet(data) {
    genLists(data);
    $('#walletLoading').modal('hide');
}

function displayForm(action) {
    currentAction = action;
    $('#commands div.form-group').hide();
    
    $('#commands div.form-group.'+action+'-tab').show();
    //$('#commands div.tab-pane').hide();
    $('#commands #send-tab').show();
}

function loadWallet() {
    $('#walletLoading').modal('show');
    jQuery.ajax({
        url:"/wallet?rand="+Math.random(), //rand to avoid cache
        method: "GET",
        complete: function (jqXHR, textStatus) {
            console.log('status:'+textStatus);
        },
        success: initWallet
    });
}

$('#commands ul.nav-tabs a').click(function (e) {   
    e.preventDefault();
    //$(this).tab('show')
    var action = $(this).attr('href').substr(1).split('-').shift();
    displayForm(action);
})

$(document).ready(function() {
    displayForm('send');

    if (MODE=="gui") {
        loadWallet();
    }

});


