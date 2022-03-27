---
title: '使用JS操作列表'
scope: ['JS', 'Algorithm', 'LeetCode']
---

### [力扣-206](https://leetcode-cn.com/problems/reverse-linked-list/)

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

我的解法：

```js
var reverseList = function (head) {
  let nodeTemp = new ListNode()
  let currentHead = nodeTemp
  while (head !== null) {
    let nextNode = head.next
    // 判断是否有第一个节点，如果没有头节点则表明是第一个节点，即需要将其next置为null
    if (currentHead.next) {
      // 如果有节点，则将当前的节点的next指向头节点的下一个节点
      head.next = currentHead.next
    } else {
      head.next = null
    }
    // 将头节点的下一个节点指向当前节点
    currentHead.next = head
    head = nextNode
  }
  return nodeTemp.next
}
```

官方解法 1：

```js
var reverseList = function (head) {
  // 由于是倒转，前一个节点必为null
  let prev = null
  let curr = head
  while (curr) {
    // 记录下一节点
    const next = curr.next
    // 将下一节点指向前一节点，以此实现倒转
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}
```

- 时间复杂度：O(n)_O_(_n_)，其中 n*n* 是链表的长度。需要遍历链表一次。
- 空间复杂度：O(1)_O_(1)。

官方解法 2：

```js
var reverseList = function (head) {
  if (head == null || head.next == null) {
    return head
  }
  // 递归到最后一个节点
  const newHead = reverseList(head.next)
  head.next.next = head
  head.next = null
  return newHead
}
```

### [力扣剑指 offer-06](https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

我的解法：使用递归

```js
var reversePrint = function (head) {
  if (head) {
    return head.next ? reversePrint(head.next).concat(head.val) : [head.val]
  } else {
    return []
  }
}
```

效率不如递推。

其他解法：递推

```javascript
var reversePrint = function (head) {
  let nums = []
  let node = head
  while (node !== null) {
    // 通过unshift倒转数组
    nums.unshift(node.val)
    node = node.next
  }
  return nums
}
```

结果对比：

![image-20220320133657219](https://cdn.jsdelivr.net/gh/zrains/images/2022/03/image-20220320133657219-987a10ab5393bf4af9fa484bd2f99157.png)
