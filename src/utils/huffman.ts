//规定树节点的内容对象
export interface keyobj {
    key: string|null,
    val: number
}

//映射表的类型接口约定
interface kcMap {
    [id: string]: string
}

class Huffman{
    //文本
    public str: string;
    //key值和频率的映射表
    public keyCountMap: any = null;
    //key值和编码的映射表
    public keyCodeMap: kcMap = {};

    //哈夫曼节点列表
    public nodelist: Array<Nodeitem> = [];
    //哈夫曼树根节点
    public root: Nodeitem | undefined;
    //哈夫曼编码后的序列
    public code: any = null;
    codeKeyMap: any;

    constructor(str: string){
        this.str = str;
    }
    
    //计算文本每个字母元素出现的频率
    public cal(): void{
        let map:any = {};
        let i: number = 0;

        while(this.str[i]){
            map[this.str[i]] ? map[this.str[i]] ++ : (map[this.str[i]] = 1);
            i ++;
        }

        this.keyCountMap = map
    };
    
    //对于字母频率，规定成节点，并排序
    public sort(): void{
        //类型声明为对象的数组集合
        let result: Array<Nodeitem> = [];

        for(let key in this.keyCountMap){
            if(this.keyCountMap.hasOwnProperty(key)){
                let obj: keyobj = {
                    key: key,
                    val: this.keyCountMap[key]
                };

                result.push(new Nodeitem(null,null,obj));
            }
        }

        result.sort(function(x,y){
            return x.data.val - y.data.val;
        })

        this.nodelist = result;
        
    }
    
    //制作哈夫曼树
    public makeTree(): Nodeitem{
        let i: number = 0;
        let parentNode: Nodeitem;

        let table: Array<Nodeitem> = this.nodelist;

        //将数组合并成哈夫曼树
        while(table.length > 1){
            parentNode = new Nodeitem(table[i],table[i+1],{
                key: null,
                val: table[i].data.val + table[i + 1].data.val
            })
            table.splice(i,2);
            table.push(parentNode);
            table.sort(function(x,y) {
                return x.data.val - y.data.val
            })
        }

        this.root = table[0] || new Nodeitem(null,null,{key: null,val: 0});

        return this.root;
    }
    
    //将每个字母通过哈夫曼树转换为二进制编码
    public traversal(tree: Nodeitem|any,code: string): void{
        if(tree.left !== null){
            this.traversal.call(this,tree.left,code + '0');
        }
        else{
            this.keyCodeMap[tree.data.key] = code;
        }

        if(tree.right !== null){
            this.traversal.call(this,tree.right,code + '1');
        }
        else{
            this.keyCodeMap[tree.data.key] = code;
        }

    }
    
    //将文本字符串进行编码
    public encode(): string{
        this.cal();
        this.sort();
        let root: Nodeitem = this.makeTree();
        this.traversal(root,'');
        let i: number = 0;
        let result: string = '';
        while(this.str[i]){
            result += this.keyCodeMap[this.str[i ++]];
        }

        this.code = result;
        console.log("encode:" + result);
        return result;
    }
    reverseMap() {
        var ret:any = this.keyCodeMap;
        var result:any = {};
        for (const key in ret) {
            if(ret.hasOwnProperty(key)) {
                result[ret[key]] = key;
            }
        }
        this.codeKeyMap = result;
        return result;
    }
    decode() {
        var i = 0;
        var result = '';
        var data = '';  
        var map = this.reverseMap();    
        var str = this.code;
        while(str) {
            result += str[i++];
            if (result in map) {
                data += map[result];
                str = str.replace(new RegExp("^"+result),'');
                result = '';
                i = 0;
            }
        }
        console.log("decode:" + data)
        return data
    }
}

class Nodeitem{

    public left: any;
    public right: any;
    public data: keyobj;
    
    constructor(left: any,right: any,data: keyobj){
        this.left = left;
        this.right = right;
        this.data = data;
    }
}
export {
    Huffman
}
//测试代码（demo）
const str1: string = "dasjfhpasujdhfu;h4wpoiufjhapwoivnowuihvno;awjcoi;wejfoiawejfpiuowefjhijwhvniu";
const huffmanDemo: Huffman = new Huffman(str1);
huffmanDemo.encode();
huffmanDemo.decode();