/**
 * User: materliu(materliu@gmail.com)
 * Date: 13-5-24
 * Time: 上午11:26
 */

;(function($) {
    Parse.initialize("eW2cokjiyGm0OsMW3L6bjxzi05JzAR0ih1KwxTob",
            "Udihr8tEzPT4rGoKP97MDydY21fk6tZ7L7OCbVz0");

    function save(obj, data, callback) {
        obj.save(data, {
            success: function (obj) {
                alert("存储数据成功，可前往打印单据");
                callback && callback(obj);
            },
            error : function (obj) {
                alert("存储数据失败！请稍后重试");
                callback && callback(obj);
            }
        })
    }

    function handleSaveEvent(e) {
        var typeInputs = $(".column2 > input"),
                salesInpts = $(".column2-last > input"),
                saveArray = [];

        // 首先从页面中获取品类和单价的键值
        $(".column3 > input").each(function(index, element) {
            var $this = $(this),
                    nameValue = $this.val(),
                    type = "",
                    price = "";

            if (nameValue !== "") {

                // 认为取到了品类的名字
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
            }
        });

        // 准备对获取到的数据进行存储
        var GoodsObject = Parse.Object.extend("Goods");
        var GoodsObj = new GoodsObject();

        if (saveArray[0] === undefined) {
            alert("请先输入数据");
        } else {
            save(GoodsObj, {
                goods : saveArray
            });
        }


        e.preventDefault();
        e.stopPropagation();
    }

    $(document).on("click", "[data-save]", handleSaveEvent);

}(jQuery));

