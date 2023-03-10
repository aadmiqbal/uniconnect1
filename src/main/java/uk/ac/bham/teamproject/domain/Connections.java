package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Connections.
 */
@Entity
@Table(name = "connections")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Connections implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "degree", "optionalModules" }, allowSetters = true)
    private AppUsers user1;

    @ManyToOne
    @JsonIgnoreProperties(value = { "degree", "optionalModules" }, allowSetters = true)
    private AppUsers user2;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Connections id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppUsers getUser1() {
        return this.user1;
    }

    public void setUser1(AppUsers appUsers) {
        this.user1 = appUsers;
    }

    public Connections user1(AppUsers appUsers) {
        this.setUser1(appUsers);
        return this;
    }

    public AppUsers getUser2() {
        return this.user2;
    }

    public void setUser2(AppUsers appUsers) {
        this.user2 = appUsers;
    }

    public Connections user2(AppUsers appUsers) {
        this.setUser2(appUsers);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Connections)) {
            return false;
        }
        return id != null && id.equals(((Connections) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Connections{" +
            "id=" + getId() +
            "}";
    }
}
