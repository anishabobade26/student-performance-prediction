from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict


class StudentInput(BaseModel):
    # Demographics
    school: Literal["GP", "MS"] = Field("GP", description="School (GP: Gabriel Pereira, MS: Mousinho da Silveira)")
    sex: Literal["F", "M"] = Field("F", description="Student sex (F: Female, M: Male)")
    age: int = Field(17, ge=15, le=22, description="Student age in years (15-22)")
    address: Literal["U", "R"] = Field("U", description="Home address type (U: Urban, R: Rural)")
    famsize: Literal["LE3", "GT3"] = Field("GT3", description="Family size (LE3: <=3, GT3: >3)")
    Pstatus: Literal["T", "A"] = Field("T", description="Parent cohabitation (T: Together, A: Apart)")

    # Family Background
    Medu: int = Field(3, ge=0, le=4, description="Mother education (0: None, 1: Primary, 2: 5th-9th, 3: Secondary, 4: Higher)")
    Fedu: int = Field(3, ge=0, le=4, description="Father education (0: None, 1: Primary, 2: 5th-9th, 3: Secondary, 4: Higher)")
    Mjob: Literal["teacher", "health", "services", "at_home", "other"] = Field("other", description="Mother job")
    Fjob: Literal["teacher", "health", "services", "at_home", "other"] = Field("other", description="Father job")
    reason: Literal["home", "reputation", "course", "other"] = Field("course", description="Reason to choose school")
    guardian: Literal["mother", "father", "other"] = Field("mother", description="Student guardian")

    # Academic Habits & Travel
    traveltime: int = Field(1, ge=1, le=4, description="Travel time to school (1: <15m, 2: 15-30m, 3: 30-60m, 4: >60m)")
    studytime: int = Field(2, ge=1, le=4, description="Weekly study time (1: <2h, 2: 2-5h, 3: 5-10h, 4: >10h)")
    failures: int = Field(0, ge=0, le=4, description="Past class failures (0-4)")

    # Support & Extracurriculars
    schoolsup: Literal["yes", "no"] = Field("no", description="Extra educational school support")
    famsup: Literal["yes", "no"] = Field("yes", description="Family educational support")
    paid: Literal["yes", "no"] = Field("no", description="Extra paid classes within subject")
    activities: Literal["yes", "no"] = Field("yes", description="Extracurricular activities")
    nursery: Literal["yes", "no"] = Field("yes", description="Attended nursery school")
    higher: Literal["yes", "no"] = Field("yes", description="Wants to pursue higher education")
    internet: Literal["yes", "no"] = Field("yes", description="Internet access at home")
    romantic: Literal["yes", "no"] = Field("no", description="In a romantic relationship")

    # Social & Health
    famrel: int = Field(4, ge=1, le=5, description="Quality of family relationships (1: Very bad to 5: Excellent)")
    freetime: int = Field(3, ge=1, le=5, description="Free time after school (1: Very low to 5: Very high)")
    goout: int = Field(3, ge=1, le=5, description="Frequency of going out with friends (1-5)")
    Dalc: int = Field(1, ge=1, le=5, description="Workday alcohol consumption (1-5)")
    Walc: int = Field(1, ge=1, le=5, description="Weekend alcohol consumption (1-5)")
    health: int = Field(4, ge=1, le=5, description="Current health status (1: Very bad to 5: Very good)")
    absences: int = Field(2, ge=0, le=93, description="Number of school absences (0-93)")

    # Historical Period Grades
    G1: float = Field(12.0, ge=0.0, le=20.0, description="First period grade (0-20 scale)")
    G2: float = Field(13.0, ge=0.0, le=20.0, description="Second period grade (0-20 scale)")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "school": "GP",
                "sex": "F",
                "age": 17,
                "address": "U",
                "famsize": "GT3",
                "Pstatus": "T",
                "Medu": 4,
                "Fedu": 3,
                "Mjob": "services",
                "Fjob": "other",
                "reason": "reputation",
                "guardian": "mother",
                "traveltime": 1,
                "studytime": 3,
                "failures": 0,
                "schoolsup": "no",
                "famsup": "yes",
                "paid": "yes",
                "activities": "yes",
                "nursery": "yes",
                "higher": "yes",
                "internet": "yes",
                "romantic": "no",
                "famrel": 4,
                "freetime": 3,
                "goout": 2,
                "Dalc": 1,
                "Walc": 1,
                "health": 5,
                "absences": 2,
                "G1": 14.0,
                "G2": 15.0
            }
        }
    )
