package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserGroupUsers.
 */
@Entity
@Table(name = "user_group_users")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserGroupUsers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    private UserGroups group;

    @ManyToOne
    private AppUsers user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserGroupUsers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserGroups getGroup() {
        return this.group;
    }

    public void setGroup(UserGroups userGroups) {
        this.group = userGroups;
    }

    public UserGroupUsers group(UserGroups userGroups) {
        this.setGroup(userGroups);
        return this;
    }

    public AppUsers getUser() {
        return this.user;
    }

    public void setUser(AppUsers appUsers) {
        this.user = appUsers;
    }

    public UserGroupUsers user(AppUsers appUsers) {
        this.setUser(appUsers);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserGroupUsers)) {
            return false;
        }
        return id != null && id.equals(((UserGroupUsers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserGroupUsers{" +
            "id=" + getId() +
            "}";
    }
}
