package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link uk.ac.bham.teamproject.domain.Friendship} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FriendshipDTO implements Serializable {

    private Long id;

    private FinalUserDTO finalUser;

    private FinalUserDTO finalUser2;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FinalUserDTO getFinalUser() {
        return finalUser;
    }

    public void setFinalUser(FinalUserDTO finalUser) {
        this.finalUser = finalUser;
    }

    public FinalUserDTO getFinalUser2() {
        return finalUser2;
    }

    public void setFinalUser2(FinalUserDTO finalUser2) {
        this.finalUser2 = finalUser2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FriendshipDTO)) {
            return false;
        }

        FriendshipDTO friendshipDTO = (FriendshipDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, friendshipDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FriendshipDTO{" +
            "id=" + getId() +
            ", finalUser=" + getFinalUser() +
            ", finalUser2=" + getFinalUser2() +
            "}";
    }
}
