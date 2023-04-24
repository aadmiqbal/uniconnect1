package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link uk.ac.bham.teamproject.domain.FinalUser} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinalUserDTO implements Serializable {

    private Long id;

    private String name;

    private Integer studyYear;

    @Size(max = 2000)
    private String bio;

    @Size(max = 10485760)
    private String pfp;

    @Size(max = 2000)
    private String modules;

    private String firstName;

    private String lastName;

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

    public String getModules() {
        return modules;
    }

    public void setModules(String modules) {
        this.modules = modules;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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
        if (!(o instanceof FinalUserDTO)) {
            return false;
        }

        FinalUserDTO finalUserDTO = (FinalUserDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, finalUserDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinalUserDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", studyYear=" + getStudyYear() +
            ", bio='" + getBio() + "'" +
            ", pfp='" + getPfp() + "'" +
            ", modules='" + getModules() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
