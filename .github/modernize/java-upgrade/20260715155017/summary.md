# Upgrade Summary: student-placement-tracker

## Outcome

- Updated the backend Java target from 17 to 24 in [backend/pom.xml](backend/pom.xml).
- Updated the runtime container images in [backend/Dockerfile](backend/Dockerfile) to use Java 24.
- Refreshed the documented backend runtime in [README.md](README.md).
- Installed Maven 3.9.15 and JDK 25 for verification.

## Verification

- Compile: `mvn -q -DskipTests compile` succeeded under the upgraded toolchain.
- Tests: `mvn -q test` succeeded under the upgraded toolchain.

## Notes

- The environment did not have Maven preinstalled, so Maven was installed locally for verification.
- The project already compiled cleanly with the runtime change, so no application code rewrites were necessary.
