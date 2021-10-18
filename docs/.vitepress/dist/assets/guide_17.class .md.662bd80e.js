import{o as n,c as s,d as a}from"./app.8f4d3ffd.js";const t='{"title":"Class 的底层实现原理","description":"","frontmatter":{},"headers":[{"level":2,"title":"Mix-ins / 混入","slug":"mix-ins-混入"},{"level":3,"title":"Class 的底层实现原理","slug":"class-的底层实现原理"}],"relativePath":"guide/17.class .md","lastUpdated":1623720864659}',p={},o=a('<p>实际上，类是“特殊的<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions" target="_blank" rel="noopener noreferrer">函数</a>”，就像你能够定义的<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/function" target="_blank" rel="noopener noreferrer">函数表达式</a>和<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function" target="_blank" rel="noopener noreferrer">函数声明</a>一样，类语法有两个组成部分：<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/class" target="_blank" rel="noopener noreferrer">类表达式</a>和<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/class" target="_blank" rel="noopener noreferrer">类声明</a>。</p><p>类声明和 函数声明</p><p>类表达式和 函数表达式</p><ol><li>类 不存在变量提升</li></ol><div class="language-"><pre><code>// 未命名/匿名类\nlet Rectangle = class {\n  constructor(height, width) {\n    this.height = height;\n    this.width = width;\n  }\n};\nconsole.log(Rectangle.name);\n// output: &quot;Rectangle&quot;\n\n// 命名类\nlet Rectangle = class Rectangle2 {\n  constructor(height, width) {\n    this.height = height;\n    this.width = width;\n  }\n};\nconsole.log(Rectangle.name);\n// 输出: &quot;Rectangle2&quot;\n</code></pre></div><ol start="2"><li><p>构造函数 constructor 一个类只能拥有一个</p></li><li><p>getter、 setter、 methods</p></li><li><p>私有字段声明、 公有字段声明</p><div class="language-"><pre><code>class Rectangle {\n  #height = 0;\n  #width;\n  constructor(height, width) {\n    this.#height = height;\n    this.#width = width;\n  }\n}\n\nclass Rectangle {\n  height = 0;\n  width;\n  constructor(height, width) {\n    this.height = height;\n    this.width = width;\n  }\n}\n</code></pre></div></li><li><p>static 静态函数</p><p>静态 方法不是能被实例使用的 但是可以通过类访问</p><p>dart 里的静态方法 也是不能在实例上访问</p></li><li><p>extends 继承</p><ol><li><p>子类中定义了构造函数，那么它必须先调用 <code>super()</code> 才能使用 <code>this</code></p></li><li><p>请注意，类不能继承常规对象（不可构造的）。如果要继承常规对象，可以改用<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf" target="_blank" rel="noopener noreferrer"><code>Object.setPrototypeOf()</code></a>：</p><div class="language-"><pre><code>var Animal = {\n  speak() {\n    console.log(this.name + &#39; makes a noise.&#39;);\n  }\n};\n\nclass Dog {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\nObject.setPrototypeOf(Dog.prototype, Animal);// 如果不这样做，在调用speak时会返回TypeError\n\nvar d = new Dog(&#39;Mitzie&#39;);\nd.speak(); // Mitzie makes a noise.\n</code></pre></div></li></ol></li><li><h2 id="mix-ins-混入"><a class="header-anchor" href="#mix-ins-混入" aria-hidden="true">#</a> <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes#mix-ins_%E6%B7%B7%E5%85%A5" target="_blank" rel="noopener noreferrer">Mix-ins / 混入</a></h2><p>抽象子类或者 mix-ins 是类的模板。 一个 ECMAScript 类只能有一个单超类，所以想要从工具类来多重继承的行为是不可能的。子类继承的只能是父类提供的功能性。因此，例如，从工具类的多重继承是不可能的。该功能必须由超类提供。</p><p>一个以超类作为输入的函数和一个继承该超类的子类作为输出可以用于在ECMAScript中实现混合：</p><div class="language-"><pre><code>var calculatorMixin = Base =&gt; class extends Base {\n  calc() { }\n};\n\nvar randomizerMixin = Base =&gt; class extends Base {\n  randomize() { }\n};\n</code></pre></div><p>Copy to Clipboard</p><p>使用 mix-ins 的类可以像下面这样写：</p><div class="language-"><pre><code>class Foo { }\nclass Bar extends calculatorMixin(randomizerMixin(Foo)) { }\n</code></pre></div><p>Copy to Clipboard</p></li></ol><h3 id="class-的底层实现原理"><a class="header-anchor" href="#class-的底层实现原理" aria-hidden="true">#</a> Class 的底层实现原理</h3><div class="language-js"><pre><code><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">static</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;run&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;hello!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>ES5</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">say</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;hello!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nPerson<span class="token punctuation">.</span><span class="token function-variable function">run</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;run&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre></div><p>babel 编译分析</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">_classCallCheck</span><span class="token punctuation">(</span><span class="token parameter">instance<span class="token punctuation">,</span> Constructor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>instance <span class="token keyword">instanceof</span> <span class="token class-name">Constructor</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token string">&quot;Cannot call a class as a function&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">_defineProperties</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> props<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> descriptor <span class="token operator">=</span> props<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n    descriptor<span class="token punctuation">.</span>enumerable <span class="token operator">=</span> descriptor<span class="token punctuation">.</span>enumerable <span class="token operator">||</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    descriptor<span class="token punctuation">.</span>configurable <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token string">&quot;value&quot;</span> <span class="token keyword">in</span> descriptor<span class="token punctuation">)</span> descriptor<span class="token punctuation">.</span>writable <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> descriptor<span class="token punctuation">.</span>key<span class="token punctuation">,</span> descriptor<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">_createClass</span><span class="token punctuation">(</span><span class="token parameter">Constructor<span class="token punctuation">,</span> protoProps<span class="token punctuation">,</span> staticProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>protoProps<span class="token punctuation">)</span> <span class="token function">_defineProperties</span><span class="token punctuation">(</span><span class="token class-name">Constructor</span><span class="token punctuation">.</span>prototype<span class="token punctuation">,</span> protoProps<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>staticProps<span class="token punctuation">)</span> <span class="token function">_defineProperties</span><span class="token punctuation">(</span>Constructor<span class="token punctuation">,</span> staticProps<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> Constructor<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> Person <span class="token operator">=</span> <span class="token comment">/*#__PURE__*/</span> <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token string">&quot;use strict&quot;</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">_classCallCheck</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> Person<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">_createClass</span><span class="token punctuation">(</span>\n    Person<span class="token punctuation">,</span>\n    <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        key<span class="token operator">:</span> <span class="token string">&quot;say&quot;</span><span class="token punctuation">,</span>\n        <span class="token function-variable function">value</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;hello!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        key<span class="token operator">:</span> <span class="token string">&quot;run&quot;</span><span class="token punctuation">,</span>\n        <span class="token function-variable function">value</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;run&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">return</span> Person<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n</code></pre></div><ul><li><p>暂时性死区</p></li><li><p>严格模式 class 默认亏气严格模式 ， 构造函数 默认 非严格模式</p></li><li><p>内部方法 不可枚举 class 的所有方法（静态 、 实例） 都不可枚举 ； 构造函数可枚举所有方法</p></li><li><p>原型对象 prototype <code>class</code> 的所有方法（包括 <code>静态方法</code>、<code>实例方法</code>）都没有原型对象 <code>prototype</code>，因此也没有 <code>[[construct]]</code>，不能通过 <code>new</code> 来调用，构造函数则支持 <code>new</code> 调用。</p></li><li><p>new 调用 <code>class</code> 必须使用 <code>new</code> 调用，构造函数的本质是函数，支持直接调用。</p></li><li></li></ul>',13);p.render=function(a,t,p,e,c,l){return n(),s("div",null,[o])};export default p;export{t as __pageData};