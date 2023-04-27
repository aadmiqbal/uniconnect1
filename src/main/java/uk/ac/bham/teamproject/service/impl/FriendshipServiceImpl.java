package uk.ac.bham.teamproject.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.domain.Friendship;
import uk.ac.bham.teamproject.repository.FinalUserRepository;
import uk.ac.bham.teamproject.repository.FriendshipRepository;
import uk.ac.bham.teamproject.service.FriendshipService;
import uk.ac.bham.teamproject.service.dto.FriendshipDTO;
import uk.ac.bham.teamproject.service.mapper.FriendshipMapper;

/**
 * Service Implementation for managing {@link Friendship}.
 */
@Service
@Transactional
public class FriendshipServiceImpl implements FriendshipService {

    private final Logger log = LoggerFactory.getLogger(FriendshipServiceImpl.class);

    private final FriendshipRepository friendshipRepository;

    private final FriendshipMapper friendshipMapper;

    @Autowired
    private final FinalUserRepository finalUserRepository;

    public FriendshipServiceImpl(
        FriendshipRepository friendshipRepository,
        FriendshipMapper friendshipMapper,
        FinalUserRepository finalUserRepository
    ) {
        this.friendshipRepository = friendshipRepository;
        this.friendshipMapper = friendshipMapper;
        this.finalUserRepository = finalUserRepository;
    }

    @Override
    public FriendshipDTO save(FriendshipDTO friendshipDTO) {
        log.debug("Request to save Friendship : {}", friendshipDTO);
        Friendship friendship = friendshipMapper.toEntity(friendshipDTO);
        friendship = friendshipRepository.save(friendship);
        return friendshipMapper.toDto(friendship);
    }

    @Override
    public FriendshipDTO update(FriendshipDTO friendshipDTO) {
        log.debug("Request to update Friendship : {}", friendshipDTO);
        Friendship friendship = friendshipMapper.toEntity(friendshipDTO);
        friendship = friendshipRepository.save(friendship);
        return friendshipMapper.toDto(friendship);
    }

    @Override
    public Optional<FriendshipDTO> partialUpdate(FriendshipDTO friendshipDTO) {
        log.debug("Request to partially update Friendship : {}", friendshipDTO);

        return friendshipRepository
            .findById(friendshipDTO.getId())
            .map(existingFriendship -> {
                friendshipMapper.partialUpdate(existingFriendship, friendshipDTO);

                return existingFriendship;
            })
            .map(friendshipRepository::save)
            .map(friendshipMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FriendshipDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Friendships");
        return friendshipRepository.findAll(pageable).map(friendshipMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FriendshipDTO> findOne(Long id) {
        log.debug("Request to get Friendship : {}", id);
        return friendshipRepository.findById(id).map(friendshipMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Friendship : {}", id);
        friendshipRepository.deleteById(id);
    }

    @Override
    public List<FriendshipDTO> findAllByFinalUser(Long finalUserId) {
        log.debug("Request to get all Friendships by FinalUser : {}", finalUserId);
        FinalUser finalUser = finalUserRepository
            .findById(finalUserId)
            .orElseThrow(() -> new IllegalStateException("FinalUser not found with id: " + finalUserId));
        return friendshipRepository.findAllByFinalUser(finalUser).stream().map(friendshipMapper::toDto).collect(Collectors.toList());
    }
}
