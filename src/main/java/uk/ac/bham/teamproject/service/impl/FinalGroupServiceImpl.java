package uk.ac.bham.teamproject.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.domain.FinalGroup;
import uk.ac.bham.teamproject.repository.FinalGroupRepository;
import uk.ac.bham.teamproject.service.FinalGroupService;
import uk.ac.bham.teamproject.service.dto.FinalGroupDTO;
import uk.ac.bham.teamproject.service.mapper.FinalGroupMapper;

/**
 * Service Implementation for managing {@link FinalGroup}.
 */
@Service
@Transactional
public class FinalGroupServiceImpl implements FinalGroupService {

    private final Logger log = LoggerFactory.getLogger(FinalGroupServiceImpl.class);

    private final FinalGroupRepository finalGroupRepository;

    private final FinalGroupMapper finalGroupMapper;

    public FinalGroupServiceImpl(FinalGroupRepository finalGroupRepository, FinalGroupMapper finalGroupMapper) {
        this.finalGroupRepository = finalGroupRepository;
        this.finalGroupMapper = finalGroupMapper;
    }

    @Override
    public FinalGroupDTO save(FinalGroupDTO finalGroupDTO) {
        log.debug("Request to save FinalGroup : {}", finalGroupDTO);
        FinalGroup finalGroup = finalGroupMapper.toEntity(finalGroupDTO);
        finalGroup = finalGroupRepository.save(finalGroup);
        return finalGroupMapper.toDto(finalGroup);
    }

    @Override
    public FinalGroupDTO update(FinalGroupDTO finalGroupDTO) {
        log.debug("Request to update FinalGroup : {}", finalGroupDTO);
        FinalGroup finalGroup = finalGroupMapper.toEntity(finalGroupDTO);
        finalGroup = finalGroupRepository.save(finalGroup);
        return finalGroupMapper.toDto(finalGroup);
    }

    @Override
    public Optional<FinalGroupDTO> partialUpdate(FinalGroupDTO finalGroupDTO) {
        log.debug("Request to partially update FinalGroup : {}", finalGroupDTO);

        return finalGroupRepository
            .findById(finalGroupDTO.getId())
            .map(existingFinalGroup -> {
                finalGroupMapper.partialUpdate(existingFinalGroup, finalGroupDTO);

                return existingFinalGroup;
            })
            .map(finalGroupRepository::save)
            .map(finalGroupMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FinalGroupDTO> findAll(Pageable pageable) {
        log.debug("Request to get all FinalGroups");
        return finalGroupRepository.findAll(pageable).map(finalGroupMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FinalGroupDTO> findOne(Long id) {
        log.debug("Request to get FinalGroup : {}", id);
        return finalGroupRepository.findById(id).map(finalGroupMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FinalGroup : {}", id);
        finalGroupRepository.deleteById(id);
    }
}
