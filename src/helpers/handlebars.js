module.exports ={
    formatNumber: function(num){
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        },
        totalProduct: function(price,quantity){
            return (price*quantity).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        },
        totalProductOrder:function(product){
            return (
                product.reduce((total,item)=>{
                return total+((item.quatity)*(item.price))
                },0)+0
            ).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        },
        conver:function(arr) {
            return (arr)?(arr.length):0
        },
        converArraytoString:function(arr,index){
            return arr[index]
        },
        formatDatetime:function(Datetime){
            var date = new Date(Datetime)
            return (`${date.getDate()} tháng ${date.getMonth()+1}, ${date.getFullYear()}`)
        }
}