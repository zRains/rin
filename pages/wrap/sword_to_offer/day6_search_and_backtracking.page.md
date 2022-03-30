---
title: '第6天 - 搜索与回溯算法（简单）'
wrap: ['sword_to_offer']
scope: ['algorithm', 'LeetCode']
---

### [剑指 Offer 32 - I. 从上到下打印二叉树](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/)

#### 描述

从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。

#### 解答

思路是维护一个节点列表`cache`，每次取最后一个（pop）节点，并检测是否存在左右子节点，如果存在，依次放入列表头部，遍历整个数组直到为空。效率有亿点低哈。。。

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function (root) {
  const result = []
  if (!root) {
    return result
  }
  const cache = [root]
  while (cache.length !== 0) {
    const node = cache.pop()
    if (node.left) cache.unshift(node.left)
    if (node.right) cache.unshift(node.right)
    result.push(node.val)
  }
  return result
}
```
