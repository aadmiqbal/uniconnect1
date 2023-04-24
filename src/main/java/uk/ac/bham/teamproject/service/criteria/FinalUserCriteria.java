package uk.ac.bham.teamproject.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link uk.ac.bham.teamproject.domain.FinalUser} entity. This class is used
 * in {@link uk.ac.bham.teamproject.web.rest.FinalUserResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /final-users?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinalUserCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private IntegerFilter studyYear;

    private StringFilter bio;

    private StringFilter pfp;

    private StringFilter modules;

    private StringFilter firstName;

    private StringFilter lastName;

    private LongFilter userId;

    private Boolean distinct;

    public FinalUserCriteria() {}

    public FinalUserCriteria(FinalUserCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.studyYear = other.studyYear == null ? null : other.studyYear.copy();
        this.bio = other.bio == null ? null : other.bio.copy();
        this.pfp = other.pfp == null ? null : other.pfp.copy();
        this.modules = other.modules == null ? null : other.modules.copy();
        this.firstName = other.firstName == null ? null : other.firstName.copy();
        this.lastName = other.lastName == null ? null : other.lastName.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public FinalUserCriteria copy() {
        return new FinalUserCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getName() {
        return name;
    }

    public StringFilter name() {
        if (name == null) {
            name = new StringFilter();
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public IntegerFilter getStudyYear() {
        return studyYear;
    }

    public IntegerFilter studyYear() {
        if (studyYear == null) {
            studyYear = new IntegerFilter();
        }
        return studyYear;
    }

    public void setStudyYear(IntegerFilter studyYear) {
        this.studyYear = studyYear;
    }

    public StringFilter getBio() {
        return bio;
    }

    public StringFilter bio() {
        if (bio == null) {
            bio = new StringFilter();
        }
        return bio;
    }

    public void setBio(StringFilter bio) {
        this.bio = bio;
    }

    public StringFilter getPfp() {
        return pfp;
    }

    public StringFilter pfp() {
        if (pfp == null) {
            pfp = new StringFilter();
        }
        return pfp;
    }

    public void setPfp(StringFilter pfp) {
        this.pfp = pfp;
    }

    public StringFilter getModules() {
        return modules;
    }

    public StringFilter modules() {
        if (modules == null) {
            modules = new StringFilter();
        }
        return modules;
    }

    public void setModules(StringFilter modules) {
        this.modules = modules;
    }

    public StringFilter getFirstName() {
        return firstName;
    }

    public StringFilter firstName() {
        if (firstName == null) {
            firstName = new StringFilter();
        }
        return firstName;
    }

    public void setFirstName(StringFilter firstName) {
        this.firstName = firstName;
    }

    public StringFilter getLastName() {
        return lastName;
    }

    public StringFilter lastName() {
        if (lastName == null) {
            lastName = new StringFilter();
        }
        return lastName;
    }

    public void setLastName(StringFilter lastName) {
        this.lastName = lastName;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public LongFilter userId() {
        if (userId == null) {
            userId = new LongFilter();
        }
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final FinalUserCriteria that = (FinalUserCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(studyYear, that.studyYear) &&
            Objects.equals(bio, that.bio) &&
            Objects.equals(pfp, that.pfp) &&
            Objects.equals(modules, that.modules) &&
            Objects.equals(firstName, that.firstName) &&
            Objects.equals(lastName, that.lastName) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, studyYear, bio, pfp, modules, firstName, lastName, userId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinalUserCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (studyYear != null ? "studyYear=" + studyYear + ", " : "") +
            (bio != null ? "bio=" + bio + ", " : "") +
            (pfp != null ? "pfp=" + pfp + ", " : "") +
            (modules != null ? "modules=" + modules + ", " : "") +
            (firstName != null ? "firstName=" + firstName + ", " : "") +
            (lastName != null ? "lastName=" + lastName + ", " : "") +
            (userId != null ? "userId=" + userId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
