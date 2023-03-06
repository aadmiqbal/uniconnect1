package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Degrees.
 */
@Entity
@Table(name = "degrees")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Degrees implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "degree_name", nullable = false)
    private String degreeName;

    @OneToMany(mappedBy = "degree")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "degree", "subject" }, allowSetters = true)
    private Set<DegreeSubjects> subjects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Degrees id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDegreeName() {
        return this.degreeName;
    }

    public Degrees degreeName(String degreeName) {
        this.setDegreeName(degreeName);
        return this;
    }

    public void setDegreeName(String degreeName) {
        this.degreeName = degreeName;
    }

    public Set<DegreeSubjects> getSubjects() {
        return this.subjects;
    }

    public void setSubjects(Set<DegreeSubjects> degreeSubjects) {
        if (this.subjects != null) {
            this.subjects.forEach(i -> i.setDegree(null));
        }
        if (degreeSubjects != null) {
            degreeSubjects.forEach(i -> i.setDegree(this));
        }
        this.subjects = degreeSubjects;
    }

    public Degrees subjects(Set<DegreeSubjects> degreeSubjects) {
        this.setSubjects(degreeSubjects);
        return this;
    }

    public Degrees addSubject(DegreeSubjects degreeSubjects) {
        this.subjects.add(degreeSubjects);
        degreeSubjects.setDegree(this);
        return this;
    }

    public Degrees removeSubject(DegreeSubjects degreeSubjects) {
        this.subjects.remove(degreeSubjects);
        degreeSubjects.setDegree(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Degrees)) {
            return false;
        }
        return id != null && id.equals(((Degrees) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Degrees{" +
            "id=" + getId() +
            ", degreeName='" + getDegreeName() + "'" +
            "}";
    }
}
