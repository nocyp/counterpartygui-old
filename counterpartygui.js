var testData = {"addresses": {"1K4n6spjq6VUxUqaPL9qNcWG2LHAjkUjUS": {"BTC": 0.01666123}, "1AMFjGUGNCdDJ6KYR6R66Xct6jhk63aKSS": {"NAMECOIN": "1000000000.0"}, "1PhDAmaN4VuP6GRabinphfJHA6Y4YX9w5b": {"SPORT": "1000000000.0"}, "1NYnQmmrKfoe34iXJFwQuwqdNQuxxHABFa": {"COGNITIVE": "1000000000.0"}, "12bbUcurcDLW4cwc6R8rAsJYjqf2JdKho9": {"NASDAQ": "1000000000.0"}, "1Jkx1LVfHgUWa8sHEN9BnNeYN6WfSwNmbf": {"XCP": "1243.4655", "BTC": 0.01342893}, "1AdVABUapTivcKQHa9DYMwM965tN3iwN4m": {"GOOG": "1000000000.0"}, "16X6VcQNWRRduhMm2s4pJDukGRXHAnFEUe": {"SEXCOIN": "1000000000.0"}, "19A91oyrWQBhnyJ5bUGUrtcihUiASbi1Ux": {"VIAGRA": "1000000000.0"}, "1P69SNRUEVpT4geGuHPge9aKghLj3jhHGj": {"BETONLINE": "1000000000.0"}, "1PDDncUPb1V2uFUKgP8Kax8QUeQ3KXrBAT": {"SEXE": "1000000000.0"}, "1At1nVNBwurQTUoag8Ag8VgMAkdMjMjCNo": {"YACOIN": "1000000000.0"}, "1JBrdAppvrUqsaDqXqQTVLc84YnY1uKwGS": {"SICMINER": "1000000000.0", "XCP": "10.0", "BTC": 0.0001086}, "1cSaaibq3qUSeUoJbUDwBSxFaQ8Wb1kPd": {"TSLA": "1000000000.0"}, "16WUHQk2NBdnRpxAt3GuvtAy4yGU69SUUy": {"GOOGLE": "1000000000.0"}, "1KBwi6vF2h15MVB83mALcrpopTQuSASyy": {"INTERNET": "1000000000.0"}, "18oaVanLC1YNXj8p1bdTAh2RnySB6cvsND": {"POKER": "1000000000.0"}, "1eouxuruU6QU64YhPC8bb8UeYrSuDcpRG": {"XCP": "63.96808633", "LEMONDE": "1000000.0", "BTC": 0.0001086, "PRIMECOIN": "1000000000.0"}, "1Mkj2kKCnvUbS3aMFBy6K83iYwVgJYonyk": {"NOVACOIN": "1000000000.0"}, "16vFXxQwpYg4RUYpTiJmtwbpFe6UNdtT9e": {"MTGOX": "1000000000.0"}, "1PAaCGphy2Vx4Gn43YpQnQTLScMVH6s3hr": {"FEATHERCOIN": "1000000000.0"}, "16Nhj9GyU2AxQh6aLuxpJ6MW6oS8EqgBFp": {"CINEMA": "1000000000.0"}, "1JpCsxrRCijK96V1Tpgcuc8RUsDNqA6qRc": {"PPLE": "1000000000.0"}, "1NJv3Lf9rBjnX3N16JeUtFpModaW14UNmX": {"TESLA": "1000000000.0"}}, "totals": {"LEMONDE": "1000000.0", "TESLA": "1000000000.0", "VIAGRA": "1000000000.0", "NOVACOIN": "1000000000.0", "POKER": "1000000000.0", "SPORT": "1000000000.0", "GOOGLE": "1000000000.0", "SEXCOIN": "1000000000.0", "FEATHERCOIN": "1000000000.0", "PRIMECOIN": "1000000000.0", "BETONLINE": "1000000000.0", "SICMINER": "1000000000.0", "PPLE": "1000000000.0", "NASDAQ": "1000000000.0", "COGNITIVE": "1000000000.0", "BTC": 0.03131636, "INTERNET": "1000000000.0", "TSLA": "1000000000.0", "YACOIN": "1000000000.0", "MTGOX": "1000000000.0", "SEXE": "1000000000.0", "XCP": "1316.43358633", "NAMECOIN": "1000000000.0", "GOOG": "1000000000.0", "CINEMA": "1000000000.0"}};
var currentAction = 'send';

