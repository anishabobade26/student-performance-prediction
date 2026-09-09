# Explainable AI (XAI) Architecture & Theory

Educational machine learning systems require high trust and interpretability. Black-box predictions can introduce bias and offer no guidance to educators. This platform employs two complementary explainability techniques:

---

## 1. SHAP (SHapley Additive exPlanations)

SHAP calculates game-theoretic Shapley values to apportion the credit of a prediction among all input features:

$$f(x) = \phi_0 + \sum_{i=1}^{M} \phi_i$$

Where:
- $\phi_0$ is the base value (expected value across the training population, $\approx 10.4 / 20$).
- $\phi_i$ represents the Shapley attribution value for feature $i$.
- $\phi_i > 0$ indicates a positive boost (e.g. $+1.8$ points due to high study time).
- $\phi_i < 0$ indicates a penalty (e.g. $-1.4$ points due to previous failures).

### Implementation:
- **`TreeExplainer`**: Leveraged for tree-based ensemble models (Random Forest, Gradient Boosting, XGBoost, LightGBM) to achieve $O(TLD^2)$ fast exact Shapley values.
- **`LinearExplainer`**: Utilized for linear models (Ridge, Lasso).

---

## 2. LIME (Local Interpretable Model-agnostic Explanations)

LIME builds a local surrogate linear model by perturbing the student's feature vector and observing changes in model output:

$$\xi(x) = \arg\min_{g \in G} \mathcal{L}(f, g, \pi_x) + \Omega(g)$$

Where:
- $g$ is the simple, interpretable linear explanation.
- $\pi_x(z)$ defines the proximity measure between perturbed instance $z$ and target $x$.
- $\Omega(g)$ penalizes model complexity.

---

## 3. Human-Readable Natural Language Translation

Mathematical feature attributions are parsed by `app.ml.explainer._generate_human_explanations` to synthesize plain-English observations, e.g.:

> *"Strong 2nd period performance (G2: 15/20) was the primary positive driver, significantly uplifting the forecast."*

> *"High number of school absences (14 days) penalized the overall forecast."*
