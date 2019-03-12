import '../lib/flexible'; //
import './rewriteAddEventLister'; // 重写addEventListener
// import './scrollBackToLastView'; // 页面切换时回到原位置


// fixed: 触发移动换触屏事件的 :active 伪类
window.addEventListener('touchstart', _ => null);
