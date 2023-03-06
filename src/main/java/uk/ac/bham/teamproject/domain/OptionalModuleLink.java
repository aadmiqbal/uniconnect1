package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OptionalModuleLink.
 */
@Entity
@Table(name = "optional_module_link")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OptionalModuleLink implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "subject" }, allowSetters = true)
    private UserModules optionalModule;

    @ManyToOne
    private AppUsers optionalModuleUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OptionalModuleLink id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserModules getOptionalModule() {
        return this.optionalModule;
    }

    public void setOptionalModule(UserModules userModules) {
        this.optionalModule = userModules;
    }

    public OptionalModuleLink optionalModule(UserModules userModules) {
        this.setOptionalModule(userModules);
        return this;
    }

    public AppUsers getOptionalModuleUser() {
        return this.optionalModuleUser;
    }

    public void setOptionalModuleUser(AppUsers appUsers) {
        this.optionalModuleUser = appUsers;
    }

    public OptionalModuleLink optionalModuleUser(AppUsers appUsers) {
        this.setOptionalModuleUser(appUsers);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OptionalModuleLink)) {
            return false;
        }
        return id != null && id.equals(((OptionalModuleLink) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OptionalModuleLink{" +
            "id=" + getId() +
            "}";
    }
}
