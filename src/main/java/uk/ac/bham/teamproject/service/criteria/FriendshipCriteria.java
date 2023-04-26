package uk.ac.bham.teamproject.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link uk.ac.bham.teamproject.domain.Friendship} entity. This class is used
 * in {@link uk.ac.bham.teamproject.web.rest.FriendshipResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /friendships?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FriendshipCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private LongFilter finalUserId;

    private LongFilter finalUser2Id;

    private Boolean distinct;

    public FriendshipCriteria() {}

    public FriendshipCriteria(FriendshipCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.finalUserId = other.finalUserId == null ? null : other.finalUserId.copy();
        this.finalUser2Id = other.finalUser2Id == null ? null : other.finalUser2Id.copy();
        this.distinct = other.distinct;
    }

    @Override
    public FriendshipCriteria copy() {
        return new FriendshipCriteria(this);
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

    public LongFilter getFinalUserId() {
        return finalUserId;
    }

    public LongFilter finalUserId() {
        if (finalUserId == null) {
            finalUserId = new LongFilter();
        }
        return finalUserId;
    }

    public void setFinalUserId(LongFilter finalUserId) {
        this.finalUserId = finalUserId;
    }

    public LongFilter getFinalUser2Id() {
        return finalUser2Id;
    }

    public LongFilter finalUser2Id() {
        if (finalUser2Id == null) {
            finalUser2Id = new LongFilter();
        }
        return finalUser2Id;
    }

    public void setFinalUser2Id(LongFilter finalUser2Id) {
        this.finalUser2Id = finalUser2Id;
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
        final FriendshipCriteria that = (FriendshipCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(finalUserId, that.finalUserId) &&
            Objects.equals(finalUser2Id, that.finalUser2Id) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, finalUserId, finalUser2Id, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FriendshipCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (finalUserId != null ? "finalUserId=" + finalUserId + ", " : "") +
            (finalUser2Id != null ? "finalUser2Id=" + finalUser2Id + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
