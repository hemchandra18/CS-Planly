/* ═══════════════════════════════════════════════════════
   Planly — Intelligent Co-pilot Knowledge Engine
   Generates structured, IDE-grade developer responses
   with thinking reasoning steps, markdown, and code.
   ═══════════════════════════════════════════════════════ */

export interface CopilotAnswer {
  thinking: string;
  markdown: string;
}

export function generateCopilotAnswer(query: string): CopilotAnswer {
  const q = query.toLowerCase().trim();

  // 1. Search in Rotated Sorted Array (Today's Scheduled Topic)
  if (q.includes('rotate') || (q.includes('binary') && q.includes('search')) || q.includes('33')) {
    return {
      thinking:
        'Analyzing array rotation properties. In a rotated sorted array around an unknown pivot, at least one half of the array (left..mid or mid..right) is guaranteed to be strictly sorted. Verifying binary search invariants in O(log n) time.',
      markdown: `### Search in Rotated Sorted Array (O(log N))

The key insight is that **one half of the array is always strictly sorted**. We can check which half is sorted by comparing \`nums[left]\` with \`nums[mid]\`.

#### Core Invariant:
1. If \`nums[left] <= nums[mid]\`, the **left half is normally sorted**.
   - If \`nums[left] <= target < nums[mid]\`, search left: \`right = mid - 1\`.
   - Otherwise, search right: \`left = mid + 1\`.
2. Otherwise, the **right half is normally sorted**.
   - If \`nums[mid] < target <= nums[right]\`, search right: \`left = mid + 1\`.
   - Otherwise, search left: \`right = mid - 1\`.

\`\`\`typescript
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } 
    // Right half is sorted
    else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}
\`\`\`

#### Complexity:
- **Time Complexity:** \`O(log N)\` — eliminates half the search space at each iteration.
- **Space Complexity:** \`O(1)\` — in-place iterative pointers.

> **Interview Tip:** Watch out for duplicate elements (LeetCode 81). If \`nums[left] === nums[mid] === nums[right]\`, you must increment \`left++\` and decrement \`right--\`, which degrades worst-case time to \`O(N)\`.`,
    };
  }

  // 2. Trapping Rain Water (Two Pointers / Today's Topic)
  if (q.includes('rain') || q.includes('water') || q.includes('two pointer') || q.includes('42')) {
    return {
      thinking:
        'Evaluating two-pointer geometry. Trapped water at index i is determined by min(maxLeft, maxRight) - height[i]. We can eliminate auxiliary arrays by using two pointers from opposite ends moving towards each other.',
      markdown: `### Trapping Rain Water (Optimal Two-Pointer Solution)

Instead of precomputing prefix and suffix max arrays in \`O(N)\` space, we can maintain running maximums from both ends in **\`O(1)\` auxiliary space**.

#### Algorithm:
- Pointers \`left = 0\`, \`right = n - 1\`.
- Keep track of \`leftMax\` and \`rightMax\`.
- At each step, advance the pointer with the smaller boundary inward because the bottleneck is strictly bounded by the smaller side.

\`\`\`typescript
function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
}
\`\`\`

#### Complexity:
- **Time:** \`O(N)\` — single pass over array.
- **Space:** \`O(1)\` — no additional arrays required.`,
    };
  }

  // 3. Virtual Memory & Page Replacement (OS Topic)
  if (q.includes('virtual memory') || q.includes('paging') || q.includes('tlb') || q.includes('page fault')) {
    return {
      thinking:
        'Retrieving OS architectural concepts: Memory Management Unit (MMU), Translation Lookaside Buffer (TLB), multi-level page tables, demand paging, and page fault handling lifecycle.',
      markdown: `### Virtual Memory, Paging & TLB Architecture

Virtual memory decouples a process's virtual address space from physical RAM, providing hardware-enforced process isolation and contiguous memory illusion.

#### Key Mechanics:
1. **Virtual Address Breakdown:**
   - \`[ Virtual Page Number (VPN) | Page Offset ]\`
2. **Translation Lookaside Buffer (TLB):**
   - A fast associative hardware cache directly inside the CPU MMU.
   - **TLB Hit:** Physical frame number resolved in ~1 CPU cycle.
   - **TLB Miss:** Walks multi-level page tables in RAM (~10–100ns).
3. **Page Fault Handling Lifecycle:**
   - CPU triggers interrupt (Exception #14 on x86).
   - OS validates memory reference: if invalid, triggers \`SIGSEGV\`.
   - If valid, OS locates page frame on disk swap storage.
   - Swaps requested frame into free physical page frame.
   - Updates page table entry valid bit and resumes process.

#### Common Page Replacement Algorithms:
- **LRU (Least Recently Used):** High hit ratio, approximated via hardware clock algorithm (\`Second Chance\`).
- **FIFO:** Simple circular queue, vulnerable to **Belady's Anomaly**.
- **Optimal (MIN):** Theoretical benchmark — evict the page that will not be accessed for the longest time.`,
    };
  }

  // 4. Redis & System Design Caching
  if (q.includes('redis') || q.includes('cache') || q.includes('system design') || q.includes('scale')) {
    return {
      thinking:
        'Structuring distributed caching architectures. Evaluating Cache-Aside pattern, read/write throughput, cache invalidation, cache stampede prevention, and TTL strategies.',
      markdown: `### Distributed Caching: Cache-Aside & High-Scale Resilience

In high-concurrency distributed systems, Redis is deployed as a low-latency in-memory data store alongside persistent databases.

#### Cache-Aside Pattern (Lazy Loading):
1. **Read Request:** Application queries Redis first.
   - **Hit:** Return data immediately (<1ms latency).
   - **Miss:** Query primary database, write result into Redis with a TTL, return data.
2. **Write Request:** Write to database first, then **invalidate (delete)** the cache key rather than updating it, avoiding race conditions.

\`\`\`typescript
async function getUserProfile(userId: string): Promise<UserProfile> {
  const cacheKey = \`user:profile:\${userId}\`;

  // 1. Check Redis Cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Fallback to Primary DB
  const user = await db.users.findUnique({ where: { id: userId } });

  if (user) {
    // 3. Cache with Jittered TTL (1 hour + random 5 mins to prevent stampede)
    const ttlSeconds = 3600 + Math.floor(Math.random() * 300);
    await redis.setex(cacheKey, ttlSeconds, JSON.stringify(user));
  }

  return user;
}
\`\`\`

#### Production Failure Modes & Mitigations:
- **Cache Stampede (Thundering Herd):** Multiple concurrent misses overwhelm DB. *Fix:* Distributed mutex lock or Singleflight coalescing.
- **Cache Penetration:** Querying keys that never exist. *Fix:* Bloom filters or caching empty sentinel values with short TTL.
- **Cache Avalanche:** Mass key expirations at the same second. *Fix:* Add randomized jitter to expiration TTLs.`,
    };
  }

  // 5. Dynamic Programming
  if (q.includes('dp') || q.includes('dynamic programming') || q.includes('memo') || q.includes('subsequence')) {
    return {
      thinking:
        'Breaking down Dynamic Programming framework: state definition, recurrence relation, topological ordering of subproblems, base cases, and state space compression.',
      markdown: `### Dynamic Programming: 5-Step Framework

Every DP problem can be solved methodically using this standard blueprint:

1. **State Definition:** What parameters uniquely describe a subproblem? (e.g. \`dp[i][j]\` = longest common subsequence of \`s[0..i]\` and \`t[0..j]\`).
2. **Base Case:** Smallest trivial inputs (e.g. \`dp[0][j] = 0\`).
3. **Recurrence Relation:** How does \`dp[i]\` transition from previous states?
4. **Computation Order:** Iteration direction ensuring subproblems are calculated before needed.
5. **Space Optimization:** Can we keep only the last row or variable?

#### Classic Example: 0/1 Knapsack
\`\`\`typescript
function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  // Space optimized 1D DP table
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    // Traverse backwards to avoid using the same item twice
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}
\`\`\``,
    };
  }

  // 6. SQL / DBMS / B+ Trees
  if (q.includes('sql') || q.includes('dbms') || q.includes('index') || q.includes('b+ tree') || q.includes('acid')) {
    return {
      thinking:
        'Retrieving relational database engine internals: B+ Tree disk layout, sequential leaf pointers, fan-out, Write-Ahead Logging (WAL), and ACID transaction guarantees.',
      markdown: `### B+ Tree Indexing & Database Internals

Relational engines (PostgreSQL, MySQL InnoDB) use **B+ Trees** as their default storage structure for primary and secondary indexes.

#### Why B+ Tree over Binary Search Tree?
- **High Fan-out:** Each node holds hundreds of keys per 4KB/16KB page, minimizing disk I/O depth (a tree of depth 3–4 can index millions of rows).
- **Sequential Leaf Chaining:** All actual record pointers reside strictly in the leaf nodes, which are linked together in a bidirectional linked list. This makes **range queries (\`BETWEEN\`, \`>\`, \`<\`)** lightning-fast.

#### ACID Guarantees:
- **Atomicity:** Ensured via **Write-Ahead Logging (WAL)**. Changes are committed to disk log before data files.
- **Consistency:** Schema constraints, foreign keys, cascade rules.
- **Isolation:** Multi-Version Concurrency Control (MVCC) or two-phase locking (2PL).
- **Durability:** Fsync writes to persistent non-volatile storage.`,
    };
  }

  // 7. Quiz / Mock Practice Request
  if (q.includes('quiz') || q.includes('mock') || q.includes('practice') || q.includes('question')) {
    return {
      thinking:
        'Formulating an SDE interview scenario question tailored to binary search and two-pointer array algorithms with clear constraints and evaluation criteria.',
      markdown: `### Quick Mock Interview Question

Here is a common FAANG/Top-tier SDE-1 screening question:

**Problem: Find Minimum in Rotated Sorted Array (LeetCode 153)**
> Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. All integers are unique. Find the minimum element in **\`O(log n)\`** time.

#### Constraints:
- \`nums = [4,5,6,7,0,1,2]\` → Output: \`0\`
- Array contains no duplicates.

#### Hints to consider:
1. Can you compare \`nums[mid]\` with \`nums[right]\` to determine which half contains the inflection point?
2. If \`nums[mid] > nums[right]\`, where must the minimum lie?

*Reply with your approach or code, and I will review your logic, invariants, and edge cases!*`,
    };
  }

  // Fallback: Clean, general CS SDE study assistant response
  return {
    thinking: `Analyzing user prompt: "${query}". Formulating clear, structured developer explanation with conceptual overview, code patterns, and best practices.`,
    markdown: `### Analysis & Study Guidance

Here is a clear breakdown for **"${query}"**:

1. **Core Concept:**
   - Identify the fundamental data structure or algorithmic paradigm (e.g., Arrays, Hash Maps, Graphs, Dynamic Programming, or System Architecture).
   - Evaluate whether greedy choices hold or if exhaustive search with memoization is required.

2. **Standard Interview Approach:**
   - **Brute Force:** State the naive \`O(N^2)\` or \`O(2^N)\` approach first to demonstrate baseline correctness.
   - **Optimization:** Identify duplicate work, sorted properties, or monotonicity to optimize to \`O(N log N)\` or \`O(N)\`.
   - **Edge Cases:** Handle empty inputs, single element, boundary pivots, and negative numbers.

\`\`\`typescript
// Clean modular template
function solveProblem(input: number[]): number {
  if (!input || input.length === 0) return 0;
  
  // Step 1: Preprocessing / Pointers
  let result = 0;
  
  // Step 2: Algorithmic transformation
  // ...
  
  return result;
}
\`\`\`

Feel free to ask for a specific code walkthrough, complexity proof, or a practice drill!`,
  };
}
