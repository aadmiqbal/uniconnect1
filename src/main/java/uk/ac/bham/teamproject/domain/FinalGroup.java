package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FinalGroup.
 */
@Entity
@Table(name = "final_group")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinalGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Size(max = 30000)
    @Column(name = "members", length = 30000)
    private String members;

    @Column(name = "is_advertised")
    private Boolean isAdvertised;

    @Size(max = 10000)
    @Column(name = "group_description", length = 10000)
    private String groupDescription;

    @Size(max = 10485760)
    @Column(name = "pfp", length = 10485760)
    private String pfp;

    @Size(max = 30000)
    @Column(name = "admins", length = 30000)
    private String admins;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FinalGroup id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public FinalGroup name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMembers() {
        return this.members;
    }

    public FinalGroup members(String members) {
        this.setMembers(members);
        return this;
    }

    public void setMembers(String members) {
        this.members = members;
    }

    public Boolean getIsAdvertised() {
        return this.isAdvertised;
    }

    public FinalGroup isAdvertised(Boolean isAdvertised) {
        this.setIsAdvertised(isAdvertised);
        return this;
    }

    public void setIsAdvertised(Boolean isAdvertised) {
        this.isAdvertised = isAdvertised;
    }

    public String getGroupDescription() {
        return this.groupDescription;
    }

    public FinalGroup groupDescription(String groupDescription) {
        this.setGroupDescription(groupDescription);
        return this;
    }

    public void setGroupDescription(String groupDescription) {
        this.groupDescription = groupDescription;
    }

    public String getPfp() {
        return this.pfp;
    }

    public FinalGroup pfp(String pfp) {
        this.setPfp(pfp);
        return this;
    }

    public void setPfp(String pfp) {
        this.pfp = pfp;
    }

    public String getAdmins() {
        return this.admins;
    }

    public FinalGroup admins(String admins) {
        this.setAdmins(admins);
        return this;
    }

    public void setAdmins(String admins) {
        this.admins = admins;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FinalGroup)) {
            return false;
        }
        return id != null && id.equals(((FinalGroup) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinalGroup{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", members='" + getMembers() + "'" +
            ", isAdvertised='" + getIsAdvertised() + "'" +
            ", groupDescription='" + getGroupDescription() + "'" +
            ", pfp='" + getPfp() + "'" +
            ", admins='" + getAdmins() + "'" +
            "}";
    }
}
