package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link uk.ac.bham.teamproject.domain.FinalGroup} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinalGroupDTO implements Serializable {

    private Long id;

    private String name;

    @Size(max = 30000)
    private String members;

    private Boolean isAdvertised;

    @Size(max = 10000)
    private String groupDescription;

    @Size(max = 10485760)
    private String pfp;

    @Size(max = 30000)
    private String admins;

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

    public String getMembers() {
        return members;
    }

    public void setMembers(String members) {
        this.members = members;
    }

    public Boolean getIsAdvertised() {
        return isAdvertised;
    }

    public void setIsAdvertised(Boolean isAdvertised) {
        this.isAdvertised = isAdvertised;
    }

    public String getGroupDescription() {
        return groupDescription;
    }

    public void setGroupDescription(String groupDescription) {
        this.groupDescription = groupDescription;
    }

    public String getPfp() {
        return pfp;
    }

    public void setPfp(String pfp) {
        this.pfp = pfp;
    }

    public String getAdmins() {
        return admins;
    }

    public void setAdmins(String admins) {
        this.admins = admins;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FinalGroupDTO)) {
            return false;
        }

        FinalGroupDTO finalGroupDTO = (FinalGroupDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, finalGroupDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinalGroupDTO{" +
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
