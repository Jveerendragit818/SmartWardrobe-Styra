from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints


PreferenceValue = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        to_lower=True,
        min_length=1,
        max_length=40,
    ),
]


class PreferencesUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    preferred_colors: list[PreferenceValue] = Field(
        default_factory=list,
        max_length=20,
    )
    preferred_styles: list[PreferenceValue] = Field(
        default_factory=list,
        max_length=20,
    )
    usual_occasions: list[PreferenceValue] = Field(
        default_factory=list,
        max_length=20,
    )
    disliked_colors: list[PreferenceValue] = Field(
        default_factory=list,
        max_length=20,
    )