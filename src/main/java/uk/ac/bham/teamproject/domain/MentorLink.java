package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MentorLink.
 */
@Entity
@Table(name = "mentor_link")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MentorLink implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "module", "mentorUser" }, allowSetters = true)
    private Mentors mentor;

    @ManyToOne
    @JsonIgnoreProperties(value = { "module", "menteeUser" }, allowSetters = true)
    private Mentees mentee;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MentorLink id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mentors getMentor() {
        return this.mentor;
    }

    public void setMentor(Mentors mentors) {
        this.mentor = mentors;
    }

    public MentorLink mentor(Mentors mentors) {
        this.setMentor(mentors);
        return this;
    }

    public Mentees getMentee() {
        return this.mentee;
    }

    public void setMentee(Mentees mentees) {
        this.mentee = mentees;
    }

    public MentorLink mentee(Mentees mentees) {
        this.setMentee(mentees);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MentorLink)) {
            return false;
        }
        return id != null && id.equals(((MentorLink) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MentorLink{" +
            "id=" + getId() +
            "}";
    }
}
