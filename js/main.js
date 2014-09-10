/**
 * User: materliu(materliu@gmail.com)
 * Date: 13-5-24
 * Time: 上午11:26
 */

;(function($) {


    Parse.initialize("eW2cokjiyGm0OsMW3L6bjxzi05JzAR0ih1KwxTob",
            "Udihr8tEzPT4rGoKP97MDydY21fk6tZ7L7OCbVz0");

    var allGoodsTableArray = [];    // 用来渲染table商品信息表格的数据

    /**
     * 拉取已经存储的神奇一号炉子型号等数据来渲染表格
     */
    function renderTables() {

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

                    allGoodsTableArray.push([goodsName, goodsType, goodsSalePrice]);
                }

                // 填充数据表格
                var dataTable = $('.data-table').DataTable();
                dataTable.rows.add(allGoodsTableArray).draw();


            },
            error: function () {
                alert('查询数据失败， 刷新页面后重试， 若持续不行， 联系刘炬光');
            }
        });
    }

    function save(obj, data, callback) {
        obj.save(data, {
            success: function (obj) {

                //
                var attributes = obj.attributes,
                    goods = [];

                if (attributes) {
                    goods = attributes.goods || [];
                }

                for (var i = 0, j = goods.length; i < j; i++) {
                    var goods = goods[i],
                        goodsName = goods["name"],
                        goodsType = goods["type"],
                        goodsSalePrice = goods["salePrice"];

                    allGoodsTableArray.unshift([goodsName, goodsType, goodsSalePrice]);
                }

                var dataTable = $('.data-table').DataTable();
                dataTable.clear();
                dataTable.rows.add(allGoodsTableArray).draw();

                callback && callback(obj);
            },
            error : function (obj) {
                alert("存储数据失败！请稍后重试");
                callback && callback(obj);
            }
        })
    }

    function handleSaveEvent(e) {
        var typeInputs = $("#model-form-control"),
                salesInpts = $("#price-form-control"),
                saveArray = [];

        // 首先从页面中获取品类和单价的键值
        $("#category-form-control").each(function(index, element) {
            var $this = $(this),
                nameValue = $this.val(),
                type = "",
                price = "";

            nameValue = nameValue || '神奇';

            type = typeInputs[index].value;

            if (type !== "") {

                // 既有品类又有型号，获取价格
                price = salesInpts[index].value;

                if (price !== "") {

                    // 认为品类，型号，价格全齐了
                    saveArray.push({
                        "name" : nameValue,
                        "type" : type,
                        "salePrice" : price
                    });
                }
            }
        });

        // 准备对获取到的数据进行存储
        var GoodsObject = Parse.Object.extend("Goods");
        var GoodsObj = new GoodsObject();

        if (saveArray[0] === undefined) {
            alert("请先输入数据");
            return false;
        } else {
            save(GoodsObj, {
                goods : saveArray
            });
        }

        // 隐藏modal窗口
        $('#modal-add-new-category').modal('hide');

        e.preventDefault();
        e.stopPropagation();
    }

    var Main = {
        init: function () {

            /*
             * 初始化表格配置
             */
            $('.data-table').DataTable({
                "aaSorting": [],
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "sDom": 't<"mistat-table-bottom"f<"mistat-pagination"p>>',
                "searching": false,
                "oLanguage": {
                    "oPaginate": {
                        "sFirst": "第一页",
                        "sLast": "最后一页",
                        "sNext": "下一页",
                        "sPrevious": "上一页"
                    },
                    "sEmptyTable": "暂无数据",
                    "sLengthMenu": '每页最多显示 _MENU_ 条',
                    "sSearch": "搜索:",
                    "sZeroRecords": "没有符合条件的结果"
                }
            });

            // 渲染已经录入的神奇一号的型号单
            renderTables();

            Main.initEventHandler();
        },
        initEventHandler: function () {
            $(document).on("click", "[data-save]", handleSaveEvent);

            $(document).on('click', '[data-add-new-category]', function (e) {
                // 增加新的品类
                $('#modal-add-new-category').modal({});
            });
        }
    };

    Main.init();


}(jQuery));

