package uk.ac.bham.teamproject.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link uk.ac.bham.teamproject.domain.FinalGroup} entity. This class is used
 * in {@link uk.ac.bham.teamproject.web.rest.FinalGroupResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /final-groups?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinalGroupCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private StringFilter members;

    private BooleanFilter isAdvertised;

    private StringFilter groupDescription;

    private StringFilter pfp;

    private StringFilter admins;

    private Boolean distinct;

    public FinalGroupCriteria() {}

    public FinalGroupCriteria(FinalGroupCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.members = other.members == null ? null : other.members.copy();
        this.isAdvertised = other.isAdvertised == null ? null : other.isAdvertised.copy();
        this.groupDescription = other.groupDescription == null ? null : other.groupDescription.copy();
        this.pfp = other.pfp == null ? null : other.pfp.copy();
        this.admins = other.admins == null ? null : other.admins.copy();
        this.distinct = other.distinct;
    }

    @Override
    public FinalGroupCriteria copy() {
        return new FinalGroupCriteria(this);
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

    public StringFilter getMembers() {
        return members;
    }

    public StringFilter members() {
        if (members == null) {
            members = new StringFilter();
        }
        return members;
    }

    public void setMembers(StringFilter members) {
        this.members = members;
    }

    public BooleanFilter getIsAdvertised() {
        return isAdvertised;
    }

    public BooleanFilter isAdvertised() {
        if (isAdvertised == null) {
            isAdvertised = new BooleanFilter();
        }
        return isAdvertised;
    }

    public void setIsAdvertised(BooleanFilter isAdvertised) {
        this.isAdvertised = isAdvertised;
    }

    public StringFilter getGroupDescription() {
        return groupDescription;
    }

    public StringFilter groupDescription() {
        if (groupDescription == null) {
            groupDescription = new StringFilter();
        }
        return groupDescription;
    }

    public void setGroupDescription(StringFilter groupDescription) {
        this.groupDescription = groupDescription;
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

    public StringFilter getAdmins() {
        return admins;
    }

    public StringFilter admins() {
        if (admins == null) {
            admins = new StringFilter();
        }
        return admins;
    }

    public void setAdmins(StringFilter admins) {
        this.admins = admins;
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
        final FinalGroupCriteria that = (FinalGroupCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(members, that.members) &&
            Objects.equals(isAdvertised, that.isAdvertised) &&
            Objects.equals(groupDescription, that.groupDescription) &&
            Objects.equals(pfp, that.pfp) &&
            Objects.equals(admins, that.admins) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, members, isAdvertised, groupDescription, pfp, admins, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinalGroupCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (members != null ? "members=" + members + ", " : "") +
            (isAdvertised != null ? "isAdvertised=" + isAdvertised + ", " : "") +
            (groupDescription != null ? "groupDescription=" + groupDescription + ", " : "") +
            (pfp != null ? "pfp=" + pfp + ", " : "") +
            (admins != null ? "admins=" + admins + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
