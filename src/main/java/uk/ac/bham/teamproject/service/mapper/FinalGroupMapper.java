package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.FinalGroup;
import uk.ac.bham.teamproject.service.dto.FinalGroupDTO;

/**
 * Mapper for the entity {@link FinalGroup} and its DTO {@link FinalGroupDTO}.
 */
@Mapper(componentModel = "spring")
public interface FinalGroupMapper extends EntityMapper<FinalGroupDTO, FinalGroup> {}
