package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mentors.
 */
@Entity
@Table(name = "mentors")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Mentors implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "subject" }, allowSetters = true)
    private UserModules module;

    @ManyToOne
    private AppUsers mentorUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Mentors id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserModules getModule() {
        return this.module;
    }

    public void setModule(UserModules userModules) {
        this.module = userModules;
    }

    public Mentors module(UserModules userModules) {
        this.setModule(userModules);
        return this;
    }

    public AppUsers getMentorUser() {
        return this.mentorUser;
    }

    public void setMentorUser(AppUsers appUsers) {
        this.mentorUser = appUsers;
    }

    public Mentors mentorUser(AppUsers appUsers) {
        this.setMentorUser(appUsers);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mentors)) {
            return false;
        }
        return id != null && id.equals(((Mentors) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mentors{" +
            "id=" + getId() +
            "}";
    }
}
