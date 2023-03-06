package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DegreeSubjects.
 */
@Entity
@Table(name = "degree_subjects")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DegreeSubjects implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "subjects" }, allowSetters = true)
    private Degrees degree;

    @ManyToOne
    private Subjects subject;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DegreeSubjects id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Degrees getDegree() {
        return this.degree;
    }

    public void setDegree(Degrees degrees) {
        this.degree = degrees;
    }

    public DegreeSubjects degree(Degrees degrees) {
        this.setDegree(degrees);
        return this;
    }

    public Subjects getSubject() {
        return this.subject;
    }

    public void setSubject(Subjects subjects) {
        this.subject = subjects;
    }

    public DegreeSubjects subject(Subjects subjects) {
        this.setSubject(subjects);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DegreeSubjects)) {
            return false;
        }
        return id != null && id.equals(((DegreeSubjects) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DegreeSubjects{" +
            "id=" + getId() +
            "}";
    }
}
