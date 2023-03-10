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
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "study_year", nullable = false)
    private Integer studyYear;

    @Column(name = "bio")
    private String bio;

    @Column(name = "pfp")
    private String pfp;

    @ManyToOne
    @JsonIgnoreProperties(value = { "subjects" }, allowSetters = true)
    private Degrees degree;

    @OneToMany(mappedBy = "optionalModuleUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "optionalModule", "optionalModuleUser" }, allowSetters = true)
    private Set<ModuleLink> optionalModules = new HashSet<>();

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

    public Degrees getDegree() {
        return this.degree;
    }

    public void setDegree(Degrees degrees) {
        this.degree = degrees;
    }

    public AppUsers degree(Degrees degrees) {
        this.setDegree(degrees);
        return this;
    }

    public Set<ModuleLink> getOptionalModules() {
        return this.optionalModules;
    }

    public void setOptionalModules(Set<ModuleLink> moduleLinks) {
        if (this.optionalModules != null) {
            this.optionalModules.forEach(i -> i.setOptionalModuleUser(null));
        }
        if (moduleLinks != null) {
            moduleLinks.forEach(i -> i.setOptionalModuleUser(this));
        }
        this.optionalModules = moduleLinks;
    }

    public AppUsers optionalModules(Set<ModuleLink> moduleLinks) {
        this.setOptionalModules(moduleLinks);
        return this;
    }

    public AppUsers addOptionalModules(ModuleLink moduleLink) {
        this.optionalModules.add(moduleLink);
        moduleLink.setOptionalModuleUser(this);
        return this;
    }

    public AppUsers removeOptionalModules(ModuleLink moduleLink) {
        this.optionalModules.remove(moduleLink);
        moduleLink.setOptionalModuleUser(null);
        return this;
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
