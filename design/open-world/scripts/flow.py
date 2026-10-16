import numpy as np, numba, heapq
D8 = np.array([(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)], np.int64)

@numba.njit(cache=True)
def fill(h, sink):
    """Priority-flood: raise pits so every cell drains to a sink (sea, lake or map edge)."""
    n0, n1 = h.shape; out = h.copy(); closed = np.zeros(h.shape, np.bool_)
    heap = [(np.float64(0.0), np.int64(0), np.int64(0))]; heap.pop()
    for i in range(n0):
        for j in range(n1):
            if sink[i, j] or i == 0 or j == 0 or i == n0 - 1 or j == n1 - 1:
                heapq.heappush(heap, (out[i, j], np.int64(i), np.int64(j))); closed[i, j] = True
    while len(heap) > 0:
        z, i, j = heapq.heappop(heap)
        for di in range(-1, 2):
            for dj in range(-1, 2):
                a = i + di; b = j + dj
                if a < 0 or b < 0 or a >= n0 or b >= n1 or closed[a, b]: continue
                closed[a, b] = True
                if out[a, b] <= z: out[a, b] = z + 1e-4
                heapq.heappush(heap, (out[a, b], np.int64(a), np.int64(b)))
    return out

@numba.njit(cache=True)
def receivers(h, sink, dx):
    n0, n1 = h.shape; rcv = np.arange(n0 * n1); dist = np.full(n0 * n1, dx)
    for i in range(n0):
        for j in range(n1):
            if sink[i, j]: continue
            best = 0.0; k = i * n1 + j
            for di in range(-1, 2):
                for dj in range(-1, 2):
                    if di == 0 and dj == 0: continue
                    a = i + di; b = j + dj
                    if a < 0 or b < 0 or a >= n0 or b >= n1: continue
                    d = dx * (1.41421356 if di != 0 and dj != 0 else 1.0)
                    s = (h[i, j] - h[a, b]) / d
                    if s > best: best = s; rcv[k] = a * n1 + b; dist[k] = d
    return rcv, dist

@numba.njit(cache=True)
def accumulate(order_desc, rcv, cell_area):
    A = np.full(rcv.shape[0], cell_area)
    for k in order_desc:
        r = rcv[k]
        if r != k: A[r] += A[k]
    return A

@numba.njit(cache=True)
def incise(hf, order_asc, rcv, dist, A, kdt, m, hard):
    """Implicit stream-power step (Braun & Willett 2013), solved from the outlets upward."""
    for k in order_asc:
        r = rcv[k]
        if r == k: continue
        F = kdt * hard[k] * A[k] ** m / dist[k]
        hk = (hf[k] + F * hf[r]) / (1.0 + F)
        if hk < hf[k]: hf[k] = hk
    return hf

def erode(h, sink, dx, iters=30, kdt=0.003, m=0.5, hard=None, diffuse=0.15):
    from scipy import ndimage as ndi
    hard = np.ones(h.size) if hard is None else hard.ravel().astype(np.float64)
    for it in range(iters):
        f = fill(h, sink)
        rcv, dist = receivers(f, sink, dx)
        fl = f.ravel()
        A = accumulate(np.argsort(-fl), rcv, dx * dx)
        fl = incise(fl.copy(), np.argsort(fl), rcv, dist, A, kdt, m, hard)
        new = fl.reshape(h.shape)
        if diffuse > 0:
            lap = ndi.uniform_filter(new, 3) - new
            new = new + diffuse * lap * (~sink)
        h = np.where(sink, h, np.minimum(new, f))
    return h

def flow(h, sink, dx):
    f = fill(h, sink)
    rcv, dist = receivers(f, sink, dx)
    A = accumulate(np.argsort(-f.ravel()), rcv, dx * dx)
    return f, rcv, dist, A.reshape(h.shape)
