package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AppUserLogins.
 */
@Entity
@Table(name = "app_user_logins")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppUserLogins implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @NotNull
    @Column(name = "password_salt", nullable = false)
    private String passwordSalt;

    @NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @JsonIgnoreProperties(value = { "degree", "optionalModules" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private AppUsers appUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppUserLogins id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public AppUserLogins userEmail(String userEmail) {
        this.setUserEmail(userEmail);
        return this;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getPasswordSalt() {
        return this.passwordSalt;
    }

    public AppUserLogins passwordSalt(String passwordSalt) {
        this.setPasswordSalt(passwordSalt);
        return this;
    }

    public void setPasswordSalt(String passwordSalt) {
        this.passwordSalt = passwordSalt;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public AppUserLogins passwordHash(String passwordHash) {
        this.setPasswordHash(passwordHash);
        return this;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public AppUsers getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUsers appUsers) {
        this.appUser = appUsers;
    }

    public AppUserLogins appUser(AppUsers appUsers) {
        this.setAppUser(appUsers);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUserLogins)) {
            return false;
        }
        return id != null && id.equals(((AppUserLogins) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUserLogins{" +
            "id=" + getId() +
            ", userEmail='" + getUserEmail() + "'" +
            ", passwordSalt='" + getPasswordSalt() + "'" +
            ", passwordHash='" + getPasswordHash() + "'" +
            "}";
    }
}
