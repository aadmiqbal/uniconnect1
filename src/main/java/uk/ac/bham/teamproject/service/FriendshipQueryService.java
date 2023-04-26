package uk.ac.bham.teamproject.service;

import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import uk.ac.bham.teamproject.domain.*; // for static metamodels
import uk.ac.bham.teamproject.domain.Friendship;
import uk.ac.bham.teamproject.repository.FriendshipRepository;
import uk.ac.bham.teamproject.service.criteria.FriendshipCriteria;
import uk.ac.bham.teamproject.service.dto.FriendshipDTO;
import uk.ac.bham.teamproject.service.mapper.FriendshipMapper;

/**
 * Service for executing complex queries for {@link Friendship} entities in the database.
 * The main input is a {@link FriendshipCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link FriendshipDTO} or a {@link Page} of {@link FriendshipDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class FriendshipQueryService extends QueryService<Friendship> {

    private final Logger log = LoggerFactory.getLogger(FriendshipQueryService.class);

    private final FriendshipRepository friendshipRepository;

    private final FriendshipMapper friendshipMapper;

    public FriendshipQueryService(FriendshipRepository friendshipRepository, FriendshipMapper friendshipMapper) {
        this.friendshipRepository = friendshipRepository;
        this.friendshipMapper = friendshipMapper;
    }

    /**
     * Return a {@link List} of {@link FriendshipDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<FriendshipDTO> findByCriteria(FriendshipCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Friendship> specification = createSpecification(criteria);
        return friendshipMapper.toDto(friendshipRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link FriendshipDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<FriendshipDTO> findByCriteria(FriendshipCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Friendship> specification = createSpecification(criteria);
        return friendshipRepository.findAll(specification, page).map(friendshipMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(FriendshipCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Friendship> specification = createSpecification(criteria);
        return friendshipRepository.count(specification);
    }

    /**
     * Function to convert {@link FriendshipCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Friendship> createSpecification(FriendshipCriteria criteria) {
        Specification<Friendship> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Friendship_.id));
            }
            if (criteria.getFinalUserId() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getFinalUserId(),
                            root -> root.join(Friendship_.finalUser, JoinType.LEFT).get(FinalUser_.id)
                        )
                    );
            }
            if (criteria.getFinalUser2Id() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getFinalUser2Id(),
                            root -> root.join(Friendship_.finalUser2, JoinType.LEFT).get(FinalUser_.id)
                        )
                    );
            }
        }
        return specification;
    }
}
