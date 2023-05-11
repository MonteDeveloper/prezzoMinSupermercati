const { createApp } = Vue;

createApp({
    data() {
        return {
            marketPages: [],
            selectedPageId: -1,
            newProduct: "",
            newMarket: "",
            bestPage: []
        }
    },
    created(){
        // localStorage.clear();

        if (localStorage.getItem('marketPages')) {
            this.marketPages = JSON.parse(localStorage.getItem('marketPages'));
        }

        // Salva l'array in cache prima di chiudere o aggiornare la pagina
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('marketPages', JSON.stringify(this.marketPages));
        });

        this.updateBestPage();
    },
    watch: {
        selectedPageId: function (newVal) {
            if (newVal === "-1") {
                this.updateBestPage();
            }
        }
    },
    methods: {
        addNewProduct(){
            if(this.newProduct != ""){
                for(page of this.marketPages){
                    page.productList.push(
                        {
                            name: this.newProduct,
                            section: "Farina",
                            market: page.market,
                            price: 0
                        }
                    )
                }
                this.newProduct = "";
                this.updateBestPage();
            }
        },
        addNewMarket(){
            let productList = [];
            if(this.marketPages[0]){
                for(product of this.marketPages[0].productList){
                    productList.push(
                        {
                            name: product.name,
                            section: product.section,
                            market: this.newMarket,
                            price: 0
                        }
                    )
                }
            }
            this.marketPages.push(
                {
                    market: this.newMarket,
                    productList: productList
                }
            )
            this.selectedPageId = this.marketPages.length - 1;
            this.newMarket = "";
        },
        deleteCurrentMarket(){
            this.marketPages.splice(this.selectedPageId, 1);
            if(this.selectedPageId == 0){
                this.selectedPageId = -1;
            }
        },
        deleteProductAtIndex(productIndex){
            for(page of this.marketPages){
                page.productList.splice(productIndex, 1);
            }
        },
        deleteAllMarkets(){
            this.marketPages = [];
            this.updateBestPage();
        },
        updateBestPage(){
            this.bestPage = [];
            if(this.marketPages[0]){
                this.marketPages[0].productList.forEach((product, index) => {
                    let bestProduct = product;
                    for(page of this.marketPages){
                        if(page.productList[index].price < bestProduct.price){
                            bestProduct = page.productList[index];
                        }
                    }
                    this.bestPage.push(bestProduct);
                });
            }
        }
    }
}).mount('#app')