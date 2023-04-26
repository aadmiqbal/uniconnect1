package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.domain.Friendship;
import uk.ac.bham.teamproject.service.dto.FinalUserDTO;
import uk.ac.bham.teamproject.service.dto.FriendshipDTO;

/**
 * Mapper for the entity {@link Friendship} and its DTO {@link FriendshipDTO}.
 */
@Mapper(componentModel = "spring")
public interface FriendshipMapper extends EntityMapper<FriendshipDTO, Friendship> {
    @Mapping(target = "finalUser", source = "finalUser", qualifiedByName = "finalUserId")
    @Mapping(target = "finalUser2", source = "finalUser2", qualifiedByName = "finalUserId")
    FriendshipDTO toDto(Friendship s);

    @Named("finalUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    FinalUserDTO toDtoFinalUserId(FinalUser finalUser);
}
