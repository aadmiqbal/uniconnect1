package uk.ac.bham.teamproject.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link uk.ac.bham.teamproject.domain.Message} entity. This class is used
 * in {@link uk.ac.bham.teamproject.web.rest.MessageResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /messages?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MessageCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private IntegerFilter senderId;

    private IntegerFilter recieverId;

    private StringFilter content;

    private InstantFilter timestamp;

    private Boolean distinct;

    public MessageCriteria() {}

    public MessageCriteria(MessageCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.senderId = other.senderId == null ? null : other.senderId.copy();
        this.recieverId = other.recieverId == null ? null : other.recieverId.copy();
        this.content = other.content == null ? null : other.content.copy();
        this.timestamp = other.timestamp == null ? null : other.timestamp.copy();
        this.distinct = other.distinct;
    }

    @Override
    public MessageCriteria copy() {
        return new MessageCriteria(this);
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

    public IntegerFilter getSenderId() {
        return senderId;
    }

    public IntegerFilter senderId() {
        if (senderId == null) {
            senderId = new IntegerFilter();
        }
        return senderId;
    }

    public void setSenderId(IntegerFilter senderId) {
        this.senderId = senderId;
    }

    public IntegerFilter getRecieverId() {
        return recieverId;
    }

    public IntegerFilter recieverId() {
        if (recieverId == null) {
            recieverId = new IntegerFilter();
        }
        return recieverId;
    }

    public void setRecieverId(IntegerFilter recieverId) {
        this.recieverId = recieverId;
    }

    public StringFilter getContent() {
        return content;
    }

    public StringFilter content() {
        if (content == null) {
            content = new StringFilter();
        }
        return content;
    }

    public void setContent(StringFilter content) {
        this.content = content;
    }

    public InstantFilter getTimestamp() {
        return timestamp;
    }

    public InstantFilter timestamp() {
        if (timestamp == null) {
            timestamp = new InstantFilter();
        }
        return timestamp;
    }

    public void setTimestamp(InstantFilter timestamp) {
        this.timestamp = timestamp;
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
        final MessageCriteria that = (MessageCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(senderId, that.senderId) &&
            Objects.equals(recieverId, that.recieverId) &&
            Objects.equals(content, that.content) &&
            Objects.equals(timestamp, that.timestamp) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, senderId, recieverId, content, timestamp, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MessageCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (senderId != null ? "senderId=" + senderId + ", " : "") +
            (recieverId != null ? "recieverId=" + recieverId + ", " : "") +
            (content != null ? "content=" + content + ", " : "") +
            (timestamp != null ? "timestamp=" + timestamp + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
