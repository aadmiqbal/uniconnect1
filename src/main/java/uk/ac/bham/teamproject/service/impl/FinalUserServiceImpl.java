package uk.ac.bham.teamproject.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.repository.FinalUserRepository;
import uk.ac.bham.teamproject.repository.UserRepository;
import uk.ac.bham.teamproject.service.FinalUserService;
import uk.ac.bham.teamproject.service.dto.FinalUserDTO;
import uk.ac.bham.teamproject.service.mapper.FinalUserMapper;

/**
 * Service Implementation for managing {@link FinalUser}.
 */
@Service
@Transactional
public class FinalUserServiceImpl implements FinalUserService {

    private final Logger log = LoggerFactory.getLogger(FinalUserServiceImpl.class);

    private final FinalUserRepository finalUserRepository;

    private final FinalUserMapper finalUserMapper;

    private final UserRepository userRepository;

    public FinalUserServiceImpl(FinalUserRepository finalUserRepository, FinalUserMapper finalUserMapper, UserRepository userRepository) {
        this.finalUserRepository = finalUserRepository;
        this.finalUserMapper = finalUserMapper;
        this.userRepository = userRepository;
    }

    @Override
    public FinalUserDTO save(FinalUserDTO finalUserDTO) {
        log.debug("Request to save FinalUser : {}", finalUserDTO);
        FinalUser finalUser = finalUserMapper.toEntity(finalUserDTO);
        Long userId = finalUserDTO.getUser().getId();
        userRepository.findById(userId).ifPresent(finalUser::user);
        finalUser = finalUserRepository.save(finalUser);
        return finalUserMapper.toDto(finalUser);
    }

    @Override
    public FinalUserDTO update(FinalUserDTO finalUserDTO) {
        log.debug("Request to update FinalUser : {}", finalUserDTO);
        FinalUser finalUser = finalUserMapper.toEntity(finalUserDTO);
        Long userId = finalUserDTO.getUser().getId();
        userRepository.findById(userId).ifPresent(finalUser::user);
        finalUser = finalUserRepository.save(finalUser);
        return finalUserMapper.toDto(finalUser);
    }

    @Override
    public Optional<FinalUserDTO> partialUpdate(FinalUserDTO finalUserDTO) {
        log.debug("Request to partially update FinalUser : {}", finalUserDTO);

        return finalUserRepository
            .findById(finalUserDTO.getId())
            .map(existingFinalUser -> {
                finalUserMapper.partialUpdate(existingFinalUser, finalUserDTO);

                return existingFinalUser;
            })
            .map(finalUserRepository::save)
            .map(finalUserMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FinalUserDTO> findAll(Pageable pageable) {
        log.debug("Request to get all FinalUsers");
        return finalUserRepository.findAll(pageable).map(finalUserMapper::toDto);
    }

    public Page<FinalUserDTO> findAllWithEagerRelationships(Pageable pageable) {
        return finalUserRepository.findAllWithEagerRelationships(pageable).map(finalUserMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FinalUserDTO> findOne(Long id) {
        log.debug("Request to get FinalUser : {}", id);
        return finalUserRepository.findOneWithEagerRelationships(id).map(finalUserMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FinalUser : {}", id);
        finalUserRepository.deleteById(id);
    }
}