var counterpartyParams = {
    'send': ['source', 'destination', 'quantity', 'asset'],
    'order': ['source', 'give_quantity', 'give_asset', 'get_quantity', 'get_asset', 'expiration', 'fee_required', 'fee_provided'],
    'btcpay': ['order_match_id'],
    'cancel': ['offer_hash'],
    'issuance': ['source', 'destination', 'asset_name', 'quantity', 'divisible', 'callable', 'call_date', 'call_price', 'description'],
    'dividend': ['source', 'asset', 'quantity_per_share'],
    'callback': ['source', 'asset', 'fraction_per_share'],
    'broadcast': ['source', 'text', 'value', 'fee_multiplier'],
    'bet': ['source', 'feed_address', 'bet_type', 'deadline', 'wager', 'counterwager', 'target_value', 'leverage', 'expiration']
}

var paramsFieldsName = {
    'give_asset': 'asset'
}

function counterpartyAction(form) {
    var action = $(form).find("input[name=action]").val();
    var params = {'action': action};
    for (var p in counterpartyParams[action]) {
        var name = counterpartyParams[action][p];
        var inputName = name;
        if (paramsFieldsName[name]) {
            inputName = paramsFieldsName[name];
        }
        var input = $(form).find("input[name="+inputName+"], select[name="+inputName+"]");
        params[name] = input.val();
    }
    params["unsigned"] = $('input[name=unsigned]')[0].checked ? "1" : "0";
    console.log(params); return false;
    $('#walletLoading').modal('show');
    jQuery.ajax({
        url:"/action",
        method: "POST",
        data: params,
        success: function(data) {
            $('#walletLoading').modal('hide');
            $('#walletDialog #messageDialog').html(data['message']);
            $('#walletDialog').modal('show');
            console.log(data);
        }
    });
    return false;
}

function genAssetRow(assetName, data) {
    value = 0;
    if (assetName in data) {
        value = data[assetName];
    }
    return '<div class="tablerow"><div class="asset-name">'+assetName+'</div><div class="amount">'+value+'</div></div>';
}

function genAssetsLists(data) {
    var select = $('<select></select>').addClass('form-control').attr('name', 'asset');
    var walletTable = $('<div></div>').addClass('table').addClass('table-striped').addClass('assets-list');
    var tableBody = $('<div class="tablelist"></div>');

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
    var walletTable = $('<div></div>').addClass('table').addClass('table-striped').addClass('assets-list');
    var tableBody = $('<div class="tablelist"></div>');

    for (var address in data['addresses']) {
        var option = $('<option></option>').attr('value', address);
        tableBody.append('<div class="address">'+address+'</div>');
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

function initWallet(data) {
   
    genAssetsLists(data);
    genAddressesLists(data);
    $('.dropdown').fancyfields({customScrollBar: true});
    $('.scroll').perfectScrollbar({suppressScrollX: true});
    //Add in different row styling in asset list
    $('#assets-tab .tablerow').filter(':odd').addClass('list2');
    $('#addresses-tab .tablerow').addClass('list2');
    $('#walletLoading').modal('hide');
}

function initGUI() {

    $('#walletLoading').modal('show');

    $(".btcommands").click(function() {

        var openCommand = $(this).data('command');
        var closeCommand = $('.boxes.open').data('command');

        $('#commands'+closeCommand).removeClass('open').animate({top: '-100px', opacity: 0}, 400, 'swing', function() {
            $(this).addClass('closed');
            $('#commands'+openCommand).removeClass('closed').animate({top: '0px', opacity: 1}, 400, 'swing', function() {
                $(this).addClass('open');
            });
        });

    });

    $('div.menuitem').hover(
        function() { $(this).find('div').stop().animate({top: '-20px'}); },
        function() { $(this).find('div').stop().animate({top: '0'}); }
    );

    var leftpanemenuHeight = 0;
    $('ul.leftpanemenu li').each(function() {
        leftpanemenuHeight += $(this).height();
    })
    
    $('ul.leftpanemenu li').click(function() {
        var pane = $(this).data('pane');
        $('img.img_title').hide();
        $('img.img_'+pane).show();
        $('ul.leftpanemenu').animate({height: '0'});
        $('.group').hide();
        $('#'+pane+"-tab").show();
    });


    $('div.leftpanetop').hover(
        function() { $('ul.leftpanemenu').animate({height: leftpanemenuHeight+'px'}); },
        function() { $('ul.leftpanemenu').animate({height: '0'}); }
    );
   

}

function loadWallet() {
    jQuery.ajax({
        url:"/wallet",
        method: "GET",
        complete: function (jqXHR, textStatus) {
            console.log('status:'+textStatus);
        },
        success: initWallet
    });
}

jQuery(document).ready(function ($) {
    "use strict";  

    initGUI();


    if (window.location.origin=='file://') {

        initWallet(testData); //Test
		   	  

    } else {

        loadWallet();
    }

});




