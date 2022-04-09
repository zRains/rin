---
title: '第15天 - 搜索与回溯算法2（中等）'
wrap: ['sword_to_offer']
scope: ['algorithm', 'LeetCode']
---

### [剑指 Offer 34. 二叉树中和为某一值的路径](https://leetcode-cn.com/problems/er-cha-shu-zhong-he-wei-mou-yi-zhi-de-lu-jing-lcof/)

#### 描述

给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。

> 叶子节点 是指没有子节点的节点。

#### 解答

第一次使用先序遍历，一直向下传递当前数组，效率实在太低了，自己都看不下去了：

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @param {number} target
 * @return {number[][]}
 */
var pathSum = function (root, target) {
  let result = []
  const check = (r, t, res = []) => {
    if (!r.left && !r.right) {
      if (r.val === t) result.push([...res, r.val])
      return t === 0
    }
    if (r.left) check(r.left, t - r.val, [...res, r.val])
    if (r.right) check(r.right, t - r.val, [...res, r.val])
    return false
  }
  root && check(root, target)
  return result
}
```

我看了一下解析，思路一样，为什么效率差这么大？🤣

---

### [剑指 Offer 36. 二叉搜索树与双向链表](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

#### 描述

输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向。

为了让您更好地理解问题，以下面的二叉搜索树为例：

![bstdlloriginalbst-1](https://assets.leetcode.com/uploads/2018/10/12/bstdlloriginalbst.png)

我们希望将这个二叉搜索树转化为双向循环链表。链表中的每个节点都有一个前驱和后继指针。对于双向循环链表，第一个节点的前驱是最后一个节点，最后一个节点的后继是第一个节点。

下图展示了上面的二叉搜索树转化成的链表。“head” 表示指向链表中有最小元素的节点。

![bstdlloriginalbst-2](https://assets.leetcode.com/uploads/2018/10/12/bstdllreturndll.png)

特别地，我们希望可以就地完成转换操作。当转化完成以后，树中节点的左指针需要指向前驱，树中节点的右指针需要指向后继。还需要返回链表中的第一个节点的指针。

#### 解答

待完成
