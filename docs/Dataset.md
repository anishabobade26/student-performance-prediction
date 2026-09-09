# UCI Student Performance Dataset Reference

The application uses the landmark **Student Performance Data Set** provided by the UCI Machine Learning Repository (Cortez and Silva, 2008).

---

## 1. Attributes Description

| Attribute | Type | Description | Values / Range |
| :--- | :--- | :--- | :--- |
| `school` | Binary | Student school | `GP` (Gabriel Pereira) or `MS` (Mousinho da Silveira) |
| `sex` | Binary | Student sex | `F` (Female), `M` (Male) |
| `age` | Numeric | Student age | 15 to 22 |
| `address` | Binary | Home address type | `U` (Urban), `R` (Rural) |
| `famsize` | Binary | Family size | `LE3` (≤ 3), `GT3` (> 3) |
| `Pstatus` | Binary | Parent cohabitation | `T` (Living together), `A` (Apart) |
| `Medu` | Numeric | Mother education | 0 (None), 1 (4th grade), 2 (5th-9th), 3 (Secondary), 4 (Higher) |
| `Fedu` | Numeric | Father education | 0 (None), 1 (4th grade), 2 (5th-9th), 3 (Secondary), 4 (Higher) |
| `Mjob` | Nominal | Mother job | `teacher`, `health`, `services`, `at_home`, `other` |
| `Fjob` | Nominal | Father job | `teacher`, `health`, `services`, `at_home`, `other` |
| `reason` | Nominal | Reason to choose school | `home`, `reputation`, `course`, `other` |
| `guardian` | Nominal | Student guardian | `mother`, `father`, `other` |
| `traveltime` | Numeric | Travel time to school | 1 (<15m), 2 (15-30m), 3 (30-60m), 4 (>60m) |
| `studytime` | Numeric | Weekly study time | 1 (<2h), 2 (2-5h), 3 (5-10h), 4 (>10h) |
| `failures` | Numeric | Past class failures | 0 to 4 |
| `schoolsup` | Binary | Extra educational support | `yes`, `no` |
| `famsup` | Binary | Family educational support | `yes`, `no` |
| `paid` | Binary | Extra paid tutoring classes | `yes`, `no` |
| `activities` | Binary | Extra-curricular activities | `yes`, `no` |
| `nursery` | Binary | Attended nursery school | `yes`, `no` |
| `higher` | Binary | Wants higher education | `yes`, `no` |
| `internet` | Binary | Internet access at home | `yes`, `no` |
| `romantic` | Binary | In a romantic relationship | `yes`, `no` |
| `famrel` | Numeric | Family relationship quality | 1 (Very bad) to 5 (Excellent) |
| `freetime` | Numeric | Free time after school | 1 (Very low) to 5 (Very high) |
| `goout` | Numeric | Going out with friends | 1 (Very low) to 5 (Very high) |
| `Dalc` | Numeric | Workday alcohol consumption | 1 (Very low) to 5 (Very high) |
| `Walc` | Numeric | Weekend alcohol consumption | 1 (Very low) to 5 (Very high) |
| `health` | Numeric | Current health status | 1 (Very bad) to 5 (Very good) |
| `absences` | Numeric | Number of school absences | 0 to 93 |
| `G1` | Numeric | First period grade | 0 to 20 |
| `G2` | Numeric | Second period grade | 0 to 20 |
| **`G3`** | Numeric | **Final target grade** | **0 to 20** |

---

## 2. Citation

> Cortez, P., & Silva, A. (2008). *Using Data Mining to Predict Secondary School Student Performance*. In Proceedings of 5th Annual Future Business Technology Conference (FUBUTEC 2008), Porto, Portugal, pp. 5-12.
