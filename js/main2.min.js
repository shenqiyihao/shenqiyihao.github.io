/**
 * User: materliu(materliu@gmail.com)
 * Date: 13-5-24
 * Time: 上午11:26
 */
(function ($) {
    var printAreaCount = 0;
    $.fn.printArea = function () {
        var ele = $(this);
        var idPrefix = "printArea_";
        removePrintArea(idPrefix + printAreaCount);
        printAreaCount++;
        var iframeId = idPrefix + printAreaCount;
        var iframeStyle = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';
        iframe = document.createElement('IFRAME');
        $(iframe).attr({
            style: iframeStyle,
            id: iframeId
        });
        document.body.appendChild(iframe);
        var doc = iframe.contentWindow.document;
        $(document).find("link").filter(function () {
            return $(this).attr("rel").toLowerCase() == "stylesheet";
        }).each(
                function () {
                    doc.write('<link type="text/css" rel="stylesheet" href="'
                            + $(this).attr("href") + '" >');
                });
        doc.write('<div class="' + $(ele).attr("class") + '">' + $(ele).html()
                + '</div>');
        doc.close();
        $(doc.body).addClass("body2");
        var frameWindow = iframe.contentWindow;
        frameWindow.close();
        frameWindow.focus();
        frameWindow.print();
    }
    var removePrintArea = function (id) {
        $("iframe#" + id).remove();
    };
})(jQuery);
;
(function ($) {
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
    query.exists("goods");
    query.find({
        success: function (results) {
            "use strict";
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


            // 初始化事件绑定
            initHandler();

            // 生成开票日期
            var date = new Date();
            $(".generate-date").val(date.toLocaleString());
        }
    });

    function initHandler() {
        "use strict";
        $(document).on("click", "[data-add-row]", handleAddRowEvent);
        $(document).on("change", ".goodsNameSelection", handleNameChangeEvent);
        $(document).on("change", ".goodsTypeSelection", handleTypeCountChangeEvent);
        $(document).on("change", ".goodsCount", handleTypeCountChangeEvent);
        $(document).on("click", "[data-generate-print]", handleGeneratePrintEvent);
    }

    function handleGeneratePrintEvent(e) {
        "use strict";

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
        $("#original-article .goodsInfo").each(function (index, element) {
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


        $("#print-article").printArea();
    }

    function handleTypeCountChangeEvent(e) {
        "use strict";
        var $this = $(this),
                $parent = $this.parents("tr");
        generatePrice($parent);
    }

    function handleNameChangeEvent(e) {
        "use strict";
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
        "use strict";
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
        $("#totalTotalPrice").val(totalTotalPrice);
    }

    function handleAddRowEvent(e) {
        generateOneRow();
        e.preventDefault();
        e.stopPropagation();
    }

    function generateOneRow() {
        "use strict";

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
        rowsString += '<tr class="goodsInfo"><td><select class="goodsNameSelection">' +
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


}(jQuery));

