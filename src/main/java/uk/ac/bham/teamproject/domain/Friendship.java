package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Friendship.
 */
@Entity
@Table(name = "friendship")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Friendship implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private FinalUser finalUser;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private FinalUser finalUser2;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Friendship id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FinalUser getFinalUser() {
        return this.finalUser;
    }

    public void setFinalUser(FinalUser finalUser) {
        this.finalUser = finalUser;
    }

    public Friendship finalUser(FinalUser finalUser) {
        this.setFinalUser(finalUser);
        return this;
    }

    public FinalUser getFinalUser2() {
        return this.finalUser2;
    }

    public void setFinalUser2(FinalUser finalUser) {
        this.finalUser2 = finalUser;
    }

    public Friendship finalUser2(FinalUser finalUser) {
        this.setFinalUser2(finalUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Friendship)) {
            return false;
        }
        return id != null && id.equals(((Friendship) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Friendship{" +
            "id=" + getId() +
            "}";
    }
}
