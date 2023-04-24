package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.service.dto.FinalUserDTO;
import uk.ac.bham.teamproject.service.dto.UserDTO;

/**
 * Mapper for the entity {@link FinalUser} and its DTO {@link FinalUserDTO}.
 */
@Mapper(componentModel = "spring")
public interface FinalUserMapper extends EntityMapper<FinalUserDTO, FinalUser> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    FinalUserDTO toDto(FinalUser s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
