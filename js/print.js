/**
 * User: materliu(materliu@gmail.com)
 * Date: 13-5-24
 * Time: 上午11:26
 */

(function ($) {
    'use strict';


    Parse.initialize("eW2cokjiyGm0OsMW3L6bjxzi05JzAR0ih1KwxTob",
            "Udihr8tEzPT4rGoKP97MDydY21fk6tZ7L7OCbVz0");

    // 在执行的过程中取出之前存储的数据
    var GoodsObject = Parse.Object.extend("Goods"),
        query = new Parse.Query(GoodsObject),
        allNames = [],
        allNamesObj = {
//                "name" : null
        },
        allNameRType = {
//                "name" : []
        },
        nameTypeRPrice = {
//                "name-type" : "price"
        },
        allGoods = [];


    function handleGeneratePrintEvent2(e) {

        var innerHtml = '<header class="container text-center"><h3>神奇一号采暖炉销售单</h3></header>';

        innerHtml += $('#original-article').html();

        $('#print-article').html(innerHtml);

        var $doc = $('#print-article').contents();

        // 清除新增按钮
        $doc.find('.btn-add-new-category').remove();

        // 清除生成打印单按钮
        $doc.find('.btn-generate-print').remove();

        // 经办人员,购买人员 ... input处理
        $doc.find('#typed-people').text('经办人员: ' + $('#original-article').find('#typed-people').find('input').val());
        $doc.find('#purchase-people').text('购方人员: ' + $('#original-article').find('#purchase-people').find('input').val());
        $doc.find('#purchase-unit').text('购买单位: ' + $('#original-article').find('#purchase-unit').find('input').val());
        $doc.find('#purchase-address').text('联系地址: ' + $('#original-article').find('#purchase-address').find('input').val());
        $doc.find('#purchase-phone').text('联系购方: ' + $('#original-article').find('#purchase-phone').find('input').val());

        // 拷贝salebody里边的内容
        var tableHtml = '';
        $("#original-article .goods-info").each(function (index, element) {
            var $this = $(this),
                goodsName = $this.find(".goodsNameSelection").val(),
                goodsType = $this.find(".goodsTypeSelection").val(),
                goodsCount = $this.find(".goodsCount").val(),
                singlePrice = $this.find(".singlePrice").text(),
                totalPrice = $this.find(".totalPrice").text(),
                remark = $this.find(".remark").val();
            tableHtml += '<tr class="goodsInfo"><td><span class="goodsNameSelection">' +
                goodsName +
                '</select>' +
                '</td><td><span class="goodsTypeSelection">' +
                goodsType +
                '</span>' +
                '</td><td><span class="goodsCount" type="number" min="0" max="10000" step="1"' +
                ' value="1">' +
                goodsCount +
                '</span>' +
                '</td><td><span class="singlePrice">' +
                singlePrice +
                '</span>元</td><td><span' +
                ' class="totalPrice">' +
                totalPrice +
                '</span>元' +
                '</td><td><span class="remark" type="text">' +
                remark +
                '</span></td></tr>'
        });

        $doc.find('.goods-info').remove();
        $doc.find('.table-footer').before(tableHtml);

        $('#print-article').printThis();

        window.setTimeout(function() {
            $('#print-article').html('');
        }, 2000);

        return false;
    }

    function handleGeneratePrintEvent(e) {

        // 首先获取当前所有可打印内容

        // 打印局部内容
        // 一步一步的拷贝内容
        var saleHeaderInput = $("#saleHeader input"),
            i, j;

        saleHeaderInput.each(function(index, element) {
            var $this = $(this),
                thisClassName = $this.attr("class");

            $("#print-article").find("." + thisClassName).text($this.val());
        });

        // 拷贝salebody里边的内容
        var tableHtml = '<tr class="table-header"><th>商品名称</th>' +
            '<th>型号</th><th>数量</th><th>单价</th><th>金额</th>' +
            '<th>备注</th></tr>';
        $("#original-article .goods-info").each(function (index, element) {
            var $this = $(this),
                goodsName = $this.find(".goodsNameSelection").val(),
                goodsType = $this.find(".goodsTypeSelection").val(),
                goodsCount = $this.find(".goodsCount").val(),
                singlePrice = $this.find(".singlePrice").text(),
                totalPrice = $this.find(".totalPrice").text(),
                remark = $this.find(".remark").val();
            tableHtml += '<tr class="goodsInfo"><td><span class="goodsNameSelection">' +
                goodsName +
                '</select>' +
                '</td><td><span class="goodsTypeSelection">' +
                goodsType +
                '</span>' +
                '</td><td><span class="goodsCount" type="number" min="0" max="10000" step="1"' +
                ' value="1">' +
                goodsCount +
                '</span>' +
                '</td><td><span class="singlePrice">' +
                singlePrice +
                '</span>元</td><td><span' +
                ' class="totalPrice">' +
                totalPrice +
                '</span>元' +
                '</td><td><span class="remark" type="text">' +
                remark +
                '</span></td></tr>'
        });


        // 清空 table里边的内容
        $("#print-article").find("table").empty().append(tableHtml);


        // 复制收款账户信息 和 总计金额信息
        $("#saleFooter input").each(function (index, element) {
            var $this = $(this),
                thisClassName = $this.attr("class");

            $("#print-article").find("." + thisClassName).text($this.val());
        });


        $("#print-article").printThis();


    }

    function handleTypeCountChangeEvent(e) {
        var $this = $(this),
            $parent = $this.parents("tr");
        generatePrice($parent);
    }

    function handleNameChangeEvent(e) {
        var $this = $(this),
            goodsName = $this.val(),
            $parent = $this.parents("tr"),
            goodsTypeArray = allNameRType[goodsName],
            typeOptionStr = "",
            i, j;

        // 构造型号list
        for (i = 0, j = goodsTypeArray.length; i < j; i++) {
            typeOptionStr += '<option value="' +
                goodsTypeArray[i] +
                '">' +
                goodsTypeArray[i] +
                '</option>'
        }

        $parent.find(".goodsTypeSelection").html(typeOptionStr);

        generatePrice($parent);
    }

    function generatePrice(currentRow) {
        var name = currentRow.find(".goodsNameSelection").val(),
            type = currentRow.find(".goodsTypeSelection").val(),
            goodsCount = currentRow.find(".goodsCount").val(),
            price = nameTypeRPrice[name + "-" + type];
        if (name === "" || type === "" || goodsCount === "") {
            return;
        }

        if (!(currentRow instanceof jQuery)) {
            currentRow = $(currentRow);
        }

        if (price === undefined) {
            alert("程序出错了。");
            return;
        } else {
            currentRow.find(".singlePrice").text(price);
            currentRow.find(".totalPrice").text(price*goodsCount);
        }

        // 遍历所有的表格元素，来生成总计金额
        var totalTotalPrice = 0;
        $(".totalPrice").each(function(index, element) {
            var $this = $(this),
                price = $this.text();
            if (!isNaN(parseFloat(price))) {
                totalTotalPrice += parseFloat(price);
            } else {
                alert("计算总金额出错，请稍后重试！");
            }
        });
        $("#total-all-price").text(totalTotalPrice + '元');
    }

    function handleAddRowEvent(e) {
        generateOneRow();
        e.preventDefault();
        e.stopPropagation();
    }

    function generateOneRow() {

        // 直接利用闭包内的数据吧
        var goodsNameOption = "",
            goodsTypeOption = "",
            rowsString = "",
            i, j;

        for (i = 0, j = allNames.length; i < j; i++) {
            goodsNameOption += "<option value='" +
                allNames[i] +
                "'>" +
                allNames[i] +
                "</option>"
        }
        rowsString += '<tr class="goods-info"><td><select class="goodsNameSelection">' +
            goodsNameOption +
            '</select>' +
            '</td><td><select class="goodsTypeSelection"></select>' +
            '</td><td><input class="goodsCount" type="number" min="0" max="10000" step="1"' +
            ' value="1"/>' +
            '</td><td><span class="singlePrice"></span>元</td><td><span' +
            ' class="totalPrice"></span>元' +
            '</td><td><input class="remark" type="text"/></td></tr>'

        var $currentRow = $(rowsString);
        $(".table-footer").before($currentRow);

        // 这里模拟一次name列表的变化，来激活后续的流程
        handleNameChangeEvent.apply($currentRow.find(".goodsNameSelection")[0], []);
    }

    query.exists("goods");
    query.find({
        success: function (results) {
            var i = 0,
                j = results.length,
                goods = [],
                s = null;

            for (; i < j; i++) {
                s = results[i];

                if (s.attributes) {
                    goods = goods.concat((s.attributes).goods || []);
                }
            }
            allGoods = goods;

            // 这里建立这些数据的索引信息，用来下边勾选
            for (i = 0, j = allGoods.length; i < j; i++) {
                var goods = allGoods[i],
                    goodsName = goods["name"],
                    goodsType = goods["type"],
                    goodsSalePrice = goods["salePrice"];

                if (!(goodsName in allNamesObj)) {
                    allNames.push(goodsName);
                    allNamesObj[goodsName] = null;
                }

                if (!allNameRType[goodsName]) {
                    allNameRType[goodsName] = [];
                }

                if (!((goodsName + "-" + goodsType) in nameTypeRPrice)) {
                    nameTypeRPrice[(goodsName + "-" + goodsType)] =
                        goodsSalePrice;

                    allNameRType[goodsName].push(goodsType);
                }
            }

            // 生成第一行示例数据
            generateOneRow();

        }
    });

    var Main = {
        init: function () {

            // 自动生成录单日期
            $('#typed-day').text('录单日期: ' + date('%Y-%n-%j %H:%i', (+ new Date)));

            // 自动生成一个单据编号
            $('#typed-num').text('单据编号: ' + date('%Y-%n-%j', (+ new Date)) + '-' + parseInt(Math.random() * 99999));

            Main.initEventHandler();
        },
        initEventHandler: function () {
            // 在销售单中点击新增一项
            $(document).on("click", "[data-add-new-category]", handleAddRowEvent);

            $(document).on("change", ".goodsNameSelection", handleNameChangeEvent);
            $(document).on("change", ".goodsTypeSelection", handleTypeCountChangeEvent);
            $(document).on("change", ".goodsCount", handleTypeCountChangeEvent);
            $(document).on("click", "[data-generate-print]", handleGeneratePrintEvent2);
        }
    };

    Main.init();

}(jQuery));

