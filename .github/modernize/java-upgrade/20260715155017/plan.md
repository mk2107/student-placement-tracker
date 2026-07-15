# Upgrade Plan: student-placement-tracker (20260715155017)

- **Generated**: 2026-07-15 15:50:17
- **HEAD Branch**: main
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 17: C:\Program Files\Java\jdk-17 (not found; baseline will be skipped)
- JDK 22: C:\Program Files\Java\jdk-22\bin
- JDK 23: C:\Program Files\Java\jdk-23\bin
- JDK 24: C:\Program Files\Java\jdk-24\bin

**Build Tools**
- Maven: **<TO_BE_INSTALLED>** (required to build and verify the backend)
- Maven Wrapper: not present

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260715155017
- Run tests before and after the upgrade: true

## Upgrade Goals

- Java runtime: latest LTS version

## Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| ---------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 25 | User requested latest LTS runtime |
| Spring Boot | 3.3.2 | 3.3.2 | Current baseline already compatible |
| Maven | not detected | 3.9+ | Needed for reliable Java 25 build verification |

## Derived Upgrades

- Update Maven build and container configuration to target the latest LTS JDK available in the environment.
- Ensure the backend can compile and test with the selected JDK.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|-----------|---------|--------|--------|--------|
| backend/pom.xml | java.version | 17 | upgrade | 25 | User requested latest LTS runtime |

### Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| None expected | - | - | None | Current codebase is already on Spring Boot 3.3 and Java 17-compatible APIs |

### Configuration Changes

| File | Property/Setting | Current | Required Change | Reason |
|------|------------------|---------|----------------|--------|
| backend/Dockerfile | base image | eclipse-temurin:17-jre | update to a Java 25-compatible base image | Align container runtime with target JDK |
| README.md | documented backend runtime | Java 17 | update to Java 25 | Documentation drift |

### CI/CD Changes

| File | Location | Current | Required Change |
|------|----------|---------|----------------|
| None detected | - | - | - |

### Risks & Warnings

- The environment exposes JDK 22/23/24, but Maven was not found, so installation is required before build verification can proceed.
- The project currently has unrelated modified files; the upgrade should avoid changing them unless necessary.

## Upgrade Steps

- Step 1: Setup Environment
  - **Rationale**: Install a compatible Java build toolchain and confirm the target JDK path before changing project files.
  - **Changes to Make**: Install Maven and confirm the selected JDK path.
  - **Verification**: Run `mvn -version` and `java -version` with the target JDK.

- Step 2: Update Runtime Configuration
  - **Rationale**: Align the backend Maven configuration and container image with the upgraded Java runtime.
  - **Changes to Make**: Update backend/pom.xml, backend/Dockerfile, and README.md.
  - **Verification**: Run `mvn -q -DskipTests compile` in backend.

- Step 3: Final Validation
  - **Rationale**: Ensure the application still builds and tests successfully with the upgraded runtime.
  - **Changes to Make**: Fix any compilation or test issues introduced by the runtime change.
  - **Verification**: Run `mvn -q test` in backend.
