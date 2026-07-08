# CareerOS Business Rules

1. **Skill Verification Threshold (Rule 1)**
   - `ai_validated_confidence >= 0.7` is strictly required for a skill to be marked as "Verified". Anything below is "Unverified".

2. **Temporal Integrity (Rule 2)**
   - All experiences must have `end_date >= start_date`.

3. **Identity Immutability (Snapshots) (Rule 3)**
   - Changes to the profile generate a new `IdentitySnapshot`. Past states are immutable.

4. **Evidence Linkage (Rule 4)**
   - Verified skills require a Foreign Key (`experienceId`) linking to a valid `WorkExperience`.
