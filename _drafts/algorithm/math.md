### 傅里叶变换

怎么将混合的波依频率分开，

$$
\frac{1}{N}\sum_{k=1}^{N}g(t_{k})e^{-2 \pi i f t_{k}}

\frac{1}{t_2 - t_1} \int_{t1}^{t2}{g(t)e^{-2 \pi i f t} dt}

\hat{g}(f) = \int_{t1}^{t2}{g(t)e^{-2 \pi i f t} dt}
$$

### 卷积积分

$$
(f \times g)(n) = \int_{- \infty}^{+ \infty}{f(\tau)g(n - \tau)d\tau}

(f \times g)(n) = \sum_{\tau = - \infty}^{+ \infty}{f(\tau)g(n - \tau)}
$$

将图像A表示为矩阵：

$$
A =

\begin{bmatrix}
a_{0,0} & a_{0,1} & a_{0,2} & \dots & a_{0,n}\\
a_{1,0} & a_{1,1} & a_{1,2} & \dots & a_{1,n}\\
a_{2,0} & a_{2,1} & a_{2,2} & \dots & a_{2,n}\\
\dots   & \dots   & \dots   & \dots & \dots  \\
a_{m,0} & a_{m,1} & a_{m,2} & \dots & a_{m,n}\\
\end{bmatrix}
$$

平滑$$ a_{1,1} $$点，取平均矩阵g：

$$
g =

\begin{bmatrix}
\frac{1}{9} & \frac{1}{9} & \frac{1}{9} \\
\frac{1}{9} & \frac{1}{9} & \frac{1}{9} \\
\frac{1}{9} & \frac{1}{9} & \frac{1}{9} \\
\end{bmatrix}
$$

取$$ a_{1,1} $$点附近的点组成矩阵f：

$$
f =

\begin{bmatrix}
a_{0,0} & a_{0,1} & a_{0,2} \\
a_{1,0} & a_{1,1} & a_{1,2} \\
a_{2,0} & a_{2,1} & a_{2,2} \\
\end{bmatrix}
$$

为了运用卷积，g和f虽然同维度，但下标不同：

$$
f =

\begin{bmatrix}
a_{0,0} & a_{0,1} & a_{0,2} \\
a_{1,0} & a_{1,1} & a_{1,2} \\
a_{2,0} & a_{2,1} & a_{2,2} \\
\end{bmatrix}

\qquad

g =

\begin{bmatrix}
b_{-1,-1} & b_{-1,0} & b_{-1,1} \\
b_{0, -1} & b_{0, 0} & b_{0, 1} \\
b_{1, -1} & b_{1, 0} & b_{1, 1} \\
\end{bmatrix}
$$

计算时a,b的下标相加都为1,1，写成卷积公式就是：

$$
(f \times g)(1,1) = \sum_{k=0}^{2}\sum_{h=0}^{2}f(h,k)g(1-h, 1-k)
$$
