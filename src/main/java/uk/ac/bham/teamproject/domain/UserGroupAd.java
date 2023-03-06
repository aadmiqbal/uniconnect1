package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserGroupAd.
 */
@Entity
@Table(name = "user_group_ad")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserGroupAd implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "group_bio")
    private String groupBio;

    @OneToOne
    @JoinColumn(unique = true)
    private UserGroups group;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserGroupAd id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupBio() {
        return this.groupBio;
    }

    public UserGroupAd groupBio(String groupBio) {
        this.setGroupBio(groupBio);
        return this;
    }

    public void setGroupBio(String groupBio) {
        this.groupBio = groupBio;
    }

    public UserGroups getGroup() {
        return this.group;
    }

    public void setGroup(UserGroups userGroups) {
        this.group = userGroups;
    }

    public UserGroupAd group(UserGroups userGroups) {
        this.setGroup(userGroups);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserGroupAd)) {
            return false;
        }
        return id != null && id.equals(((UserGroupAd) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserGroupAd{" +
            "id=" + getId() +
            ", groupBio='" + getGroupBio() + "'" +
            "}";
    }
}
