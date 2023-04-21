package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.UserExtra;
import uk.ac.bham.teamproject.service.dto.UserDTO;
import uk.ac.bham.teamproject.service.dto.UserExtraDTO;

/**
 * Mapper for the entity {@link UserExtra} and its DTO {@link UserExtraDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserExtraMapper extends EntityMapper<UserExtraDTO, UserExtra> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    UserExtraDTO toDto(UserExtra s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
