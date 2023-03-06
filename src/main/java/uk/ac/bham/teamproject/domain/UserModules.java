package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserModules.
 */
@Entity
@Table(name = "user_modules")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserModules implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "module_name", nullable = false)
    private String moduleName;

    @NotNull
    @Column(name = "optional", nullable = false)
    private Boolean optional;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "study_year", nullable = false)
    private Integer studyYear;

    @ManyToOne
    private Subjects subject;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserModules id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModuleName() {
        return this.moduleName;
    }

    public UserModules moduleName(String moduleName) {
        this.setModuleName(moduleName);
        return this;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public Boolean getOptional() {
        return this.optional;
    }

    public UserModules optional(Boolean optional) {
        this.setOptional(optional);
        return this;
    }

    public void setOptional(Boolean optional) {
        this.optional = optional;
    }

    public Integer getStudyYear() {
        return this.studyYear;
    }

    public UserModules studyYear(Integer studyYear) {
        this.setStudyYear(studyYear);
        return this;
    }

    public void setStudyYear(Integer studyYear) {
        this.studyYear = studyYear;
    }

    public Subjects getSubject() {
        return this.subject;
    }

    public void setSubject(Subjects subjects) {
        this.subject = subjects;
    }

    public UserModules subject(Subjects subjects) {
        this.setSubject(subjects);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserModules)) {
            return false;
        }
        return id != null && id.equals(((UserModules) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserModules{" +
            "id=" + getId() +
            ", moduleName='" + getModuleName() + "'" +
            ", optional='" + getOptional() + "'" +
            ", studyYear=" + getStudyYear() +
            "}";
    }
}
