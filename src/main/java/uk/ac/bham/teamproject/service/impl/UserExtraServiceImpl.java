package uk.ac.bham.teamproject.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.domain.UserExtra;
import uk.ac.bham.teamproject.repository.UserExtraRepository;
import uk.ac.bham.teamproject.repository.UserRepository;
import uk.ac.bham.teamproject.service.UserExtraService;
import uk.ac.bham.teamproject.service.dto.UserExtraDTO;
import uk.ac.bham.teamproject.service.mapper.UserExtraMapper;

/**
 * Service Implementation for managing {@link UserExtra}.
 */
@Service
@Transactional
public class UserExtraServiceImpl implements UserExtraService {

    private final Logger log = LoggerFactory.getLogger(UserExtraServiceImpl.class);

    private final UserExtraRepository userExtraRepository;

    private final UserExtraMapper userExtraMapper;

    private final UserRepository userRepository;

    public UserExtraServiceImpl(UserExtraRepository userExtraRepository, UserExtraMapper userExtraMapper, UserRepository userRepository) {
        this.userExtraRepository = userExtraRepository;
        this.userExtraMapper = userExtraMapper;
        this.userRepository = userRepository;
    }

    @Override
    public UserExtraDTO save(UserExtraDTO userExtraDTO) {
        log.debug("Request to save UserExtra : {}", userExtraDTO);
        UserExtra userExtra = userExtraMapper.toEntity(userExtraDTO);
        Long userId = userExtraDTO.getUser().getId();
        userRepository.findById(userId).ifPresent(userExtra::user);
        userExtra = userExtraRepository.save(userExtra);
        return userExtraMapper.toDto(userExtra);
    }

    @Override
    public UserExtraDTO update(UserExtraDTO userExtraDTO) {
        log.debug("Request to update UserExtra : {}", userExtraDTO);
        UserExtra userExtra = userExtraMapper.toEntity(userExtraDTO);
        Long userId = userExtraDTO.getUser().getId();
        userRepository.findById(userId).ifPresent(userExtra::user);
        userExtra = userExtraRepository.save(userExtra);
        return userExtraMapper.toDto(userExtra);
    }

    @Override
    public Optional<UserExtraDTO> partialUpdate(UserExtraDTO userExtraDTO) {
        log.debug("Request to partially update UserExtra : {}", userExtraDTO);

        return userExtraRepository
            .findById(userExtraDTO.getId())
            .map(existingUserExtra -> {
                userExtraMapper.partialUpdate(existingUserExtra, userExtraDTO);

                return existingUserExtra;
            })
            .map(userExtraRepository::save)
            .map(userExtraMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserExtraDTO> findAll(Pageable pageable) {
        log.debug("Request to get all UserExtras");
        return userExtraRepository.findAll(pageable).map(userExtraMapper::toDto);
    }

    public Page<UserExtraDTO> findAllWithEagerRelationships(Pageable pageable) {
        return userExtraRepository.findAllWithEagerRelationships(pageable).map(userExtraMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserExtraDTO> findOne(Long id) {
        log.debug("Request to get UserExtra : {}", id);
        return userExtraRepository.findOneWithEagerRelationships(id).map(userExtraMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserExtra : {}", id);
        userExtraRepository.deleteById(id);
    }
}
