package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AppUsers.
 */
@Entity
@Table(name = "app_users")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppUsers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Max(value = 5)
    @Column(name = "study_year", nullable = false)
    private Integer studyYear;

    @Column(name = "bio")
    private String bio;

    @Column(name = "pfp")
    private String pfp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppUsers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public AppUsers name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStudyYear() {
        return this.studyYear;
    }

    public AppUsers studyYear(Integer studyYear) {
        this.setStudyYear(studyYear);
        return this;
    }

    public void setStudyYear(Integer studyYear) {
        this.studyYear = studyYear;
    }

    public String getBio() {
        return this.bio;
    }

    public AppUsers bio(String bio) {
        this.setBio(bio);
        return this;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPfp() {
        return this.pfp;
    }

    public AppUsers pfp(String pfp) {
        this.setPfp(pfp);
        return this;
    }

    public void setPfp(String pfp) {
        this.pfp = pfp;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUsers)) {
            return false;
        }
        return id != null && id.equals(((AppUsers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUsers{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", studyYear=" + getStudyYear() +
            ", bio='" + getBio() + "'" +
            ", pfp='" + getPfp() + "'" +
            "}";
    }
}
