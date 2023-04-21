package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link uk.ac.bham.teamproject.domain.UserExtra} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserExtraDTO implements Serializable {

    private Long id;

    private String name;

    private Integer studyYear;

    private String bio;

    private String pfp;

    private UserDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStudyYear() {
        return studyYear;
    }

    public void setStudyYear(Integer studyYear) {
        this.studyYear = studyYear;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPfp() {
        return pfp;
    }

    public void setPfp(String pfp) {
        this.pfp = pfp;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserExtraDTO)) {
            return false;
        }

        UserExtraDTO userExtraDTO = (UserExtraDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userExtraDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserExtraDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", studyYear=" + getStudyYear() +
            ", bio='" + getBio() + "'" +
            ", pfp='" + getPfp() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
