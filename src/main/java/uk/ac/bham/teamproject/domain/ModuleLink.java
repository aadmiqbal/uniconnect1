package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ModuleLink.
 */
@Entity
@Table(name = "module_link")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ModuleLink implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    private UserModules optionalModule;

    @ManyToOne
    @JsonIgnoreProperties(value = { "subject", "optionalModules" }, allowSetters = true)
    private AppUsers optionalModuleUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ModuleLink id(Long id) {
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

    public ModuleLink optionalModule(UserModules userModules) {
        this.setOptionalModule(userModules);
        return this;
    }

    public AppUsers getOptionalModuleUser() {
        return this.optionalModuleUser;
    }

    public void setOptionalModuleUser(AppUsers appUsers) {
        this.optionalModuleUser = appUsers;
    }

    public ModuleLink optionalModuleUser(AppUsers appUsers) {
        this.setOptionalModuleUser(appUsers);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ModuleLink)) {
            return false;
        }
        return id != null && id.equals(((ModuleLink) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ModuleLink{" +
            "id=" + getId() +
            "}";
    }
}
